const dataHandler = require('../lib/data');
const {Command} = require('commander');

module.exports.commandSetup = () => {
  return new Command('track')
      .alias('t')
      .option('-t, --time', 'Specify tracker')
      .option('-r, --read', 'Read specific tracker')
      .option('-l, --list', 'List all tracker')
      .action(this.handle);
};
module.exports.handle = (args, options, logger) => {
    const me = this;

    if (true === args.read) {
        console.log(this.getTracker(options[0]));
        return;
    }

    if (true === args.list) {
        console.log(this.getTracker());
        return;
    }

    //TODO implement time specific

    me.createTimeTracker(options[0], options[1]);
};

module.exports.createTimeTracker = (key, message) => {
  const writtenData = dataHandler.readData();

  if (writtenData.trackedTime === undefined) {
    writtenData.trackedTime = {};
  }

  writtenData.trackedTime[key] = message;

  dataHandler.writeData(JSON.stringify(writtenData));
};
module.exports.readAllTracker = () => {
    console.log(this.getTracker());
};
module.exports.getTracker = (key) => {
    const writtenData = dataHandler.readData();

    if (key === undefined) {
        return JSON.stringify(writtenData.notes);
    }

    return JSON.stringify(writtenData.notes[key]);
};
