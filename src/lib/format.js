const fs = require('fs');
const homedir = require('os').homedir();
const defaultFormat = {
  'note': '[{{id}}] {{time}} \t\t {{value}}\n',
  'tracker': '[{{id}}] {{time}} \t\t {{key}} {{message}}\n'
};

const getSpecifiedFormat = (formatName) => {
  const configPath = homedir + '/.eni/config.json';
  let configContent = {};

  if (!fs.existsSync(configPath)) {
    return defaultFormat[formatName];
  }

  configContent = fs.readFileSync(configPath);

  if (configContent.format !== undefined && configContent.format[formatName] !== undefined) {
    return configContent.format[formatName];
  }
};

module.exports.formatNotes = (notes) => {
  const specifiedFormat = getSpecifiedFormat('note'),
    me = this;
  let formattedResult = '';

  formattedResult += '---------------------\n';
  formattedResult += '### NOTES\n';
  Object.entries(notes).forEach(([key, value]) => {
    formattedResult += '---------------------\n';
    formattedResult += specifiedFormat
        .split('{{id}}').join(key)
        .split('{{time}}').join(me.formatTime(value.time))
        .split('{{value}}').join(value.message);
  });
  formattedResult += '---------------------\n';

  return formattedResult;
};
module.exports.formatTracker = (tracker) => {
  const me = this;
  const specifiedFormat = getSpecifiedFormat('tracker');
  let formattedResult = '';

  formattedResult += '---------------------\n';
  formattedResult += '### Worklogs\n';
  Object.entries(tracker).forEach(([key, value]) => {
    formattedResult += '---------------------\n';
    formattedResult += specifiedFormat
        .split('{{id}}').join(key)
        .split('{{time}}').join(me.formatTime(value.time))
        .split('{{key}}').join(value.key)
        .split('{{message}}').join(value.message);
  });
  formattedResult += '---------------------\n';

  return formattedResult;
};
module.exports.formatTime = (time, formatType) => {
  const dateObject = new Date(time);

  if ('date' === formatType) {
    return dateObject.getDate();
  }

  return dateObject.getHours() + ':' + dateObject.getMinutes();
};
