import 'reflect-metadata';
import container from './config/inversify.config';
import {IDENTIFIERS} from './identifiers';
import * as Command from 'commander';
import AbstractCommand from './command/AbstractCommand';

export default new class Wib {
  public program: Command.Command
  private version: string
  commands: object;
  options = [];

  constructor() {
    this.program = new Command.Command();
    this.version = require('../package.json').version;
    this.program.version(`v${this.version}`, '-v, --vers', 'Outputs the current version');

    this.injectCommands();
  }

  private injectCommands(): void {
    const migrateCommand = container.get<AbstractCommand>(IDENTIFIERS.Command.MigrateCommand);
    const worklogCommand = container.get<AbstractCommand>(IDENTIFIERS.Command.WorklogCommand);
    const listCommand = container.get<AbstractCommand>(IDENTIFIERS.Command.ListCommand);
    const noteCommand = container.get<AbstractCommand>(IDENTIFIERS.Command.NoteCommand);
    const startCommand = container.get<AbstractCommand>(IDENTIFIERS.Command.StartCommand);
    const stopCommand = container.get<AbstractCommand>(IDENTIFIERS.Command.StopCommand);

    this.program.addCommand(migrateCommand.init());
    this.program.addCommand(worklogCommand.init());
    this.program.addCommand(listCommand.init());
    this.program.addCommand(noteCommand.init());
    this.program.addCommand(startCommand.init());
    this.program.addCommand(stopCommand.init());
  }

  exec(argv): Command.Command {
    return this.program.parse(argv);
  }
};
