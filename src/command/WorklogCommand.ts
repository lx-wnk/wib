import {inject, injectable} from 'inversify';
import AbstractCommand from './AbstractCommand';
import {ConnectionManager} from '../orm';
import {MessageService} from '../components';
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

  constructor(
    @inject(IDENTIFIERS.Message) messages: MessageService,
    @inject(IDENTIFIERS.ORM.Connection) connectionManager: ConnectionManager
  ) {
    super(messages);
    this.connectionManager = connectionManager;
  }

  exec(args): void {
    console.log(args);
  }
}
