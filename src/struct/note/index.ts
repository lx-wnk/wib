import AbstractStruct from '../AbstractStruct';

export default class NoteStruct extends AbstractStruct {
    id: number;
    key: string;
    value: string;
    time: Date;
    dataKey = 'note';

    constructor(id?: number, value?: string, time = new Date()) {
      super();

      this.id = id;
      this.time = time;
      this.value = value;
    }

    getWriteData(): object {
      return {
        id: this.id,
        value: this.value,
        time: this.time,
        dataKey: this.dataKey
      };
    }
}
