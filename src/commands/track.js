const dataHandler = require('../lib/data');
const {Command} = require('commander');

module.exports.commandSetup = () => {
  return new Command('track')
      .alias('t')
      .description('Time tracker handling')
      .option('-d, --delete', 'Delete specific tracker')
      .action(this.handle);
};
module.exports.handle = (args, options, logger) => {
  const me = this;

  if (true === args.delete) {
    me.removeTimeTracker(options[0]);
  }

  me.createTimeTracker(options[0], options.slice(1).join(' '));
};
module.exports.createTimeTracker = (key, message) => {
  const writtenData = dataHandler.readData();

  if (writtenData.trackedTime === undefined) {
    writtenData.trackedTime = {};
  }

  const trackerAmount = Object.entries(writtenData.trackedTime).length;

  writtenData.trackedTime[0 < trackerAmount ? trackerAmount : 0] = {
    'key': key,
    'message': message,
    'time': Date.now()
  };

  dataHandler.writeData(JSON.stringify(writtenData));
};
module.exports.removeTimeTracker = (key) => {
  const writtenData = dataHandler.readData();

  if (writtenData.trackedTime === undefined) {
    writtenData.trackedTime = {};

    return;
  }

  writtenData.trackedTime[key] = undefined;
  // TODO reorder tracked times

  dataHandler.writeData(JSON.stringify(writtenData));
};
