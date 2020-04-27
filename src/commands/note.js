const dataHandler = require('../lib/data');
const {Command} = require('commander');

module.exports.commandSetup = () => {
  return new Command('note')
      .alias('n')
      .option('-d, --delete', 'Delete')
      .option('-e, --edit', 'Edit')
      .option('-l, --list', 'List')
      .option('-r, --read', 'Read')
      .action(this.handle);
};
module.exports.handle = (args, options, logger) => {
  const me = this;

  if (true === args.read) {
    this.readNote(options[0]);
    return;
  }

  if (true === args.list) {
    this.readNote();
    return;
  }

  if (true === args.delete) {
    this.deleteNote(options[0]);
      return;
  }

  if (true === args.edit) {
    this.editNote(options[0], options[1]);
    return;
  }

  for (key in options) {
    me.createNote(options[key]);
  }
};
module.exports.createNote = (message, key) => {
  const writtenData = dataHandler.readData();

  if (writtenData.notes === undefined) {
    writtenData.notes = {};
  }

  if (key === undefined) {
    const noteAmount = Object.entries(writtenData.notes).length;

    key = 0 < noteAmount ? noteAmount : 0;
  }

  writtenData.notes[key] = message;
  dataHandler.writeData(JSON.stringify(writtenData));
};
module.exports.editNote = (key, message) => {
  console.log(`Old value of note(${key}): ` + this.getNote(key));

  this.createNote(message, key);

  console.log(`New value of note(${key}): ` + this.getNote(key));
};
module.exports.deleteNote = (key) => {
  const writtenData = dataHandler.readData();

  if (writtenData.notes === undefined || writtenData.notes[key] === undefined) {
    return;
  }

  writtenData.notes[key] = undefined;

  console.log(`Note with key (${key}) deleted: ` + this.getNote(key));

  dataHandler.writeData(JSON.stringify(writtenData));
};
module.exports.readNote = () => {
  console.log(this.getNote());
};
module.exports.getNote = (key) => {
  const writtenData = dataHandler.readData();

  if (key === undefined) {
    return JSON.stringify(writtenData.notes);
  }

  return JSON.stringify(writtenData.notes[key]);
};
