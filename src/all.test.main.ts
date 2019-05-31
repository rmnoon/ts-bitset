const jsr = require('jasmine-spec-reporter') as any;

(jasmine.getEnv() as any).clearReporters();               // remove default reporter logs
jasmine.getEnv().addReporter(new jsr.SpecReporter({  // add jasmine-spec-reporter
    spec: {
        displayPending: true,
        displayErrorMessages: true,
        displayStacktrace: true,
        displayDuration: true
    }
}));

// get all the files, for each file, call the context function
// that will require the file and load it up here. Context will
// loop and require those spec files here
const appContext = require.context('..', true, /\.spec\.ts$/);
appContext.keys().forEach(appContext);
