import 'mocha';
import * as chai from 'chai';
import DateHelper from '../../src/helper/DateHelper';
import GlobalMock from '../mock/global';

describe('DateHelper', () => {
  beforeEach(function() {
    GlobalMock.beforeEach();
  });

  afterEach(() => {
    GlobalMock.afterEach();
  });

  it('Current date is correct formatted', () => {
    chai.expect('2000_04_20')
        .to.equal((new DateHelper()).calculateFormattedCurrentDate());
  });

  it('Given date data is correct formatted', () => {
    chai.expect('2000_04_21')
        .to.equal((new DateHelper()).calculateFormattedGivenDateData({day: 21}));

    chai.expect('2000_05_20')
        .to.equal((new DateHelper()).calculateFormattedGivenDateData({month: 5}));

    chai.expect('1999_04_20')
        .to.equal((new DateHelper()).calculateFormattedGivenDateData({year: 1999}));

    chai.expect('1999_05_21')
        .to.equal((new DateHelper()).calculateFormattedGivenDateData({year: 1999, month: 5, day: 21}));
  });

  it('Given date object is correct formatted', () => {
    chai.expect('1991_02_03')
        .to.equal((new DateHelper()).calculateFormattedGivenDateObject(new Date(1991, 1, 3)));
  });
});
