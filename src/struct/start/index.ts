import AbstractStruct from '../AbstractStruct';

export default class StartStruct extends AbstractStruct {
    private _time: Date;
    private _dataKey = 'start';

    constructor(time= new Date(Date.now())) {
      super();

      this._time = time;
    }

    public getWriteData(): object {
      return {
        time: this._time
      };
    }


    get time(): Date {
      return this._time;
    }

    set time(value: Date) {
      this._time = value;
    }

    get dataKey(): string {
      return this._dataKey;
    }

    set dataKey(value: string) {
      this._dataKey = value;
    }
}
