import { inject, injectable } from 'inversify';
import AbstractCommand from './AbstractCommand';
import { MessageService } from '../components';
import { ServiceIdentifiers, ORMIdentifiers } from '../identifiers';
import { NoteRepository } from '../orm/repositories';

@injectable()
export class NoteCommand extends AbstractCommand {
    public name = 'note';
    public aliases = ['n'];
    public options = [
        {
            flag: 'command.note.option.delete.flag',
            description: 'command.note.option.delete.description'
        },
        {
            flag: 'command.note.option.edit.flag',
            description: 'command.note.option.edit.description'
        }
    ];
    public description = 'command.note.description';

    private noteRepository: NoteRepository;

    constructor(
        @inject(ServiceIdentifiers.MessageService) messages: MessageService,
        @inject(ORMIdentifiers.Repositories.NoteRepository) noteRepository: NoteRepository
    ) {
        super(messages);
        this.noteRepository = noteRepository;
    }

    exec(options: any, args?: any[]): void {
        if (!args || args.length === 0) {
            console.log(this.message.translation('command.note.execution.noContent'));
            return;
        }

        const noteContent = args.join(' ');

        if (options.delete) {
            this.handleDelete(parseInt(options.delete, 10));
            return;
        }

        if (options.edit) {
            this.handleEdit(parseInt(options.edit, 10), noteContent);
            return;
        }

        this.handleCreate(noteContent);
    }

    private handleDelete(noteId: number): void {
        this.noteRepository
            .delete(noteId)
            .then(() => {
                console.log(this.message.translation('command.note.execution.delete', { id: noteId }));
            })
            .catch(() => {
                console.log(this.message.translation('command.note.execution.couldNotDelete', { id: noteId }));
            });
    }

    private handleEdit(noteId: number, content: string): void {
        this.noteRepository
            .update(noteId, content)
            .then(() => {
                console.log(this.message.translation('command.note.execution.edit', { id: noteId }));
            })
            .catch(() => {
                console.log(this.message.translation('command.note.execution.couldNotEdit', { id: noteId }));
            });
    }

    private handleCreate(content: string): void {
        this.noteRepository
            .create(content)
            .then((result) => {
                console.log(this.message.translation('command.note.execution.create', result));
            })
            .catch((err) => {
                console.error('Error creating note:');
                console.error(err);
            });
    }
}
