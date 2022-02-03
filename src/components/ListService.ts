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
    const listData = {'day': null, 'start': null, 'finish': null, 'notes': [], 'worklogs': []};
    const notes = await this.noteRepository.getUndeletedList();
    const worklogs = await this.worklogRepository.getUndeletedListForDate();
    const day = await this.dayRepository.getByDate();

    listData.day = {
      'key': this.formatter.applyFormat(day, 'format.list.keys', 'day'),
      'value': this.formatter.applyFormat(day, 'format.list.values', 'day')
    };
    listData.start = {
      'key': this.formatter.applyFormat(day, 'format.list.keys', 'start'),
      'value': this.formatter.applyFormat(day, 'format.list.values', 'start'),
    };
    listData.finish = {
      'key': this.formatter.applyFormat(day, 'format.list.keys', 'stop'),
      'value': this.formatter.applyFormat(day, 'format.list.values', 'stop'),
    };
    listData.notes = this.formatNotes(notes);
    listData.worklogs = this.formatWorklogs(worklogs, day.start);

    return this.formatter.toTable(listData, false);
  }

  private formatNotes(notes: NoteEntity[]) {
    const hydratedNotes = [];

    notes.forEach((note) => {
      hydratedNotes.push({
        'key': this.formatter.applyFormat(note, 'format.list.keys', 'note'),
        'value': this.formatter.applyFormat(note, 'format.list.values', 'note')
      });
    });

    return hydratedNotes;
  }

  private formatWorklogs(worklogs: WorklogEntity[], start: Date = new Date()) {
    const hydratedWorklogs = [];
    let latestTrack = start;

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

      hydratedWorklogs.push({
        'key': this.formatter.applyFormat(tmp, 'format.list.keys', worklog.rest ? 'rest' : 'worklog'),
        'value': this.formatter.applyFormat(tmp, 'format.list.values', worklog.rest ? 'rest' : 'worklog')
      });

      latestTrack = worklog.time;
    });

    return hydratedWorklogs;
  }
}
