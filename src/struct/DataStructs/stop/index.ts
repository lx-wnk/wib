import AbstractDataStruct from '../AbstractDataStruct';
import FormatHelper from '../../../helper/FormatHelper';

export default class StopStruct extends AbstractDataStruct {
    private _time: Date;
    private _dataKey = 'stop';

    constructor(time = new Date(Date.now())) {
      super();

      this._time = time;
    }

    public getWriteData(): object {
      return {
        time: this._time
      };
    }

    public getUnsetPrintData(dataObject = this.getWriteData()): object {
      return {
        'key': (new FormatHelper()).applyFormat(dataObject, 'stop-unset', 'key'),
        'value': (new FormatHelper()).applyFormat(dataObject, 'stop-unset')
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
