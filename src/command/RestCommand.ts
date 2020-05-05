import AbstractCommand from './AbstractCommand';
import DataHelper from '../lib/helper/DataHelper';
import WorklogCollection from '../struct/collection/WorklogCollection';
import WorklogStruct from '../struct/worklog';

export default class RestCommand extends AbstractCommand {
    name = 'rest';
    aliases = ['b', 'break'];
    options = [];
    description = 'Add a new rest';

    public execute(): string {
      const worklogs = new WorklogCollection(),
        rest = new WorklogStruct(worklogs.getAmount(), 'Break', 'Break', new Date(), 'rest');

      worklogs.addEntry(rest);

      (new DataHelper).writeData(worklogs.getWriteData(), worklogs.dataKey);

      return 'Rest ended at: ' + rest.time.getHours() + ':' + rest.time.getMinutes();
    }
}
