import AbstractCollection from './AbstractCollection';
import DataHelper from '../../../helper/DataHelper';
import NoteStruct from '../note';

export default class NoteCollection extends AbstractCollection {
    private _entries: {string?: NoteStruct};
    private _dataKey = (new NoteStruct()).dataKey;

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
        this._entries[key] = (new NoteStruct(null)).fromObject(objData[key]);
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
      const printData = [];

      for (const key in this._entries) {
        if (!this._entries[key].deleted) {
          const curEntry = this._entries[key].getPrintData();

          printData.push(curEntry);
        }
      }

      return printData;
    }

    get entries(): { string?: NoteStruct } {
      return this._entries;
    }

    set entries(value: { string?: NoteStruct }) {
      this._entries = value;
    }

    get dataKey(): string {
      return this._dataKey;
    }

    set dataKey(value: string) {
      this._dataKey = value;
    }
}
