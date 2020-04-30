const fs = require('fs');
const homedir = require('os').homedir();

/**
 *
 * @return {string}
 */
const getCurDate = () => {
  const today = new Date();
  return today.getFullYear() + '_' + String(today.getMonth() + 1).padStart(2, '0') +
        '_' + String(today.getDate()).padStart(2, '0');
};
/**
 *
 * @param {string }date
 * @return {string}
 */
const getFilePath = (date) => {
  if (date === undefined) {
    date = getCurDate();
  }

  return homedir + '/.eni/' + date + '.json';
};

/**
 * @param {string} filePath
 */
module.exports.createFile = (filePath = getFilePath()) => {
  if (!fs.existsSync(homedir + '/.eni')) {
    fs.mkdirSync(homedir + '/.eni');
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '{}');
  }
};
/**
 *
 * @param {string} data
 * @param {string} date
 */
module.exports.writeData = (data, date) => {
  const filePath = getFilePath(date);

  if (!fs.existsSync(filePath)) {
    this.createFile(filePath);
  }

  fs.writeFileSync(filePath, data);
};
/**
 *
 * @param {string} date
 * @return {Object}
 */
module.exports.readData = (date) => {
  const filePath = getFilePath(date);

  if (!fs.existsSync(filePath)) {
    this.createFile(filePath);
  }

  return JSON.parse(fs.readFileSync(filePath));
};
