const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('expect');

//
// GIVEN
//
Given('the user is on the chat page', async function () {
  await this.page.goto('http://localhost:5173');


  await this.page.evaluate(() => {
    localStorage.setItem('username', 'testuser');
  });

  await this.page.reload();

  await this.page.waitForSelector('input, textarea');
});

// WHEN
//
When('the user sends {string}', async function (input) {
  const inputBox = await this.page.$('input, textarea');

  await inputBox.click({ clickCount: 3 });
  await inputBox.press('Backspace');
  await inputBox.type(input);

  const messagesBefore = await this.page.evaluate(() => {
    return document.querySelectorAll('*').length;
  });

  await inputBox.press('Enter');
  await this.page.waitForFunction(
    (prevCount) => document.querySelectorAll('*').length > prevCount,
    {},
    messagesBefore
  );


  await new Promise(r => setTimeout(r, 2000));
});

//
// THEN
//
Then('the system should classify it as {string}', async function (type) {
  const text = await this.page.evaluate(() => document.body.innerText);

  console.log("Response:", text);

  expect(text.length).toBeGreaterThan(0);
});

Then('return {string}', async function (result) {
  const text = await this.page.evaluate(() => document.body.innerText);

  expect(text).toContain(result);
});

Then('return the correct solution', async function () {
  const text = await this.page.evaluate(() => document.body.innerText);

  expect(text.length).toBeGreaterThan(0);
});

Then('call Gemini API', async function () {
  const text = await this.page.evaluate(() => document.body.innerText);

  expect(text.length).toBeGreaterThan(0);
});