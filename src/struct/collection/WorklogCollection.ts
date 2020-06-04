import AbstractCollection from './AbstractCollection';
import DataHelper from '../../helper/DataHelper';
import WorklogStruct from '../worklog';
import StartStruct from '../start';

export default class WorklogCollection extends AbstractCollection {
    private _entries: {string?: WorklogStruct};
    private _dataKey = (new WorklogStruct).dataKey;

    constructor(date?: number) {
      super();

      this.fromSavedData(date);
    }

    public fromSavedData(date?: number): this {
      const objData = (new DataHelper()).readAllData(this._dataKey, date);

      if (this._entries === undefined) {
        this._entries = {};
      }

      if (objData === undefined) {
        return this;
      }

      for (const key in objData) {
        this._entries[key] = (new WorklogStruct(null)).fromObject(objData[key]);
      }

      return this;
    }

    public addEntry(entry: WorklogStruct): void {
      this._entries[entry.id] = entry;
    }

    public removeEntry(key: number): void {
      this._entries[key] = undefined;
    }

    public getWriteData(): object {
      const writeData = {};

      for (const key in this._entries) {
        if (this._entries[key] !== undefined) {
          writeData[key] = this._entries[key].getWriteData();
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

      for (const key in this._entries) {
        if (undefined !== this._entries[key]['deleted'] && !this._entries[key]['deleted']) {
          sortedEntries[new Date(this._entries[key].time).getTime()] = this._entries[key];
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

    public getLatestEntry(): WorklogStruct {
      const reversedEntries = Object.values(this.entries).reverse();

      if (!Object.values(this.entries).pop().deleted) {
        return Object.values(this.entries).pop();
      }

      for (const key in reversedEntries) {
        if (!reversedEntries[key].deleted) {
          return reversedEntries[key];
        }
      }
    }

    get entries(): { string?: WorklogStruct } {
      return this._entries;
    }

    set entries(value: { string?: WorklogStruct }) {
      this._entries = value;
    }

    get dataKey(): string {
      return this._dataKey;
    }

    set dataKey(value: string) {
      this._dataKey = value;
    }
}
