import Clock from "./utils/Clock.js";
import VideoRecorder from "./utils/VideoRecorder.js";
import Layers from "./Layers.js";

class App {
  constructor(canvasId, config) {
    this.config = config;
    this.clock = new Clock();
    this.clock.start();

    // console.log(window.devicePixelRatio);

    this.finalCanvas = document.getElementById(canvasId);
    this.finalCanvas.width = config.width;
    this.finalCanvas.height = config.height;

    this.canvas = new OffscreenCanvas(config.width, config.height);
    this.canvas.width = config.width;
    this.canvas.height = config.height;

    this.ctx = this.canvas.getContext("2d");

    this.finalCtx = this.finalCanvas.getContext("2d");

    this.requestAnimationFrameId = null;

    this.layers = new Layers(this.canvas, this.ctx, this.config, this.clock);

    this.speed = config.speed || 1;

    this.videoRecorder = new VideoRecorder(this.finalCanvas, config);

    this.handleKeyPress = this.handleKeyPress.bind(this);
    window.addEventListener("keydown", this.handleKeyPress);
  }

  handleKeyPress(event) {
    if (event.key === "s") {
      const dataURL = this.finalCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `screenshot-${this.config.seed}.png`;
      link.href = dataURL;
      link.click();
    }
    if (event.key === "v") {
      if (this.videoRecorder.isRecording) {
        this.videoRecorder.stopRecording().then((videoBlob) => {
          const url = URL.createObjectURL(videoBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "recording.webm";
          a.click();
        });
      } else {
        this.videoRecorder.startRecording();
      }
    }
  }

  set config(config) {
    this._config = config;
    // this.layers.updateconfig(config);
  }

  get config() {
    return this._config;
  }

  destroy() {
    this.pause();
    this.canvas = null;
    this.ctx = null;
    this.requestAnimationFrameId = null;
    // remove event listener for
    window.removeEventListener("keydown", this.handleKeyPress);
  }

  play() {
    const now = performance.now();
    this.deltaTime = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.requestAnimationFrameId = requestAnimationFrame(this.play.bind(this));
    this.draw();
  }

  draw() {
    const elapsedTime = this.clock.getElapsedTime();

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.layers.draw(elapsedTime);
    this.finalCtx.drawImage(this.canvas, 0, 0);
  }

  pause() {
    cancelAnimationFrame(this.requestAnimationFrameId);
  }
}

export default App;
