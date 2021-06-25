// 本地 https://appledaily-hk-appledaily-prod.cdn.arcpublishing.com/pf/api/v3/content/fetch/query-feed?query=%7B%22feedOffset%22%3A0%2C%22feedQuery%22%3A%22taxonomy.primary_section._id%3A%5C%22%252Fdaily%252Flocal%5C%22%2BAND%2Btype%3Astory%2BAND%2B(editor_note%3A%5C%2220210623%5C%22%2BOR%2Bdisplay_date%3A%5B2021-06-23T16%3A00%3A00Z%7C%7C-24h%2BTO%2B2021-06-23T16%3A00%3A00Z%5D)%22%2C%22feedSize%22%3A100%2C%22sort%22%3A%22location%3Aasc%22%7D&d=232&_website=hk-appledaily
// 國際 https://appledaily-hk-appledaily-prod.cdn.arcpublishing.com/pf/api/v3/content/fetch/query-feed?query=%7B%22feedOffset%22%3A0%2C%22feedQuery%22%3A%22(taxonomy.primary_section._id%3A%5C%22%2Fdaily%2Finternational%5C%22%2BOR%2Btaxonomy.primary_section._id%3A%5C%22%2Fdaily%2Fchina%5C%22)%2BAND%2Btype%3Astory%2BAND%2B(editor_note%3A%5C%2220210623%5C%22%2BOR%2Bdisplay_date%3A%5B2021-06-23T16%3A00%3A00Z%7C%7C-24h%2BTO%2B2021-06-23T16%3A00%3A00Z%5D)%22%2C%22feedSize%22%3A100%2C%22sort%22%3A%22location%3Aasc%22%7D&d=232&_website=hk-appledaily
// 娛樂 https://appledaily-hk-appledaily-prod.cdn.arcpublishing.com/pf/api/v3/content/fetch/query-feed?query=%7B%22feedOffset%22%3A0%2C%22feedQuery%22%3A%22taxonomy.primary_section._id%3A%5C%22%252Fdaily%252Fentertainment%5C%22%2BAND%2Btype%3Astory%2BAND%2B(editor_note%3A%5C%2220210623%5C%22%2BOR%2Bdisplay_date%3A%5B2021-06-23T16%3A00%3A00Z%7C%7C-24h%2BTO%2B2021-06-23T16%3A00%3A00Z%5D)%22%2C%22feedSize%22%3A100%2C%22sort%22%3A%22location%3Aasc%22%7D&d=232&_website=hk-appledaily
// 果籽 https://appledaily-hk-appledaily-prod.cdn.arcpublishing.com/pf/api/v3/content/fetch/query-feed?query=%7B%22feedOffset%22%3A0%2C%22feedQuery%22%3A%22taxonomy.primary_section.parent_id%3A%5C%22%252Fdaily%252Flifestyle%5C%22%2BAND%2Btype%3Astory%2BAND%2B(editor_note%3A%5C%2220210622%5C%22%2BOR%2Bdisplay_date%3A%5B2021-06-22T16%3A00%3A00Z%7C%7C-24h%2BTO%2B2021-06-22T16%3A00%3A00Z%5D)%22%2C%22feedSize%22%3A100%2C%22sort%22%3A%22location%3Aasc%22%7D&d=232&_website=hk-appledaily

const { default: axios } = require('axios');
const moment = require('moment');
const { existsSync, writeFile, appendToTextFile, log, delay } = require('./utils');

const ERROR_FILE = `./log/${moment().format('YYYYMMDD-HHmmss')}-error.log`;
const dateFormat = 'YYYY-MM-DD';
const eDateFormat = 'YYYYMMDD';

const categories = [
  'local',
  'international',
  'entertainment',
  'lifestyle',
  'china',
  'sports',
  'finance',
];
const errorPaths = categories.map((c) => `./log/${moment().format('YYYYMMDD')}-${c}-error.log`);

function fetchData(url) {
  return axios
    .get(url)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
}

function dataHandler(response, index, filePath, errorLabel) {
  if (response.status === 200) {
    writeFile(filePath, JSON.stringify(response.data, null, 2));
  } else {
    const message = `[${response.status}] ${errorLabel}`;
    // log(message);
    appendToTextFile(errorPaths[index], message);
  }
}

async function crawlFeed(date, index) {
  if (index >= categories.length || index < 0) {
    log(`Index: ${index}, cannot find category.`);
    return;
  }

  // startFrom date format = YYYY-MM-DD
  const normalDate = moment(date, dateFormat).format(dateFormat);
  const editorDate = moment(date, dateFormat).format(eDateFormat);

  const category = categories[index];
  const url = `https://appledaily-hk-appledaily-prod.cdn.arcpublishing.com/pf/api/v3/content/fetch/query-feed?query=%7B%22feedOffset%22%3A0%2C%22feedQuery%22%3A%22taxonomy.primary_section._id%3A%5C%22%252Fdaily%252F${category}%5C%22%2BAND%2Btype%3Astory%2BAND%2B(editor_note%3A%5C%22${editorDate}%5C%22%2BOR%2Bdisplay_date%3A%5B${normalDate}T16%3A00%3A00Z%7C%7C-24h%2BTO%2B${normalDate}T16%3A00%3A00Z%5D)%22%2C%22feedSize%22%3A100%2C%22sort%22%3A%22location%3Aasc%22%7D&d=232&_website=hk-appledaily`;

  const filePath = `./data/${category}/${normalDate}.json`;
  const errorLabel = `${normalDate}-${category}-${url}`;

  if (existsSync(filePath)) {
    // log(`File exist, skipped - ${filePath}`);
  } else {
    log(`Fetching ${normalDate}-${category}`);

    const result = await fetchData(url);
    dataHandler(result, index, filePath, errorLabel);
    await delay(100);
  }

  if (normalDate === '2000-01-01') {
    log('==============================================================');
    crawlFeed(process.argv[2], parseInt(process.argv[3]));
    return;
  }

  crawlFeed(moment(date, dateFormat).subtract(1, 'days').format(dateFormat), index);
}

crawlFeed(process.argv[2], parseInt(process.argv[3]));
