import {ConnectionManager} from '../orm';
import {DayRepository, WorklogRepository} from '../orm/repositories';

const IDENTIFIERS_ORM = {
  Connection: Symbol.for('ConnectionManager'),
  repositories: {
    day: Symbol.for('DayRepository'),
    worklog: Symbol.for('WorklogRepository')
  }
};

export {IDENTIFIERS_ORM};
