// export function grainShader(canvas, ctx, grainIntensity) {
//   const width = canvas.width;
//   const height = canvas.height;

//   // Création de l'effet de grain
//   const imageData = ctx.createImageData(width, height);
//   for (let i = 0; i < imageData.data.length; i += 4) {
//     // Les grains sont des points blancs avec une opacité aléatoire
//     const opacity = Math.random() * grainIntensity;
//     imageData.data[i] = 255; // Rouge
//     imageData.data[i + 1] = 255; // Vert
//     imageData.data[i + 2] = 255; // Bleu
//     imageData.data[i + 3] = opacity * 255; // Alpha
//   }

//   // Superposition de l'effet de grain sur l'image actuelle
//   ctx.putImageData(imageData, 0, 0);
// }

export default class Grain {
  constructor(canvas, grainIntensity = 0.1, grainSize = 1, grainOpacity = 0.1) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.grainIntensity = grainIntensity;
    this.grainSize = grainSize;
    this.grainOpacity = grainOpacity; // Nouveau paramètre pour l'opacité
  }

  draw() {
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Capture l'image actuelle du canvas
    const currentImageData = this.ctx.getImageData(0, 0, width, height);
    const currentData = currentImageData.data;

    // Crée un nouvel effet de grain
    const grainImageData = this.ctx.createImageData(width, height);
    const grainData = grainImageData.data;

    for (let i = 0; i < grainData.length; i += 4) {
      const opacity = Math.random() * this.grainIntensity;
      const grainValue = 255 * Math.random();

      grainData[i] = grainValue; // Rouge
      grainData[i + 1] = grainValue; // Vert
      grainData[i + 2] = grainValue; // Bleu
      grainData[i + 3] = opacity * 255; // Alpha

      // Multiplie l'effet de grain avec l'image actuelle en tenant compte de l'opacité
      currentData[i] =
        ((currentData[i] * grainData[i]) / 255) * this.grainOpacity +
        currentData[i] * (1 - this.grainOpacity);
      currentData[i + 1] =
        ((currentData[i + 1] * grainData[i + 1]) / 255) * this.grainOpacity +
        currentData[i + 1] * (1 - this.grainOpacity);
      currentData[i + 2] =
        ((currentData[i + 2] * grainData[i + 2]) / 255) * this.grainOpacity +
        currentData[i + 2] * (1 - this.grainOpacity);
      // L'alpha reste inchangé
    }

    // Met à jour le canvas avec l'image modifiée
    this.ctx.putImageData(currentImageData, 0, 0);
  }

  setIntensity(newIntensity) {
    this.grainIntensity = newIntensity;
  }

  setSize(newSize) {
    this.grainSize = newSize;
  }

  setOpacity(newOpacity) {
    this.grainOpacity = newOpacity;
  }
}
