import chroma from "chroma-js";

import ScreenCopy from "./effects/ScreenCopy.js";
import Symmetry from "./effects/Symmetry.js";
import Kaleidoscope from "./effects/Kaleidoscope.js";
import Grain from "./effects/Grain.js";

import PendulumLayer from "./layers/PendulumLayer.js";
import FlowFieldLayer from "./layers/FlowFieldLayer.js";
import SandLayer from "./layers/SandLayer.js";

class Layers {
  constructor(canvas, ctx, config, clock) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.config = config;
    this.clock = clock;

    this.layers = [];
    // this.layers.push(new PendulumLayer(this.ctx, this.config, this.clock, 0));
    this.layers.push(new SandLayer(this.ctx, this.config, this.clock));
    // this.layers.push(new PendulumLayer(this.ctx, this.config, this.clock, 1));
    // this.layers.push(new FlowFieldLayer(this.ctx, this.config, this.clock));

    this.effects = [];
    // this.effects.push(new ScreenCopy(this.canvas, 20));
    // this.effects.push(new Grain(this.canvas, 1, 1));
    // this.effects.push(new Symmetry(this.canvas, this.ctx, this.config));
    // this.effects.push(new Kaleidoscope(this.canvas, this.ctx, this.config));
  }

  updateconfig(config) {
    this.config = config;
    // this.thingToUpdate.updateconfig(config);
  }

  drawThumbBackground() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = Math.max(this.canvas.width, this.canvas.height);

    const gradient = this.ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius
    );
    gradient.addColorStop(0, this.config.color.background);
    gradient.addColorStop(
      1,
      chroma(this.config.color.background).saturate(1).darken(2)
    );

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw(elapsedTime) {
    // this.drawThumbBackground();
    this.layers.forEach((layer) => {
      layer.draw(elapsedTime);
    });
    this.effects.forEach((effect) => {
      effect.draw(elapsedTime);
    });
  }
}

export default Layers;
