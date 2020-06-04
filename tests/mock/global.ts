import 'mocha';
import * as sinon from 'sinon';
import DataHelper from '../../src/helper/DataHelper';
import * as testData from '../data.json';
import ConfigHelper from '../../src/helper/ConfigHelper';
import fs from 'fs';

export default class GlobalMock {
    public static dateNowStub;
    public static dateConstructorStub;
    public static configFormatStub;
    public static configRoundingStub;
    public static configHomeDirStub;
    public static constantDate = new Date(testData.testDate);

    static beforeEach(shouldMock = GlobalMock.getDefaults()): void {
      process.env.TZ = 'Europe/Berlin';

      if (shouldMock.date) {
        GlobalMock.dateNowStub = sinon.stub(Date, 'now').callsFake(() => {
          return testData.testTime;
        });

        GlobalMock.dateConstructorStub = sinon.stub(Date.prototype, 'constructor').callsFake(() => {
          return GlobalMock.constantDate;
        });
      }

      if (shouldMock.config.format) {
        GlobalMock.configFormatStub = sinon.stub(ConfigHelper.prototype, 'getSpecifiedFormat')
            .callsFake((formatName: string, type?: string) => {
              return (new ConfigHelper()).getDefaults()['format'][formatName][type];
            });
      }

      if (shouldMock.config.rounding) {
        GlobalMock.configRoundingStub = sinon.stub(ConfigHelper.prototype, 'getSpecifiedMinuteRounding')
            .callsFake(() => {
              return (new ConfigHelper()).getDefaults()['minuteRounding'];
            });
      }

      if (shouldMock.config.homeDir) {
        GlobalMock.configHomeDirStub = sinon.stub(DataHelper, 'getHomeDir').callsFake(() => {
          return '~/.wib_test/';
        });
      }

      (new DataHelper()).writeData({}, null, GlobalMock.constantDate.getTime());
      GlobalMock.writeToConfig({});
    }

    static afterEach(shouldMock = GlobalMock.getDefaults()): void {
      if (shouldMock.date) {
        GlobalMock.dateNowStub.restore();
        GlobalMock.dateConstructorStub.restore();
      }

      if (shouldMock.config.format) {
        GlobalMock.configFormatStub.restore();
      }

      if (shouldMock.config.rounding) {
        GlobalMock.configRoundingStub.restore();
      }

      if (shouldMock.config.homeDir) {
        GlobalMock.configHomeDirStub.restore();
      }
    }

    static getDefaults(): {date: boolean; config: {format: boolean; rounding: boolean; homeDir: boolean}} {
      return {
        date: true,
        config: {
          format: true,
          rounding: true,
          homeDir: true
        }
      };
    }

    static writeToConfig(data: object): void {
      if (!fs.readdirSync('~/.wib_test', null)) {
        fs.mkdirSync('~/.wib_test', {recursive: true});
      }

      fs.writeFileSync('~/.wib_test/config.json', JSON.stringify(data));
    }
}
