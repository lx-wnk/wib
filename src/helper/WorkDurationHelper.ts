import StartStruct from '../struct/start';
import WorklogCollection from '../struct/collection/WorklogCollection';
import FormatHelper from './FormatHelper';
import ConfigHelper from './ConfigHelper';

export default class WorkDurationHelper {
  public getWorkDuration(start?: StartStruct, worklogs?: WorklogCollection): object {
    const baseDate = new Date(new Date(Date.now()).getTime() - new Date(Date.now()).getTime()),
      workedMinutes = this.calculateWorkedMinutes(this.sortEntries(worklogs), start.time);

    baseDate.setMinutes(workedMinutes);

    return {
      key: (new FormatHelper()).applyFormat({'duration': baseDate}, 'workDuration', 'key'),
      value: (new FormatHelper()).applyFormat({'duration': baseDate}, 'workDuration')
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
        curEntryDuration = new Date( curDate.getTime() - previousDate.getTime());

      if (undefined !== sortedEntries[key].dataKey && 'rest' !== sortedEntries[key].dataKey) {
        workedMinutes += Math.ceil((curEntryDuration.getUTCHours() * 60 + curEntryDuration.getUTCMinutes()) /
            (new ConfigHelper).getSpecifiedMinuteRounding()) *
            (new ConfigHelper).getSpecifiedMinuteRounding();
      }

      previousDate = curDate;
    }

    return workedMinutes;
  }
}
