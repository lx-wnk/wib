import StartStruct from '../../struct/start';
import StopStruct from '../../struct/stop';
import WorklogCollection from '../../struct/collection/WorklogCollection';
import FormatHelper from './FormatHelper';

export default class WorkDurationHelper {
  getWorkDuration(start?: StartStruct, stop?: StopStruct, worklogs?: WorklogCollection): object {
    if (start === undefined) {
      start = (new StartStruct()).fromSavedData();
    }
    if (stop === undefined) {
      stop = (new StopStruct()).fromSavedData();
    }
    if (worklogs === undefined) {
      worklogs = (new WorklogCollection()).fromSavedData();
    }

    const breakDuration = {
        hour: 0,
        minute: 0
      },
      workDuration = new Date(stop.time.getTime() - start.time.getTime());
    let previousWorklog;

    for (const key in worklogs.entries) {
      const curWorklog = worklogs.entries[key];
      let timeDiff;

      curWorklog.time = new Date(curWorklog.time);

      if ('rest' === curWorklog.dataKey) {
        if (undefined === previousWorklog) {
          timeDiff = new Date(curWorklog.time.getTime() - start.time.getTime());
        } else {
          timeDiff = new Date(curWorklog.time.getTime() - previousWorklog.time.getTime());
        }

        breakDuration.hour = timeDiff.getUTCHours();
        breakDuration.hour = timeDiff.getUTCMinutes();
      }

      previousWorklog = curWorklog;
    }

    workDuration.setUTCHours(workDuration.getUTCHours() - breakDuration.hour);
    workDuration.setUTCMinutes(workDuration.getUTCMinutes() - breakDuration.minute);

    if (0 >= workDuration.getUTCHours() && 0 >= workDuration.getUTCMinutes()) {
      return {
        key: undefined,
        value: undefined
      };
    }

    return {
      key: (new FormatHelper()).applyFormat({'duration': workDuration}, 'workDuration', 'key'),
      value: (new FormatHelper()).applyFormat({'duration': workDuration}, 'workDuration')
    };
  }
}
