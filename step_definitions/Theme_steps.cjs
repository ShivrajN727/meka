const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('expect');

Given('I am on the landing page', async function () {
  await this.page.goto('http://localhost:5173');
  await this.page.waitForSelector('button');
});

Given('the theme is dark', async function () {
  const buttons = await this.page.$$('button');

  for (const button of buttons) {
    const text = await this.page.evaluate(el => el.textContent, button);
    if (text.includes('Light')) {
      return; // already dark
    }
  }

  const themeButton = buttons[buttons.length - 2];
  await themeButton.click();
  await new Promise(r => setTimeout(r, 200));
});

When('I click the theme toggle button', async function () {
  const buttons = await this.page.$$('button');
  const themeButton = buttons[buttons.length - 2];

  await themeButton.click();
  await new Promise(r => setTimeout(r, 200));
});

When('I click the theme toggle button twice', async function () {
  const buttons = await this.page.$$('button');
  const themeButton = buttons[buttons.length - 2];

  await themeButton.click();
  await new Promise(r => setTimeout(r, 150));
  await themeButton.click();
  await new Promise(r => setTimeout(r, 150));
});

Then('the theme should be light', async function () {
  const buttons = await this.page.$$('button');

  let isLight = false;
  for (const button of buttons) {
    const text = await this.page.evaluate(el => el.textContent, button);
    if (text.includes('Dark')) {
      isLight = true;
    }
  }

  expect(isLight).toBe(true);
});

Then('the theme should be dark', async function () {
  const buttons = await this.page.$$('button');

  let isDark = false;
  for (const button of buttons) {
    const text = await this.page.evaluate(el => el.textContent, button);
    if (text.includes('Light')) {
      isDark = true;
    }
  }

  expect(isDark).toBe(true);
});