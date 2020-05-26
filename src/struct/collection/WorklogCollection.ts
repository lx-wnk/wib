import AbstractCollection from './AbstractCollection';
import DataHelper from '../../lib/helper/DataHelper';
import WorklogStruct from '../worklog';
import StartStruct from '../start';

export default class WorklogCollection extends AbstractCollection {
    entries: {string?: WorklogStruct};
    dataKey = (new WorklogStruct).dataKey;

    constructor(date?: number) {
      super();

      this.fromSavedData(date);
    }

    public fromSavedData(date?: number): this {
      const objData = (new DataHelper()).readAllData(this.dataKey, date);

      if (this.entries === undefined) {
        this.entries = {};
      }

      if (objData === undefined) {
        return this;
      }

      for (const key in objData) {
        this.entries[key] = (new WorklogStruct(null)).fromObject(objData[key]);
      }

      return this;
    }

    public addEntry(entry: WorklogStruct): void {
      this.entries[entry.id] = entry;
    }

    public removeEntry(key: number): void {
      this.entries[key] = undefined;
    }

    public getWriteData(): object {
      const writeData = {};

      for (const key in this.entries) {
        if (this.entries[key] !== undefined) {
          writeData[key] = this.entries[key].getWriteData();
        }
      }

      return writeData;
    }

    public getPrintData(): object {
      return this.getCalculatedPrintData((new StartStruct().fromSavedData()));
    }

    public getCalculatedPrintData(startStruct: StartStruct): object {
      const printData = [];
      let sortedEntries = {},
        startTime = startStruct.time;

      for (const key in this.entries) {
        if (undefined !== this.entries[key]['deleted'] && !this.entries[key]['deleted']) {
          sortedEntries[new Date(this.entries[key].time).getTime()] = this.entries[key];
        }
      }

      sortedEntries = Object.keys(sortedEntries).sort().reduce((r, k) => (r[k] = sortedEntries[k], r), {});

      for (const key in sortedEntries) {
        const curEntry = sortedEntries[key].getWorklogPrintData(startTime);

        printData.push(curEntry);
        startTime = new Date(sortedEntries[key].time);
      }

      return printData;
    }
}
