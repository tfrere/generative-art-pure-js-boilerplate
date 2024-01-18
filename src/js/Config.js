import {
  random,
  randomSnap,
  randomBias,
  seedPRNG,
  map,
} from "@tfrere/generative-tools";

class Config {
  width = 500;
  height = 500;
  debug = false;
  speed = 1;
  _seed = 1;
  color = {
    background: "#ff0000",
  };

  constructor(seed = 0) {
    this.seed = seed;
  }

  set seed(value) {
    this._seed = value;
    seedPRNG(value);
  }
  get seed() {
    return this._seed;
  }
}

export default Config;
