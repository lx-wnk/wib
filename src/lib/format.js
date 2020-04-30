const fs = require('fs');
const homedir = require('os').homedir();
/**
 * Possible values for day: {{date}}
 * Possible values for start|stop|break: {{time}}
 * Possible values for note: {{id}}, {{key}}, {{time}}, {{value}}
 * Possible values for track: {{id}}, {{time}}, {{value}}
 */
const defaultFormat = {
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
    'key': 'Break duration'
  },
  'note': {
    'key': 'Note({{id}}) [{{time}}]',
    'value': '{{value}}'
  },
  'tracker': {
    'key': 'Track({{id}}) [{{time}}]',
    'value': '{{key}} {{value}}'
  }
};

/**
 * @param {{string}} formatName
 * @param {{string}}type
 * @return {{string}}
 */
const getSpecifiedFormat = (formatName, type = 'value') => {
  const configPath = homedir + '/.wib/config.json';
  let configContent = {};

  if (!fs.existsSync(configPath)) {
    return defaultFormat[formatName][type];
  }

  configContent = fs.readFileSync(configPath);

  if (configContent.format !== undefined && configContent.format[formatName] !== undefined) {
    return configContent.format[formatName][type];
  }
};
/**
 * @param {{string}} data
 * @return {{Object}}
 */
const getLongestElements = (data) => {
  let longestKey = 0, longestValue = 0;

  Object.values(data).forEach((row) => {
    let curKeyLength = 0, curValLength = 0;

    if (Array.isArray(row) && 0 < row.length) {
      const tmp = getLongestElements(row);
      curKeyLength = tmp.key;
      curValLength = tmp.value;
    } else if (row !== undefined) {
      curKeyLength = row.key.toString().length;
      curValLength = row.value.toString().length;
    }

    if (curKeyLength > longestKey) {
      longestKey = curKeyLength;
    }

    if (curValLength > longestValue) {
      longestValue = curValLength;
    }
  });

  longestKey++;
  longestValue++;

  return {
    key: longestKey,
    value: longestValue
  };
};

/**
 * @param {{Object}} dataObject
 * @param {{string}} formatName
 * @param {{string}}type
 * @return {{string}}
 */
module.exports.applyFormat = (dataObject, formatName, type = 'value') => {
  const me = this;
  let specifiedFormat = getSpecifiedFormat(formatName, type);

  if (specifiedFormat === undefined || dataObject === undefined) {
    console.log('INVALID FORMAT: ' + formatName);
    return '';
  }

  Object.keys(dataObject).forEach((keyName) => {
    let replaceVal = dataObject[keyName];

    if (replaceVal !== undefined) {
      if ('time' === keyName) {
        replaceVal = me.formatTime(replaceVal);
      }
      if ('date' === keyName) {
        replaceVal = me.formatTime(replaceVal, 'date');
      }

      specifiedFormat = specifiedFormat.split('{{'+keyName+'}}').join(replaceVal);
    }
  });

  return specifiedFormat;
};
module.exports.formatNotes = (notes) => {
  const me = this, formattedResult = [];

  if (!notes || 1 > Object.entries(notes).length) {
    return;
  }

  Object.entries(notes).forEach(([id, value]) => {
    value.id = id;
    formattedResult.push({
      key: me.applyFormat(value, 'note', 'key'),
      value: me.applyFormat(value, 'note'),
    });
  });

  return formattedResult;
};
module.exports.formatTracker = (tracker) => {
  const me = this, formattedResult = [];

  if (!tracker || 1 > Object.entries(tracker).length) {
    return;
  }

  Object.entries(tracker).forEach(([id, value]) => {
    value.id = id;
    formattedResult.push({
      key: me.applyFormat(value, 'tracker', 'key'),
      value: me.applyFormat(value, 'tracker', 'value'),
    });
  });

  return formattedResult;
};
module.exports.formatTime = (time, formatType) => {
  const dateObject = new Date(time);

  if ('date' === formatType) {
    return dateObject.getFullYear() + '-' + dateObject.getMonth() + '-' + dateObject.getDate();
  }

  return dateObject.getHours() + ':' + dateObject.getMinutes();
};
module.exports.toTable = (data, colLength = getLongestElements(data), isSub = false) => {
  const me = this;
  let output = '',
    loopAmount = Object.values(data).length +1;

  if (isSub) {
    loopAmount--;
  }

  for (let a = 0; a < loopAmount; a++) {
    const curObject = Object.values(data)[a];
    if (/** (isSub && a !== 0) ||**/ !isSub) {
      for (let b = 0; b < colLength.key + colLength.value + 5; b++) {
        output += '-';
      }
    }

    if (curObject !== undefined) {
      if (Array.isArray(curObject) && 0 < curObject.length) {
        output += me.toTable(curObject, colLength, true);
      } else {
        const curKey = curObject.key;
        const curVal = curObject.value;

        output += '\n| ' + curKey;
        output += ' '.repeat(colLength.key - curKey.toString().length);
        output += '| ' + curVal;
        output += ' '.repeat(colLength.value - curVal.toString().length) + '|';
      }
    }
    if (a+1 !== loopAmount && !isSub) {
      output += '\n';
    }
  }

  return output;
};
