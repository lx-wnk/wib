/**
 * Type-safe identifiers for Dependency Injection using Inversify 7.5
 */

// Service identifiers
export const ServiceIdentifiers = {
    MessageService: Symbol.for('MessageService'),
    ConfigService: Symbol.for('ConfigService'),
    WorklogService: Symbol.for('WorklogService'),
    ListService: Symbol.for('ListService'),
    Formatter: Symbol.for('Formatter'),
    ListItemFormatter: Symbol.for('ListItemFormatter')
};

// Command identifiers
export const CommandIdentifiers = {
    MigrateCommand: Symbol.for('MigrateCommand'),
    WorklogCommand: Symbol.for('WorklogCommand'),
    ListCommand: Symbol.for('ListCommand'),
    NoteCommand: Symbol.for('NoteCommand'),
    StartCommand: Symbol.for('StartCommand'),
    StopCommand: Symbol.for('StopCommand'),
    RestCommand: Symbol.for('RestCommand')
};

// ORM identifiers
export const ORMIdentifiers = {
    ConnectionManager: Symbol.for('ConnectionManager'),
    Repositories: {
        DayRepository: Symbol.for('DayRepository'),
        WorklogRepository: Symbol.for('WorklogRepository'),
        NoteRepository: Symbol.for('NoteRepository')
    }
};

// Group all identifiers together for organization
export const TYPES = {
    Services: ServiceIdentifiers,
    Commands: CommandIdentifiers,
    ORM: ORMIdentifiers
};
