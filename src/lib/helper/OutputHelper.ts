export default class OutputHelper {
  static log(value: string): void {
    console.log(value);
  }

  static error(value: string): void {
    console.error(value);
  }

  static table(value: string): void {
    console.table(value);
  }
}
