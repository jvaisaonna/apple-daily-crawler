const fs = require('fs');
const moment = require('moment');
const { fileURLToPath } = require('url');
const { dirname } = require('path');

const FILE_DATE_TIME_FORMAT = 'YYMMDDTHHmm';

const getFilenameAndDirname = (absolutePath) => {
  // absolute path = import.meta.url
  const __filename = fileURLToPath(absolutePath);
  const __dirname = dirname(__filename);

  return { __filename, __dirname };
};

const readdirSync = (folderPath) => {
  return fs.readdirSync(folderPath);
};

const readFileSync = (filePath) => {
  return fs.readFileSync(filePath);
};

const writeFile = (file, data) => {
  checkFolderExist(file);
  fs.writeFile(file, data, function (err) {
    if (err) {
      return console.log(err);
    }
    log(`${file} was saved!`);
  });
};

const writeFileSync = (file, data) => {
  checkFolderExist(file);
  fs.writeFileSync(file, data);
  console.log(`${file} was saved!`);
};

const appendToTextFile = (fileName, text) => {
  const logStream = fs.createWriteStream(fileName, { flags: 'a' });
  logStream.write(`[${getCurrentDateTime()}] ${text}\n`);
  logStream.close();
};

const getCurrentDateTime = (format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment().format(format);
};

const getCurrentTimestamp = () => {
  return moment().unix();
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
