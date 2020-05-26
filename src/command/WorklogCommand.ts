import AbstractCommand from './AbstractCommand';
import DataHelper from '../lib/helper/DataHelper';
import WorklogCollection from '../struct/collection/WorklogCollection';
import WorklogStruct from '../struct/worklog';
import * as responsePrefix from './response.json';
import StartStruct from '../struct/start';

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
      },
      {
        flag: '-t, --time <hour:minute>',
        description: 'Create a worklog with specified time'
      }];
    description = 'Add a new worklog';

    public execute(args, options): string {
      let specifiedDate = null;

      if (args.delete !== undefined) {
        return (new WorklogCommand()).deleteTracker(args.delete);
      }

      if (args.time !== undefined) {
        const timeArgs = args.time.split(':');
        specifiedDate = new Date(Date.now());
        specifiedDate.setHours(timeArgs[0]);
        specifiedDate.setMinutes(timeArgs[1]);
      }

      if (args.edit !== undefined) {
        if (args.time !== undefined) {
          if (undefined === options || 0 === options.length) {
            return (new WorklogCommand()).editTracker(args.edit, null, null, specifiedDate);
          }
          return (new WorklogCommand()).editTracker(args.edit, options[0], options.slice(1).join(' '), specifiedDate);
        } else {
          return (new WorklogCommand()).editTracker(args.edit, options[0], options.slice(1).join(' '));
        }
      }

      if (options === undefined || 1 > options[0] === undefined || options[1] === undefined) {
        return responsePrefix.note.missingOptions;
      }

      return (new WorklogCommand()).createTimeTracker(options[0], options.slice(1).join(' '), specifiedDate);
    }

    createTimeTracker(key: string, value: string, date?: Date): string {
      const worklogs = new WorklogCollection(),
        worklog = new WorklogStruct(worklogs.getAmount(), key, value, date);

      worklogs.addEntry(worklog);

      (new DataHelper).writeData(worklogs.getWriteData(), worklogs.dataKey);

      worklogs.fromSavedData();

      return responsePrefix.worklog.create +
          Object.values(worklogs.getCalculatedPrintData((new StartStruct(null)).fromSavedData())).slice(-1)[0]['value'];
    }

    editTracker(id, key?: string, value?: string, date?: Date): string {
      const worklogs = new WorklogCollection();

      if (undefined === worklogs.entries || undefined === worklogs.entries[id]) {
        return responsePrefix.worklog.couldNotEdit + id;
      }

      if (null !== date && undefined !== date) {
        worklogs.entries[id].time = date;
      }

      if (null !== key && undefined !== key) {
        worklogs.entries[id].key = key;
      }

      if (null !== value && undefined !== value) {
        worklogs.entries[id].value = value;
      }

      (new DataHelper).writeData(worklogs.getWriteData(), worklogs.dataKey);

      return responsePrefix.worklog.edit + id;
    }

    deleteTracker(id): string {
      const worklogs = new WorklogCollection();

      if (undefined === worklogs.entries || undefined === worklogs.entries[id]) {
        return responsePrefix.worklog.couldNotDelete + id;
      }

      worklogs.entries[id]['deleted'] = true;

      (new DataHelper).writeData(worklogs.getWriteData(), worklogs.dataKey);

      return responsePrefix.worklog.delete + id;
    }
}
