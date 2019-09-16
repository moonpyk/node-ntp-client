# react-native-ntp-client [![Build Status](https://secure.travis-ci.org/artem-russkikh/react-native-ntp-client.png?branch=master)](http://travis-ci.org/artem-russkikh/react-native-ntp-client)

React Native compatible implementation of the NTP Client Protocol.

## Getting Started

1. Install the module with: `yarn add react-native-ntp-client` or `npm install react-native-ntp-client`.
2. Install the native required dependency: `yarn add react-native-udp` or `npm install react-native-udp`.
3. If you are using React Native < 0.60, link `react-native-udp` running `react-native link react-native-udp`. If you are using React Native >= 0.60 the native dependencies are auto-linked on both platforms.
4. If you are using React Native >= 0.60, on iOS run `pod install` in **ios** directory.

## Usage

```js
import ntpClient from 'react-native-ntp-client';

ntpClient.getNetworkTime("pool.ntp.org", 123, (error, date) => {
    if (error) {
        console.error(error);
        return;
    }

    console.log(date); // Mon Jul 08 2013 21:31:31 GMT+0200 (Paris, Madrid (heure d’été))
});
```

## Contributors

- [Clément Bourgeois](https://github.com/moonpyk)
- [Callan Bryant](https://github.com/naggie)
- [Artem Russkikh](https://github.com/artem-russkikh)
- [Info-Bit](https://github.com/info-bit)

## License

Licensed under the MIT license.
