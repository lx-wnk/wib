import 'reflect-metadata';
import {Container} from 'inversify';
import {IDENTIFIERS} from '../identifiers';

import {AbstractCommand, ListCommand, MigrateDataCommand, NoteCommand, StartCommand, WorklogCommand, StopCommand} from '../command';
import {ConnectionManager} from '../orm';
import {MessageService, ConfigService, WorklogService, Formatter, ListService} from '../components';
import {AbstractRepository, DayRepository, NoteRepository, WorklogRepository} from '../orm/repositories';

const container = new Container();

container.bind<MessageService>(IDENTIFIERS.Message).to(MessageService);
container.bind<ConfigService>(IDENTIFIERS.Config).to(ConfigService);
container.bind<WorklogService>(IDENTIFIERS.worklog).to(WorklogService);
container.bind<ListService>(IDENTIFIERS.List).to(ListService);
container.bind<Formatter>(IDENTIFIERS.Formatter).to(Formatter);


container.bind<AbstractCommand>(IDENTIFIERS.Command.MigrateDataCommand).to(MigrateDataCommand);
container.bind<AbstractCommand>(IDENTIFIERS.Command.WorklogCommand).to(WorklogCommand);
container.bind<AbstractCommand>(IDENTIFIERS.Command.ListCommand).to(ListCommand);
container.bind<AbstractCommand>(IDENTIFIERS.Command.NoteCommand).to(NoteCommand);
container.bind<AbstractCommand>(IDENTIFIERS.Command.StartCommand).to(StartCommand);
container.bind<AbstractCommand>(IDENTIFIERS.Command.StopCommand).to(StopCommand);

container.bind<ConnectionManager>(IDENTIFIERS.ORM.Connection).to(ConnectionManager);
container.bind<AbstractRepository>(IDENTIFIERS.ORM.repositories.day).to(DayRepository);
container.bind<AbstractRepository>(IDENTIFIERS.ORM.repositories.worklog).to(WorklogRepository);
container.bind<AbstractRepository>(IDENTIFIERS.ORM.repositories.note).to(NoteRepository);

export default container;
