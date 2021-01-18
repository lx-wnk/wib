import StartStruct from '../struct/DataStructs/start';
import WorklogCollection from '../struct/DataStructs/collection/WorklogCollection';
import FormatHelper from './FormatHelper';
import ConfigHelper from './ConfigHelper';
import StopStruct from '../struct/DataStructs/stop';

export default class WorkDurationHelper {
  private formatHelper: FormatHelper;
  private configHelper: ConfigHelper;


  constructor() {
    this.formatHelper = new FormatHelper();
    this.configHelper = new ConfigHelper();
  }

  public getEstimatedClockOut(start?: StartStruct, worklogs?: WorklogCollection): StopStruct {
    const clockOut = new StopStruct(),
      timeSortedWorklogs = this.sortEntries(worklogs),
      restDuration = this.calculateRestDuration(timeSortedWorklogs, start.time);

    clockOut.time.setHours(start.time.getHours() + this.configHelper.getSpecifiedWorkDuration());
    clockOut.time.setMinutes(clockOut.time.getMinutes() + restDuration);

    return clockOut;
  }

  public getWorkDuration(start?: StartStruct, worklogs?: WorklogCollection): object {
    const baseDate = new Date(new Date(Date.now()).getTime() - new Date(Date.now()).getTime()),
      workedMinutes = this.calculateWorkedMinutes(this.sortEntries(worklogs), start.time);

    baseDate.setMinutes(workedMinutes);

    return {
      key: this.formatHelper.applyFormat({'duration': baseDate}, 'workDuration', 'key'),
      value: this.formatHelper.applyFormat({'duration': baseDate}, 'workDuration')
    };
  }

  public getWorkDurationPlain(start?: StartStruct, worklogs?: WorklogCollection): object {
    const baseDate = new Date(new Date(Date.now()).getTime() - new Date(Date.now()).getTime()),
      workedMinutes = this.calculateWorkedMinutes(this.sortEntries(worklogs), start.time);

    baseDate.setMinutes(workedMinutes);

    return {
      hours: baseDate.getUTCHours(),
      minutes: baseDate.getUTCMinutes()
    };
  }

  public getBreakDuration(start?: StartStruct, worklogs?: WorklogCollection): object {
    const baseDate = new Date(new Date(Date.now()).getTime() - new Date(Date.now()).getTime()),
      workedMinutes = this.calculateBreakMinutes(this.sortEntries(worklogs), start.time);

    baseDate.setMinutes(workedMinutes);

    return {
      key: this.formatHelper.applyFormat({'duration': baseDate}, 'breakDuration', 'key'),
      value: this.formatHelper.applyFormat({'duration': baseDate}, 'breakDuration')
    };
  }

  public getBreakDurationPlain(start?: StartStruct, worklogs?: WorklogCollection): object {
    const baseDate = new Date(new Date(Date.now()).getTime() - new Date(Date.now()).getTime()),
      workedMinutes = this.calculateBreakMinutes(this.sortEntries(worklogs), start.time);

    baseDate.setMinutes(workedMinutes);

    return {
      hours: baseDate.getUTCHours(),
      minutes: baseDate.getUTCMinutes()
    };
  }

  private sortEntries(worklogs: WorklogCollection): object {
    const sortedEntries = {};
    for (const key in worklogs.entries) {
      if (undefined !== worklogs.entries[key]['deleted'] && !worklogs.entries[key]['deleted']) {
        const curDate = new Date(worklogs.entries[key].time);

        sortedEntries[curDate.getTime()] = worklogs.entries[key];
      }
    }

    return Object.keys(sortedEntries).sort().reduce((r, k) => (r[k] = sortedEntries[k], r), {});
  }

  private calculateWorkedMinutes(sortedEntries: object, startDate: Date): number {
    let workedMinutes = 0,
      previousDate = startDate;

    for (const key in sortedEntries) {
      const curDate = (new Date(sortedEntries[key]['time'])),
        curEntryDuration = new Date(curDate.getTime() - previousDate.getTime());

      if (undefined !== sortedEntries[key].dataKey &&
        'rest' !== sortedEntries[key].dataKey && !sortedEntries[key].deleted) {
        workedMinutes += Math.ceil((curEntryDuration.getUTCHours() * 60 + curEntryDuration.getUTCMinutes()) /
            this.configHelper.getSpecifiedMinuteRounding()) *
            this.configHelper.getSpecifiedMinuteRounding();
      }

      previousDate = curDate;
    }

    return workedMinutes;
  }

  private calculateBreakMinutes(sortedEntries: object, startDate: Date): number {
    let workedMinutes = 0,
      previousDate = startDate;

    for (const key in sortedEntries) {
      const curDate = (new Date(sortedEntries[key]['time'])),
        curEntryDuration = new Date(curDate.getTime() - previousDate.getTime());

      if (undefined !== sortedEntries[key].dataKey &&
        'rest' === sortedEntries[key].dataKey && !sortedEntries[key].deleted) {
        workedMinutes += Math.ceil((curEntryDuration.getUTCHours() * 60 + curEntryDuration.getUTCMinutes()) /
          this.configHelper.getSpecifiedMinuteRounding()) *
          this.configHelper.getSpecifiedMinuteRounding();
      }

      previousDate = curDate;
    }

    return workedMinutes;
  }

  private calculateRestDuration(timeSortedWorklogs: object, startDate: Date): number {
    let restDuration = 0,
      previousDate = startDate;

    for (const key in timeSortedWorklogs) {
      if (undefined !== timeSortedWorklogs[key]) {
        const curEntry = timeSortedWorklogs[key],
          curDate = (new Date(curEntry['time'])),
          curEntryDuration = new Date(curDate.getTime() - previousDate.getTime());

        if (undefined !== curEntry.dataKey && 'rest' === curEntry.dataKey) {
          restDuration += Math.ceil((curEntryDuration.getUTCHours() * 60 + curEntryDuration.getUTCMinutes()) /
              this.configHelper.getSpecifiedMinuteRounding()) *
              this.configHelper.getSpecifiedMinuteRounding();
        }

        if (undefined !== curEntry.time) {
          previousDate = new Date(curEntry.time);
        }
      }
    }

    return restDuration;
  }
}
