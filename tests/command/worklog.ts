import 'mocha';
import * as chai from 'chai';
import WorklogCommand from '../../src/command/WorklogCommand';
import StartCommand from '../../src/command/StartCommand';
import DataHelper from '../../src/lib/helper/DataHelper';
import * as responsePrefix from '../../src/command/response.json';

describe('Worklog command', () => {
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

    (new DataHelper()).writeData({});
    (new StartCommand()).execute(null, []);
  });
  it('Create worklog', () => {
    const commandOptions = [];
    commandOptions.push(testData.worklog.createData.key);
    testData.worklog.createData.value.forEach((message) => {
      commandOptions.push(message);
    });

    chai.expect(responsePrefix.worklog.create +
        testData.worklog.createData.key + ' ' +
        testData.note.createData.join(' ')).to.equal((new WorklogCommand()).execute(argumentMock, commandOptions));
  });

  it('Edit worklog', () => {
    argumentMock.edit = 1;
    const commandOptions = [];
    commandOptions.push(testData.worklog.editData.key);
    testData.worklog.createData.value.forEach((message) => {
      commandOptions.push(message);
    });

    chai.expect(responsePrefix.worklog.edit+ '1').to.equal(
        (new WorklogCommand()).execute(argumentMock, commandOptions)
    );
  });

  it('Delete worklog', () => {
    argumentMock.delete = 1;

    chai.expect(responsePrefix.worklog.delete+ '1').to.equal((new WorklogCommand()).execute(argumentMock, []));
  });
});
