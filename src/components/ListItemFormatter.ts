import {injectable, inject} from 'inversify';
import {ServiceIdentifiers} from '../identifiers';
import {Formatter} from './Formatter';
import {ListItem} from '../interfaces/ListItem.interface';
import {WorklogFormatData} from '../interfaces/WorklogFormatData.interface';
import {NoteEntity} from '../orm/entities/Note.entity';
import {WorklogEntity} from '../orm/entities/Worklog.entity';

@injectable()
export class ListItemFormatter {
  protected formatter: Formatter;
  constructor(@inject(ServiceIdentifiers.Formatter) formatter: Formatter) {
    this.formatter = formatter;
  }


  public init(formatter: Formatter): void {
    this.formatter = formatter;
  }


  public formatDayItem(day: any, type: string): ListItem {
    return {
      key: this.formatter.applyFormat(day, 'format.list.keys', type),
      value: this.formatter.applyFormat(day, 'format.list.values', type)
    };
  }

  /**
   * Format notes for display
   * @param notes - Array of note entities
   * @return Array of formatted list items
   */
  public formatNotes(notes: NoteEntity[]): ListItem[] {
    return notes.map((note) => ({
      key: this.formatter.applyFormat(note, 'format.list.keys', 'note'),
      value: this.formatter.applyFormat(note, 'format.list.values', 'note')
    }));
  }


  public formatWorklogs(worklogs: WorklogEntity[], start: Date = new Date()): ListItem[] {
    // Format worklog entries and calculate time duration between consecutive entries
    const hydratedWorklogs: ListItem[] = [];
    let latestTrack = start;

    worklogs.forEach((worklog) => {
      const worklogFormatData: WorklogFormatData = {
        duration: null,
        iterator: worklog.iterator,
        time: worklog.time,
        key: worklog.key,
        value: worklog.value
      };


      const currentTime = worklog.time.getTime();
      const latestTime = latestTrack.getTime();
      const duration = currentTime >= latestTime ?
        currentTime - latestTime :
        latestTime - currentTime;

      worklogFormatData.duration = duration;

      const itemType = worklog.rest ? 'rest' : 'worklog';
      hydratedWorklogs.push({
        key: this.formatter.applyFormat(worklogFormatData, 'format.list.keys', itemType),
        value: this.formatter.applyFormat(worklogFormatData, 'format.list.values', itemType)
      });

      latestTrack = worklog.time;
    });

    return hydratedWorklogs;
  }
}
