import AbstractStruct from '../AbstractStruct';

export default class StopStruct extends AbstractStruct {
    time: Date;
    dataKey = 'stop';

    constructor(time = new Date()) {
      super();

      this.time = time;
    }

    getWriteData(): object {
      return {
        time: this.time
      };
    }
}
