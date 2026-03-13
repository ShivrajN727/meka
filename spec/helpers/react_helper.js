const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// Set up a fake environment
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

const { screen } = require('@testing-library/react');
global.screen = screen;

require('@testing-library/jest-dom');