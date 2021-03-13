import 'reflect-metadata';
import {Container} from 'inversify';
import {IDENTIFIERS_COMMAND} from '../constants/identifiers.command';
import {IDENTIFIERS_ORM} from '../constants/identifiers.orm';

import {
  CommandInterface,
  MigrateDataCommand
} from '../command';

import {
  ConnectionManager
} from '../orm';

const container = new Container();

container.bind<CommandInterface>(IDENTIFIERS_COMMAND.MigrateDataCommand).to(MigrateDataCommand);
container.bind<ConnectionManager>(IDENTIFIERS_ORM.Connection).to(ConnectionManager);

export default container;
