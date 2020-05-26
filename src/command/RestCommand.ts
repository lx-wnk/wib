import AbstractCommand from './AbstractCommand';
import DataHelper from '../lib/helper/DataHelper';
import WorklogCollection from '../struct/collection/WorklogCollection';
import WorklogStruct from '../struct/worklog';
import * as responsePrefix from './response.json';


export default class RestCommand extends AbstractCommand {
    name = 'rest';
    aliases = ['b', 'break'];
    options = [
      {
        flag: '-t, --time <hour:minute>',
        description: 'Create a worklog with specified time'
      }
    ];
    description = 'Add a new rest';

    public execute(args): string {
      const worklogs = new WorklogCollection(),
        specifiedDate = new Date(Date.now());

      if (args.time !== undefined) {
        const timeArgs = args.time.split(':');
        specifiedDate.setHours(timeArgs[0]);
        specifiedDate.setMinutes(timeArgs[1]);
      }

      const rest = new WorklogStruct(worklogs.getAmount(), 'Break', 'Break', specifiedDate, 'rest');

      worklogs.addEntry(rest);

      (new DataHelper).writeData(worklogs.getWriteData(), worklogs.dataKey);

      return responsePrefix.rest.create + rest.time.getHours() + ':' + rest.time.getMinutes();
    }
}
