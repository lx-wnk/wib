import 'mocha';
import * as chai from 'chai';
import WorklogCommand from '../../src/command/WorklogCommand';
import StartCommand from '../../src/command/StartCommand';
import DataHelper from '../../src/helper/DataHelper';
import Messages from '../../src/messages';
import GlobalMock from '../mock/global';

describe('Worklog command', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const testData = require('../data.json'),
    argumentMock = {
      delete: undefined,
      edit: undefined
    };

  beforeEach(() => {
    GlobalMock.beforeEach();

    (new DataHelper()).writeData({});
    (new StartCommand()).execute(null, []);
    argumentMock.delete = undefined;
    argumentMock.edit = undefined;
  });

  afterEach(() => {
    GlobalMock.afterEach();
  });

  it('Create worklog', () => {
    const commandOptions = [];
    commandOptions.push(testData.worklog.createData.key);
    testData.worklog.createData.value.forEach((message) => {
      commandOptions.push(message);
    });

    chai.expect(Messages.translation('command.worklog.execution.create') + '4h 20m ' +
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

    chai.expect(Messages.translation('command.worklog.execution.couldNotEdit')).to.equal(
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

    chai.expect(Messages.translation('command.worklog.execution.edit') + '0').to.equal(
        (new WorklogCommand()).execute(argumentMock, commandOptions)
    );
  });

  it('Delete non-existing worklog', () => {
    argumentMock.delete = 1;

    chai.expect(Messages.translation('command.worklog.execution.couldNotDelete') + '1')
        .to.equal((new WorklogCommand()).execute(argumentMock, []));
  });

  it('Delete existing worklog', () => {
    const commandOptions = [];
    commandOptions.push(testData.worklog.createData.key);
    testData.worklog.createData.value.forEach((message) => {
      commandOptions.push(message);
    });

    (new WorklogCommand()).execute(argumentMock, commandOptions);

    argumentMock.delete = 0;
    chai.expect(Messages.translation('command.worklog.execution.delete') + '0')
        .to.equal((new WorklogCommand()).execute(argumentMock, []));
  });
});
