const dataHelper = require('../lib/data');
const {Command} = require('commander');

module.exports.commandSetup = () => {
  return new Command('track')
      .alias('t')
      .alias('wl')
      .alias('worklog')
      .description('Worklog handling')
      .option('-d, --delete', 'Delete specific worklog')
      .action(this.handle);
};
module.exports.handle = (args, options) => {
  const me = this;

  if (true === args.delete) {
    me.removeTimeTracker(options[0]);
  }

  me.createTimeTracker(options[0], options.slice(1).join(' '));
};
module.exports.createTimeTracker = (key, value) => {
  const writtenData = dataHelper.readData();

  if (writtenData.worklogs === undefined) {
    writtenData.worklogs = {};
  }

  const trackerAmount = Object.entries(writtenData.worklogs).length;

  writtenData.worklogs[0 < trackerAmount ? trackerAmount : 0] = {
    'key': key,
    'value': value,
    'time': new Date(Date.now())
  };

  dataHelper.writeData(JSON.stringify(writtenData));
};
module.exports.removeTimeTracker = (key) => {
  const writtenData = dataHelper.readData();

  if (writtenData.worklogs === undefined) {
    writtenData.worklogs = {};

    return;
  }

  writtenData.worklogs[key] = undefined;

  dataHelper.writeData(JSON.stringify(writtenData));
};
