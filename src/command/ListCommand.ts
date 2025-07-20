import {inject, injectable} from 'inversify';
import AbstractCommand from './AbstractCommand';
import {MessageService} from '../components';
import {ServiceIdentifiers} from '../identifiers';
import {ListService} from '../components';
import {DateHelper} from '../helper';

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
    @inject(ServiceIdentifiers.MessageService) messages: MessageService,
    @inject(ServiceIdentifiers.ListService) listService: ListService
  ) {
    super(messages);
    this.listService = listService;
  }

  exec(options: any, args?: any[]): void {
    const outputDate = this.determineOutputDate(options);

    this.displayList(outputDate, options.order, options.full);
  }

  private determineOutputDate(options: any): Date {
    return DateHelper.getDateForDay(options.day, options.yesterday);
  }

  private displayList(date: Date, order?: string, fullOutput?: string): void {
    this.listService.getList(date, order, fullOutput)
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.error(this.message.translation('command.list.execution.error', {error}));
        });
  }
}
