export default abstract class AbstractCollection {
    abstract entries: object;
    abstract dataKey: string;

    abstract getWriteData(): object;

    removeEntry(key: number): void {
      this.entries[key] = undefined;
    }

    getAmount(): number {
      if (this.entries instanceof Object) {
        return Object.keys(this.entries).length;
      }

      return 0;
    }

    abstract fromSavedData(date?: number);

    getPrintData(): object {
      const printData = {};

      for (const key in this.entries) {
        printData[key] = this.entries[key].getPrintData();
      }

      return printData;
    }
}
