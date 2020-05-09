import 'mocha';
import * as chai from 'chai';
import StartCommand from '../../src/command/StartCommand';
import DataHelper from '../../src/lib/helper/DataHelper';
import RestCommand from '../../src/command/RestCommand';
import * as responsePrefix from '../../src/command/response.json';

describe('Rest command', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const testData = require('../data.json'),
    constantDate = new Date(testData.testDate);
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
    (new StartCommand()).execute(null, []);
  });
  it('Create Rest', () => {
    chai.expect(responsePrefix.rest.create+ '6:20').to.equal((new RestCommand()).execute());
  });
});
