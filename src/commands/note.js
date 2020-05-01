const dataHelper = require('../lib/data');
const formatHelper = require('../lib/format');
const {Command} = require('commander');

module.exports.commandSetup = () => {
  return new Command('note')
      .alias('n')
      .description('Note handling')
      .option('-d, --delete', 'Delete')
      .option('-e, --edit', 'Edit')
      .action(this.handle);
};
module.exports.handle = (args, options) => {
  const me = this;

  if (true === args.delete) {
    this.deleteNote(options[0]);
    return;
  }

  if (true === args.edit) {
    this.editNote(options[0], options[1]);
    return;
  }

  me.createNote(options.join(' '));
};
module.exports.createNote = (value, key) => {
  const writtenData = dataHelper.readData();

  if (writtenData.notes === undefined) {
    writtenData.notes = {};
  }

  if (key === undefined) {
    const noteAmount = Object.entries(writtenData.notes).length;

    key = 0 < noteAmount ? noteAmount : 0;
  }

  writtenData.notes[key] = {
    'value': value,
    'time': Date.now()
  };

  dataHelper.writeData(JSON.stringify(writtenData));

  console.log(`Saved note(${key}): ` + formatHelper.applyFormat(this.getNote(key), 'note'));
};
module.exports.editNote = (key, value) => {
  console.log(`Old value of note(${key}): ` + formatHelper.applyFormat(this.getNote(key), 'note'));

  this.createNote(value, key);
};
module.exports.getNote = (key) => {
  const writtenData = dataHelper.readData();

  if (key === undefined) {
    return JSON.stringify(writtenData.notes);
  }

  return writtenData.notes[key];
};
