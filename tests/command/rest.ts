import 'mocha';
import * as chai from 'chai';
import StartCommand from '../../src/command/StartCommand';
import DataHelper from '../../src/helper/DataHelper';
import RestCommand from '../../src/command/RestCommand';
import Messages from '../../src/messages';
import GlobalMock from '../mock/global';

describe('Rest command', () => {
  const argumentMock = {
    edit: undefined,
    time: undefined
  };

  beforeEach(() => {
    GlobalMock.beforeEach();

    (new DataHelper()).writeData({});
    (new StartCommand()).execute(null, []);

    argumentMock.edit = undefined;
    argumentMock.time = undefined;
  });

  afterEach(() => {
    GlobalMock.afterEach();
  });
  it('Create rest entry', () => {
    chai.expect(Messages.translation('command.rest.execution.create', {'duration': '5m'}) + '04:20')
        .to.equal((new RestCommand()).execute(argumentMock));
  });

  it('Append to rest entry', () => {
    (new RestCommand()).execute({});
    argumentMock.time = '08:20';

    chai.expect(Messages.translation('command.rest.execution.create', {'duration': '4h'}) + '08:20')
        .to.equal((new RestCommand()).execute(argumentMock));
  });

  it('Set rest entry to current time', () => {
    argumentMock.time = '02:20';
    (new RestCommand()).execute(argumentMock);

    argumentMock.edit = '0';
    argumentMock.time = undefined;

    chai.expect(Messages.translation('command.rest.execution.create') + '04:20')
        .to.equal((new RestCommand()).execute(argumentMock));
  });

  it('Set rest entry to specific time', () => {
    argumentMock.time = '02:20';
    (new RestCommand()).execute(argumentMock);

    argumentMock.edit = '0';
    argumentMock.time = '03:20';

    chai.expect(Messages.translation('command.rest.execution.create') + '03:20')
        .to.equal((new RestCommand()).execute(argumentMock));
  });

  it('Edit undefined', () => {
    argumentMock.edit = '1';

    chai.expect(Messages.translation('command.rest.execution.couldNotEdit') + '1')
        .to.equal((new RestCommand()).execute(argumentMock));
  });
});
