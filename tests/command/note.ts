import 'mocha';
import * as chai from 'chai';
import NoteCommand from '../../src/command/NoteCommand';
import * as responsePrefix from '../../src/command/response.json';

describe('Note command', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const testData = require('../data.json'),
    constantDate = new Date(testData.testDate),
    argumentMock = {
      delete: undefined,
      edit: undefined
    };
  beforeEach(function() {
    process.env.TZ = 'Europe/Berlin';
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
    chai.expect(responsePrefix.note.create + testData.note.createData.join(' '))
        .to.equal((new NoteCommand()).execute(argumentMock, testData.note.createData));
  });

  it('Edit note', () => {
    argumentMock.edit = 1;

    chai.expect(responsePrefix.note.edit+ '1').to.equal(
        (new NoteCommand()).execute(argumentMock, testData.note.editData)
    );
  });

  it('Delete note', () => {
    argumentMock.delete = 1;
    chai.expect(responsePrefix.note.delete+ '1').to.equal((new NoteCommand()).execute(argumentMock, []));
  });
});
