import 'reflect-metadata';
import {Container} from 'inversify';
import {IDENTIFIERS_COMMAND} from '../constants/identifiers.command';
import {IDENTIFIERS_MIGRATION} from '../constants/identifiers.migration';
import {IDENTIFIERS_ORM} from '../constants/identifiers.orm';

import {
  CommandInterface,
  MigrateCommand
} from '../command';

import {
  Migration1611850217
} from '../migrations';

import {
  ConnectionManager
} from '../orm';

const container = new Container();

container.bind<CommandInterface>(IDENTIFIERS_COMMAND.MigrateCommand).to(MigrateCommand);
container.bind<Migration1611850217>(IDENTIFIERS_MIGRATION.Migration1611850217).to(Migration1611850217);
container.bind<ConnectionManager>(IDENTIFIERS_ORM.Connection).to(ConnectionManager);

export default container;
