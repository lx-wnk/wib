import AbstractCollection from './AbstractCollection';
import DataHelper from '../../helper/DataHelper';
import WorklogStruct from '../worklog';
import StartStruct from '../start';
import ConfigHelper from '../../helper/ConfigHelper';

export default class WorklogCollection extends AbstractCollection {
    public static possibleOrderKeys = {
      time: 'time',
      key: 'key',
      value: 'value',
      id: 'id'
    };

    private _entries: {string?: WorklogStruct};
    private _dataKey = (new WorklogStruct()).dataKey;

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

    public getCalculatedPrintData(startStruct: StartStruct, order = WorklogCollection.possibleOrderKeys.time): object {
      const startTime = startStruct.time;
      let timeSortedEntries = {},
        keySortedEntries = {};

      for (const key in this._entries) {
        if (undefined !== this._entries[key]['deleted'] && !this._entries[key]['deleted']) {
          timeSortedEntries[new Date(this._entries[key].time).getTime()] = this._entries[key];
        }
      }

      timeSortedEntries = Object.keys(timeSortedEntries).sort().reduce((r, k) => (r[k] = timeSortedEntries[k], r), {});

      keySortedEntries = this.getKeySortedData(timeSortedEntries, startTime, order);

      keySortedEntries = Object.keys(keySortedEntries).sort().reduce((r, k) => (r[k] = keySortedEntries[k], r), {});

      return Object.values(keySortedEntries);
    }

    private getKeySortedData(timeSortedEntries: object, startTime: Date, order: string): object {
      const keySortedEntries = {},
        maxWorklogDuration = (new ConfigHelper()).getMaxWorklogDuration();

      for (const key in timeSortedEntries) {
        const curDuration = new Date((new Date(timeSortedEntries[key].time)).getTime() - startTime.getTime());
        let curMinutes = curDuration.getUTCMinutes() + curDuration.getUTCHours() * 60,
          curLoopCount = 0;

        if ('rest' !== timeSortedEntries[key].dataKey && curMinutes > maxWorklogDuration) {
          while (curMinutes > maxWorklogDuration) {
            const tmpDate = new Date(Date.now() - Date.now());
            tmpDate.setMinutes(maxWorklogDuration);

            curMinutes -= maxWorklogDuration;

            timeSortedEntries[key].duration = tmpDate;

            const curEntry = timeSortedEntries[key].getPrintData();

            if (null !== curEntry && undefined !== curEntry) {
              keySortedEntries[this.getKeyByOrder(timeSortedEntries[key], order) + curLoopCount] = curEntry;
            }

            curLoopCount++;
          }

          const tmpDate = new Date(Date.now() - Date.now());
          tmpDate.setMinutes(curMinutes);
          timeSortedEntries[key].duration = tmpDate;

          const curEntry = timeSortedEntries[key].getPrintData();

          if (null !== curEntry && undefined !== curEntry) {
            keySortedEntries[this.getKeyByOrder(timeSortedEntries[key], order)+ curLoopCount] = curEntry;
          }
        } else {
          const curEntry = timeSortedEntries[key].getWorklogPrintData(startTime);

          if (null !== curEntry && undefined !== curEntry) {
            keySortedEntries[this.getKeyByOrder(timeSortedEntries[key], order)] = curEntry;
          }
        }

        startTime = new Date(timeSortedEntries[key].time);
      }

      return keySortedEntries;
    }

    private getKeyByOrder(entry: WorklogStruct, order: string): string {
      switch (order) {
        case 'key':
          return entry.key + entry.id;
        case 'value':
          return entry.value;
        case 'id':
          return entry.id.toString();
        default:
          return entry.time.toString();
      }
    }

    public getLatestEntry(): WorklogStruct|null {
      const reversedEntries = Object.values(this.entries).reverse();

      if (0 === this.getAmount()) {
        return null;
      }

      if (!Object.values(this.entries).pop().deleted) {
        return Object.values(this.entries).pop();
      }

      for (const key in reversedEntries) {
        if (!reversedEntries[key].deleted) {
          return reversedEntries[key];
        }
      }

      return null;
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
