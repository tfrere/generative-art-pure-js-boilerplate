export default class Symmetry {
  constructor(canvas, ctx, options) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.options = options;
  }

  draw() {
    var imgData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    var data = imgData.data;

    // Boucle à travers chaque rangée de pixels
    for (var y = 0; y < this.canvas.height; y++) {
      for (var x = 0; x < this.canvas.width / 2; x++) {
        // Calculer l'indice dans le tableau ImageData
        var leftIndex = (y * this.canvas.width + x) * 4;
        var rightIndex =
          (y * this.canvas.width + (this.canvas.width - x - 1)) * 4;

        if (this.options.symmetryToggle) {
          // Copie de droite à gauche
          for (var offset = 0; offset < 4; offset++) {
            data[leftIndex + offset] = data[rightIndex + offset];
          }
        } else {
          // Copie de gauche à droite
          for (var offset = 0; offset < 4; offset++) {
            data[rightIndex + offset] = data[leftIndex + offset];
          }
        }
      }
    }

    this.ctx.putImageData(imgData, 0, 0);
  }
}
