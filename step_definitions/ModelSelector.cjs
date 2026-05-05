const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('expect');


//
Then('the selected model should be {string}', async function (model) {
  await this.page.waitForSelector('.top-center select');

  const selectedText = await this.page.$eval(
    '.top-center select',
    el => el.options[el.selectedIndex].textContent
  );

  expect(selectedText.toLowerCase()).toContain(model.toLowerCase());
});

//

//
Then('no model is explicitly selected', async function () {
  await this.page.waitForSelector('.top-center select');

  const selectedText = await this.page.$eval(
    '.top-center select',
    el => el.options[el.selectedIndex].textContent
  );

  // 👉 这里假设默认不是 "gemini"
  expect(selectedText.toLowerCase()).not.toContain('gemini');
});

When('the user selects {string}', async function (model) {
  this.model = model;

  // 1️⃣ 等下拉框出现
  await this.page.waitForSelector('.top-center select');

  // 2️⃣ 点击下拉框（打开）
  await this.page.click('.top-center select');

  // 3️⃣ 找到匹配的 option
  const options = await this.page.$$('.top-center select option');

  let found = false;

  for (const option of options) {
    const text = await this.page.evaluate(el => el.textContent, option);

    if (text.toLowerCase().includes(model.toLowerCase())) {
      const value = await this.page.evaluate(el => el.value, option);

      // ⚠️ Puppeteer不能直接点 option → 用 keyboard / select
      await this.page.select('.top-center select', value);

      found = true;
      break;
    }
  }

  if (!found) {
    throw new Error('Model not found: ' + model);
  }

  // 4️⃣ 等 UI 更新
  await new Promise(r => setTimeout(r, 300));
});

//
// THEN
//
Then('a response should be returned', async function () {

  await this.page.waitForFunction(
    () =>
      document.body.innerText.includes('AI:') ||
      document.body.innerText.includes('You:'),
    { timeout: 5000 }
  );

  const text = await this.page.evaluate(() => document.body.innerText);

  expect(text).toBeTruthy();
});