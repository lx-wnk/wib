import AbstractCommand from './AbstractCommand';
import {Formatter, MessageService, WorklogService} from '../components';
import {inject, injectable} from 'inversify';
import {IDENTIFIERS} from '../identifiers';

@injectable()
export class RestCommand extends AbstractCommand {
  public name = 'rest';
  public aliases = ['b', 'break'];
  public options = [{
    flag: 'command.rest.option.time.flag',
    description: 'command.rest.option.time.description'
  }];
  public description = 'command.rest.description';

  private worklogService: WorklogService;
  private formatter: Formatter;

  constructor(
    @inject(IDENTIFIERS.Message) messages: MessageService,
    @inject(IDENTIFIERS.worklog) worklogService: WorklogService,
    @inject(IDENTIFIERS.Formatter) formatter: Formatter
  ) {
    super(messages);
    this.worklogService = worklogService;
    this.formatter = formatter;
  }

  exec(options): void {
    let trackTime;

    if (options.time) {
      trackTime = new Date();
      const timeArgs = options.time.split(':');
      trackTime.setHours(timeArgs[0]);
      trackTime.setMinutes(timeArgs[1]);

      if (trackTime.toString() === 'Invalid Date') {
        console.log(this.message.translation('command.worklog.execution.invalidTime'));
      }
    }

    this.worklogService.createRest(trackTime).then((res) => {
      console.log(this.formatter.applyFormat(res, 'command.rest.execution', 'create'));
    });
  }
}
