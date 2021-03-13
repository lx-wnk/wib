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

  injectCommands(): void {
    const migrateCommand = container.get<AbstractCommand>(IDENTIFIERS.Command.MigrateDataCommand);
    const worklogCommand = container.get<AbstractCommand>(IDENTIFIERS.Command.WorklogCommand);

    this.program.addCommand(migrateCommand.init());
    this.program.addCommand(worklogCommand.init());
  }

  exec(argv): void {
    this.program.parse(argv);
  }
};
