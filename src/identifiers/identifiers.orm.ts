import {ConnectionManager} from '../orm';
import {DayRepository, WorklogRepository, NoteRepository} from '../orm/repositories';

const IDENTIFIERS_ORM = {
  Connection: Symbol.for('ConnectionManager'),
  repositories: {
    day: Symbol.for('DayRepository'),
    worklog: Symbol.for('WorklogRepository'),
    note: Symbol.for('NoteRepository')
  }
};

export {IDENTIFIERS_ORM};
