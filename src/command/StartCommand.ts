import AbstractCommand from './AbstractCommand';

import {inject, injectable} from 'inversify';
import {ConnectionManager} from '../orm';
import {MessageService} from '../components';
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

  constructor(
    @inject(IDENTIFIERS.Message) messages: MessageService,
    @inject(IDENTIFIERS.ORM.Connection) connectionManager: ConnectionManager,
    @inject(IDENTIFIERS.ORM.repositories.day) dayRepository: DayRepository
  ) {
    super(messages);
    this.connectionManager = connectionManager;
    this.dayRepository = dayRepository;
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
          console.log(result);


          if (!result.finish) {
            result.finish = new Date();
          }
          currentDay.start.setHours(time.split(':')[0]);
          currentDay.start.setMinutes(time.split(':')[1]);

          if (!result) {
            this.dayRepository.create(result);

            return;
          }

          this.dayRepository.update(currentDay);
        });
  }
}
