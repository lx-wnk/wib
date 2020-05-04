import AbstractCollection from './AbstractCollection';
import DataHelper from '../../lib/helper/DataHelper';
import WorklogStruct from '../worklog';
import StartStruct from '../start';

export default class RestCollection extends AbstractCollection {
    entries: {string?: WorklogStruct};
    dataKey = (new WorklogStruct).dataKey;

    constructor() {
      super();

      this.fromSavedData();
    }

    fromSavedData(date?: string): this {
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

    addEntry(entry: WorklogStruct): void {
      this.entries[entry.id] = entry;
    }

    removeEntry(key: number): void {
      this.entries[key] = undefined;
    }

    getWriteData(): object {
      const writeData = {};

      for (const key in this.entries) {
        if (this.entries[key] !== undefined) {
          writeData[key] = this.entries[key].getWriteData();
        }
      }

      return writeData;
    }

    getPrintData(): object {
      const printData = [];
      let startTime = (new StartStruct().fromSavedData()).time;

      for (const key in this.entries) {
        const curEntry = this.entries[key].getPrintData(startTime);

        printData.push(curEntry);
        startTime = new Date(this.entries[key].time);
      }

      return printData;
    }
}
