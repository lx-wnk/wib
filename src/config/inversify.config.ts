import 'reflect-metadata';
import {Container} from 'inversify';
import {IDENTIFIERS} from '../identifiers';

import {AbstractCommand, ListCommand, MigrateCommand, NoteCommand, StartCommand, WorklogCommand, StopCommand, RestCommand} from '../command';
import {ConnectionManager} from '../orm';
import {MessageService, ConfigService, WorklogService, Formatter, ListService} from '../components';
import {AbstractRepository, DayRepository, NoteRepository, WorklogRepository} from '../orm/repositories';

const container = new Container();

// global
container.bind<MessageService>(IDENTIFIERS.Message).to(MessageService);
container.bind<ConfigService>(IDENTIFIERS.Config).to(ConfigService);
container.bind<WorklogService>(IDENTIFIERS.worklog).to(WorklogService);
container.bind<ListService>(IDENTIFIERS.List).to(ListService);
container.bind<Formatter>(IDENTIFIERS.Formatter).to(Formatter);

// commands
container.bind<AbstractCommand>(IDENTIFIERS.Command.MigrateCommand).to(MigrateCommand);
container.bind<AbstractCommand>(IDENTIFIERS.Command.WorklogCommand).to(WorklogCommand);
container.bind<AbstractCommand>(IDENTIFIERS.Command.ListCommand).to(ListCommand);
container.bind<AbstractCommand>(IDENTIFIERS.Command.NoteCommand).to(NoteCommand);
container.bind<AbstractCommand>(IDENTIFIERS.Command.StartCommand).to(StartCommand);
container.bind<AbstractCommand>(IDENTIFIERS.Command.StopCommand).to(StopCommand);
container.bind<AbstractCommand>(IDENTIFIERS.Command.RestCommand).to(RestCommand);

// orm
container.bind<ConnectionManager>(IDENTIFIERS.ORM.Connection).to(ConnectionManager);
container.bind<AbstractRepository>(IDENTIFIERS.ORM.repositories.day).to(DayRepository);
container.bind<AbstractRepository>(IDENTIFIERS.ORM.repositories.worklog).to(WorklogRepository);
container.bind<AbstractRepository>(IDENTIFIERS.ORM.repositories.note).to(NoteRepository);

export default container;
