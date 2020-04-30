const dataHelper = require('../lib/data');
const {Command} = require('commander');

module.exports.commandSetup = () => {
  return new Command('break')
      .alias('b')
      .description('lunchtime duration')
      .action(this.handle);
};
module.exports.handle = (args, options, logger) => {
  const writtenData = dataHelper.readData(),
    specifiedDuration = Number.parseInt(options[0]);
  let breakDuration = 30;

  if (options !== undefined && Number.isSafeInteger(specifiedDuration)) {
    breakDuration = specifiedDuration;
  }

  writtenData.break = {
    time: breakDuration
  };

  dataHelper.writeData(JSON.stringify(writtenData));

  console.log('Set break duration to: ' + writtenData.break.time);
};
