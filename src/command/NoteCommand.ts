import AbstractCommand from './AbstractCommand';
import DataHelper from '../lib/helper/DataHelper';
import NoteStruct from '../struct/note';
import NoteCollection from '../struct/collection/NoteCollection';

export default class NoteCommand extends AbstractCommand {
    name = 'note';
    aliases = ['n'];
    options = [
      {
        flag: '-d, --delete <key>',
        description: 'Delete a specified note'
      },
      {
        flag: '-e, --edit <key>',
        description: 'Edit an specified note'
      }];
    description = 'Handle notes';

    public execute(args, options): string {
      if (args.delete !== undefined) {
        return (new NoteCommand()).deleteTracker(args.delete);
      }

      if (args.edit !== undefined) {
        return (new NoteCommand()).editTracker(args.edit, options.join(' '));
      }

      return (new NoteCommand()).createNote(options.join(' '));
    }

    createNote(value: string): string {
      const notes = new NoteCollection(),
        note = new NoteStruct(notes.getAmount(), value);

      notes.addEntry(note);

      (new DataHelper).writeData(notes.getWriteData(), notes.dataKey);

      return 'Created new note with value: ' + value;
    }

    deleteTracker(id): string {
      const notes = new NoteCollection();

      notes.entries[id] = undefined;

      (new DataHelper).writeData(notes.getWriteData(), notes.dataKey);

      return 'Deleted note with id: ' + id;
    }

    editTracker(id, value): string {
      const notes = new NoteCollection();

      if (notes.entries[id] !== undefined) {
        notes.entries[id].value = value;
      }

      (new DataHelper).writeData(notes.getWriteData(), notes.dataKey);

      return 'Edited note with id: ' + id;
    }
}
