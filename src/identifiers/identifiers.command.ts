// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {MigrateCommand, ListCommand, WorklogCommand, NoteCommand, StartCommand, StopCommand} from '../command';

const IDENTIFIERS_COMMAND = {
  MigrateCommand: Symbol.for('MigrateCommand'),
  WorklogCommand: Symbol.for('WorklogCommand'),
  ListCommand: Symbol.for('ListCommand'),
  NoteCommand: Symbol.for('NoteCommand'),
  StartCommand: Symbol.for('StartCommand'),
  StopCommand: Symbol.for('StopCommand'),
};

export {IDENTIFIERS_COMMAND};
