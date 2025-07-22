import 'reflect-metadata';
import { Container, ContainerModule } from 'inversify';
import { ServiceIdentifiers, CommandIdentifiers, ORMIdentifiers } from '../identifiers';

import {
    ListCommand,
    MigrateCommand,
    NoteCommand,
    StartCommand,
    WorklogCommand,
    StopCommand,
    RestCommand
} from '../command';
import { ConnectionManager } from '../orm';
import {
    MessageService,
    ConfigService,
    WorklogService,
    Formatter,
    ListService,
    ListItemFormatter
} from '../components';
import { DayRepository, NoteRepository, WorklogRepository } from '../orm/repositories';

const container = new Container({
    defaultScope: 'Singleton' // Most services should be singletons by default
});

// Create a services module for better organization
const servicesModule = new ContainerModule((options) => {
    // Register services directly to avoid circular dependencies
    // First register the ConfigService since other services depend on it
    const configServiceInstance = new ConfigService();
    options.bind<ConfigService>(ServiceIdentifiers.ConfigService).toConstantValue(configServiceInstance);

    // Then register the MessageService
    options.bind<MessageService>(ServiceIdentifiers.MessageService).to(MessageService).inSingletonScope();

    // Register other services
    options.bind<WorklogService>(ServiceIdentifiers.WorklogService).to(WorklogService).inSingletonScope();
    options.bind<Formatter>(ServiceIdentifiers.Formatter).to(Formatter).inSingletonScope();
    options.bind<ListItemFormatter>(ServiceIdentifiers.ListItemFormatter).to(ListItemFormatter).inSingletonScope();
    options.bind<ListService>(ServiceIdentifiers.ListService).to(ListService).inSingletonScope();
});

// Create a commands module
const commandsModule = new ContainerModule((options) => {
    options.bind<MigrateCommand>(CommandIdentifiers.MigrateCommand).to(MigrateCommand);
    options.bind<WorklogCommand>(CommandIdentifiers.WorklogCommand).to(WorklogCommand);
    options.bind<ListCommand>(CommandIdentifiers.ListCommand).to(ListCommand);
    options.bind<NoteCommand>(CommandIdentifiers.NoteCommand).to(NoteCommand);
    options.bind<StartCommand>(CommandIdentifiers.StartCommand).to(StartCommand);
    options.bind<StopCommand>(CommandIdentifiers.StopCommand).to(StopCommand);
    options.bind<RestCommand>(CommandIdentifiers.RestCommand).to(RestCommand);
});

// Create an ORM module
const ormModule = new ContainerModule((options) => {
    options.bind<ConnectionManager>(ORMIdentifiers.ConnectionManager).to(ConnectionManager).inSingletonScope();
    options.bind<DayRepository>(ORMIdentifiers.Repositories.DayRepository).to(DayRepository).inSingletonScope();
    options
        .bind<WorklogRepository>(ORMIdentifiers.Repositories.WorklogRepository)
        .to(WorklogRepository)
        .inSingletonScope();
    options.bind<NoteRepository>(ORMIdentifiers.Repositories.NoteRepository).to(NoteRepository).inSingletonScope();
});

// Load all modules
container.load(servicesModule, commandsModule, ormModule);

export default container;
