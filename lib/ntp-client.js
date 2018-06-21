/*
 * ntp-client
 * https://github.com/moonpyk/node-ntp-client
 *
 * Copyright (c) 2013 Clément Bourgeois
 * Licensed under the MIT license.
 */

(function (exports) {
    "use strict";

    var dgram = require('dgram');

    exports.defaultNtpPort = 123;
    exports.defaultNtpServer = "pool.ntp.org";

    /**
     * Amount of acceptable time to await for a response from the remote server.
     * Configured default to 10 seconds.
     */
    exports.ntpReplyTimeout = 10000;

    /**
     * Fetches the current NTP Time from the given server and port.
     * @param {string} server IP/Hostname of the remote NTP Server
     * @param {number} port Remote NTP Server port number
     * @param {function(Object, Date)} callback(err, date) Async callback for
     * the result date or eventually error.
     */
    exports.getNetworkTime = function (server, port, callback) {
        if (callback === null || typeof callback !== "function") {
            return;
        }

        server = server || exports.defaultNtpServer;
        port = port || exports.defaultNtpPort;

        var client = dgram.createSocket("udp4"),
            ntpData = new Buffer(48);

        // RFC 2030 -> LI = 0 (no warning, 2 bits), VN = 3 (IPv4 only, 3 bits), Mode = 3 (Client Mode, 3 bits) -> 1 byte
        // -> rtol(LI, 6) ^ rotl(VN, 3) ^ rotl(Mode, 0)
        // -> = 0x00 ^ 0x18 ^ 0x03
        ntpData[0] = 0x1B;

        for (var i = 1; i < 48; i++) {
            ntpData[i] = 0;
        }

        var timeout = setTimeout(function () {
            client.close();
            callback("Timeout waiting for NTP response.", null);
        }, exports.ntpReplyTimeout);

        // Some errors can happen before/after send() or cause send() to was impossible.
        // Some errors will also be given to the send() callback.
        // We keep a flag, therefore, to prevent multiple callbacks.
        // NOTE : the error callback is not generalised, as the client has to lose the connection also, apparently.
        var errorFired = false;

        client.on('error', function (err) {
            if (errorFired) {
                return;
            }

            callback(err, null);
            errorFired = true;

            clearTimeout(timeout);
        });

        client.send(ntpData, 0, ntpData.length, port, server, function (err) {
            if (err) {
                if (errorFired) {
                    return;
                }
                clearTimeout(timeout);
                callback(err, null);
                errorFired = true;
                try { 
                    client.close(); 
                } catch (ex) {
                    console.err("Err during closing socket", ex);
                }
                return;
            }

            client.once('message', function (msg) {
                clearTimeout(timeout);
                client.close();

                // Offset to get to the "Transmit Timestamp" field (time at which the reply
                // departed the server for the client, in 64-bit timestamp format."
                var offsetTransmitTime = 40,
                    intpart = 0,
                    fractpart = 0;

                // Get the seconds part
                for (var i = 0; i <= 3; i++) {
                    intpart = 256 * intpart + msg[offsetTransmitTime + i];
                }

                // Get the seconds fraction
                for (i = 4; i <= 7; i++) {
                    fractpart = 256 * fractpart + msg[offsetTransmitTime + i];
                }

                var milliseconds = (intpart * 1000 + (fractpart * 1000) / 0x100000000);

                // **UTC** time
                var date = new Date("Jan 01 1900 GMT");
                date.setUTCMilliseconds(date.getUTCMilliseconds() + milliseconds);

                callback(null, date);
            });
        });
    };

    exports.demo = function (argv) {
        exports.getNetworkTime(
            exports.defaultNtpServer,
            exports.defaultNtpPort,
            function (err, date) {
                if (err) {
                    console.error(err);
                    return;
                }

                console.log(date);
            });
    };
}(exports));
