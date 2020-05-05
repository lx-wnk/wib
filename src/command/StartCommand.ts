import AbstractCommand from './AbstractCommand';
import DataHelper from '../lib/helper/DataHelper';
import StartStruct from '../struct/start';

export default class StartCommand extends AbstractCommand {
    name = 'start';
    aliases = ['hi'];
    options = [];
    description = 'Set the start time for the day';

    execute(args, options): string {
      const start = new StartStruct();

      if (options !== undefined && options[0] !== undefined && options[0].includes(':')) {
        start.time.setHours(options[0].split(':')[0]);
        start.time.setMinutes(options[0].split(':')[1]);
      }

      (new DataHelper).writeData(start.getWriteData(), start.dataKey);

      return start.getPrintData()['key'] +' '+ start.getPrintData()['value'];
    }
}
