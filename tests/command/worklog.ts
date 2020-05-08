import 'mocha';
import * as chai from 'chai';
import WorklogCommand from '../../src/command/WorklogCommand';
import StartCommand from '../../src/command/StartCommand';
import DataHelper from '../../src/lib/helper/DataHelper';

describe('Worklog command', () => {
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

    (new DataHelper()).writeData({});
    (new StartCommand()).execute(null, []);
  });
  it('Create worklog', () => {
    const commandParam = [];
    commandParam.push(testData.worklog.createData.key);
    testData.worklog.createData.value.forEach((message) => {
      commandParam.push(message);
    });

    const commandResult = (new WorklogCommand()).execute(argumentMock, commandParam);

    chai.expect('Created a new worklog with value: ' +
        testData.worklog.createData.key + ' ' +
        testData.note.createData.join(' ')).to.equal(commandResult);
  });

  it('Edit worklog', () => {
    argumentMock.edit = 1;
    const commandParam = [];
    commandParam.push(testData.worklog.editData.key);
    testData.worklog.createData.value.forEach((message) => {
      commandParam.push(message);
    });

    const commandResult = (new WorklogCommand()).execute(argumentMock, commandParam);

    chai.expect('Edited worklog with id: '+ '1').to.equal(commandResult);
  });

  it('Delete worklog', () => {
    argumentMock.delete = 1;
    const commandResult = (new WorklogCommand()).execute(argumentMock, []);

    chai.expect('Deleted worklog with id: '+ '1').to.equal(commandResult);
  });
});
