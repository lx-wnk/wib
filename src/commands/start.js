const dataHelper = require('../lib/data');
const formatHelper = require('../lib/format');
const {Command} = require('commander');

module.exports.commandSetup = () => {
  return new Command('start')
      .alias('hi')
      .description('Save the current time as start time')
      .action(this.handle);
};
module.exports.handle = (args, options) => {
  const writtenData = dataHelper.readData();
  const startTime = new Date(Date.now());

  if (options !== undefined && options[0].includes(':')) {
    startTime.setHours(options[0].split(':')[0]);
    startTime.setMinutes(options[0].split(':')[1]);
  }

  writtenData.start = {
    time: startTime
  };

  dataHelper.writeData(JSON.stringify(writtenData));

  console.log('Clocked in at: ' + formatHelper.formatTime(writtenData.start.time));
};
