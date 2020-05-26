import AbstractStruct from '../AbstractStruct';

export default class NoteStruct extends AbstractStruct {
    private _id: number;
    private _key: string;
    private _value: string;
    private _time: Date;
    private _deleted: boolean;
    private _dataKey = 'notes';

    constructor(id?: number, value?: string, time = new Date(Date.now())) {
      super();

      this._id = id;
      this._time = time;
      this._value = value;
      this._deleted = false;
    }

    public getWriteData(): object {
      return {
        id: this._id,
        value: this._value,
        time: this._time,
        dataKey: this._dataKey
      };
    }


    get id(): number {
      return this._id;
    }

    set id(value: number) {
      this._id = value;
    }

    get key(): string {
      return this._key;
    }

    set key(value: string) {
      this._key = value;
    }

    get value(): string {
      return this._value;
    }

    set value(value: string) {
      this._value = value;
    }

    get time(): Date {
      return this._time;
    }

    set time(value: Date) {
      this._time = value;
    }

    get deleted(): boolean {
      return this._deleted;
    }

    set deleted(value: boolean) {
      this._deleted = value;
    }

    get dataKey(): string {
      return this._dataKey;
    }

    set dataKey(value: string) {
      this._dataKey = value;
    }
}
