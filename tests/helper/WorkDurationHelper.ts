import 'mocha';
import * as chai from 'chai';
import * as defaultConfig from '../../src/config.dist.json';
import WorkDurationHelper from '../../src/helper/WorkDurationHelper';
import StartStruct from '../../src/struct/start';
import WorklogCollection from '../../src/struct/collection/WorklogCollection';
import WorklogStruct from '../../src/struct/worklog';
import DataHelper from '../../src/helper/DataHelper';
import GlobalMock from '../mock/global';

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
      worklog.time = new Date(Date.now());
      worklog.time.setHours(i);
      worklog.key = 'WL-'+i;
      worklog.value = 'wl value-'+i;
      worklogs.addEntry(worklog);
    }

    chai.expect(JSON.stringify({key: defaultConfig.format.workDuration.key, value: '4h 20m'}))
        .to.equal(JSON.stringify((new WorkDurationHelper()).getWorkDuration(startStruct, worklogs)));
  });
});
