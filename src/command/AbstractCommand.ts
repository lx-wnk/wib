import * as Command from 'commander';
import {injectable} from 'inversify';
import {MessageService} from '../components';

@injectable()
export default abstract class AbstractCommand {
  abstract name: string;
  abstract description: string;
  abstract aliases: Array<string>;
  abstract options: Array<{flag: string; description: string|null; defaultValue?: string|boolean}>;

  protected message: MessageService;

  constructor(message: MessageService) {
    this.message = message;
  }

  init(): Command.Command {
    const newCommand = new Command.Command(this.name);

    this.options.forEach((option) => {
      let translatedFlag = option.flag,
        translatedDescription = option.description;

      if (translatedFlag) {
        translatedFlag = this.message.translation(option.flag);
      }

      if (translatedFlag) {
        translatedDescription = this.message.translation(option.description);
      }

      newCommand.option(translatedFlag, translatedDescription, option.defaultValue
      );
    });

    this.aliases.forEach((aliasName) => {
      newCommand.alias(aliasName);
    });

    newCommand.description(this.description).action((args, opts) => {
      this.exec(args, opts);
    });

    return newCommand;
  }

  abstract exec(options: object, args: Array<any>): void;
}
