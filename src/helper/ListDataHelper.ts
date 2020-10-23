import StartStruct from '../struct/DataStructs/start';
import StopStruct from '../struct/DataStructs/stop';
import NoteCollection from '../struct/DataStructs/collection/NoteCollection';
import WorklogCollection from '../struct/DataStructs/collection/WorklogCollection';
import WorkDurationHelper from './WorkDurationHelper';
import ListDataStruct from '../struct/ListDataStruct';

export default class ListDataHelper {
    private workDurationHelper: WorkDurationHelper;

    constructor() {
      this.workDurationHelper = new WorkDurationHelper();
    }

    public getDataForTime(time: number): ListDataStruct {
      const listData = new ListDataStruct(),
        start = new StartStruct(null),
        stop = new StopStruct(null),
        notes = new NoteCollection(time),
        worklogs = new WorklogCollection(time);

      start.fromSavedData(time);
      stop.fromSavedData(time);

      if (null !== start.time) {
        listData.start = start;
      }

      if (null !== stop.time) {
        listData.stop = stop;
      } else if (null !== start.time) {
        listData.estimatedStop = this.workDurationHelper.getEstimatedClockOut(start, worklogs);
      }

      if (null !== start.time && 0 < worklogs.getAmount()) {
        listData.workDuration = this.workDurationHelper.getWorkDuration(start, worklogs);
        listData.workDuration['plain'] = this.workDurationHelper.getWorkDurationPlain(start, worklogs);
      }

      if (null !== notes.entries) {
        listData.notes = notes;
      }

      if (null !== worklogs.entries) {
        listData.worklogs = worklogs;
      }

      return listData;
    }
}
