import AbstractStruct from '../AbstractStruct';

export default class StartStruct extends AbstractStruct {
    time: Date;
    dataKey = 'start';

    constructor(time= new Date(Date.now())) {
      super();

      this.time = time;
    }

    public getWriteData(): object {
      return {
        time: this.time
      };
    }
}
