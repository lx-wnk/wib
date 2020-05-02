import AbstractStruct from '../AbstractStruct';

export default class RestStruct extends AbstractStruct {
    id: number;
    time: Date;

    constructor(id: number) {
      super();

      this.id = id;
      this.time = new Date();
    }

    getWriteData(): object {
      return {
        time: this.time
      };
    }
}
