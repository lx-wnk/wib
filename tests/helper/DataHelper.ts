import 'mocha';
import * as chai from 'chai';
import * as testData from '../data.json';
import DataHelper from '../../src/helper/DataHelper';
import GlobalMock from '../mock/global';
import * as fs from 'fs';

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
    it('noFolder', () => {
      const deleteFolderRecursive = ((path): void => {
        if ( fs.existsSync(path) ) {
          fs.readdirSync(path).forEach(((file) => {
            const curPath = path + '/' + file;
            if (fs.lstatSync(curPath).isDirectory()) {
              deleteFolderRecursive(curPath);
            } else {
              fs.unlinkSync(curPath);
            }
          }));
          fs.rmdirSync(path);
        }
      });

      deleteFolderRecursive(DataHelper.getHomeDir());

      chai.expect(JSON.stringify({}))
          .to.equal(JSON.stringify((new DataHelper()).readAllData()));
    });
    it('noFile', () => {
      const date = new Date(Date.now());
      const formattedDate = date.getFullYear() + '_' + String(date.getMonth() + 1).padStart(2, '0') +
            '_' + String(date.getDate()).padStart(2, '0');

      fs.unlinkSync(DataHelper.getHomeDir() + formattedDate + '.json');

      chai.expect(JSON.stringify({}))
          .to.equal(JSON.stringify((new DataHelper()).readAllData()));
    });
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
