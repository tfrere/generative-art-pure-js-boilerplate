export default class Glitch {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }

  draw() {
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Capture l'image actuelle du canvas
    const imageData = this.ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Nombre de glitches à appliquer
    const glitchCount = Math.floor(Math.random() * 10) + 5;

    for (let i = 0; i < glitchCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const spliceHeight = Math.random() * 5 + 1;
      const spliceWidth = Math.random() * width;

      // Décalage horizontal pour le glitch
      const offset = (Math.random() * 20 - 10) | 0;

      for (let j = 0; j < spliceHeight; j++) {
        const yPos = (y + j) % height;
        const fromPos = (yPos * width + x) * 4;
        const toPos = (yPos * width + ((x + offset) % width)) * 4;

        for (let k = 0; k < spliceWidth * 4; k++) {
          data[toPos + k] = data[fromPos + k];
        }
      }
    }

    // Met à jour le canvas avec l'image modifiée
    this.ctx.putImageData(imageData, 0, 0);
  }
}
