import 'mocha';
import * as chai from 'chai';
import StopCommand from '../../src/command/StopCommand';
import DataHelper from '../../src/helper/DataHelper';
import GlobalMock from '../mock/global';

describe('Stop command', () => {
  beforeEach(() => {
    GlobalMock.beforeEach();

    (new DataHelper()).writeData({});
  });

  afterEach(() => {
    GlobalMock.afterEach();
  });

  it('Set stop time', () => {
    chai.expect('Clocked out '+ '06:20').to.equal((new StopCommand()).execute(null, []));
  });
  it('Set specific stop time', () => {
    chai.expect('Clocked out '+ '06:20').to.equal((new StopCommand()).execute(null, ['6:20']));
  });
});
