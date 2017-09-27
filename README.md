# react-native-ntp-client [![Build Status](https://secure.travis-ci.org/artem-russkikh/react-native-ntp-client.png?branch=master)](http://travis-ci.org/artem-russkikh/react-native-ntp-client)

React Native compatible implementation of the NTP Client Protocol (https://github.com/moonpyk/node-ntp-client fork). Uses https://github.com/parshap/node-libs-react-native for `Buffer` shim. Uses https://github.com/tradle/react-native-udp for `dgram` shim.

## Getting Started
Install the module with: `npm install react-native-ntp-client`

Link native dependencies of [react-native-udp](https://github.com/tradle/react-native-udp#install): `react-native link react-native-udp`

```javascript
var ntpClient = require('react-native-ntp-client');

ntpClient.getNetworkTime("pool.ntp.org", 123, function(err, date) {
    if(err) {
        console.error(err);
        return;
    }

    console.log("Current time : ");
    console.log(date); // Mon Jul 08 2013 21:31:31 GMT+0200 (Paris, Madrid (heure d’été))
});
```

## Contributors
 * Clément Bourgeois (https://github.com/moonpyk)
 * Callan Bryant (https://github.com/naggie)
 * Artem Russkikh (https://github.com/artem-russkikh)

## License
Copyright (c) 2014 Clément Bourgeois
Licensed under the MIT license.

