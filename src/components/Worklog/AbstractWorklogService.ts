import {inject, injectable} from 'inversify';
import {IDENTIFIERS} from '../../identifiers';
import {DayRepository, WorklogRepository} from '../../orm/repositories';
import {DayEntity} from '../../orm/entities/Day.entity';

@injectable()
export abstract class AbstractWorklogService {
  protected worklogRepository: WorklogRepository;
  protected dayRepository: DayRepository;

  constructor(
    @inject(IDENTIFIERS.ORM.repositories.worklog) worklogRepository: WorklogRepository,
    @inject(IDENTIFIERS.ORM.repositories.day) dayRepository: DayRepository
  ) {
    this.worklogRepository = worklogRepository;
    this.dayRepository = dayRepository;
  }

  protected getCurrentDay() {
    return this.dayRepository.getByDate();
  }
}
