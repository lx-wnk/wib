import 'mocha';
import * as chai from 'chai';
import NoteCommand from '../../src/command/NoteCommand';

describe('Note command', () => {
  const constantDate = new Date('2020-04-04T02:20:24.000Z');
  const argumentMock = {
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
    const commandResult = (new NoteCommand()).execute(argumentMock, ['test1', 'test2', 'test3']);

    chai.expect('Created new note with value: '+ 'test1 test2 test3').to.equal(commandResult);
  });

  it('Edit note', () => {
    argumentMock.edit = 1;

    const commandResult = (new NoteCommand()).execute(argumentMock, []);

    chai.expect('Edited note with id: '+ '1').to.equal(commandResult);
  });

  it('Delete note', () => {
    argumentMock.delete = 1;
    const commandResult = (new NoteCommand()).execute(argumentMock, []);

    chai.expect('Deleted note with id: '+ '1').to.equal(commandResult);
  });
});
