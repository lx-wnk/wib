import {inject, injectable} from 'inversify';
import AbstractCommand from './AbstractCommand';
import {ConnectionManager} from '../orm';
import {MessageService, WorklogService} from '../components';
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
    }
  ];
  public description = 'Handle worklogs';

  private connectionManager: ConnectionManager;
  private worklogService: WorklogService;

  constructor(
    @inject(IDENTIFIERS.Message) messages: MessageService,
    @inject(IDENTIFIERS.ORM.Connection) connectionManager: ConnectionManager,
    @inject(IDENTIFIERS.worklog) worklogService: WorklogService
  ) {
    super(messages);
    this.connectionManager = connectionManager;
    this.worklogService = worklogService;
  }

  exec(options, args): void {
    const commandValues: string[] = args.args;
    let trackTime;

    if (options.delete) {
      this.worklogService.delete(options.delete);

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
      console.log(options.edit);
      this.worklogService.update(options.edit, commandValues, trackTime);

      return;
    }

    this.worklogService.create(commandValues, trackTime);
  }
}
