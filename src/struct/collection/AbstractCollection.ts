import AbstractStruct from '../AbstractStruct';

export default abstract class AbstractCollection {
    abstract entries: object;
    abstract dataKey: string;

    public abstract getWriteData(): object;

    public abstract fromSavedData(date?: number);

    public removeEntry(key: number): void {
      this.entries[key] = undefined;
    }

    public addEntry(entry: AbstractStruct): void {
      this.entries[entry['id']] = entry;
    }

    public getAmount(): number {
      let amount = 0;

      if (this.entries instanceof Object && 0 < Object.keys(this.entries).length) {
        amount = Object.keys(this.entries).length;
      }

      return amount;
    }

    public getPrintData(): object {
      const printData = {};

      for (const key in this.entries) {
        if (undefined !== this.entries[key]['deleted'] && !this.entries[key]['deleted']) {
          printData[key] = this.entries[key].getPrintData();
        }
      }

      return printData;
    }
}
