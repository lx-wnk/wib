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
import {IDENTIFIERS_ORM} from '../constants/identifiers.orm';

@injectable()
export class MigrateDataCommand extends AbstractCommand {
  public name = 'migrate-data';
  public names = ['migrate-data', 'md']
  public aliases = ['md'];
  public options = [];
  public description = 'Migrate data from filesystem to sqlite';

  private days = {};
  private connectionManager: ConnectionManager;

  constructor(@inject(IDENTIFIERS_ORM.Connection) connectionManager: ConnectionManager) {
    super();
    this.connectionManager = connectionManager;
  }

  exec(): void {
    console.log('START: migration');

    this.extractTypeData();

    this.connectionManager.create().then((connection) => {
      (async (con) => {
        await con.runMigrations({
          transaction: 'none'
        });
      })(connection)
          .finally(() => {
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

  private getFiles(): string [] {
    const files = fs.readdirSync(this.getHomeDir());
    return files.filter((el) => /[0-9]{4}_[0-9]{2}_[0-9]{2}.json$/gm.test(el));
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
          worklog.key = entry['key'];
          worklog.value = entry['value'];
          worklog.time = new Date(entry['time']);
          worklog.deleted = entry['deleted'];
          worklog.rest = 'rest' === entry['dataKey'];

          day.worklogs.push(worklog);
        });
      }

      if (this.days[date]['notes']) {
        Object.values(this.days[date]['notes']).forEach((entry) => {
          const note = new NoteEntity();
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

    dayRepository.save(days).then((fin) => {
      console.log(fin);
    }).catch((err) => {
      console.error(err);
      process.exit(1);
    });

    noteRepository.save(notes).then((fin) => {
      console.log(fin);
    }).catch((err) => {
      console.error(err);
      process.exit(1);
    });
  }

  private parseFileToJson(file): object {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }

  public getHomeDir(): string {
    return homedir + '/.wib/';
  }
}
