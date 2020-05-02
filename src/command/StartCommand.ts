import AbstractCommand from './AbstractCommand';
import StopStruct from '../struct/stop';
import DataHelper from '../lib/helper/DataHelper';

export default class StartCommand extends AbstractCommand {
    name = 'start';
    aliases = ['hi'];
    options = [];
    description = 'Set the start time for the day';

    execute(args, options): void {
      const start = new StopStruct();
      console.log(options);
      if (options !== undefined && options[0] !== undefined && options[0].includes(':')) {
        start.time.setHours(options[0].split(':')[0]);
        start.time.setMinutes(options[0].split(':')[1]);
      }

      (new DataHelper).writeData(start.getWriteData(), 'stop');

      console.log(start.time.getHours() + ':' + start.time.getMinutes());
    }
}
