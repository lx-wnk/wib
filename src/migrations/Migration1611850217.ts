import {inject, injectable} from 'inversify';
import MigrationInterface from './MigrationInterface';
import * as fs from 'fs';
import {homedir} from 'os';
import {DayEntity} from '../orm/models/Day.entity';
import {WorklogEntity} from '../orm/models/Worklog.entity';
import {NoteEntity} from '../orm/models/Note.entity';
import {ConnectionManager} from '../orm/ConnectionManager';
import {IDENTIFIERS_ORM} from '../constants/identifiers.orm';
import {getConnection, getManager} from 'typeorm';
import * as process from 'process';

@injectable()
export class Migration1611850217 implements MigrationInterface {
  private days = {};
  private connectionManager: ConnectionManager;

  constructor(@inject(IDENTIFIERS_ORM.Connection) connectionManager: ConnectionManager) {
    this.connectionManager = connectionManager;
  }

  public migrate(): void {
    console.log('migration - 1611850217');

    this.extractTypeData();

    this.connectionManager.create().then((con) => {
      this.migrateToSqlite();
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

    for (const date in this.days) {
      const day = new DayEntity();
      const worklogs: WorklogEntity[] = [];
      const notes: NoteEntity[] = [];

      if (this.days[date]['start'] && this.days[date]['start']['time']) {
        day.start = new Date(this.days[date]['start']['time']);
      }

      if (this.days[date]['worklogs']) {
        Object.values(this.days[date]['worklogs']).forEach((entry) => {
          const worklog = new WorklogEntity();
          worklog.key = entry['key'];
          worklog.value = entry['value'];
          worklog.time = entry['time'];
          worklog.deleted = entry['deleted'];
          worklog.rest = 'rest' === entry['dataKey'];

          worklogs.push(worklog);
        });
      }

      if (this.days[date]['notes']) {
        Object.values(this.days[date]['notes']).forEach((entry) => {
          const note = new NoteEntity();
          note.value = entry['value'];
          note.time = entry['time'];
          note.deleted = entry['deleted'];

          notes.push(note);
        });
      }


      if (this.days[date]['stop'] && this.days[date]['stop']['time']) {
        day.finish = new Date(this.days[date]['stop']['time']);
      }

      // @ts-ignore
      day.worklogs = worklogs;
      // @ts-ignore
      day.notes = notes;

      // this.connection.connection.
      dayRepository.save(day).then((fin) => {
        console.log(fin);
      }).catch((err) => {
        console.error(err);
        process.exit(1);
      });
    }
  }

  private parseFileToJson(file): object {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }

  public getHomeDir(): string {
    return homedir + '/.wib/';
  }
}
