import { Vector, interval } from './Helper.js';

export class Map {
  static amoeba = null;
  static foods = [];

  static initialize(amoeba) {
    Map.amoeba = amoeba;
    setInterval(Map.tick, interval);
  }

  static tick() {}
}

export class Food {
  constructor(position, radius) {
    this.position = position;
    this.radius = radius;
  }
}
