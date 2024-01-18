export default class Kaleidoscope {
  constructor(canvas, ctx, options) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.options = options;
    this.sides = options.sides || 6; // Nombre de côtés du kaléidoscope, 6 par défaut
  }

  draw() {
    var imgData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    var data = imgData.data;

    // Dimensions du canvas
    var centerX = this.canvas.width / 2;
    var centerY = this.canvas.height / 2;
    var maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

    // Angle de chaque secteur
    var anglePerSector = (Math.PI * 2) / this.sides;

    // Boucle à travers chaque pixel du canvas
    for (var y = 0; y < this.canvas.height; y++) {
      for (var x = 0; x < this.canvas.width; x++) {
        // Convertir en coordonnées polaires
        var dx = x - centerX;
        var dy = y - centerY;
        var radius = Math.sqrt(dx * dx + dy * dy);
        var angle = Math.atan2(dy, dx);

        // Normaliser l'angle pour qu'il se trouve dans le premier secteur
        angle = ((angle % anglePerSector) + anglePerSector) % anglePerSector;

        // Convertir en coordonnées cartésiennes
        var sourceX = Math.cos(angle) * radius + centerX;
        var sourceY = Math.sin(angle) * radius + centerY;

        // Copier les pixels de la source
        var sourceIndex =
          (Math.round(sourceY) * this.canvas.width + Math.round(sourceX)) * 4;
        var targetIndex = (y * this.canvas.width + x) * 4;
        for (var i = 0; i < 4; i++) {
          data[targetIndex + i] = data[sourceIndex + i];
        }
      }
    }

    this.ctx.putImageData(imgData, 0, 0);
  }
}
