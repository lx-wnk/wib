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
        flag: Messages.translation('command.rest.option.time.flag'),
        description: Messages.translation('command.rest.option.time.description')
      }
    ];

    public execute(args): string {
      const worklogs = new WorklogCollection().fromSavedData(),
        latestEntry = worklogs.getLatestEntry(),
        specifiedDate = new Date(Date.now());
      let rest: WorklogStruct;

      if (args.time !== undefined) {
        const timeArgs = args.time.split(':');
        specifiedDate.setHours(timeArgs[0]);
        specifiedDate.setMinutes(timeArgs[1]);
      }

      if (undefined !== latestEntry && null !== latestEntry && 'rest' === latestEntry.dataKey && !latestEntry.deleted) {
        rest = latestEntry;
        rest.time = specifiedDate;
      } else {
        rest = new WorklogStruct(worklogs.getAmount(), 'Break', 'Break', specifiedDate, 'rest');
        worklogs.addEntry(rest);
      }

      this.dataHelper.writeData(worklogs.getWriteData(), worklogs.dataKey);

      return Messages.translation('command.rest.execution.create') +
          rest.time.getHours() + ':' + rest.time.getMinutes();
    }
}
