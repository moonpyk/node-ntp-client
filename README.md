# NTPClient [![Build Status](https://travis-ci.org/ffflorian/ntp.js.svg?branch=master)](http://travis-ci.org/ffflorian/ntp.js)

[![Greenkeeper badge](https://badges.greenkeeper.io/ffflorian/ntp.js.svg)](https://greenkeeper.io/)

Pure TypeScript implementation of the NTP Client Protocol. Based on [node-ntp-client](https://github.com/moonpyk/node-ntp-client).

## Getting Started
Install the module with: `npm install ntpclient`

```ts
import NTPClient from 'ntpclient';

NTPClient.getNetworkTime('pool.ntp.org', 123)
  .then(date => console.log(date)}) // Tue Aug 01 2017 20:27:26 GMT+0200)
  .catch(err => console.log(err));
});
```

## Contributors
 * Clément Bourgeois (https://github.com/moonpyk)
 * Callan Bryant (https://github.com/naggie)

## License
Copyright (c) 2017 Florian Keller,
licensed under the MIT license.
