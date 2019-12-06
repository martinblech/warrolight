const SoundBasedFunction = require("./../base-programs/SoundBasedFunction");
const ColorUtils = require("./../utils/ColorUtils");

module.exports = class FrequencyActivation extends SoundBasedFunction {
  constructor(config, leds) {
    super(config, leds);
  }

  start(config, draw) {
    this.lastVolume = new Array(this.numberOfLeds + 1)
      .join("0")
      .split("")
      .map(() => [0, 0, 0]);
    this.time = 0;
    this.maxVolume = 0;

    super.start(config, draw);
  }

  // Override parent method
  drawFrame(draw) {
    this.time += this.config.speed;

    let size = this.config.zoom;
    if (this.audio.absolutefft) {
      for (let i = 0; i < this.numberOfLeds; i++) {
        let pos = Math.floor((i % 150) / size);
        let vol = (this.config.multiplier * this.audio.absolutefft[pos + 5]) / 10;

        let newVal = ColorUtils.HSVtoRGB(vol, 1, Math.min(vol, 1));

        this.lastVolume[i] = newVal;
      }
    }

    draw(this.lastVolume);
  }

  static presets() {
    return {};
  }

  // Override and extend config Schema
  static configSchema() {
    let res = super.configSchema();
    res.multiplier = { type: Number, min: 0, max: 2, step: 0.01, default: 1 };
    res.zoom = { type: Number, min: 1, max: 32, step: 1, default: 4 };
    res.numberOfOnLeds = {
      type: Number,
      min: 1,
      max: 100,
      step: 1,
      default: 40
    };
    res.cutThreshold = {
      type: Number,
      min: 0,
      max: 1,
      step: 0.01,
      default: 0.45
    };
    return res;
  }
};
