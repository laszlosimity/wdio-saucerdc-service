
var sauceConnectLauncher = require('sauce-connect-launcher');

class SauceRDCLaunchService {
    /**
     * modify config and launch sauce connect
     */
    onPrepare (config, capabilities) {
            var sauceConnectRestURL;

            config.protocol = 'https';
            config.port = '443';
            config.path = '/wd/hub';
            if (config.testobject_dc == 'eu') {
                config.host = 'eu1.appium.testobject.com';
                sauceConnectRestURL = 'https://eu1.api.testobject.com/sc/rest/v1';
            }
            else if (config.testobject_dc == 'us') {
                config.host = 'us1.appium.testobject.com';
                sauceConnectRestURL = 'https://us1.api.testobject.com/sc/rest/v1';
            }
            else {
                console.log('Please specify a Data Center location - us or eu, defaulting to US');
                config.host = 'us1.appium.testobject.com';
            }

            if (config.sauceConnect) {

                if (!config.sauceConnectUser || !config.sauceConnectAPIKey) {
                    //we have a problem
                    console.log("You must specify a sauceConnectUser and a sauceConnectAPIKey to start a sauce connect tunnel! Test might be attempted after this message")
                    return;
                }

                this.sauceConnectOpts = ({
                    username: config.sauceConnectUser,
                    accessKey: config.sauceConnectAPIKey,
                    '-x': sauceConnectRestURL,
                    tunnelIdentifier: 'wdio-saucerdc-service-tunnel'  
                });

                var mergedSauceConnectOpts = Object.assign({}, this.sauceConnectOpts, config.sauceConnectOpts);


                const sauceConnectTunnelIdentifier = mergedSauceConnectOpts.tunnelIdentifier;

                if (sauceConnectTunnelIdentifier) {
                    if (Array.isArray(capabilities)) {
                        capabilities.forEach((capability) => {
                            capability.tunnelIdentifier = capability.tunnelIdentifier || sauceConnectTunnelIdentifier;
                        })
                    } else {
                        Object.keys(capabilities).forEach((browser) => {
                            capabilities[browser].desiredCapabilities.tunnelIdentifier = capabilities[browser].desiredCapabilities.tunnelIdentifier || sauceConnectTunnelIdentifier;
                        })
                    }
                }

                console.log(mergedSauceConnectOpts);

                return new Promise((resolve, reject) => sauceConnectLauncher(mergedSauceConnectOpts, (err, sauceConnectProcess) => {
                    if (err) {  
                        return reject(err)
                    }

                    this.sauceConnectProcess = sauceConnectProcess
                    resolve()
                }))

            }
    
    }

    onComplete () {
        if (!this.sauceConnectProcess) {
            return
        }

        return new Promise((resolve) => this.sauceConnectProcess.close(resolve))
    }

}


exports.default = SauceRDCLaunchService;
module.exports = exports['default'];