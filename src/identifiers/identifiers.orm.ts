// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {ConnectionManager} from '../orm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
