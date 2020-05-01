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
module.exports.handle = () => {
  const writtenData = dataHelper.readData(), output = {};

  if (writtenData.start !== undefined) {
    output[0] = {
      key: formatHelper.applyFormat({'date': writtenData.start.time}, 'day', 'key'),
      value: formatHelper.applyFormat({'date': writtenData.start.time}, 'day'),
    };
    output[1] = {
      key: formatHelper.applyFormat(writtenData.start, 'start', 'key'),
      value: formatHelper.applyFormat(writtenData.start, 'start'),
    };
  }
  if (writtenData.stop !== undefined) {
    output[3] = {
      key: formatHelper.applyFormat(writtenData.stop, 'stop', 'key'),
      value: formatHelper.applyFormat(writtenData.stop, 'stop'),
    };
  }
  if (writtenData.break !== undefined) {
    output[2] = {
      key: formatHelper.applyFormat(writtenData.break, 'break', 'key'),
      value: formatHelper.applyFormat(writtenData.break, 'break'),
    };
  }
  if (writtenData.start !== undefined) {
    let passedTime = 0,
      stopTime = new Date(Date.now());
    if (writtenData.stop !== undefined) {
      stopTime = new Date(writtenData.stop.time);
    }
    passedTime = stopTime.getTime() - (new Date(writtenData.start.time)).getTime();

    if (writtenData.break !== undefined) {
      passedTime -= (new Date(writtenData.break.duration)).getTime();
    }
    output[4] = {
      key: formatHelper.applyFormat({duration: passedTime}, 'workDuration', 'key'),
      value: formatHelper.applyFormat({
        duration: formatHelper.formatTime(passedTime, 'duration', false),
        time: passedTime
      }, 'workDuration'),
    };
  }
  if (writtenData.notes !== undefined) {
    output.notes = formatHelper.formatNotes(writtenData.notes);
  }
  if (writtenData.worklogs !== undefined) {
    if (writtenData.start === undefined) {
      output.tracked = formatHelper.formatTracker(writtenData.worklogs);
    } else {
      output.tracked = formatHelper.formatTracker(writtenData.worklogs, writtenData.start.time);
    }
  }

  console.log(formatHelper.toTable(output));
};
