import 'mocha';
import * as chai from 'chai';
import StartCommand from '../../src/command/StartCommand';

describe('Start command', () => {
  const constantDate = new Date(require('../data.json').testDate);
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
  it('Set start time', () => {
    const commandResult = (new StartCommand()).execute(null, []);

    chai.expect('Clocked in '+ '06:20').to.equal(commandResult);
  });
  it('Set specific start time', () => {
    const commandResult = (new StartCommand()).execute(null, ['6:20']);

    chai.expect('Clocked in '+ '06:20').to.equal(commandResult);
  });
});
