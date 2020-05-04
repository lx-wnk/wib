import AbstractCommand from './AbstractCommand';
import StartStruct from '../struct/start';
import StopStruct from '../struct/stop';
import FormatHelper from '../lib/helper/FormatHelper';
import WorklogCollection from '../struct/collection/WorklogCollection';
import WorkDurationHelper from '../lib/helper/WorkDurationHelper';

export default class ListCommand extends AbstractCommand {
    name = 'list';
    aliases = [
      'l', 'status', 'report'
    ];
    description = 'Show the report';
    options = [];

    execute(): void {
      const startStruct = (new StartStruct()).fromSavedData(),
        stopStruct = (new StopStruct()).fromSavedData();


      console.log((new FormatHelper().toTable(
          {
            'start': startStruct.getPrintData(),
            'stop': stopStruct.getPrintData(),
            'workDuration': (new WorkDurationHelper).getWorkDuration(),
            'worklogs': (new WorklogCollection()).getPrintData()
          }
      )));
    }
}
