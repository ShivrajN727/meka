const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('expect');



//
Then('the system should call the weather service', async function () {
  const text = await this.page.evaluate(() => document.body.innerText);

  console.log("Weather response:", text);

  expect(text.length).toBeGreaterThan(0);
});

Then('return weather information for {string}', async function (city) {
  const text = await this.page.evaluate(() => document.body.innerText);

  expect(text.toLowerCase()).toContain(city.toLowerCase());
});

Then('the system should extract {string}', async function (city) {
  const text = await this.page.evaluate(() => document.body.innerText);

  expect(text.toLowerCase()).toContain(city.toLowerCase());
});

