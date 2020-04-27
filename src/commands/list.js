const dataHandler = require('../lib/data');
const formatHelper = require('../lib/format');
const {Command} = require('commander');

module.exports.commandSetup = () => {
  return new Command('list')
      .alias('l')
      .description('Show the list of notes and tracked times')
      .action(this.handle);
};
module.exports.handle = (args, options, logger) => {
  const writtenData = dataHandler.readData();

  console.log('Report for day:\t' + formatHelper.formatTime(writtenData.start, 'date'));
  console.log('Clocked in:\t' + formatHelper.formatTime(writtenData.start));
  if (writtenData.stop !== undefined) {
    console.log('Clocked out:\t' + formatHelper.formatTime(writtenData.stop));
  }

  console.log(formatHelper.formatNotes(writtenData.notes));
  console.log(formatHelper.formatTracker(writtenData.trackedTime));
};
