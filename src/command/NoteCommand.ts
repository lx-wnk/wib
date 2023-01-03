import {inject, injectable} from 'inversify';
import AbstractCommand from './AbstractCommand';
import {MessageService} from '../components';
import {IDENTIFIERS} from '../identifiers';
import {NoteRepository} from '../orm/repositories';

@injectable()
export class NoteCommand extends AbstractCommand {
  public name = 'note';
  public aliases = ['n'];
  public options = [
    {
      flag: 'command.note.option.delete.flag',
      description: 'command.worklog.option.delete.description'
    },
    {
      flag: 'command.note.option.edit.flag',
      description: 'command.worklog.option.edit.description'
    }
  ];
  public description = 'Handle notes';

  private noteRepository: NoteRepository;

  constructor(
    @inject(IDENTIFIERS.Message) messages: MessageService,
    @inject(IDENTIFIERS.ORM.repositories.note) noteRepository: NoteRepository
  ) {
    super(messages);
    this.noteRepository = noteRepository;
  }

  exec(options, args): void {
    const commandValues: string[] = args.args;

    if (options.delete) {
      this.noteRepository.delete(options.delete)
          .then(() => {
            console.log(this.message.translation('command.note.execution.delete', {'id': options.delete}));
          }).catch(() => {
            console.log(this.message.translation('command.note.execution.couldNotDelete', {'id': options.delete}));
          });

      return;
    }

    if (options.edit) {
      this.noteRepository.update(options.edit, commandValues.join(' '))
          .then(() => {
            console.log(this.message.translation('command.note.execution.edit', {'id': options.edit}));
          }).catch(() => {
            console.log(this.message.translation('command.note.execution.couldNotEdit', {'id': options.edit}));
          });

      return;
    }

    this.noteRepository.create(commandValues.join(' '))
        .then((result) => {
          console.log(this.message.translation('command.note.execution.create', result));
        }).catch((err) => {
          console.error('catch');
          console.error(err);
        });
  }
}
