import AbstractStruct from '../AbstractStruct';

export default class StartStruct extends AbstractStruct {
    time: Date;

    constructor(time?: Date) {
      super();
      if (time === undefined) {
        time = new Date();
      }

      this.time = time;
    }

    getWriteData(): object {
      return {
        time: this.time
      };
    }
}
