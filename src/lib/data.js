const fs = require('fs');
const homedir = require('os').homedir();

const getCurDate = () => {
    const today = new Date();
    return today.getFullYear() + '_' + String(today.getMonth() + 1).padStart(2, '0') +
        '_' + String(today.getDate()).padStart(2, '0');
}

const getFilePath = (date) => {
    if (date === undefined) {
        date = getCurDate();
    }

    return homedir + '/.tracker/' + date + '.json';
}

module.exports.createFile = (filePath = getFilePath()) => {
    if (!fs.existsSync(homedir + '/.tracker')) {
        fs.mkdirSync(homedir + '/.tracker');
    }

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '{}');
    }
};
module.exports.writeData = (data, date) => {
    const filePath = getFilePath(date);

    if (!fs.existsSync(filePath)) {
        this.createFile(filePath);
    }

    fs.writeFileSync(filePath, data);
};
module.exports.readData = (date) => {
    const filePath = getFilePath(date);

    if (!fs.existsSync(filePath)) {
        this.createFile(filePath);
    }

    return JSON.parse(fs.readFileSync(filePath));
};
