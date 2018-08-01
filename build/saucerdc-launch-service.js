
class SauceRDCLaunchService {
    /**
     * modify config and launch sauce connect
     */
    onPrepare (config, capabilities) {
            config.protocol = 'https';
            config.port = '443';
            config.path = '/wd/hub';
            if (config.testobject_dc == 'eu') {
                config.host = 'eu1.appium.testobject.com';
            }
            else if (config.testobject_dc == 'us') {
                config.host = 'us1.appium.testobject.com';
            }
            else {
                console.log('Please specify a Data Center location - us or eu, defaulting to US');
                config.host = 'us1.appium.testobject.com';
            }
    
    }

}


exports.default = SauceRDCLaunchService;
module.exports = exports['default'];