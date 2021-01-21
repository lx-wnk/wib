export default class AbstractCommand {
  calculateFormattedCurrentDate(): string {
    const currentDate = new Date(Date.now());

    return `${currentDate.getUTCFullYear()}_${(currentDate.getUTCMonth() + 1).toString().padStart(2, '0')}_${currentDate.getUTCDate().toString().padStart(2, '0')}`;
  }

  calculateFormattedGivenDateData(date?: {year?: number; month?: number; day?: number}): string {
    const currentDate = new Date(Date.now());
    const givenDate = new Date(
        date.year ?? currentDate.getUTCFullYear(),
      date.month ? date.month - 1 : currentDate.getUTCMonth(),
      date.day ?? currentDate.getUTCDate());

    return `${givenDate.getUTCFullYear()}_${(givenDate.getUTCMonth() + 1).toString().padStart(2, '0')}_${givenDate.getUTCDate().toString().padStart(2, '0')}`;
  }

  calculateFormattedGivenDateObject(date: Date = new Date(Date.now())): string {
    return `${date.getUTCFullYear()}_${(date.getUTCMonth() + 1).toString().padStart(2, '0')}_${date.getUTCDate().toString().padStart(2, '0')}`;
  }
}
