export default abstract class AbstractCollection {
    abstract entries;
    abstract getWriteData(): object;
    removeEntry(key: number): void {
      this.entries[key] = undefined;
    }
    getAmount(): number {
      return Object.keys(this.entries).length;
    }
}
