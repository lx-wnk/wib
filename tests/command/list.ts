import 'mocha';
import * as chai from 'chai';
import ListCommand from '../../src/command/ListCommand';
import StartCommand from '../../src/command/StartCommand';
import StopCommand from '../../src/command/StopCommand';
import NoteCommand from '../../src/command/NoteCommand';
import DataHelper from '../../src/helper/DataHelper';
import WorklogCommand from '../../src/command/WorklogCommand';
import * as testData from '../data.json';
import RestCommand from '../../src/command/RestCommand';
import GlobalMock from '../mock/global';

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
  const argumentMock = {
    day: undefined,
    month: undefined
  };

  beforeEach(() => {
    GlobalMock.beforeEach();

    (new DataHelper()).writeData({}, null, GlobalMock.constantDate.getTime());

    argumentMock.day = undefined;
    argumentMock.month = undefined;
  });

  afterEach(() => {
    GlobalMock.afterEach();
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

  it('List rest', () => {
    createWorklog();

    (new RestCommand).execute({
      time: '10:20'
    });
    (new RestCommand).execute({
      time: '12:20'
    });

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
        '| '+testData.rest.key+'(1)   [12:20]  | 4h '+ testData.rest.value +'                 |\n' +
        '-----------------------------------------------------------')
        .to.equal((new ListCommand()).execute(argumentMock));
  });

  it('List all', () => {
    createWorklog();
    (new RestCommand).execute({
      time: '10:20'
    });
    (new NoteCommand()).execute({}, testData.note.createData);
    (new StopCommand()).execute({}, ['18:00']);

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
        '| '+testData.rest.key+'(1)   [10:20]  | 2h '+testData.rest.value+'                 |\n'+
        '-----------------------------------------------------------')
        .to.equal((new ListCommand()).execute(argumentMock));
  });
});
