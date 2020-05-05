import AbstractCollection from './AbstractCollection';
import DataHelper from '../../lib/helper/DataHelper';
import NoteStruct from '../note';

export default class NoteCollection extends AbstractCollection {
    entries: {string?: NoteStruct};
    dataKey = (new NoteStruct).dataKey;

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
        this.entries[key] = (new NoteStruct(null)).fromObject(objData[key]);
      }

      return this;
    }

    addEntry(entry: NoteStruct): void {
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

      for (const key in this.entries) {
        const curEntry = this.entries[key].getPrintData();

        printData.push(curEntry);
      }

      return printData;
    }
}
