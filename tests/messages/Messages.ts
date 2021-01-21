// import 'mocha';
// import * as chai from 'chai';
// import * as translations from '../../src/messages/en.json';
// import GlobalMock from '../mock/global';
// import Messages from '../../src/messages';
//
// describe('Config helper', () => {
//   const translationKey = 'command.worklog.execution.create';
//
//   beforeEach(() => {
//     const defaults = GlobalMock.getDefaults();
//
//     GlobalMock.beforeEach(defaults);
//   });
//
//   afterEach(() => {
//     const defaults = GlobalMock.getDefaults();
//
//     GlobalMock.afterEach(defaults);
//   });
//
//   describe('translation', () => {
//     it('default', () => {
//       chai.expect(translations.command.worklog.execution.create)
//           .to.equal(Messages.translation(translationKey));
//     });
//
//     it('non-default', () => {
//       GlobalMock.writeToConfig({'language': 'de'});
//
//       chai.expect(translations.command.worklog.execution.create)
//           .to.equal(Messages.translation(translationKey));
//     });
//   });
// });
