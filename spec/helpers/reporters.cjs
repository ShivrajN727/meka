const { SpecReporter } = require('jasmine-spec-reporter');

jasmine.getEnv().clearReporters();

jasmine.getEnv().addReporter(new SpecReporter({
  spec: {
    displaySuccessful: true,
    displayFailed: true,
    displayPending: true
  }
}));