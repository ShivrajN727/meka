import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: false
});

const page = await browser.newPage();

//automatically deal with dialog alert
page.on('dialog', async dialog => {
  console.log(dialog.message());
  await dialog.accept();
});

await page.goto("http://localhost:5173");

console.log("Page opened");

// registration
await page.click(".account-icon");

// random username
const username = "user"+Date.now();
const password = "123456";

console.log("Registering user:", username);

// user name
await page.type('input[placeholder="Username"]', username);

//password
await page.type('input[placeholder="Password"]', password);

// Create Account
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")]
    .find(b => b.textContent.includes("Create Account"));
  btn.click();
});

await page.waitForTimeout(2000);


// input username and password
await page.type('input[placeholder="Username"]', username);
await page.type('input[placeholder="Password"]', password);

//  Log In
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")]
    .find(b => b.textContent.includes("Log In"));
  btn.click();
});

await page.waitForTimeout(3000);

console.log("Login test finished");

await browser.close();
