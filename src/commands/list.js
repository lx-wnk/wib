const dataHelper = require('../lib/data');
const formatHelper = require('../lib/format');
const {Command} = require('commander');

module.exports.commandSetup = () => {
  return new Command('list')
      .alias('l')
      .alias('status')
      .alias('report')
      .description('Show the list of notes and tracked times')
      .action(this.handle);
};
module.exports.handle = (args, options, logger) => {
  const writtenData = dataHelper.readData(), output = {};

  if (writtenData.start !== undefined) {
    output.day = {
      key: formatHelper.applyFormat(writtenData.start, 'day', 'key'),
      value: formatHelper.applyFormat({'date': writtenData.start.time}, 'day'),
    };
    output.start = {
      key: formatHelper.applyFormat(writtenData.start, 'start', 'key'),
      value: formatHelper.applyFormat(writtenData.start, 'start'),
    };
  }
  if (writtenData.stop !== undefined) {
    output.stop = {
      key: formatHelper.applyFormat(writtenData.stop, 'stop', 'key'),
      value: formatHelper.applyFormat(writtenData.stop, 'stop'),
    };
  }
  if (writtenData.break !== undefined) {
    output.break = {
      key: formatHelper.applyFormat(writtenData.break, 'break', 'key'),
      value: writtenData.break.time,
    };
  }
  if (writtenData.notes !== undefined) {
    output.notes = formatHelper.formatNotes(writtenData.notes);
  }
  if (writtenData.trackedTime !== undefined) {
    output.tracked = formatHelper.formatTracker(writtenData.trackedTime);
  }

  console.log(formatHelper.toTable(output));
};
