// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {MigrateDataCommand, ListCommand, WorklogCommand, NoteCommand, StartCommand, StopCommand} from '../command';

const IDENTIFIERS_COMMAND = {
  MigrateDataCommand: Symbol.for('MigrateDataCommand'),
  WorklogCommand: Symbol.for('WorklogCommand'),
  ListCommand: Symbol.for('ListCommand'),
  NoteCommand: Symbol.for('NoteCommand'),
  StartCommand: Symbol.for('StartCommand'),
  StopCommand: Symbol.for('StopCommand'),
};

export {IDENTIFIERS_COMMAND};
