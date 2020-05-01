const dataHelper = require('./data'),
  configHelper = require('./config');

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
  let specifiedFormat = configHelper.getSpecifiedFormat(formatName, type);

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
/**
 *
 * @param {Object} notes
 * @return {[]}
 */
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
/**
 *
 * @param {Object} worklogs
 * @param {Date|null} startTime
 * @return {[]}
 */
module.exports.formatTracker = (worklogs, startTime) => {
  const me = this, formattedResult = [], writtenData = dataHelper.readData();
  let latestTimeObject = undefined;

  if (!worklogs || 1 > Object.entries(worklogs).length) {
    return;
  }

  if (writtenData.start !== undefined && writtenData.start.time !== undefined) {
    latestTimeObject = new Date(writtenData.start.time);
  }

  Object.entries(worklogs).forEach(([id, value]) => {
    const curTimeObject = new Date(value.time);
    value.id = id;

    if (writtenData.start !== undefined && writtenData.start.time !== undefined &&
        writtenData.break !== undefined && writtenData.break.time !== undefined &&
        latestTimeObject.getTime() <= (new Date(writtenData.break.time)).getTime() &&
        curTimeObject.getTime() >= (new Date(writtenData.break.time)).getTime()) {
      latestTimeObject = new Date(writtenData.break.time);
    }

    if (latestTimeObject !== undefined && value.duration === undefined) {
      const timeBetween = new Date(Math.abs(latestTimeObject.getTime() - curTimeObject.getTime()));
      value.duration = me.formatTime(timeBetween, 'duration');
      latestTimeObject = curTimeObject;
    }

    formattedResult.push({
      key: me.applyFormat(value, 'worklog', 'key'),
      value: me.applyFormat(value, 'worklog', 'value'),
    });
  });

  return formattedResult;
};
/**
 *
 * @param {Date|string} time
 * @param {string|null} formatType
 * @param {bool} round
 * @return {string}
 */
module.exports.formatTime = (time, formatType, round = true) => {
  const dateObject = new Date(time);

  if ('date' === formatType) {
    return dateObject.getFullYear() + '-' + dateObject.getMonth() + '-' + dateObject.getDate();
  }

  if ('duration' === formatType) {
    let formattedDuration = '';

    dateObject.setSeconds(60);

    if (0 < dateObject.getUTCHours()) {
      formattedDuration += dateObject.getUTCHours() + 'h';
    }
    if (0 < dateObject.getUTCHours() && 0 < dateObject.getUTCMinutes()) {
      formattedDuration += ' ';
    }
    if (0 < dateObject.getUTCMinutes()) {
      if (round) {
        formattedDuration += Math.ceil(dateObject.getUTCMinutes()/configHelper.getSpecifiedMinuteRounding())*
            configHelper.getSpecifiedMinuteRounding();
      } else {
        formattedDuration += dateObject.getUTCMinutes();
      }
    }

    return formattedDuration;
  }

  return dateObject.getHours() + ':' + dateObject.getMinutes();
};
/**
 *
 * @param {Object} data
 * @param {{longestKey: int, longestVal: int}} colLength
 * @param {bool} isSub
 * @return {string}
 */
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
