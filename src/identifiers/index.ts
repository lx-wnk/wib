import {IDENTIFIERS_COMMAND} from './identifiers.command';
import {IDENTIFIERS_ORM} from './identifiers.orm';
import {MessageService, ConfigService} from '../components';

const IDENTIFIERS = {
  Message: Symbol.for('MessageService'),
  Config: Symbol.for('ConfigService'),
  worklog: Symbol.for('WorklogService'),
  List: Symbol.for('ListService'),
  Formatter: Symbol.for('Formatter'),
  Command: IDENTIFIERS_COMMAND,
  ORM: IDENTIFIERS_ORM
};

export {IDENTIFIERS};
