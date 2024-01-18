import App from "./js/App.js";
import Config from "./js/Config";
import { randomSnap } from "@tfrere/generative-tools";

let app = null;

const start = (seed) => {
  if (app) {
    app.destroy();
  }
  app = new App("canvas", new Config(seed));
  app.play();
};

function main() {
  start(randomSnap(0, 99, 1));
}

main();
