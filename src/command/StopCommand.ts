import AbstractCommand from './AbstractCommand';

import {inject, injectable} from 'inversify';
import {ConnectionManager} from '../orm';
import {Formatter, MessageService} from '../components';
import {IDENTIFIERS} from '../identifiers';
import {DayRepository} from '../orm/repositories';
import {DayEntity} from '../orm/entities/Day.entity';

@injectable()
export class StopCommand extends AbstractCommand {
  name = 'stop';
  aliases = ['bye'];
  options = [];
  description = 'todo';

  private connectionManager: ConnectionManager;
  private dayRepository: DayRepository;
  private formatter: Formatter;

  constructor(
    @inject(IDENTIFIERS.Message) messages: MessageService,
    @inject(IDENTIFIERS.ORM.Connection) connectionManager: ConnectionManager,
    @inject(IDENTIFIERS.ORM.repositories.day) dayRepository: DayRepository,
    @inject(IDENTIFIERS.Formatter) formatter: Formatter
  ) {
    super(messages);
    this.connectionManager = connectionManager;
    this.dayRepository = dayRepository;
    this.formatter = formatter;
  }


  exec(args, options): void {
    let time = options.args[0];

    if (!options || !options.args || !options.args[0] || !options.args[0].includes(':')) {
      time = (new Date()).getHours() + ':' + (new Date()).getMinutes();
    }

    let currentDay = new DayEntity();

    this.dayRepository.getByDate()
        .then((result) => {
          if (result instanceof DayEntity) {
            currentDay = result;
          }

          if (!currentDay.finish) {
            currentDay.finish = new Date();
          }

          currentDay.finish.setHours(time.split(':')[0]);
          currentDay.finish.setMinutes(time.split(':')[1]);

          if (!currentDay.id) {
            this.dayRepository.create(currentDay);

            return;
          }

          this.dayRepository.update(currentDay);
        })
        .finally(() => {
          console.log(this.formatter.applyFormat(currentDay, 'format.commandResponse', 'stop'));
        });
  }
}
