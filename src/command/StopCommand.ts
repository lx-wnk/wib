import AbstractCommand from './AbstractCommand';
import StopStruct from '../struct/DataStructs/stop';
import Messages from '../messages';

export default class StopCommand extends AbstractCommand {
    name = 'stop';
    aliases = ['bye'];
    options = [];
    description = Messages.translation('command.stop.description');

    public execute(args, options): string {
      const stop = new StopStruct();

      if (options !== undefined && options[0] !== undefined && options[0].includes(':')) {
        stop.time.setHours(options[0].split(':')[0]);
        stop.time.setMinutes(options[0].split(':')[1]);
      }

      this.dataHelper.writeData(stop.getWriteData(), stop.dataKey);

      return stop.getPrintData()['key'] +' '+ stop.getPrintData()['value'];
    }
}
