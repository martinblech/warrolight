const dgram = require('dgram');
const now = require('performance-now')

const { LightDevice } = require('./base')

let reconnectTime = 3000;

const ENCODING_POS_RGB = 1;
const ENCODING_POS_VGA = 2;
const ENCODING_VGA = 3;
const ENCODING_RGB = 4;


module.exports = class LightDeviceUDP extends LightDevice {
  constructor({numberOfLights, ip, udpPort}) {
    super(numberOfLights, "E "+ip);

    this.expectedIp = ip;
    this.udpPort = udpPort;

    this.encoding = ENCODING_RGB

    this.freshData = false;
    this.dataBuffer = [0]
    this.connected = false;

    this.packageCount = 0

    this.setupCommunication()
  }

  sendNextFrame() {
    if(this.connected && this.freshData) {
      this.initEncoding()

      let dim = 1
      for (let i = 0; i < this.numberOfLights; i++) {
        this.writePixel(i,
          this.state[i][0] / dim,
          this.state[i][1] / dim,
          this.state[i][2] / dim
        )
      }
      this.freshData = false;
      this.flush()
    }
  }

  handleArduinoData(data) {
    if(data){
      data = data.replace(/[^\w]+/gi, "")

      if(data === 'YEAH'){
        this.logInfo("Reconnected")
        this.updateState(this.STATE_RUNNING);
      } else if (data.startsWith("PERF")) {
        let perfCount = parseInt(data.substring(4) || 0);
        this.lastFps = perfCount;
        // console.log("Perf ", perfCount)
        //this.logInfo(`ACK`)
      } else {
        this.logInfo(`UNEXPECTED MSG'${data}'`)
      }
    } else {
      this.logInfo(`No data received`)
    }

    clearTimeout(this.reconnectTimeout);

    this.reconnectTimeout = setTimeout(() => {
      this.connected = false;
      this.updateState(this.STATE_CONNECTING);
      this.logInfo(`no data`)
    }, reconnectTime)
  }

  // Override parent
  logDeviceState() {
    if (this.deviceState === this.STATE_RUNNING) {
      if (now() - this.lastPrint > 250) {
        this.logInfo(`FPS: ${this.lastFps}`.green)
        this.lastPrint = now()
      }
    }
  }

  initEncoding() {
    this.write([this.encoding]);
    if (this.needsHeaderWithNumberOfLights()) {
      this.write([this.numberOfLights]);
    }
  }

  needsHeaderWithNumberOfLights () {
    return this.encoding === ENCODING_POS_RGB
        || this.encoding === ENCODING_POS_VGA
  }

  writePixel(pos, r, g, b) {
    switch (this.encoding) {
      case ENCODING_RGB:
        return this.write([r, g, b])
      case ENCODING_VGA:
        return this.write([rgbToVga(r, g, b)])
      case ENCODING_POS_RGB:
        return this.write([pos, r, g, b])
      case ENCODING_POS_VGA:
        return this.write([pos, rgbToVga(r, g, b)])
      default:
        this.logError('Invalid encoding!')
        return
    }
  }

  write(data) {
    this.dataBuffer = this.dataBuffer.concat(data);
  }

  flush() {
    let payload = Buffer.from(this.dataBuffer);
    this.udpSocket.send(payload, 0, payload.length, this.remotePort, this.remoteAddress, (err, bytes) => {
      if(err) {
        this.handleError(err);
      }
    })

    this.dataBuffer = [this.packageCount++ % 256];
  }

  setupCommunication() {
    this.udpSocket = dgram.createSocket('udp4');

    this.udpSocket.on('error', (err) => {
      this.udpSocket.close();
      this.updateState(this.STATE_ERROR);
      this.logError('Error: ' + err.message)
      // Create socket again
      setTimeout(() => this.setupCommunication(), 500);
    });

    this.udpSocket.on('listening', () => {
      const address = this.udpSocket.address();
      this.updateState(this.STATE_CONNECTING);
      console.log('UDP Server listening on ' + address.address + ":" + address.port);
    });

    this.udpSocket.on('message', (message, remote) => {
      // console.log(message.toString(), remote.address)
      if(remote.address === this.expectedIp) {
        this.remotePort = remote.port;
        this.remoteAddress = remote.address;

        if (!this.connected) {
          console.log(`Connected to ${this.remoteAddress}:${this.remotePort}`)
          this.connected = true;
          this.updateState(this.STATE_RUNNING);
        }

        this.handleArduinoData(message.toString())
      }
    });

    setInterval(() => {
      // Es UDP, no esperamos respuesta
      if(this.connected) {
        this.sendNextFrame()
      }
    }, 16)

    this.udpSocket.on('error', (err) => {this.handleError(err)})
    this.udpSocket.on('close', () => {this.handleError("socket closed. Falta manejarlo")})

    this.udpSocket.bind(this.udpPort);
  }
// open errors will be emitted as an error event
  handleError(err) {
    if(this.port) {
      this.updateState(this.STATE_ERROR);
      this.logError('Error: ' + err.message)

      // setTimeout(() => this.setupCommunication(), 2000);
    }
  }
}