const fs = require('fs');
const moment = require('moment');

const writeFile = (file, data) => {
  checkFolderExist(file);
  fs.writeFile(file, data, function (err) {
    if (err) {
      return console.log(err);
    }
    log(`${file} was saved!`);
  });
};
const appendToTextFile = (fileName, text) => {
  const logStream = fs.createWriteStream(fileName, { flags: 'a' });
  logStream.write(`[${getCurrentDateTime()}] ${text}\n`);
  logStream.close();
};

const getCurrentDateTime = (format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment().format(format);
};

const delay = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const log = (message) => {
  console.log(`[${getCurrentDateTime()}] ${message}`);
};

const existsSync = (path) => {
  return fs.existsSync(path);
};

const checkFolderExist = (path) => {
  let pathArray = path.split('/');
  pathArray.pop();
  const dir = pathArray.join('/');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }
};

module.exports = {
  getCurrentDateTime,
  appendToTextFile,
  writeFile,
  log,
  existsSync,
  delay,
};
