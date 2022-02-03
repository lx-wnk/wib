import {injectable} from 'inversify';
import {WorklogEntity} from '../../orm/entities/Worklog.entity';
import {AbstractWorklogService} from './AbstractWorklogService';
import {DayEntity} from '../../orm/entities/Day.entity';

@injectable()
export class WorklogService extends AbstractWorklogService {
  public async create(commandValues: Array<string>, time: Date = new Date()) {
    const currentDay = await this.getCurrentDay();
    const worklog = new WorklogEntity();

    worklog.time = time;
    worklog.key = commandValues[0];
    worklog.day = currentDay;

    commandValues.splice(0, 1);
    worklog.value = commandValues.join(' ');
    worklog.iterator= (await this.worklogRepository.getUndeletedListForDate(currentDay.start)).length + 1;

    return this.worklogRepository.create(worklog);
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
