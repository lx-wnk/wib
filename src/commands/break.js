const dataHelper = require('../lib/data');
const {Command} = require('commander');

module.exports.commandSetup = () => {
  return new Command('break')
      .alias('b')
      .description('lunchtime duration (in minutes)')
      .action(this.handle);
};
module.exports.handle = (args, options) => {
  const writtenData = dataHelper.readData(),
    specifiedDuration = Number.parseInt(options[0]);
  let breakDuration = 30;

  if (options !== undefined && Number.isSafeInteger(specifiedDuration)) {
    breakDuration = specifiedDuration;
  }

  writtenData.break = {
    duration: breakDuration,
    time: new Date(Date.now())
  };

  dataHelper.writeData(JSON.stringify(writtenData));

  console.log('Set break duration to: ' + writtenData.break.duration);
};
