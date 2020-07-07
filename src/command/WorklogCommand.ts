import AbstractCommand from './AbstractCommand';

import WorklogCollection from '../struct/collection/WorklogCollection';
import WorklogStruct from '../struct/worklog';
import StartStruct from '../struct/start';
import Messages from '../messages';

export default class WorklogCommand extends AbstractCommand {
    name = 'track';
    aliases = ['t', 'wl', 'worklog'];
    options = [
      {
        flag: Messages.translation('command.worklog.option.delete.flag'),
        description: Messages.translation('command.worklog.option.delete.description')
      },
      {
        flag: Messages.translation('command.worklog.option.edit.flag'),
        description: Messages.translation('command.worklog.option.edit.description')
      },
      {
        flag: Messages.translation('command.worklog.option.time.flag'),
        description: Messages.translation('command.worklog.option.time.description')
      }];
    description = Messages.translation('command.worklog.description');

    private worklogs: WorklogCollection;

    constructor() {
      super();
      this.worklogs = new WorklogCollection();
    }

    public execute(args, options): string {
      let specifiedDate, key, value;

      if (args.delete !== undefined) {
        return (new WorklogCommand()).deleteTracker(args.delete);
      }

      if (args.time !== undefined) {
        const timeArgs = args.time.split(':');
        specifiedDate = new Date(Date.now());
        specifiedDate.setHours(timeArgs[0]);
        specifiedDate.setMinutes(timeArgs[1]);
      }

      if (undefined !== options) {
        key = options[0];

        if (undefined !== options[1]) {
          value = options.slice(1).join(' ');
        }
      }

      if (args.edit !== undefined) {
        return (new WorklogCommand()).editTracker(args.edit, key, value, specifiedDate);
      }

      return (new WorklogCommand()).createTimeTracker(key, value, specifiedDate);
    }

    createTimeTracker(key: string, value: string, date?: Date): string {
      const worklog = new WorklogStruct(this.worklogs.getAmount(), key, value, date),
        startStruct = (new StartStruct(null)).fromSavedData();

      if (undefined === key || undefined === value) {
        return Messages.translation('command.worklog.execution.missingOptions');
      }

      this.worklogs.addEntry(worklog);

      this.dataHelper.writeData(this.worklogs.getWriteData(), this.worklogs.dataKey);

      this.worklogs.fromSavedData();

      if (!startStruct.time) {
        startStruct.time = new Date(Date.now());
      }

      return Messages.translation('command.worklog.execution.create') +
          Object.values(this.worklogs.getCalculatedPrintData(
              startStruct, WorklogCollection.possibleOrderKeys.id)
          ).slice(-1)[0]['value'];
    }

    editTracker(id, key?: string, value?: string, date?: Date): string {
      if (undefined === this.worklogs.entries || undefined === this.worklogs.entries[id]) {
        return Messages.translation('command.worklog.execution.couldNotEdit') + id;
      }

      if (null !== date && undefined !== date) {
        this.worklogs.entries[id].time = date;
      }

      if (null !== key && undefined !== key) {
        this.worklogs.entries[id].key = key;
      }

      if (null !== value && undefined !== value) {
        this.worklogs.entries[id].value = value;
      }

      this.dataHelper.writeData(this.worklogs.getWriteData(), this.worklogs.dataKey);

      return Messages.translation('command.worklog.execution.edit') + id;
    }

    deleteTracker(id): string {
      if (undefined === this.worklogs.entries || undefined === this.worklogs.entries[id]) {
        return Messages.translation('command.worklog.execution.couldNotDelete') + id;
      }

      this.worklogs.entries[id].deleted = true;

      this.dataHelper.writeData(this.worklogs.getWriteData(), this.worklogs.dataKey);

      return Messages.translation('command.worklog.execution.delete') + id;
    }
}
