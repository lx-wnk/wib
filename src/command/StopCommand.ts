import AbstractCommand from './AbstractCommand';
import {inject, injectable} from 'inversify';
import {Formatter, MessageService} from '../components';
import {ServiceIdentifiers, ORMIdentifiers} from '../identifiers';
import {DayRepository} from '../orm/repositories';
import {DayEntity} from '../orm/entities/Day.entity';
import {DateHelper} from '../helper';
@injectable()
export class StopCommand extends AbstractCommand {
  name = 'stop';
  aliases = ['bye'];
  options = [];
  description = 'command.stop.description';

  private dayRepository: DayRepository;
  private formatter: Formatter;

  constructor(
    @inject(ServiceIdentifiers.MessageService) messages: MessageService,
    @inject(ORMIdentifiers.Repositories.DayRepository) dayRepository: DayRepository,
    @inject(ServiceIdentifiers.Formatter) formatter: Formatter
  ) {
    super(messages);
    this.dayRepository = dayRepository;
    this.formatter = formatter;
  }

  exec(options: any, args?: any[]): void {
    const time = this.parseTimeFromArgs(args);

    this.stopDay(time);
  }

  private parseTimeFromArgs(args: any): Date {
    const now = new Date();

    if (!args || !args[0] || !args[0].includes(':')) {
      return now;
    }

    return DateHelper.parseTimeString(args[0], now);
  }

  private stopDay(finishTime: Date): void {
    this.dayRepository.getByDate(finishTime)
        .then((result) => {
          result.finish = finishTime;

          this.dayRepository.upsert(result);

          return result;
        })
        .then((currentDay) => {
          console.log(this.formatter.applyFormat(currentDay, 'format.commandResponse', 'stop'));
        });
  }
}
