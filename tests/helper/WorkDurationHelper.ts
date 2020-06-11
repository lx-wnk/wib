import 'mocha';
import * as chai from 'chai';
import * as defaultConfig from '../../src/config.dist.json';
import WorkDurationHelper from '../../src/helper/WorkDurationHelper';
import StartStruct from '../../src/struct/start';
import WorklogCollection from '../../src/struct/collection/WorklogCollection';
import WorklogStruct from '../../src/struct/worklog';
import DataHelper from '../../src/helper/DataHelper';
import GlobalMock from '../mock/global';
import Messages from '../../src/messages';

describe('WorkDurationHelper', () => {
  beforeEach(() => {
    GlobalMock.beforeEach();

    (new DataHelper()).writeData({});
  });

  afterEach(() => {
    GlobalMock.afterEach();
  });

  it('getWorkDuration', () => {
    const startStruct = (new StartStruct()),
      worklogs = (new WorklogCollection());
    startStruct.time = new Date(Date.now());

    for (let i = 0; 5 > i; i++) {
      const worklog = (new WorklogStruct());
      worklog.id = i;
      worklog.time = new Date(Date.now());
      worklog.time.setUTCHours(startStruct.time.getUTCHours() + i);
      worklog.key = 'WL-'+i;
      worklog.value = 'wl value-'+i;
      worklogs.addEntry(worklog);
    }

    chai.expect(JSON.stringify(
        {key: Messages.applyTranslationToString(defaultConfig.format.workDuration.key), value: '4h'}
    )).to.equal(JSON.stringify((new WorkDurationHelper()).getWorkDuration(startStruct, worklogs)));
  });
});
