export interface IRepository {
  getByDate(date?: Date): Promise<any>;
  getUndeletedList(date?: Date): Promise<any[]>;
  getUndeletedListForDate(date?: Date): Promise<any[]>;
}
