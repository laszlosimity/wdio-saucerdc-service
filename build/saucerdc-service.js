class SauceRDCService {
    
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

    after() {
        if (!this.sauceUser || !this.sauceKey) {
            return;
        }

        console.log('in after');
        return this.updateJob(this.sessionId, this.failures);
    }

    updateJob(sessionId, failures) {
            console.log('in updateJob');
            var _this = this;

            var calledOnReload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            return new Promise(function (resolve, reject) {
                return _request2.default.put(_this.getSauceRestUrl(sessionId), {
                    json: true,
                    body: _this.getBody(failures, calledOnReload)
                }, function (e, res, body) {
                    if (e) {
                        return reject(e);
                    }
                    global.browser.jobData = body;
                    _this.failures = 0;
                    resolve(body);
                });
            });
    }

    getBody(failures) {
            var body = {};

            body.passed = failures === 0;
            return body;
    }
}
