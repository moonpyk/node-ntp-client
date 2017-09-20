import * as dgram from 'dgram';

export default class NTPClient {
  private port: number = 123;
  private server: string = 'pool.ntp.org';

  /**
   * Amount of acceptable time to await for a response from the remote server.
   * Configured default to 10 seconds.
   */
  private ntpReplyTimeout: number = 10 * 1000;

  /**
   * Constructor
   * @param {string} server IP/Hostname of the remote NTP Server
   * @param {number} port Remote NTP Server port number
   */
  constructor(server?: string, port?: number) {
    if (server) {
      this.server = server;
    }
    if (port) {
      this.port = port;
    }
  }

  /**
   * Fetches the current NTP Time from the given server and port.
   */
  public getNetworkTime(ntpReplyTimeout?: number): Promise<Date> {
    if (ntpReplyTimeout) {
      this.ntpReplyTimeout = ntpReplyTimeout;
    }

    return new Promise((resolve, reject) => {
      const client: dgram.Socket = dgram.createSocket('udp4');
      const ntpData: Buffer = Buffer.alloc(48);

      // RFC 2030 -> LI = 0 (no warning, 2 bits), VN = 3 (IPv4 only, 3 bits), Mode = 3 (Client Mode, 3 bits) -> 1 byte
      // -> rtol(LI, 6) ^ rotl(VN, 3) ^ rotl(Mode, 0)
      // -> = 0x00 ^ 0x18 ^ 0x03
      ntpData[0] = 0x1b;

      const timeout = setTimeout(() => {
        client.close();
        reject('Timeout waiting for NTP response.');
      }, this.ntpReplyTimeout);

      /*
       * Some errors can happen before/after send() or cause send() to break.
       * Some errors will also be given to send()
       * NOTE: the error rejection is not generalised, as the client has to
       * lose the connection also, apparently.
       */
      let errorFired: boolean = false;

      client.on('error', err => {
        if (errorFired) {
          return;
        }

        reject(err);
        errorFired = true;

        clearTimeout(timeout);
      });

      client.send(ntpData, 0, ntpData.length, this.port, this.server, err => {
        if (err) {
          if (errorFired) {
            return;
          }
          clearTimeout(timeout);
          reject(err);
          errorFired = true;
          client.close();
          return;
        }

        client.once('message', msg => {
          clearTimeout(timeout);
          client.close();

          // Offset to get to the "Transmit Timestamp" field (time at which the reply
          // departed the server for the client, in 64-bit timestamp format.
          const offsetTransmitTime: number = 40;
          let intpart: number = 0;
          let fractpart: number = 0;

          // Get the seconds part
          for (let i = 0; i <= 3; i++) {
            intpart = 256 * intpart + msg[offsetTransmitTime + i];
          }

          // Get the seconds fraction
          for (let i = 4; i <= 7; i++) {
            fractpart = 256 * fractpart + msg[offsetTransmitTime + i];
          }

          const milliseconds = intpart * 1000 + fractpart * 1000 / 0x100000000;

          // **UTC** time
          const date: Date = new Date('Jan 01 1900 GMT');
          date.setUTCMilliseconds(date.getUTCMilliseconds() + milliseconds);

          resolve(date);
        });
      });
    });
  }
}
