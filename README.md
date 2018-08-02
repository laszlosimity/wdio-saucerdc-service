# wdio-saucerdc-service

wdio-saucerdc-service is a package designed to configure your tests to run on Sauce Labs' Real Devive Cloud.

The package:
1) Configures the appium endpoints, path and protocol
2) Automatically updates test status after completion

wdio-saucerdc-service is published to npm and can be installed simply by calling
npm install wdio-saucerdc-service 
From the command line in your project directory

To use wdio-saucerdc-service, you need to add the service definition to your wdio.conf.js file

    services: ['saucerdc']

Other configuration changes:

1) Remove the 'sauce' service from your conf file if the definition exists
2) Ensure your config does not define a 'key' parameter, as wdio will use this to attempt configuration which will override the required settings here

You may also pass in the testobject_dc parameter, with a setting of either 'eu' or 'us', corresponding to the European or USA data centre locations for Sauce Labs RDC. If you do not pass through these settings (or do not define one at all), wdio-saucerdc-service will default to the USA.
 eg.   testobject_dc: 'eu'

