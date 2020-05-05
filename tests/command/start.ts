import 'mocha';
import * as chai from 'chai';
import StartCommand from '../../src/command/StartCommand';

describe('Start command', () => {
  const constantDate = new Date('2020-04-04T02:20:24.000Z');
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
  it('Should return specified time', () => {
    const commandResult = (new StartCommand()).execute(null, ['8:0']);

    chai.expect('Clocked in '+ '08:00').to.equal(commandResult);
  });

  it('should return the specified time without setting it', () => {
    const commandResult = (new StartCommand()).execute(null, []);

    chai.expect('Clocked in '+ '08:00').to.equal(commandResult);
  });
});
