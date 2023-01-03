import {injectable} from 'inversify';
import {WorklogEntity} from '../../orm/entities/Worklog.entity';
import {AbstractWorklogService} from './AbstractWorklogService';

@injectable()
export class WorklogService extends AbstractWorklogService {
  public async create(commandValues: Array<string>, unexpected: string, time: Date = new Date()): Promise<WorklogEntity> {
    const currentDay = await this.getCurrentDay();
    const worklog = new WorklogEntity();

    worklog.time = time;
    worklog.key = commandValues[0];
    worklog.day = currentDay;

    commandValues.splice(0, 1);
    worklog.value = commandValues.join(' ');
    worklog.unexpected = unexpected;
    worklog.iterator= (await this.worklogRepository.getUndeletedListForDate(currentDay.start)).length + 1;

    return this.worklogRepository.create(worklog);
  }

  public update(iterator: number, commandValues: string[], unexpected: string, time: Date): void {
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

          if (unexpected.length > 0) {
            singleResult.unexpected = unexpected;
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

  public delete(iterator: number): void {
    this.worklogRepository.getByDateIterator(new Date(), iterator)
        .then((result) => {
          if (result.length !== 1) {
            console.error('Could not delete worklog. Please make sure the worklog is not already deleted.');
            console.log('If you made sure, everythin is fine please feel free to fill a bug report.');
            // TODO: Error logging
            return;
          }

          const singleResult = result.shift();
          singleResult.deleted = true;

          this.worklogRepository.update(singleResult);
        });
  }
}
