import AbstractStruct from '../AbstractStruct';

export default class NoteStruct extends AbstractStruct {
    id: number;
    key: string;
    value: string;
    time: Date;
    deleted: boolean;
    dataKey = 'notes';

    constructor(id?: number, value?: string, time = new Date(Date.now())) {
      super();

      this.id = id;
      this.time = time;
      this.value = value;
      this.deleted = false;
    }

    public getWriteData(): object {
      return {
        id: this.id,
        value: this.value,
        time: this.time,
        dataKey: this.dataKey
      };
    }
}
