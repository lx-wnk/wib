import {inject, injectable} from 'inversify';
import AbstractCommand from './AbstractCommand';
import {ConnectionManager} from '../orm';
import {Formatter, MessageService, WorklogService} from '../components';
import {IDENTIFIERS} from '../identifiers';

@injectable()
export class WorklogCommand extends AbstractCommand {
  public name = 'worklog';
  public aliases = ['w', 't'];
  public options = [
    {
      flag: 'command.worklog.option.delete.flag',
      description: 'command.worklog.option.delete.description'
    },
    {
      flag: 'command.worklog.option.edit.flag',
      description: 'command.worklog.option.edit.description'
    },
    {
      flag: 'command.worklog.option.time.flag',
      description: 'command.worklog.option.time.description'
    },
    {
      flag: 'command.worklog.option.unexpected.flag',
      description: 'command.worklog.option.unexpected.description'
    }
  ];
  public description = 'Handle worklogs';

  private connectionManager: ConnectionManager;
  private worklogService: WorklogService;
  private formatter: Formatter;

  constructor(
    @inject(IDENTIFIERS.Message) messages: MessageService,
    @inject(IDENTIFIERS.ORM.Connection) connectionManager: ConnectionManager,
    @inject(IDENTIFIERS.worklog) worklogService: WorklogService,
    @inject(IDENTIFIERS.Formatter) formatter: Formatter
  ) {
    super(messages);
    this.connectionManager = connectionManager;
    this.worklogService = worklogService;
    this.formatter = formatter;
  }

  exec(options, args): void {
    const commandValues: string[] = args.args;
    let trackTime;
    const unexpected = options.unexpected ?? '';

    if (options.delete) {
      this.worklogService.delete(options.delete);
      console.log(this.formatter.applyFormat({'iterator': options.delete}, 'command.worklog.execution', 'delete'));

      return;
    }

    if (options.time) {
      trackTime = new Date();
      const timeArgs = options.time.split(':');
      trackTime.setHours(timeArgs[0]);
      trackTime.setMinutes(timeArgs[1]);

      if (trackTime.toString() === 'Invalid Date') {
        console.log(this.message.translation('command.worklog.execution.invalidTime'));
      }
    }

    if (options.edit) {
      this.worklogService.update(options.edit, commandValues, unexpected, trackTime);

      return;
    }

    if (commandValues.length < 2) {
      console.log(this.message.translation('command.worklog.execution.invalidArguments'));

      return;
    }

    this.worklogService.create(commandValues, unexpected, trackTime).then((res) => {
      console.log(this.formatter.applyFormat(res, 'command.worklog.execution', 'create'));
    });
  }
}
