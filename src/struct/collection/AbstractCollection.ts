export default abstract class AbstractCollection {
    abstract entries: object;
    abstract dataKey: string;

    abstract getWriteData(): object;

    removeEntry(key: number): void {
      this.entries[key] = undefined;
    }

    getAmount(): number {
      let amount = 0;

      if (this.entries instanceof Object && 0 < Object.keys(this.entries).length) {
        amount = Object.keys(this.entries).length;
      }

      return amount;
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
