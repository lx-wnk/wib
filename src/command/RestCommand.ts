import AbstractCommand from './AbstractCommand';
import WorklogCollection from '../struct/collection/WorklogCollection';
import WorklogStruct from '../struct/worklog';
import Messages from '../messages';


export default class RestCommand extends AbstractCommand {
    name = 'rest';
    aliases = ['b', 'break'];
    description = Messages.translation('command.rest.description');
    options = [
      {
        flag: Messages.translation('command.rest.option.edit.flag'),
        description: Messages.translation('command.rest.option.edit.description')
      },
      {
        flag: Messages.translation('command.rest.option.time.flag'),
        description: Messages.translation('command.rest.option.time.description')
      }
    ];

    private worklogs: WorklogCollection;

    constructor() {
      super();
      this.worklogs = new WorklogCollection().fromSavedData();
    }

    public execute(args): string {
      const specifiedDate = new Date(Date.now());

      if (args.time !== undefined) {
        const timeArgs = args.time.split(':');
        specifiedDate.setHours(timeArgs[0]);
        specifiedDate.setMinutes(timeArgs[1]);
      }

      if (args.edit !== undefined) {
        return (new RestCommand()).editRest(args.edit, specifiedDate);
      }

      return (new RestCommand()).createRest(specifiedDate);
    }

    createRest(specifiedDate: Date): string {
      const latestEntry = this.worklogs.getLatestEntry();
      let rest: WorklogStruct;

      if (undefined !== latestEntry && null !== latestEntry && 'rest' === latestEntry.dataKey && !latestEntry.deleted) {
        rest = latestEntry;
        rest.time = specifiedDate;
      } else {
        rest = new WorklogStruct(this.worklogs.getAmount(), 'Break', 'Break', specifiedDate, 'rest');
        this.worklogs.addEntry(rest);
      }

      this.dataHelper.writeData(this.worklogs.getWriteData(), this.worklogs.dataKey);

      return Messages.translation('command.rest.execution.create') +
            rest.time.getHours() + ':' + rest.time.getMinutes();
    }

    editRest(restKey: string, specifiedDate: Date): string {
      if (!this.worklogs.entries || !this.worklogs.entries[restKey]) {
        return Messages.translation('command.rest.execution.couldNotEdit') + restKey;
      }

      const rest = this.worklogs.entries[restKey];
      rest.time = specifiedDate;

      this.dataHelper.writeData(this.worklogs.getWriteData(), this.worklogs.dataKey);

      return Messages.translation('command.rest.execution.create') +
            rest.time.getHours() + ':' + rest.time.getMinutes();
    }
}
