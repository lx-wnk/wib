import AbstractCommand from './AbstractCommand';
import DataHelper from '../lib/helper/DataHelper';
import WorklogCollection from '../struct/collection/WorklogCollection';
import WorklogStruct from '../struct/worklog';

export default class WorklogCommand extends AbstractCommand {
    name = 'track';
    aliases = ['t', 'wl', 'worklog'];
    options = [
      {
        flag: '-d, --delete <key>',
        description: 'Delete an specified worklog'
      },
      {
        flag: '-e, --edit <key>',
        description: 'Edit an specified worklog'
      }];
    description = 'Add a new worklog';

    public execute(args, options): string {
      if (args.delete !== undefined) {
        return (new WorklogCommand()).deleteTracker(args.Delete);
      }

      if (args.edit !== undefined) {
        return (new WorklogCommand()).editTracker(args.edit, options[0], options.slice(1).join(' '));
      }

      return (new WorklogCommand()).createTimeTracker(options[0], options.slice(1).join(' '));
    }

    createTimeTracker(key: string, value: string): void {
      const worklogs = new WorklogCollection(),
        worklog = new WorklogStruct(worklogs.getAmount(), key, value);

      worklogs.addEntry(worklog);

      (new DataHelper).writeData(worklogs.getWriteData(), worklogs.dataKey);

      return worklog.getPrintData(null);
    }

    deleteTracker(id): void {
      const worklogs = new WorklogCollection();

      worklogs.entries[id] = undefined;

      (new DataHelper).writeData(worklogs.getWriteData(), worklogs.dataKey);

      return 'Deleted worklog with id: ' + id;
    }

    editTracker(id, key, value): void {
      const worklogs = new WorklogCollection();

      if (worklogs.entries[id] !== undefined) {
        worklogs.entries[id].key = key;
        worklogs.entries[id].value = value;
      }

      (new DataHelper).writeData(worklogs.getWriteData(), worklogs.dataKey);

      return 'Edited worklog with id: ' + id;
    }
}
