import 'mocha';
import * as chai from 'chai';
import * as testData from '../data.json';
import DataHelper from '../../src/helper/DataHelper';
import GlobalMock from '../mock/global';

describe('DataHelper', () => {
  const constantDate = new Date(testData.testDate);

  beforeEach(() => {
    GlobalMock.beforeEach();

    (new DataHelper()).writeData({});
  });

  afterEach(() => {
    GlobalMock.afterEach();
  });

  describe('data handling', () => {
    it('plain', () => {
      (new DataHelper()).writeData({
        'test': 'test123'
      });

      chai.expect(JSON.stringify({'test': 'test123'}))
          .to.equal(JSON.stringify((new DataHelper()).readAllData()));
    });
    it('with date', () => {
      (new DataHelper()).writeData({
        'test': 'test123'
      }, null, constantDate.getTime());

      chai.expect(JSON.stringify({'test': 'test123'}))
          .to.equal(JSON.stringify((new DataHelper()).readAllData(null, constantDate.getTime())));
    });
    it('with key', () => {
      (new DataHelper()).writeData({
        'test': 'test123'
      }, 'key123');

      chai.expect(JSON.stringify({'test': 'test123'}))
          .to.equal(JSON.stringify((new DataHelper()).readAllData('key123')));
    });
    it('with key and date', () => {
      (new DataHelper()).writeData({
        'test': 'test123'
      }, 'key123', constantDate.getTime());

      chai.expect(JSON.stringify({'test': 'test123'}))
          .to.equal(JSON.stringify((new DataHelper()).readAllData('key123', constantDate.getTime())));
    });
  });
});
