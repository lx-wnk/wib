import {Command} from 'commander';
import {injectable, inject, optional} from 'inversify';
import {MessageService} from '../components';
import {ServiceIdentifiers} from '../identifiers';

@injectable()
export default abstract class AbstractCommand {
  abstract name: string;
  abstract description: string;
  abstract aliases: Array<string>;
  abstract options: Array<{flag: string; description: string|null; defaultValue?: string|boolean}>;

  protected message: MessageService;

  constructor(@inject(ServiceIdentifiers.MessageService) @optional() message?: MessageService) {
    this.message = message || new MessageService();
  }

  init(): Command {
    const newCommand = new Command(this.name);

    this.options.forEach((option) => {
      let translatedFlag = option.flag,
        translatedDescription = option.description || '';

      if (translatedFlag) {
        translatedFlag = this.message.translation(option.flag);
      }

      if (translatedDescription) {
        translatedDescription = this.message.translation(translatedDescription);
      }

      newCommand.option(translatedFlag, translatedDescription, option.defaultValue);
    });

    this.aliases.forEach((aliasName) => {
      newCommand.alias(aliasName);
    });

    // Use translated description
    newCommand.description(this.message.translation(this.description))
        .action((options: any, command: Command) => {
          this.exec(options, command.args);
        });

    return newCommand;
  }

  abstract exec(options: object, args: Array<any>): void;
}
