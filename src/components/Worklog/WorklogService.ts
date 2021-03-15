import {injectable} from 'inversify';
import {WorklogEntity} from '../../orm/entities/Worklog.entity';
import {AbstractWorklogService} from './AbstractWorklogService';
import {DayEntity} from '../../orm/entities/Day.entity';

@injectable()
export class WorklogService extends AbstractWorklogService {
  public create(commandValues: Array<string>, time: Date = new Date()) {
    if (commandValues.length < 2) {
      return 'invalid'; // TODO
    }

    let currentDay: DayEntity;

    this.getCurrentDay()
        .then((result) => {
          console.log(result);

          if (result.length === 0) {
            this.startDay(time).then((day) => {
              currentDay = day;
            });
          } else {
            currentDay = result.shift();
          }
        })
        .finally(() => {
          const worklog = new WorklogEntity();
          worklog.time = time;
          worklog.key = commandValues[0];
          worklog.value = commandValues[1];
          worklog.day = currentDay;

          this.worklogRepository.create(worklog);
        });
  }

  public update(iterator: number, commandValues: string[], time: Date) {
    this.worklogRepository.getByDateIterator(time, iterator)
        .then((result) => {
          if (result.length !== 1) {
            console.log('something went wrong');
            return;
            // TODO
          }

          const singleResult = result.shift();

          if (time) {
            singleResult.time = time;
          }

          if (commandValues[0]) {
            singleResult.key =commandValues[0];

            if (commandValues[1]) {
              singleResult.key =commandValues[1];
            }
          }

          this.worklogRepository.update(singleResult);
        });
  }

  private startDay(time: Date) {
    const day = new DayEntity();
    day.start = time;
    return this.dayRepository.create(day);
  }
}
