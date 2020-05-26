import AbstractStruct from '../AbstractStruct';

export default class WorklogStruct extends AbstractStruct {
    private _id: number;
    private _key: string;
    private _value: string;
    private _time: Date;
    private _duration: Date;
    private _deleted: boolean;
    private _dataKey: string;

    constructor(id?: number, key?: string, value?: string, time?: Date, dataKey = 'worklogs') {
      super();

      if (null === time || undefined === time) {
        time = new Date(Date.now());
      }

      this._id = id;
      this._key = key;
      this._value = value;
      this._time = time;
      this._deleted = false;
      this._dataKey = dataKey;
    }

    public getWriteData(): object {
      return {
        id: this._id,
        key: this._key,
        value: this._value,
        time: this._time,
        duration: this._duration,
        deleted: this._deleted,
        dataKey: this._dataKey,
      };
    }

    public getWorklogPrintData(previousDate: Date): object {
      if (previousDate !== undefined && this.time !== undefined) {
        this.duration = new Date((new Date(this.time)).getTime() - (new Date(previousDate).getTime()));
      }

      return this.getPrintData();
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

    get duration(): Date {
      return this._duration;
    }

    set duration(value: Date) {
      this._duration = value;
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
