import 'mocha';
import * as chai from 'chai';
import * as defaultConfig from '../../src/config.dist.json';
import ConfigHelper from '../../src/helper/ConfigHelper';
import GlobalMock from '../mock/global';

describe('Config helper', () => {
  const formatKeys = Object.keys(defaultConfig.format);

  beforeEach(() => {
    const defaults = GlobalMock.getDefaults();
    defaults.config.format = false;
    defaults.config.rounding = false;

    GlobalMock.beforeEach(defaults);
  });

  afterEach(() => {
    const defaults = GlobalMock.getDefaults();
    defaults.config.format = false;
    defaults.config.rounding = false;

    GlobalMock.afterEach(defaults);
  });

  describe('getSpecifiedFormat', () => {
    describe('without config', () => {
      for (const val in formatKeys) {
        it(formatKeys[val], () => {
          chai.expect(defaultConfig.format[formatKeys[val]].key)
              .to.equal((new ConfigHelper()).getSpecifiedFormat(formatKeys[val], 'key'));

          chai.expect(defaultConfig.format[formatKeys[val]].value)
              .to.equal((new ConfigHelper()).getSpecifiedFormat(formatKeys[val]));
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
          GlobalMock.writeToConfig(baseWriteConfig);

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
      GlobalMock.writeToConfig({'minuteRounding': specifiedRounding});

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
      GlobalMock.writeToConfig({'workDuration': workDuration});

      chai.expect(workDuration).to.equal((new ConfigHelper()).getSpecifiedWorkDuration());
    });
  });
});
