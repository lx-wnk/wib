import 'reflect-metadata';
import container from './config/inversify.config';
import {CommandIdentifiers, ORMIdentifiers} from './identifiers';
import {Command} from 'commander';
import AbstractCommand from './command/AbstractCommand';

class Wib {
  public readonly program: Command;
  public readonly version: string;
  public options: string[] = [];

  constructor() {
    this.program = new Command();
    this.version = require('../package.json').version;
    this.program.version(`v${this.version}`, '-v, --vers', 'Outputs the current version');

    container.get(ORMIdentifiers.ConnectionManager);

    this.injectCommands();
  }

  public injectCommands(): void {
    Object.keys(CommandIdentifiers).forEach((key) => {
      const identifier = CommandIdentifiers[key as keyof typeof CommandIdentifiers];
      const command = container.get<AbstractCommand>(identifier);

      this.program.addCommand(command.init());
    });
  }

  public exec(argv: string[]): Command {
    return this.program.parse(argv);
  }
}

// Export a singleton instance
export default new Wib();
