import {inject, injectable} from 'inversify';
import {WorklogEntity} from '../orm/entities/Worklog.entity';
import {DayRepository, WorklogRepository} from '../orm/repositories';
import {ORMIdentifiers} from '../identifiers';

@injectable()
export class WorklogService {
  constructor(
        @inject(ORMIdentifiers.Repositories.WorklogRepository) protected worklogRepository: WorklogRepository,
        @inject(ORMIdentifiers.Repositories.DayRepository) protected dayRepository: DayRepository
  ) {
  }

  public async create(commandValues: string[], unexpected: string, time: Date = new Date()): Promise<WorklogEntity> {
    const currentDay = await this.dayRepository.getByDate(time);
    const worklog = new WorklogEntity();

    worklog.time = time;
    worklog.key = commandValues[0];
    worklog.day = currentDay;
    worklog.unexpected = unexpected;

    commandValues.splice(0, 1);
    worklog.value = commandValues.join(' ');
    worklog.iterator = (await this.worklogRepository.getUndeletedListForDate(currentDay.start)).length + 1;

    return this.worklogRepository.create(worklog);
  }

  public async createRest(time: Date = new Date()): Promise<WorklogEntity> {
    const currentDay = await this.dayRepository.getByDate(time);
    const worklog = new WorklogEntity();

    worklog.time = time;
    worklog.key = 'rest';
    worklog.day = currentDay;
    worklog.rest = true;
    worklog.value = '';
    worklog.iterator = (await this.worklogRepository.getUndeletedListForDate(currentDay.start)).length + 1;

    return this.worklogRepository.create(worklog);
  }

  public update(iterator: number, commandValues: string[], unexpected: string, time?: Date): void {
    this.worklogRepository.getByDateIterator(new Date(), iterator)
        .then((result) => {
          if (result.length !== 1) {
            console.error('Error: Expected exactly one worklog entry, found ' + result.length);
            console.error('Please provide a valid iterator number');
            return;
          }

          const worklog = result[0];

          // Update fields if provided
          if (time) {
            worklog.time = time;
          }

          if (unexpected?.length > 0) {
            worklog.unexpected = unexpected;
          }

          if (commandValues?.length > 0) {
          // First value is always the key
            worklog.key = commandValues[0];

            // If there are more values, use them as the worklog value
            if (commandValues.length > 1) {
              const values = [...commandValues];
              values.splice(0, 1);
              worklog.value = values.join(' ');
            }
          }

          this.worklogRepository.update(worklog);
        })
        .catch((error) => {
          console.error('Error updating worklog:', error);
        });
  }

  public delete(iterator: number): void {
    this.worklogRepository.getByDateIterator(new Date(), iterator)
        .then((result) => {
          if (result.length !== 1) {
            console.warn('Could not delete worklog. Please make sure the worklog is not already deleted.');
            console.warn('If you made sure, everything is fine please feel free to file a bug report.');
            console.error('Error: Failed to delete worklog with iterator ' + iterator + '. Found ' + result.length + ' records.');
            return;
          }

          const worklog = result[0];
          worklog.deleted = true;

          return this.worklogRepository.update(worklog);
        })
        .catch((error) => {
          console.error('Error deleting worklog:', error);
        });
  }
}
