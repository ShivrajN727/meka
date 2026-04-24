// Mock CSS imports
const Module = require('module');
if (!Module._extensions['.css']) {
  Module._extensions['.css'] = function(module, filename) {
    module.exports = {};
  };
}

// Register Babel to transpile JSX and ES modules to CommonJS
require('@babel/register')({
  presets: [
    ['@babel/preset-env', { modules: 'commonjs' }],
    '@babel/preset-react'
  ],
  extensions: ['.js', '.jsx', '.cjs']
});

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// ===== ADD THIS BLOCK =====
// Polyfill fetch for tests (jsdom doesn't provide it)
const fetch = require('node-fetch');
global.window.fetch = fetch;
global.fetch = fetch;
// ==========================

// Make React Testing Library's screen available globally (optional)
const { screen } = require('@testing-library/react');
global.screen = screen;