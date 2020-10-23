import AbstractDataStruct from '../AbstractDataStruct';

export default class NoteStruct extends AbstractDataStruct {
    private _id: number;
    private _key: string;
    private _value: string;
    private _time: Date;
    private _deleted: boolean;
    private _dataKey = 'notes';

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
        dataKey: this.dataKey,
        deleted: this.deleted
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
