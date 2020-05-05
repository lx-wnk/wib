import AbstractStruct from '../AbstractStruct';

export default class WorklogStruct extends AbstractStruct {
    id: number;
    key: string;
    value: string;
    time: Date;
    dataKey: string;

    constructor(id?: number, key?: string, value?: string, time = new Date(), dataKey = 'worklogs') {
      super();

      this.id = id;
      this.key = key;
      this.value = key;
      this.time = time;
      this.dataKey = dataKey;
    }

    getWriteData(): object {
      return {
        id: this.id,
        key: this.key,
        value: this.value,
        time: this.time,
        dataKey: this.dataKey
      };
    }

    getWorklogPrintData(previousDate: Date): object {
      const writeData = this.getWriteData();
      if (previousDate !== undefined && writeData['time'] !== undefined) {
        writeData['duration'] = new Date((new Date(writeData['time'])).getTime() - (new Date(previousDate).getTime()));
      }

      return this.getPrintData(writeData);
    }
}
