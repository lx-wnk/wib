import 'mocha';
import * as chai from 'chai';
import StartCommand from '../../src/command/StartCommand';
import DataHelper from '../../src/lib/helper/DataHelper';

describe('Start command', () => {
  const constantDate = new Date(require('../data.json').testDate);
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

    (new DataHelper()).writeData({});
  });
  it('Set start time', () => {
    chai.expect('Clocked in '+ '06:20').to.equal((new StartCommand()).execute(null, []));
  });
  it('Set specific start time', () => {
    chai.expect('Clocked in '+ '06:20').to.equal((new StartCommand()).execute(null, ['6:20']));
  });
});
