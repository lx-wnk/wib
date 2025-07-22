import 'reflect-metadata';
import container from './config/inversify.config';
import { CommandIdentifiers } from './identifiers';
import { Command } from 'commander';
import AbstractCommand from './command/AbstractCommand';
import pkg from '../package.json';

class Wib {
    public readonly program: Command;
    public readonly version: string;
    public options: string[] = [];

    constructor() {
        this.program = new Command();
        this.version = pkg.version;
        this.program.version(`v${this.version}`, '-v, --vers', 'Outputs the current version');

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
