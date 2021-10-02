import { Vector } from './Helper.js';

export class Map {
  constructor(amoeba, numFoods = 100) {
    this.amoeba = amoeba;

    this.foods = [];
    for (let i = 0; i < numFoods; i++) {
      this.foods[i] = new Food(
        new Vector((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000),
        Math.random() * 10
      );
    }
  }
}

export class Food {
  constructor(position, size) {
    this.position = position;
    this.size = size;
  }
}
