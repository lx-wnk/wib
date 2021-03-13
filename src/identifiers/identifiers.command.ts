import {MigrateDataCommand} from '../command';
import {WorklogCommand} from '../command';

const IDENTIFIERS_COMMAND = {
  MigrateDataCommand: Symbol.for('MigrateDataCommand'),
  WorklogCommand: Symbol.for('WorklogCommand')
};

export {IDENTIFIERS_COMMAND};
