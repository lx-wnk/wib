import 'reflect-metadata';
import {Container} from 'inversify';
import {IDENTIFIERS} from '../identifiers';

import {AbstractCommand, MigrateDataCommand, WorklogCommand} from '../command';
import {ConnectionManager} from '../orm';
import {MessageService, ConfigService, WorklogService} from '../components';
import {AbstractRepository, DayRepository, WorklogRepository} from '../orm/repositories';

const container = new Container();

container.bind<MessageService>(IDENTIFIERS.Message).to(MessageService);
container.bind<ConfigService>(IDENTIFIERS.Config).to(ConfigService);
container.bind<WorklogService>(IDENTIFIERS.worklog).to(WorklogService);

container.bind<AbstractCommand>(IDENTIFIERS.Command.MigrateDataCommand).to(MigrateDataCommand);
container.bind<AbstractCommand>(IDENTIFIERS.Command.WorklogCommand).to(WorklogCommand);

container.bind<ConnectionManager>(IDENTIFIERS.ORM.Connection).to(ConnectionManager);
container.bind<AbstractRepository>(IDENTIFIERS.ORM.repositories.day).to(DayRepository);
container.bind<AbstractRepository>(IDENTIFIERS.ORM.repositories.worklog).to(WorklogRepository);

export default container;
