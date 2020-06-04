import 'mocha';
import * as chai from 'chai';
import StartCommand from '../../src/command/StartCommand';
import DataHelper from '../../src/helper/DataHelper';
import RestCommand from '../../src/command/RestCommand';
import Messages from '../../src/messages';
import GlobalMock from '../mock/global';

describe('Rest command', () => {
  beforeEach(() => {
    GlobalMock.beforeEach();

    (new DataHelper()).writeData({});
    (new StartCommand()).execute(null, []);
  });

  afterEach(() => {
    GlobalMock.afterEach();
  });
  it('Create rest entry', () => {
    chai.expect(Messages.translation('command.rest.execution.create') + '6:20')
        .to.equal((new RestCommand()).execute({}));
  });

  it('Append to rest entry', () => {
    (new RestCommand()).execute({});

    chai.expect(Messages.translation('command.rest.execution.create') + '8:20')
        .to.equal((new RestCommand()).execute({
          time: '08:20'
        }));
  });
});
