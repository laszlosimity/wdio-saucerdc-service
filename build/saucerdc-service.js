class SauceRDCService {

    onPrepare(config, capabilities) {

            console.log('In onPrepare');
            this.config.protocol = 'https';
            this.config.port = '443';
            this.config.path = '/wd/hub';
            if (config.testobject_dc == 'eu') {
                this.config.host = 'eu1.appium.testobject.com';
            }
            else if (config.testobject_dc == 'us') {
                this.config.host = 'us1.appium.testobject.com';
            }
            else {
                console.log('Please specify a Data Center location - us or eu, defaulting to US');
                this.config.host = 'us1.appium.testobject.com';
            }
    
    }
    
    getSauceRDCRestUrl(sessionId) {
            return 'https://app.testobject.com/api/rest/v2/appium/session/' + sessionId + '/test';
    }

    before(capabilities) {
        this.sessionId = global.browser.sessionId;
        this.capabilities = capabilities;
        this.auth = global.browser.requestHandler.auth || {};
        this.testCnt = 0;
        this.failures = 0; // counts failures between reloads
        console.log('in before');
    }

    afterSuite(suite) {
        if (suite.hasOwnProperty('err')) {
        ++this.failures;
        }
    }

    afterTest(test) {
        if (!test.passed) {
        ++this.failures;
        }
    }

    afterStep(feature) {
            if (
            /**
             * Cucumber v1
             */
            feature.failureException ||
            /**
             * Cucumber v2
             */
            typeof feature.getFailureException === 'function' && feature.getFailureException()) {
                ++this.failures;
            }
    }

    after(result, capabilities, specs) {
        console.log('in after');
            return this.updateJob(this.sessionId, this.failures);
    }

    updateJob(sessionId, failures) {
           var resultToSend = true;

        if (failures > 0) //failed
        { 
            resultToSend = false;
        }

        var request = require('request');
        var theUri = this.getSauceRDCRestUrl(this.sessionId);

        var options = {
            json: true,
            url: theUri,
            method: 'PUT',
            body: { "passed": resultToSend }
        }
 
        function callback(error, response, body) {
            //nothing at the moment 
        }
 
       request(options, callback);
    }

    getBody(failures) {
            var body = {};

            body.passed = failures === 0;
            return body;
    }
}

exports.default = SauceRDCService;
module.exports = exports['default'];