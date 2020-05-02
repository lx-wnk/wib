import AbstractCollection from './AbstractCollection';
import DataHelper from '../../lib/helper/DataHelper';
import RestStruct from '../rest';

export default class RestCollection extends AbstractCollection {
    entries: {};

    constructor() {
      super();

      this.entries = (new DataHelper).readAllData('rest');
    }

    addEntry(entry: RestStruct): void {
      this.entries[entry.id] = entry;
    }

    removeEntry(key: number): void {
      this.entries[key] = undefined;
    }

    getWriteData(): object {
      return this.entries;
    }
}
