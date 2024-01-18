export default class ExampleLayer {
  constructor(ctx, config, clock) {
    this.outputCtx = ctx;
    this.config = config;
    this.clock = clock;

    this.canvas = new OffscreenCanvas(this.config.width, this.config.height);
    this.ctx = this.canvas.getContext("2d", {
      // willReadFrequently: true,
      // antialias: true,
    });
  }

  update() {}

  draw(elapsedTime) {
    this.update();

    // Mettre l'image modifiée sur le canvas tampon
    const bufferCanvas = new OffscreenCanvas(700, 500);
    const bufferCtx = bufferCanvas.getContext("2d");
    bufferCtx.drawImage(this.canvas, 0, 0);

    // Dessiner l'image du canvas tampon dans outputCtx à une taille réduite
    this.outputCtx.drawImage(
      bufferCanvas,
      0,
      0,
      this.config.width,
      this.config.height,
      0,
      0,
      this.config.width,
      this.config.height
    );
  }
}
