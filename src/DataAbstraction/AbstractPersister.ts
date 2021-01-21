import DateHelper from '../helper/DateHelper';

export default abstract class AbstractCommand {
  private dateHelper: DateHelper;


  constructor() {
    this.dateHelper = new DateHelper();
  }

  persist(data: object, date?: Date): void {
    let dateToPersist = this.dateHelper.calculateFormattedCurrentDate();
    if (!date) {
      dateToPersist = this.dateHelper.calculateFormattedGivenDateObject(date);
    }
    console.log();
  }
}
