const puppeteer = require('puppeteer')
const bell = require('./bell');

(async () => {
  const browser = await puppeteer.launch();
  await bell(browser);
})();