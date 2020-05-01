const dataHelper = require('../lib/data');
const formatHelper = require('../lib/format');
const {Command} = require('commander');

module.exports.commandSetup = () => {
  return new Command('stop')
      .alias('bye')
      .description('Save the current time as stop time')
      .action(this.handle);
};
module.exports.handle = (args, options) => {
  const writtenData = dataHelper.readData();
  const startTime = new Date(Date.now());

  if (options !== undefined && options[0].includes(':')) {
    startTime.setHours(options[0].split(':')[0]);
    startTime.setMinutes(options[0].split(':')[1]);
  }

  writtenData.stop = {
    time: startTime
  };

  dataHelper.writeData(JSON.stringify(writtenData));
  console.log('Clocked out at: ' + formatHelper.formatTime(writtenData.stop.time));
};
