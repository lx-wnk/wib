import AbstractCommand from './AbstractCommand';
import DataHelper from '../lib/helper/DataHelper';
import NoteStruct from '../struct/note';
import NoteCollection from '../struct/collection/NoteCollection';
import * as responsePrefix from './response.json';

export default class NoteCommand extends AbstractCommand {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    responsePrefix = require('./response.json').worklog;
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
        return (new NoteCommand()).deleteNote(args.delete);
      }

      if (args.edit !== undefined) {
        return (new NoteCommand()).editNote(args.edit, options.join(' '));
      }

      return (new NoteCommand()).createNote(options.join(' '));
    }

    createNote(value: string): string {
      const notes = new NoteCollection(),
        note = new NoteStruct(notes.getAmount(), value);

      notes.addEntry(note);

      (new DataHelper).writeData(notes.getWriteData(), notes.dataKey);

      return responsePrefix.note.create + value;
    }

    editNote(id, value): string {
      const notes = new NoteCollection();

      if (notes.entries[id] !== undefined) {
        notes.entries[id].value = value;
      }

      (new DataHelper).writeData(notes.getWriteData(), notes.dataKey);

      return responsePrefix.note.edit + id;
    }

    deleteNote(id): string {
      const notes = new NoteCollection();

      notes.entries[id] = undefined;

      (new DataHelper).writeData(notes.getWriteData(), notes.dataKey);

      return responsePrefix.note.delete + id;
    }
}
