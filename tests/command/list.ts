import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import ListCommand from '../../src/command/ListCommand';
import StartCommand from '../../src/command/StartCommand';
import StopCommand from '../../src/command/StopCommand';
import NoteCommand from '../../src/command/NoteCommand';
import DataHelper from '../../src/lib/helper/DataHelper';
import WorklogCommand from '../../src/command/WorklogCommand';
import * as testData from '../data.json';
import ConfigHelper from '../../src/lib/helper/ConfigHelper';

function createWorklog(): void {
  const commandOptions = [];
  commandOptions.push(testData.worklog.createData.key);
  testData.worklog.createData.value.forEach((message) => {
    commandOptions.push(message);
  });

  (new StartCommand()).execute({}, []);
  (new WorklogCommand()).execute({
    time: '08:20'
  }, commandOptions);
}

describe('List command', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const constantDate = new Date(testData.testDate),
    argumentMock = {
      day: undefined,
      month: undefined
    };
  let dateNowStub, dateConstructorStub, formatStub, roundingStub;

  beforeEach(() => {
    process.env.TZ = 'Europe/Berlin';

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

    (new DataHelper()).writeData({}, null, new Date(Date.now()).getTime());

    argumentMock.day = undefined;
    argumentMock.month = undefined;
  });

  afterEach(() => {
    dateNowStub.restore();
    dateConstructorStub.restore();
    formatStub.restore();
    roundingStub.restore();
  });

  it('List start', () => {
    (new StartCommand()).execute({}, []);

    chai.expect(
        '-------------------------------\n' +
        '| Clocked in          | 06:20 |\n' +
        '-------------------------------\n' +
        '| Estimated clock out | 14:20 |\n' +
        '-------------------------------\n')
        .to.equal((new ListCommand()).execute(argumentMock));
  });

  it('List stop', () => {
    (new StopCommand()).execute({}, []);
    chai.expect(
        '-----------------------\n' +
        '| Clocked out | 06:20 |\n' +
        '-----------------------\n')
        .to.equal((new ListCommand()).execute(argumentMock));
  });

  it('List notes', () => {
    (new NoteCommand()).execute({}, testData.note.createData);
    chai.expect(
        '-------------------------------------------\n' +
        '| Note(0) [06:20]  | '+testData.note.createData.join(' ')+'  |\n' +
        '-------------------------------------------\n')
        .to.equal((new ListCommand()).execute(argumentMock));
  });

  it('List worklogs', () => {
    createWorklog();

    chai.expect(
        '-----------------------------------------------------------\n' +
        '| Clocked in          | 06:20                             |\n' +
        '-----------------------------------------------------------\n' +
        '| Estimated clock out | 14:20                             |\n' +
        '-----------------------------------------------------------\n' +
        '| Worked time         | 2h                                |\n' +
        '-----------------------------------------------------------\n' +
        '| Worklog(0) [08:20]  | 2h '+testData.worklog.createData.key+ ' ' +
        testData.worklog.createData.value.join(' ') +'  |\n' +
        '-----------------------------------------------------------')
        .to.equal((new ListCommand()).execute(argumentMock));
  });

  it('List all', () => {
    createWorklog();
    (new NoteCommand()).execute({}, testData.note.createData);
    (new StopCommand()).execute({}, ['18:00']);

    /**
     * TODO: Check why the hell the date object is 4PM instead of 4:20AM
     */
    chai.expect(
        '-----------------------------------------------------------\n'+
        '| Clocked in          | 06:20                             |\n'+
        '-----------------------------------------------------------\n'+
        '| Clocked out         | 18:00                             |\n'+
        '-----------------------------------------------------------\n'+
        '| Worked time         | 2h                                |\n'+
        '-----------------------------------------------------------\n'+
        '| Note(0) [06:20]     | '+ testData.note.createData.join(' ') +'               |\n'+
        '-----------------------------------------------------------\n'+
        '| Worklog(0) [08:20]  | 2h '+testData.worklog.createData.key +
        ' ' + testData.worklog.createData.value.join(' ') + '  |\n'+
        '-----------------------------------------------------------')
        .to.equal((new ListCommand()).execute(argumentMock));
  });
});
