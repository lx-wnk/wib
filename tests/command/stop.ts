import 'mocha';
import * as chai from 'chai';
import StopCommand from '../../src/command/StopCommand';

describe('Stop command', () => {
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
  it('Set stop time', () => {
    const commandResult = (new StopCommand()).execute(null, []);

    chai.expect('Clocked out '+ '06:20').to.equal(commandResult);
  });
  it('Set specific stop time', () => {
    const commandResult = (new StopCommand()).execute(null, ['6:20']);

    chai.expect('Clocked out '+ '06:20').to.equal(commandResult);
  });
});
