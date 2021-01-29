import * as Command from 'commander';

export default interface CommandInterface {
    name: string;
    description: string;
    aliases: Array<string>;
    options: Array<{flag: string; description: string|null; defaultValue?: string|boolean}>;

    init(): Command.Command;

    exec(options: object): void;
}
