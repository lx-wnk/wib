import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import WorklogCommand from '../../src/command/WorklogCommand';
import StartCommand from '../../src/command/StartCommand';
import DataHelper from '../../src/lib/helper/DataHelper';
import * as responsePrefix from '../../src/command/response.json';
import ConfigHelper from '../../src/lib/helper/ConfigHelper';

describe('Worklog command', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const testData = require('../data.json'),
    constantDate = new Date(testData.testDate),
    argumentMock = {
      delete: undefined,
      edit: undefined
    };
  let dateNowStub, dateConstructorStub, formatStub, roundingStub;
  beforeEach(function() {
    process.env.TZ = 'Europe/Berlin';
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    // eslint-disable-next-line no-global-assign
    dateNowStub = sinon.stub(Date, 'now')
        .callsFake(() => {
          return testData.testTime;
        });

    dateConstructorStub = sinon.stub(Date.prototype, 'constructor')
        .callsFake(() => {
          return constantDate;
        });

    formatStub = sinon.stub(ConfigHelper.prototype, 'getSpecifiedFormat')
        .callsFake((formatName: string, type?: string) => {
          return (new ConfigHelper()).getDefaults()['format'][formatName][type];
        });

    roundingStub = sinon.stub(ConfigHelper.prototype, 'getSpecifiedMinuteRounding')
        .callsFake(() => {
          return (new ConfigHelper()).getDefaults()['minuteRounding'];
        });

    (new DataHelper()).writeData({});
    (new StartCommand()).execute(null, []);
    argumentMock.delete = undefined;
    argumentMock.edit = undefined;
  });

  afterEach(() => {
    dateNowStub.restore();
    dateConstructorStub.restore();
    formatStub.restore();
    roundingStub.restore();
  });

  it('Create worklog', () => {
    const commandOptions = [];
    commandOptions.push(testData.worklog.createData.key);
    testData.worklog.createData.value.forEach((message) => {
      commandOptions.push(message);
    });

    chai.expect(responsePrefix.worklog.create + '4h 20m ' +
        testData.worklog.createData.key + ' ' +
        testData.note.createData.join(' ')
    ).to.equal((new WorklogCommand()).execute(argumentMock, commandOptions));
  });

  it('Edit non-existing worklog', () => {
    const commandOptions = [];
    argumentMock.edit = 1;
    commandOptions.push(testData.worklog.editData.key);
    testData.worklog.createData.value.forEach((message) => {
      commandOptions.push(message);
    });

    chai.expect(responsePrefix.worklog.couldNotEdit + '1').to.equal(
        (new WorklogCommand()).execute(argumentMock, commandOptions)
    );
  });

  it('Edit existing worklog', () => {
    const commandOptions = [];
    commandOptions.push(testData.worklog.createData.key);
    testData.worklog.createData.value.forEach((message) => {
      commandOptions.push(message);
    });

    (new WorklogCommand()).execute(argumentMock, commandOptions);

    commandOptions.splice(0, commandOptions.length);

    argumentMock.edit = 0;
    commandOptions.push(testData.worklog.editData.key);
    testData.worklog.createData.value.forEach((message) => {
      commandOptions.push(message);
    });

    chai.expect(responsePrefix.worklog.edit+ '0').to.equal(
        (new WorklogCommand()).execute(argumentMock, commandOptions)
    );
  });

  it('Delete non-existing worklog', () => {
    argumentMock.delete = 1;

    chai.expect(responsePrefix.worklog.couldNotDelete + '1').to.equal((new WorklogCommand()).execute(argumentMock, []));
  });

  it('Delete existing worklog', () => {
    const commandOptions = [];
    commandOptions.push(testData.worklog.createData.key);
    testData.worklog.createData.value.forEach((message) => {
      commandOptions.push(message);
    });

    (new WorklogCommand()).execute(argumentMock, commandOptions);

    argumentMock.delete = 0;
    chai.expect(responsePrefix.worklog.delete+ '0').to.equal((new WorklogCommand()).execute(argumentMock, []));
  });
});
