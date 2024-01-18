import ExampleLayer from "./ExampleLayer.js";
import { createNoiseGrid, map } from "@tfrere/generative-tools";

class FlowFieldLayer extends ExampleLayer {
  constructor(ctx, config, clock) {
    super(ctx, config, clock);

    // Initialisation du champ de flux avec les paramètres de configuration
    this.field = createNoiseGrid({
      width: this.config.width,
      height: this.config.height,
      resolution: 500,
      xInc: 0.0125,
      yInc: 0.0125,
      seed: 0,
    });
  }

  vectorFromAngle(angle, magnitude) {
    const angleRadians = angle * (Math.PI / 180);
    return {
      x: Math.cos(angleRadians) * magnitude,
      y: Math.sin(angleRadians) * magnitude,
    };
  }

  applyToParticle(particle) {
    const cell = this.field.lookup({ x: particle.x, y: particle.y });
    const angleDegrees = map(cell.noiseValue, 0, 1, 0, 360);
    const vector = this.vectorFromAngle(angleDegrees, 1);
    particle.xv += vector.x * 0.6;
    particle.yv += vector.y * 0.6;
  }

  drawLine(x, y, vecX, vecY) {
    this.ctx.save();
    this.ctx.translate(x, y);
    const angle = Math.atan2(vecY, vecX);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(vecX, vecY);
    this.ctx.stroke();
    this.ctx.lineTo(
      vecX - 5 * Math.cos(angle - Math.PI / 6),
      vecY - 5 * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.moveTo(vecX, vecY);
    this.ctx.lineTo(
      vecX - 5 * Math.cos(angle + Math.PI / 6),
      vecY - 5 * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.stroke();
    this.ctx.restore();
  }

  update() {
    // Toute logique de mise à jour du champ de flux pourrait être ajoutée ici
  }

  draw(elapsedTime) {
    super.update();

    // Dessiner sur l'OffscreenCanvas
    for (let x = 0; x < this.config.width; x += 10) {
      for (let y = 0; y < this.config.height; y += 10) {
        const cell = this.field.lookup({ x, y });
        const angleDegrees = map(cell.noiseValue, 0, 1, 0, 360);
        const vector = this.vectorFromAngle(angleDegrees, 10);
        this.drawLine(x, y, vector.x, vector.y);
      }
    }

    // Copier le contenu sur le canvas de sortie
    this.outputCtx.drawImage(this.canvas, 0, 0);
  }

  destroy() {
    this.field = null;
  }
}

export default FlowFieldLayer;
