import AbstractCommand from './AbstractCommand';
import NoteStruct from '../struct/DataStructs/note';
import NoteCollection from '../struct/DataStructs/collection/NoteCollection';
import Messages from '../messages';

export default class NoteCommand extends AbstractCommand {
    name = 'note';
    aliases = ['n'];
    description = Messages.translation('command.note.description');
    options = [
      {
        flag: Messages.translation('command.note.option.edit.flag'),
        description: Messages.translation('command.note.option.edit.description')
      },
      {
        flag: Messages.translation('command.note.option.delete.flag'),
        description: Messages.translation('command.note.option.delete.description')
      }];

    private notes: NoteCollection;

    constructor() {
      super();
      this.notes = new NoteCollection();
    }

    public execute(args, options): string {
      if (args.delete !== undefined) {
        return (new NoteCommand()).deleteNote(args.delete);
      }

      if (undefined === options) {
        return Messages.translation('command.note.execution.missingOptions');
      }

      if (args.edit !== undefined) {
        return (new NoteCommand()).editNote(args.edit, options.join(' '));
      }

      return (new NoteCommand()).createNote(options.join(' '));
    }

    createNote(value: string): string {
      const note = new NoteStruct(this.notes.getAmount(), value);

      this.notes.addEntry(note);

      this.dataHelper.writeData(this.notes.getWriteData(), this.notes.dataKey);

      return Messages.translation('command.note.execution.create') + value;
    }

    editNote(id, value): string {
      if (undefined === id || undefined === this.notes.entries[id]) {
        return Messages.translation('command.note.execution.couldNotEdit') + id;
      }

      this.notes.entries[id].value = value;

      this.dataHelper.writeData(this.notes.getWriteData(), this.notes.dataKey);

      return Messages.translation('command.note.execution.edit') + id;
    }

    deleteNote(id): string {
      if (undefined === id || undefined === this.notes.entries[id]) {
        return Messages.translation('command.note.execution.couldNotDelete') + id;
      }

      this.notes.entries[id].deleted = true;

      this.dataHelper.writeData(this.notes.getWriteData(), this.notes.dataKey);

      return Messages.translation('command.note.execution.delete') + id;
    }
}
