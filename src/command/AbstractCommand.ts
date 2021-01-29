import * as Command from 'commander';
import {injectable} from 'inversify';

@injectable()
export default abstract class AbstractCommand {
  abstract name: string;
  abstract description: string;
  abstract aliases: Array<string>;
  abstract options: Array<{flag: string; description: string|null; defaultValue?: string|boolean}>;

  init(): Command.Command {
    const newCommand = new Command.Command(this.name);

    this.options.forEach((option) => {
      newCommand.option(option.flag, option.description, option.defaultValue);
    });

    this.aliases.forEach((aliasName) => {
      newCommand.alias(aliasName);
    });
    newCommand.description(this.description)
        .action((args, opts) => {
          this.exec(args, opts);
        });

    return newCommand;
  }

  abstract exec(args, options: Array<any>): void;
}
