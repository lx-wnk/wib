import * as Command from 'commander';
import {injectable} from 'inversify';
import {MessageService} from '../components';

@injectable()
export default abstract class AbstractCommand {
  abstract name: string;
  abstract description: string;
  abstract aliases: Array<string>;
  abstract options: Array<{flag: string; description: string|null; defaultValue?: string|boolean}>;

  protected messages: MessageService;

  constructor(messages: MessageService) {
    this.messages = messages;
  }

  init(): Command.Command {
    const newCommand = new Command.Command(this.name);

    this.options.forEach((option) => {
      let translatedFlag = option.flag,
        translatedDescription = option.description;

      if (translatedFlag) {
        translatedFlag = this.messages.translation(option.flag);
      }

      if (translatedFlag) {
        translatedDescription = this.messages.translation(option.description);
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

  abstract exec(args, options: Array<any>): void;
}
