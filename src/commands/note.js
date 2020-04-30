const dataHelper = require('../lib/data');
const {Command} = require('commander');

module.exports.commandSetup = () => {
  return new Command('note')
      .alias('n')
      .description('Note handling')
      .option('-d, --delete', 'Delete')
      .option('-e, --edit', 'Edit')
      .action(this.handle);
};
module.exports.handle = (args, options, logger) => {
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

  console.log(`Saved note(${key}): ` + value);

  dataHelper.writeData(JSON.stringify(writtenData));
};
module.exports.editNote = (key, value) => {
  console.log(`Old value of note(${key}): ` + this.getNote(key));

  this.createNote(value, key);

  console.log(`New value of note(${key}): ` + this.getNote(key));
};
module.exports.deleteNote = (deleteKey) => {
  const writtenData = dataHelper.readData(),
    deletedNote = writtenData.notes[deleteKey];

  if (writtenData.notes === undefined || deletedNote === undefined) {
    return;
  }

  writtenData.notes[deleteKey] = undefined;

  console.log(`Note with key (${deleteKey}) deleted: ` + deletedNote.value);

  dataHelper.writeData(JSON.stringify(writtenData));
};
module.exports.readNote = () => {
  console.log(this.getNote());
};
module.exports.getNote = (key) => {
  const writtenData = dataHelper.readData();

  if (key === undefined) {
    return JSON.stringify(writtenData.notes);
  }

  return JSON.stringify(writtenData.notes[key]);
};
