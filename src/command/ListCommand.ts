import {inject, injectable} from 'inversify';
import AbstractCommand from './AbstractCommand';
import {MessageService} from '../components';
import {IDENTIFIERS} from '../identifiers';
import {ListService} from '../components';

@injectable()
export class ListCommand extends AbstractCommand {
  public name = 'list';
  public aliases = ['l'];
  public options = [
    {
      flag: 'command.list.option.yesterday.flag',
      description: 'command.list.option.yesterday.description'
    },
    {
      flag: 'command.list.option.full.flag',
      description: 'command.list.option.full.description'
    },
    {
      flag: 'command.list.option.order.flag',
      description: 'command.list.option.order.description'
    },
    {
      flag: 'command.list.option.day.flag',
      description: 'command.list.option.day.description'
    }
  ];
  public description = 'command.list.description';

  private listService: ListService;

  constructor(
    @inject(IDENTIFIERS.Message) messages: MessageService,
    @inject(IDENTIFIERS.List) listService: ListService
  ) {
    super(messages);
    this.listService = listService;
  }

  exec(options, args): void {
    const commandValues: string[] = args.args;
    const outputDate = new Date();
    let trackTime;

    if (options.yesterday) {
      outputDate.setUTCDate(outputDate.getUTCDate() - 1);

      return;
    }

    if (options.day) {
      outputDate.setUTCDate(options.day);

      return;
    }

    if (options.full) {
      // todo

      return;
    }

    if (options.order) {
      // todo

      return;
    }

    this.listService.getList().then((result) => {
      console.log(result);
    });
  }
}
