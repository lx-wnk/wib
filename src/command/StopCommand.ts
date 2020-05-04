import AbstractCommand from './AbstractCommand';
import DataHelper from '../lib/helper/DataHelper';
import StopStruct from '../struct/stop';

export default class StopCommand extends AbstractCommand {
    name = 'stop';
    aliases = ['bye'];
    options = [];
    description = 'Set the stop time for the day';

    public execute(args, options): void {
      const stop = new StopStruct();

      if (options !== undefined && options[0] !== undefined && options[0].includes(':')) {
        stop.time.setHours(options[0].split(':')[0]);
        stop.time.setMinutes(options[0].split(':')[1]);
      }

      (new DataHelper).writeData(stop.getWriteData(), stop.dataKey);

      console.log(stop.getPrintData()['key'] +' '+ stop.getPrintData()['value']);
    }
}
