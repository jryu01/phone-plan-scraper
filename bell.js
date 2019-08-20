const XLSX = require('xlsx');

const bellBaseLink = 'https://www.bell.ca/Mobility/Products/';
const bellPhones = [
  'iPhone-XS-Max',
  'iPhone-XS',
  'iPhone-XR',
  'iPhone-10',
  'Apple-iPhone-8-Plus',
  'Apple-iPhone-8',

  'Samsung-Galaxy-S10-Plus',
  'Samsung-Galaxy-S10',
  'Samsung-Galaxy-S10e',
  'Samsung-Galaxy-S9',
];

const availablePlans = [
  '2-year Premium Plus plan-with Pay Less Upfront †',
  '2-year Premium Plus plan',
  '2-year Premium plan',
  '2-year Smartphone plan', 
  'No term',
];

const getPlans = () => {
  const plans = Array
    .from(document.querySelectorAll('.bcx-order-now-box-body p.rsx-txt-size-18'))
    .map(el => el.innerText);
  const prices = Array
    .from(document.querySelectorAll('.bcx-order-now-box-body .bcx-product-price-group1 .rsx-price'))
    .map(el => el.innerText);
  const planPrices = {};
  Array.from(plans).forEach((plan, index) => {
    // replace newline with '-'
    const planName = plan.replace('\n', '-').trim();
    planPrices[planName] = prices[index];
  });
  return planPrices;
};

const output = (bellPhones, phonePlans) => {
  console.log('-------- Creating Excel Output ----------')
  const workbook = XLSX.utils.book_new();

  const workSheetData = [];

  const heading = ['Phone', ...availablePlans]
  console.log(heading);
  workSheetData.push(heading);

  phonePlans.forEach((phonePlan, index) => {
    const phone = bellPhones[index];
    const prices = availablePlans.map(plan => {
      const price = phonePlan[plan] || 'N/A';
      return price;
    });
    const priceInfo = [phone, ...prices]
    workSheetData.push(priceInfo);
    console.log(priceInfo)
  });
  console.log(workSheetData);
  const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);

  /* Add the worksheet to the workbook */
  XLSX.utils.book_append_sheet(workbook, workSheet, 'Bell Plans');
  XLSX.writeFile(workbook, 'bell.xlsx');
}

module.exports = async (browser) => {
  const page = await browser.newPage();

  const phonePlans = [];
  for (let phone of bellPhones) {
    const link = bellBaseLink + phone;
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
    await page.goto(link);
    const plans = await page.evaluate(getPlans);
    console.log('Getting plans info for:', phone);
    console.log(plans);
    phonePlans.push(plans);
  }
  output(bellPhones, phonePlans);

  await browser.close();
}