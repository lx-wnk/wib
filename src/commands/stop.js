const dataHandler = require('../lib/data');
const {Command} = require('commander');

module.exports.commandSetup = () => {
  return new Command('stop')
      .alias('bye')
      .description('Save the current time as stop time')
      .action(this.handle);
};
module.exports.handle = (args, options, logger) => {
  const writtenData = dataHandler.readData();

  writtenData.stop = Date.now();

  dataHandler.writeData(JSON.stringify(writtenData));
};
