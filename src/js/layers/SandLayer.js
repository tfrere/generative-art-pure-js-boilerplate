import { debounce } from "../utils/debounce.js";
import { randomSnap } from "@tfrere/generative-tools";
import ChladniPatternGenerator from "../utils/ChladniPatternGenerator";

const NUM_PARTICLES = 120000;
const DEFAULT_RANDOM_VIBRATION_INTENSITY = 0;
const MAX_GRADIENT_INTENSITY = 0.2;

const isBigEndian = (() => {
  const array = new Uint8Array(4);
  const view = new Uint32Array(array.buffer);
  return !((view[0] = 1) & array[0]);
})();

const rgbToVal = isBigEndian
  ? (r, g, b) => ((r << 24) | (g << 16) | (b << 8) | 0xff) >>> 0
  : (r, g, b) => ((0xff << 24) | (b << 16) | (g << 8) | r) >>> 0;

// Custom distribution function for radius
const getWeightedRadius = (maxRadius) => {
  const factor = randomSnap(0, 1, 0.0001) * randomSnap(0, 1, 0.0001); // Bias towards center
  return maxRadius * Math.sqrt(factor); // Adjust the distribution curve here
};

export default class SandLayer {
  constructor(ctx, config, clock) {
    let self = this;
    this.outputCtx = ctx;
    this.config = config;
    console.log("sandLayer config", this.config);
    this.clock = clock;

    this.vibrationIntensity = DEFAULT_RANDOM_VIBRATION_INTENSITY;
    this.halfVibrationIntensity = this.vibrationIntensity / 2;

    this.particles = new Float32Array(NUM_PARTICLES * 2);
    this.particleDistribution = "circle"; // "random" or "circle

    this.initParticles();

    this.particleColor = 0xff000000;
    this.backgroundColor = 0xffffffff;

    this.canvas = new OffscreenCanvas(this.config.width, this.config.height);
    this.ctx = this.canvas.getContext("2d", {
      willReadFrequently: true,
      antialias: true,
    });

    this.imageData = this.ctx.getImageData(
      0,
      0,
      this.config.width,
      this.config.height
    );
    this.buffer = new Uint32Array(this.imageData.data.buffer);

    this.debugVibration = config.debug;
    this.vibrationValues = null;
    this.gradients = null;
    this.isReadyToDraw = false;

    this.chladniPatternGenerator = new ChladniPatternGenerator({
      width: config.width,
      height: config.height,
      seed: config.seed,
    });

    this.chladniPatternGenerator
      .generatePatternWithSanskrit()
      .then(({ gradients, vibrationValues }) => {
        // Utilisez les résultats ici
        self.gradients = gradients;
        self.vibrationValues = vibrationValues;
        self.isReadyToDraw = true;

        self.checkForFallenParticles();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  initParticles() {
    const centerX = this.config.width / 2;
    const centerY = this.config.height / 2;
    const maxRadius = Math.min(centerX, centerY) * 0.95; // 95% to avoid edge

    if (this.particleDistribution === "circle") {
      for (let i = 0; i < this.particles.length; i += 2) {
        const angle = randomSnap(0, 1, 0.0001) * 2 * Math.PI;
        const r = getWeightedRadius(maxRadius);

        this.particles[i] = centerX + r * Math.cos(angle);
        this.particles[i + 1] = centerY + r * Math.sin(angle);
      }
    } else {
      for (let i = 0; i < this.particles.length; i += 2) {
        const angle = randomSnap(0, 1, 0.0001) * 2 * Math.PI;
        const r = getWeightedRadius(maxRadius);

        this.particles[i] = randomSnap(0, this.config.width, 1);
        this.particles[i + 1] = randomSnap(0, this.config.height, 1);
      }
    }
  }
  // // replace sand that fell from the plate
  checkForFallenParticles() {
    const SLACK = 100; // allow particles to really leave the screen before replacing them

    for (let i = 0; i < this.particles.length; i += 2) {
      let x = this.particles[i];
      let y = this.particles[i + 1];

      const didFall =
        x < -SLACK ||
        x >= this.config.width + SLACK ||
        y < -SLACK ||
        y >= this.config.height + SLACK;

      if (didFall) {
        this.particles[i] = randomSnap(0, 1, 0.0001) * this.config.width;
        this.particles[i + 1] = randomSnap(0, 1, 0.0001) * this.config.height;
      }
    }
  }

  obtainGradientAt(x, y) {
    // used to lerp nearest gradient grid corners here, but it's too expensive and doesn't make any visual difference
    x = Math.round(x);
    y = Math.round(y);
    const index = (y * this.config.width + x) * 2;
    return [this.gradients[index], this.gradients[index + 1]];
  }

  drawSand() {
    if (!this.isReadyToDraw) {
      return;
    }
    if (this.debugVibration && this.vibrationValues) {
      for (let i = 0; i < this.vibrationValues.length; i++) {
        const intensity = this.vibrationValues[i] * 64; // max luminosity
        this.buffer[i] = rgbToVal(intensity, intensity, intensity);
      }
    } else {
      this.buffer.fill(this.backgroundColor);
      for (let i = 0; i < this.particles.length; i += 2) {
        let x = this.particles[i];
        let y = this.particles[i + 1];
        if (this.gradients && this.isReadyToDraw) {
          const [gradX, gradY] = this.obtainGradientAt(x, y);
          // descend gradient
          x += MAX_GRADIENT_INTENSITY * gradX;
          y += MAX_GRADIENT_INTENSITY * gradY;
        }
        // random vibration
        x +=
          randomSnap(0, 1, 0.0001) * this.vibrationIntensity -
          this.halfVibrationIntensity;
        y +=
          randomSnap(0, 1, 0.0001) * this.vibrationIntensity -
          this.halfVibrationIntensity;

        // debounce(() => console.log("x", x, "y", y), 1000);
        this.particles[i] = x;
        this.particles[i + 1] = y;
        this.buffer[Math.round(y) * this.config.width + Math.round(x)] =
          this.particleColor;
      }
    }
    this.outputCtx.putImageData(this.imageData, 0, 0);
  }

  draw() {
    this.drawSand();
  }
}
