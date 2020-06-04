import 'mocha';
import * as chai from 'chai';
import * as defaultConfig from '../../src/config.dist.json';
import ConfigHelper from '../../src/helper/ConfigHelper';
import * as fs from 'fs';
import DataHelper from '../../src/helper/DataHelper';
import GlobalMock from '../mock/global';

function writeToConfig(data: object): void {
  if (!fs.readdirSync('~/.wib_test', null)) {
    fs.mkdirSync('~/.wib_test', {recursive: true});
  }

  fs.writeFileSync('~/.wib_test/config.json', JSON.stringify(data));
}

describe('Config helper', () => {
  const formatKeys = Object.keys(defaultConfig.format);

  beforeEach(() => {
    GlobalMock.beforeEach();

    (new DataHelper()).writeData({});
    writeToConfig({});
  });

  afterEach(() => {
    GlobalMock.afterEach();
  });

  describe('getSpecifiedFormat', () => {
    describe('without config', () => {
      for (const val in formatKeys) {
        it(formatKeys[val], () => {
          chai.expect(defaultConfig.format[formatKeys[val]].key)
              .to.equal(
                  (new ConfigHelper()).getSpecifiedFormat(formatKeys[val], 'key'));

          chai.expect(defaultConfig.format[formatKeys[val]].value)
              .to.equal(
                  (new ConfigHelper()).getSpecifiedFormat(formatKeys[val]));
        });
      }
    });

    describe('with config', () => {
      for (const val in formatKeys) {
        const baseWriteConfig = {
          'format': {}
        };
        it(formatKeys[val], () => {
          baseWriteConfig.format[formatKeys[val]] = {
            'key': defaultConfig.format[formatKeys[val]].key + '--1',
            'value': defaultConfig.format[formatKeys[val]].value + '--1'
          };
          writeToConfig(baseWriteConfig);

          chai.expect(defaultConfig.format[formatKeys[val]].key + '--1')
              .to.equal(
                  (new ConfigHelper()).getSpecifiedFormat(formatKeys[val], 'key'));
          chai.expect(defaultConfig.format[formatKeys[val]].value + '--1')
              .to.equal(
                  (new ConfigHelper()).getSpecifiedFormat(formatKeys[val]));
        });
      }
    });
  });
  describe('getSpecifiedMinuteRounding', () => {
    it('without config', () => {
      chai.expect(defaultConfig.minuteRounding).to.equal((new ConfigHelper()).getSpecifiedMinuteRounding());
    });

    it('with config', () => {
      const specifiedRounding = 12;
      writeToConfig({'minuteRounding': specifiedRounding});

      chai.expect(specifiedRounding).to.equal((new ConfigHelper()).getSpecifiedMinuteRounding());
    });
  });
  describe('getSpecifiedWorkDuration', () => {
    it('without config', () => {
      chai.expect(defaultConfig.workDuration)
          .to.equal(
              (new ConfigHelper()).getSpecifiedWorkDuration());
    });

    it('with config', () => {
      const workDuration = 6;
      writeToConfig({'workDuration': workDuration});
      chai.expect(workDuration).to.equal((new ConfigHelper()).getSpecifiedWorkDuration());
    });
  });
});
