import {inject, injectable} from 'inversify';
import {IDENTIFIERS} from '../identifiers';
import {Formatter} from './Formatter';
import {DayRepository, WorklogRepository, NoteRepository} from '../orm/repositories';
import {NoteEntity} from '../orm/entities/Note.entity';
import {WorklogEntity} from '../orm/entities/Worklog.entity';

@injectable()
export class ListService {
  protected noteRepository: NoteRepository;
  protected worklogRepository: WorklogRepository;
  protected dayRepository: DayRepository;
  protected formatter: Formatter;

  constructor(
    @inject(IDENTIFIERS.ORM.repositories.note) noteRepository: NoteRepository,
    @inject(IDENTIFIERS.ORM.repositories.worklog) worklogRepository: WorklogRepository,
    @inject(IDENTIFIERS.ORM.repositories.day) dayRepository: DayRepository,
    @inject(IDENTIFIERS.Formatter) formatter: Formatter
  ) {
    this.noteRepository = noteRepository;
    this.worklogRepository = worklogRepository;
    this.dayRepository = dayRepository;
    this.formatter = formatter;
  }

  public async getList() {
    const listData = {'start': null, 'finish': null, 'notes': [], 'worklogs': []};
    const notes = await this.noteRepository.getUndeletedList();
    const worklogs = await this.worklogRepository.getUndeletedListForDate();
    const day = await this.dayRepository.getByDate();

    listData.notes = this.formatNotes(notes);
    listData.worklogs = this.formatWorklogs(worklogs);
    listData.start = {
      'key': this.formatter.applyFormat(day.start, 'start', 'key'),
      'value': this.formatter.applyFormat(day.start, 'start'),
    };

    listData.finish = {
      'key': this.formatter.applyFormat(day.finish, 'stop', 'key'),
      'value': this.formatter.applyFormat(day.finish, 'stop'),
    };

    return this.formatter.toTable(listData, false);
  }

  private formatNotes(notes: NoteEntity[]) {
    const hydratedNotes = [];

    notes.forEach((note) => {
      hydratedNotes.push({
        'key': this.formatter.applyFormat(note, 'notes', 'key'),
        'value': this.formatter.applyFormat(note, 'notes')
      });
    });

    return hydratedNotes;
  }

  private formatWorklogs(worklogs: WorklogEntity[], start: Date = new Date()) {
    const hydratedWorklogs = [];
    const latestTrack = start;


    worklogs.forEach((worklog) => {
      const tmp = {
        'duration': null,
        'iterator': worklog.iterator,
        'time': worklog.time,
        'key': worklog.key,
        'value': worklog.value
      };
      let duration = worklog.time.getTime() - latestTrack.getTime();

      if (worklog.time.getTime() < latestTrack.getTime()) {
        duration = latestTrack.getTime() - worklog.time.getTime();
      }

      tmp.duration = duration;

      if (worklog.rest) {
        hydratedWorklogs.push({
          'key': this.formatter.applyFormat(tmp, 'rest', 'key'),
          'value': this.formatter.applyFormat(tmp, 'rest')
        });

        return;
      }

      hydratedWorklogs.push({
        'key': this.formatter.applyFormat(tmp, 'worklogs', 'key'),
        'value': this.formatter.applyFormat(tmp, 'worklogs')
      });
    });

    console.log(hydratedWorklogs);

    return hydratedWorklogs;
  }
}
