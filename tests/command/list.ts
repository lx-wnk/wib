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
import ConfigHelper from "../../dist/lib/helper/ConfigHelper";

function createWorklog(): void {
  const commandOptions = [];
  commandOptions.push(testData.worklog.createData.key);
  testData.worklog.createData.value.forEach((message) => {
    commandOptions.push(message);
  });

  (new StartCommand()).execute({}, []);
  (new WorklogCommand()).execute({}, commandOptions);
}

describe('List command', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const constantDate = new Date(testData.testDate),
    argumentMock = {
      day: undefined,
      month: undefined
    };
  let formatStub, roundingStub;
  beforeEach(() => {
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

    formatStub = sinon.stub(ConfigHelper.prototype, 'getSpecifiedFormat').callsFake((formatName: string, type?: string) => {
      console.log((new ConfigHelper()).getDefaults()['format'][formatName][type]);
      return (new ConfigHelper()).getDefaults()['format'][formatName][type];
    });

    roundingStub = sinon.stub(ConfigHelper.prototype, 'getSpecifiedMinuteRounding').callsFake((formatName: string, type?: string) => {
      console.log((new ConfigHelper()).getDefaults()['minuteRounding']);
      return (new ConfigHelper()).getDefaults()['minuteRounding'];
    });

    (new DataHelper()).writeData({});
  });

  afterEach(() => {
    formatStub.restore();
    roundingStub.restore();
  });
  it('List start', () => {
    (new StartCommand()).execute({}, []);
    chai.expect(
        '------------------------\n' +
        '| Clocked in  | 06:20  |\n' +
        '------------------------\n' +
        '| Worked time | 4h 22m |\n' +
        '------------------------\n')
        .to.equal((new ListCommand()).execute(argumentMock));
  });

  it('List stop', () => {
    (new StopCommand()).execute({}, []);
    chai.expect(
        '-----------------------\n' +
        '| Clocked out | 06:22 |\n' +
        '-----------------------\n')
        .to.equal((new ListCommand()).execute(argumentMock));
  });

  it('List notes', () => {
    (new NoteCommand()).execute({}, testData.note.createData);
    chai.expect(
        '-------------------------------------------\n' +
        '| Note(0) [06:22]  | '+testData.note.createData.join(' ')+'  |\n' +
        '-------------------------------------------\n')
        .to.equal((new ListCommand()).execute(argumentMock));
  });

  it('List worklogs', () => {
    createWorklog();

    chai.expect(
        '---------------------------------------------------------------\n' +
        '| Clocked in          | 06:22                                 |\n' +
        '---------------------------------------------------------------\n' +
        '| Worked time         | 4h 26m                                |\n' +
        '---------------------------------------------------------------\n' +
        '| Worklog(0) [06:22]  | 4h 25m '+testData.worklog.createData.key+ ' ' +
        testData.worklog.createData.value.join(' ') +'  |\n' +
        '---------------------------------------------------------------')
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
        '---------------------------------------------------------------\n'+
        '| Clocked in          | 18:00                                 |\n'+
        '---------------------------------------------------------------\n'+
        '| Clocked out         | 18:00                                 |\n'+
        '---------------------------------------------------------------\n'+
        '| Worked time         | 16h 4m                                |\n'+
        '---------------------------------------------------------------\n'+
        '| Note(0) [18:00]     | '+ testData.note.createData.join(' ') +'                   |\n'+
        '---------------------------------------------------------------\n'+
        '| Worklog(0) [18:00]  | 16h 5m '+testData.worklog.createData.key +
        ' ' + testData.worklog.createData.value.join(' ') + '  |\n'+
        '---------------------------------------------------------------')
        .to.equal((new ListCommand()).execute(argumentMock));
  });
});
