import 'mocha';
import * as chai from 'chai';
import StartCommand from '../../src/command/StartCommand';
import DataHelper from '../../src/helper/DataHelper';
import GlobalMock from '../mock/global';

describe('Start command', () => {
  beforeEach(() => {
    GlobalMock.beforeEach();

    (new DataHelper()).writeData({});
  });

  afterEach(() => {
    GlobalMock.afterEach();
  });

  it('Set start time', () => {
    chai.expect('Clocked in '+ '04:20').to.equal((new StartCommand()).execute(null, []));
  });
  it('Set specific start time', () => {
    chai.expect('Clocked in '+ '06:20').to.equal((new StartCommand()).execute(null, ['6:20']));
  });
});
