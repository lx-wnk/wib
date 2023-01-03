import {inject, injectable} from 'inversify';
import AbstractCommand from './AbstractCommand';
import {getConnection} from 'typeorm';
import process from 'process';
import {homedir} from 'os';
import * as fs from 'fs';
import {DayEntity} from '../orm/entities/Day.entity';
import {WorklogEntity} from '../orm/entities/Worklog.entity';
import {NoteEntity} from '../orm/entities/Note.entity';
import {ConnectionManager} from '../orm';
import {IDENTIFIERS} from '../identifiers';
import {MessageService} from '../components';

@injectable()
export class MigrateCommand extends AbstractCommand {
  public name = 'migrate';
  public aliases = ['m'];
  public options = [
    {
      flag: 'command.migrate.option.data.flag',
      description: 'command.migrate.option.data.description'
    },
  ];
  public description = 'command.migrate.description';

  private days = {};
  private connectionManager: ConnectionManager;

  constructor(
    @inject(IDENTIFIERS.Message) messages: MessageService,
    @inject(IDENTIFIERS.ORM.Connection) connectionManager: ConnectionManager
  ) {
    super(messages);
    this.connectionManager = connectionManager;
  }

  exec(options): void {
    const sleep = async (milliseconds) => {
      await new Promise((resolve) => {
        return setTimeout(resolve, milliseconds);
      });
    };

    console.log('START: migration');

    console.log('STEP(START): missing migrations');
    this.executeMissingMigrations();
    console.log('STEP(DONE): missing migrations');

    if (options.data) {
      (async () => {
        console.log('STEP(START): data migration in 5 seconds');
        await sleep(5000);

        this.migrateData();
        console.log('STEP(DONE): data migration');
      })();
    }
  }

  private executeMissingMigrations(): void {
    try {
      this.connectionManager.getConnection()
          .then((connection) => {
            connection.runMigrations({transaction: 'all'})
                .catch((err) => {
                  console.error('Please roll back to latest version due to an error while migration execution');
                  console.error(err);
                });
          }).catch((err) => {
            console.error('Please roll back to latest version due to an error while migration execution');
            console.error(err);
          });
    } catch (err) {
      console.error('Please roll back to latest version due to an error while migration execution');
      console.error(err);
    }
  }

  private migrateData(): void {
    this.extractTypeData();
    this.connectionManager.getConnection()
        .then((connection) => {
          connection.runMigrations({transaction: 'none'})
              .then(() => {
                this.migrateToSqlite();
              });
        }).finally(() => {
          console.log('FINISH: migrations');
        });
  }

  private extractTypeData(): void {
    const files = this.getFiles();

    files.forEach((file) => {
      const filePath = this.getHomeDir() + file;
      let parsed;

      try {
        parsed = this.parseFileToJson(filePath);
      } catch (e) {
        return;
      }

      if (!parsed) {
        return;
      }

      this.days[file.replace('.json', '')] = {};

      if (parsed.start) {
        this.days[file.replace('.json', '')]['start'] = parsed.start;
      }

      if (parsed.stop) {
        this.days[file.replace('.json', '')]['stop'] = parsed.stop;
      }

      if (parsed.notes) {
        this.days[file.replace('.json', '')]['notes'] = parsed.notes;
      }

      if (parsed.worklogs) {
        this.days[file.replace('.json', '')]['worklogs'] = parsed.worklogs;
      }
    });
  }

  private migrateToSqlite(): void {
    const connection = getConnection();
    const dayRepository = connection.getRepository(DayEntity);
    const noteRepository = connection.getRepository(NoteEntity);
    const days = [];
    const notes = [];

    for (const date in this.days) {
      const day = new DayEntity();

      if (this.days[date]['start'] && this.days[date]['start']['time']) {
        day.start = new Date(this.days[date]['start']['time']);
      }

      if (this.days[date]['stop'] && this.days[date]['stop']['time']) {
        day.finish = new Date(this.days[date]['stop']['time']);
      }

      if (this.days[date]['worklogs']) {
        day.worklogs = [];

        Object.values(this.days[date]['worklogs']).forEach((entry) => {
          const worklog = new WorklogEntity();
          worklog.iterator = entry['id'];
          worklog.key = entry['key'];
          worklog.value = entry['value'];
          worklog.time = new Date(entry['time']);
          worklog.deleted = entry['deleted'];
          worklog.rest = entry['dataKey'] === 'rest';

          if (!worklog.key || ! worklog.value) {
            return;
          }

          day.worklogs.push(worklog);
        });
      }

      if (this.days[date]['notes']) {
        Object.values(this.days[date]['notes']).forEach((entry) => {
          const note = new NoteEntity();
          note.iterator = notes.length;
          note.value = entry['value'];
          note.time = new Date(entry['time']);
          note.deleted = entry['deleted'];

          notes.push(note);
        });
      }

      if (!day.start && day.worklogs && day.worklogs[0]) {
        day.start = day.worklogs[0].time;
      }

      if (day.start) {
        days.push(day);
      }
    }

    dayRepository.save(days).then(() => {
      noteRepository.save(notes)
          .catch((err) => {
            console.error(err);
            process.exit(1);
          });
    }).catch((err) => {
      console.error(err);
      process.exit(1);
    }).finally(() => {
      console.log('done');
    });
  }

  private getFiles(): string [] {
    const files = fs.readdirSync(this.getHomeDir());
    return files.filter((el) => /[0-9]{4}_[0-9]{2}_[0-9]{2}.json$/gm.test(el));
  }

  private parseFileToJson(file): object {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }

  public getHomeDir(): string {
    return homedir + '/.wib/';
  }
}
