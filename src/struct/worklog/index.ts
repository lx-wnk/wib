import AbstractStruct from '../AbstractStruct';

export default class WorklogStruct extends AbstractStruct {
    id: number;
    key: string;
    value: string;
    time: Date;
    deleted: boolean;
    dataKey: string;

    constructor(id?: number, key?: string, value?: string, time?: Date, dataKey = 'worklogs') {
      super();

      if (null === time || undefined === time) {
        time = new Date(Date.now());
      }

      this.id = id;
      this.key = key;
      this.value = value;
      this.time = time;
      this.deleted = false;
      this.dataKey = dataKey;
    }

    public getWriteData(): object {
      return {
        id: this.id,
        key: this.key,
        value: this.value,
        time: this.time,
        deleted: this.deleted,
        dataKey: this.dataKey,
      };
    }

    public getWorklogPrintData(previousDate: Date): object {
      const writeData = this.getWriteData();
      if (previousDate !== undefined && writeData['time'] !== undefined) {
        writeData['duration'] = new Date((new Date(writeData['time'])).getTime() - (new Date(previousDate).getTime()));
      }

      return this.getPrintData(writeData);
    }
}
