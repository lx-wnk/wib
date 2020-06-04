import 'mocha';
import * as sinon from 'sinon';
import DataHelper from '../../src/helper/DataHelper';
import * as testData from '../data.json';
import ConfigHelper from '../../src/helper/ConfigHelper';

export default class GlobalMock {
    public static dateNowStub;
    public static dateConstructorStub;
    public static formatStub;
    public static roundingStub;
    public static homeDirStub;
    public static constantDate = new Date(testData.testDate);

    static beforeEach(): void {
      process.env.TZ = 'Europe/Berlin';

      GlobalMock.dateNowStub = sinon.stub(Date, 'now').callsFake(() => {
        return testData.testTime;
      });

      GlobalMock.dateConstructorStub = sinon.stub(Date.prototype, 'constructor').callsFake(() => {
        return GlobalMock.constantDate;
      });

      GlobalMock.formatStub = sinon.stub(ConfigHelper.prototype, 'getSpecifiedFormat')
          .callsFake((formatName: string, type?: string) => {
            return (new ConfigHelper()).getDefaults()['format'][formatName][type];
          });

      GlobalMock.roundingStub = sinon.stub(ConfigHelper.prototype, 'getSpecifiedMinuteRounding').callsFake(() => {
        return (new ConfigHelper()).getDefaults()['minuteRounding'];
      });

      GlobalMock.homeDirStub = sinon.stub(DataHelper, 'getHomeDir').callsFake(() => {
        return '~/.wib_test';
      });

      (new DataHelper()).writeData({}, null, GlobalMock.constantDate.getTime());
    }

    static afterEach(): void {
      GlobalMock.dateNowStub.restore();
      GlobalMock.dateConstructorStub.restore();
      GlobalMock.formatStub.restore();
      GlobalMock.roundingStub.restore();
      GlobalMock.homeDirStub.restore();
    }
}
