const fs = require('fs'),
  homedir = require('os').homedir();

/**
 * @param {{string}} formatName
 * @param {{string}}type
 * @return {{string}}
 */
module.exports.getSpecifiedFormat = (formatName, type = 'value') => {
  const configPath = homedir + '/.wib/config.json';
  let configContent = {};

  if (!fs.existsSync(configPath)) {
    return this.getDefaults()['format'][formatName][type];
  }

  configContent = fs.readFileSync(configPath);

  if (configContent.format !== undefined && configContent.format[formatName] !== undefined) {
    return configContent.format[formatName][type];
  }
};
/**
 *
 * @return {number}
 */
module.exports.getSpecifiedMinuteRounding = () => {
  const configPath = homedir + '/.wib/config.json';
  let configContent = {};

  if (!fs.existsSync(configPath)) {
    return this.getDefaults()['minuteRounding'];
  }

  configContent = fs.readFileSync(configPath);

  if (configContent.minuteRounding !== undefined && configContent.minuteRounding !== undefined) {
    return configContent.minuteRounding;
  }
};
/**
 * Possible values for day: {{date}}
 * Possible values for start|stop: {{time}}
 * Possible values for break|workDuration: {{time}}, {{duration}}
 * Possible values for note: {{id}}, {{key}}, {{time}}, {{value}}
 * Possible values for worklogs: {{id}}, {{time}}, {{value}}, {{duration}}
 *
 * @return {{ format: {}, minuteRounding: number }}
 */
module.exports.getDefaults = () => {
  return {
    'format': {
      'day': {
        'key': 'Report for date',
        'value': '{{date}}'
      },
      'start': {
        'key': 'Clocked in',
        'value': '{{time}}'
      },
      'stop': {
        'key': 'Clocked out',
        'value': '{{time}}'
      },
      'break': {
        'key': 'Break duration',
        'value': '{{duration}}m'
      },
      'workDuration': {
        'key': 'Worked time',
        'value': '{{duration}}m'
      },
      'note': {
        'key': 'Note({{id}}) [{{time}}]',
        'value': '{{value}}'
      },
      'worklog': {
        'key': 'Worklog({{id}}) [{{time}}]',
        'value': '{{duration}} {{key}} {{value}}'
      }
    },
    'minuteRounding': 5
  };
};
