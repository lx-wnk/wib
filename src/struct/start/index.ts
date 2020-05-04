import AbstractStruct from '../AbstractStruct';

export default class StartStruct extends AbstractStruct {
    time: Date;
    dataKey = 'start';

    constructor(time= new Date()) {
      super();

      this.time = time;
    }

    getWriteData(): object {
      return {
        time: this.time
      };
    }
}
