const dataHandler = require('../lib/data');
const {Command} = require('commander');

module.exports.commandSetup = () => {
  return new Command('start')
      .alias('hi')
      .description('Save the current time as start time')
      .action(this.handle);
};
module.exports.handle = (args, options, logger) => {
  const writtenData = dataHandler.readData();

  writtenData.start = Date.now();

  dataHandler.writeData(JSON.stringify(writtenData));
};
