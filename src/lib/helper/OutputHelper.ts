export default class OutputHelper {
  static log(value): void {
    console.log(value);
  }

  static error(value): void {
    console.error(value);
  }

  static table(value): void {
    console.table(value);
  }
}
