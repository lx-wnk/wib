import AbstractStruct from '../AbstractStruct';
import FormatHelper from '../../lib/helper/FormatHelper';

export default class StopStruct extends AbstractStruct {
    time: Date;
    dataKey = 'stop';

    constructor(time = new Date(Date.now())) {
      super();

      this.time = time;
    }

    public getWriteData(): object {
      return {
        time: this.time
      };
    }

    public getUnsetPrintData(dataObject = this.getWriteData()): object {
      return {
        'key': (new FormatHelper()).applyFormat(dataObject, 'stop-unset', 'key'),
        'value': (new FormatHelper()).applyFormat(dataObject, 'stop-unset')
      };
    }
}
