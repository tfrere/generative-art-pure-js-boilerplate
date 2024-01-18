import { randomSnap } from "@tfrere/generative-tools";
const L1 = 0.04;
const L2 = 0.02;
const L3 = 0.018;

const getRandomChladniParams = (seed) => {
  const m = randomSnap(0, 9, 1);
  let n = randomSnap(0, 9, 1);
  while (n === m) {
    n = randomSnap(0, 9, 1);
  }
  const l =
    randomSnap(0, 1, 0.0001) < 0.5
      ? L1
      : randomSnap(0, 1, 0.0001) < 0.75
      ? L2
      : L3;

  return { M: m, N: n, L: l };
};

class ChladniPatternGenerator {
  constructor(config) {
    this.config = config;
    this.vibrationValues = null;
    // this.callback = config.callback;
    this.gradients = null;
    this.width = config.width;
    this.height = config.height;
    this.seed = config.seed;
    this.gradients = new Float32Array(this.width * this.height * 2);
    this.vibrationValues = new Float32Array(this.width * this.height);

    // this.computeVibrationValues();
    // this.computeGradients();
    // this.callback({
    //   vibrationValues: this.vibrationValues,
    //   gradients: this.gradients,
    // });
  }

  async generatePatternWithSanskrit() {
    // Premier calcul des valeurs de vibration et des gradients
    this.computeVibrationValues();
    this.computeGradients();

    // Ajout de la lettre sanskrit
    await this.addSanskritLetterToVibrationValues();

    // Recalcul des gradients après l'ajout de la lettre sanskrit
    this.computeGradients();

    // Retourner les résultats finaux
    return {
      vibrationValues: this.vibrationValues,
      gradients: this.gradients,
    };
  }

  computeVibrationValues() {
    let { M, N, L } = getRandomChladniParams(this.config.seed); // Utiliser m, n, l de ChladniParams

    console.log("chladni params", M, N, L);

    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = Math.min(centerX, centerY) - 30; // Rayon du cercle
    const borderThickness = 0; // Épaisseur du contour noir

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const offsetX = x - centerX;
        const offsetY = y - centerY;
        const distanceFromCenter = Math.sqrt(
          offsetX * offsetX + offsetY * offsetY
        );

        if (distanceFromCenter <= radius) {
          // À l'intérieur du cercle
          if (distanceFromCenter >= radius - borderThickness) {
            // Dans la bande du contour
            this.vibrationValues[y * this.width + x] = -1; // Valeur pour le noir
          } else {
            // À l'intérieur du cercle sans le contour
            const scaledX = offsetX * L;
            const scaledY = offsetY * L;
            const MX = M * scaledX;
            const NX = N * scaledX;
            const MY = M * scaledY;

            const NY = N * scaledY;

            let value =
              Math.cos(NX) * Math.cos(MY) - Math.cos(MX) * Math.cos(NY);
            value /= 2;
            value *= Math.sign(value);

            this.vibrationValues[y * this.width + x] = value;
          }
        } else {
          // À l'extérieur du cercle
          this.vibrationValues[y * this.width + x] = 1; // Valeur élevée pour un rendu blanc
        }
      }
    }
  }

  async addSanskritLetterToVibrationValues() {
    const svgOutlineMatrix = await this.svgToMatrix(
      `./outline-${this.config.seed}.png`,
      this.width,
      this.height
    );
    const svgInnerMatrix = await this.svgToMatrix(
      `./inner-${this.config.seed}.png`,
      this.width,
      this.height
    );
    for (let i = 0; i < this.vibrationValues.length; i++) {
      if (svgOutlineMatrix[i] > 0.1) {
        this.vibrationValues[i] = 0.01; // Définir une valeur basse pour créer une zone vide
      }
    }
    for (let i = 0; i < this.vibrationValues.length; i++) {
      if (svgInnerMatrix[i] > 0.1) {
        this.vibrationValues[i] = -0.1; // Définir une valeur basse pour créer une zone vide
      }
    }
  }

  computeGradients() {
    // Calculate gradients based on the vibration values
    for (let y = 1; y < this.height - 1; y++) {
      for (let x = 1; x < this.width - 1; x++) {
        const index = y * this.width + x;
        const dx =
          this.vibrationValues[index + 1] - this.vibrationValues[index - 1];
        const dy =
          this.vibrationValues[index + this.width] -
          this.vibrationValues[index - this.width];
        this.gradients[index * 2] = dx;
        this.gradients[index * 2 + 1] = dy;
      }
    }
  }

  async svgToMatrix(imageUrl, width, height, scaleRatio = 0.8) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);

      // Calculer les nouvelles dimensions
      const scaledWidth = bitmap.width * scaleRatio;
      const scaledHeight = bitmap.height * scaleRatio;

      // Centrer l'image
      const offsetX = (width - scaledWidth) / 2;
      const offsetY = (height - scaledHeight) / 2;

      const offscreenCanvas = new OffscreenCanvas(width, height);
      const ctx = offscreenCanvas.getContext("2d");

      // Dessiner l'image avec la nouvelle échelle et centrée
      ctx.drawImage(bitmap, offsetX, offsetY, scaledWidth, scaledHeight);

      const imageData = ctx.getImageData(0, 0, width, height);
      const matrix = new Float32Array(width * height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const brightness = imageData.data[i] / 255;
        matrix[i / 4] = brightness;
      }
      return matrix;
    } catch (error) {
      console.error("Error in svgToMatrix:", error);
      throw error;
    }
  }
}

export default ChladniPatternGenerator;
