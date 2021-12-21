import {inject, injectable} from 'inversify';
import AbstractCommand from './AbstractCommand';
import {ConnectionManager} from '../orm';
import {MessageService, WorklogService} from '../components';
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
    let trackTime;

    if (options.delete) {
      this.noteRepository.delete(options.delete)
          .then((result)=> {
            console.log(result);
          }).catch((err) => {
            console.log(err);
          });

      return;
    }

    if (options.edit) {
      console.log(options.edit);

      this.noteRepository.update(options.edit, commandValues.join(' '))
          .then((result)=> {
            console.log(result);
          }).catch((err) => {
            console.log(err);
          });

      return;
    }

    this.noteRepository.create(commandValues.join(' '))
        .then((result)=> {
          console.log(result);
        }).catch((err) => {
          console.log(err);
        });
  }
}
