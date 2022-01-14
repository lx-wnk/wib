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
    const worklogIterator = 0;

    this.getCurrentDay()
        .then((result) => {
          if (!result) {
            this.startDay(time).then((day) => {
              currentDay = day;
            });
          } else {
            currentDay = result;
          }
        })
        .finally(() => {
          const worklog = new WorklogEntity();
          worklog.time = time;
          worklog.key = commandValues[0];

          commandValues.splice(0, 1);

          worklog.value = commandValues.join(' ');
          worklog.day = currentDay;
          worklog.iterator = worklogIterator;

          this.worklogRepository.getUndeletedListForDate(currentDay.start).then((result) => {
            worklog.iterator = result.length + 1;
          }).finally(() => {
            this.worklogRepository.create(worklog);
          });
        });
  }

  public update(iterator: number, commandValues: string[], time: Date) {
    this.worklogRepository.getByDateIterator(new Date(), iterator)
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
              commandValues.splice(0, 1);
              singleResult.value =commandValues.join(' ');
            }
          }

          this.worklogRepository.update(singleResult);
        });
  }

  public delete(iterator: number, time: Date = new Date()) {
    this.worklogRepository.getByDateIterator(new Date(), iterator)
        .then((result) => {
          if (result.length !== 1) {
            console.log('something went wrong');
            return;
          // TODO
          }

          const singleResult = result.shift();
          singleResult.deleted = true;

          this.worklogRepository.update(singleResult);
        });
  }

  private startDay(time: Date) {
    const day = new DayEntity();
    day.start = time;

    return this.dayRepository.create(day);
  }
}
