import AbstractCommand from './AbstractCommand';

import {inject, injectable} from 'inversify';
import {ConnectionManager} from '../orm';
import {Formatter, MessageService} from '../components';
import {IDENTIFIERS} from '../identifiers';
import {DayRepository} from '../orm/repositories';
import {DayEntity} from '../orm/entities/Day.entity';

@injectable()
export class StartCommand extends AbstractCommand {
  name = 'start';
  aliases = ['hi'];
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
    let time = options[0];
    if (!options || !options[0] || !options[0].includes(':')) {
      time = (new Date()).getUTCHours() + ':' + (new Date()).getUTCMinutes();
    }

    let currentDay = new DayEntity();

    this.dayRepository.getByDate()
        .then((result) => {
          if (result instanceof DayEntity) {
            currentDay = result;
          }

          if (!currentDay.start) {
            currentDay.start = new Date();
          }

          currentDay.start.setHours(time.split(':')[0]);
          currentDay.start.setMinutes(time.split(':')[1]);

          if (!currentDay.id) {
            this.dayRepository.create(currentDay);

            return;
          }

          this.dayRepository.update(currentDay);
        }).finally(() => {
          console.log(this.formatter.applyFormat({'time': currentDay.start}, 'start', 'commandResponse'));
        });
  }
}
