import 'reflect-metadata';
import {Container} from 'inversify';
import {IDENTIFIERS} from '../identifiers';

import {
  CommandInterface,
  MigrateDataCommand,
  WorklogCommand
} from '../command';

import {ConnectionManager} from '../orm';
import {MessageService, ConfigService} from '../components';

const container = new Container();

container.bind<CommandInterface>(IDENTIFIERS.Command.MigrateDataCommand).to(MigrateDataCommand);
container.bind<CommandInterface>(IDENTIFIERS.Command.WorklogCommand).to(WorklogCommand);
container.bind<ConnectionManager>(IDENTIFIERS.ORM.Connection).to(ConnectionManager);
container.bind<MessageService>(IDENTIFIERS.Message).to(MessageService);
container.bind<ConfigService>(IDENTIFIERS.Config).to(ConfigService);

export default container;
