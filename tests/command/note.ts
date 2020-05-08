import 'mocha';
import * as chai from 'chai';
import NoteCommand from '../../src/command/NoteCommand';

describe('Note command', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const testData = require('../data.json'),
    constantDate = new Date(testData.testDate),
    argumentMock = {
      delete: undefined,
      edit: undefined
    };
  beforeEach(function() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    // eslint-disable-next-line no-global-assign
    Date = class extends Date {
      constructor() {
        super();
        return constantDate;
      }
    };
  });
  it('Create note', () => {
    const commandResult = (new NoteCommand()).execute(argumentMock, testData.note.createData);

    chai.expect('Created new note with value: '+ testData.note.createData.join(' ')).to.equal(commandResult);
  });

  it('Edit note', () => {
    argumentMock.edit = 1;

    const commandResult = (new NoteCommand()).execute(argumentMock, testData.note.editData);

    chai.expect('Edited note with id: '+ '1').to.equal(commandResult);
  });

  it('Delete note', () => {
    argumentMock.delete = 1;
    const commandResult = (new NoteCommand()).execute(argumentMock, []);

    chai.expect('Deleted note with id: '+ '1').to.equal(commandResult);
  });
});
