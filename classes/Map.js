import { Renderer } from './Renderer.js';
import { Vector, interval } from './Helper.js';

const foodShrink = 0.05;

export class Map {
  static amoeba = null;
  static foods = [];
  static foodSpawnRate = 500;

  static initialize(amoeba) {
    Map.amoeba = amoeba;
    setInterval(Map.tick, interval);
    setInterval(Map.autoSpawnFood, Map.foodSpawnRate);
  }

  static tick() {
    for (let i in Map.foods) {
      if (Map.foods[i].radius <= 0) {
        Map.foods.splice(i, 1);
      }
    }
  }

  static autoSpawnFood() {
    Map.spawnFood(
      Vector.getAddition(
        Map.amoeba.position,
        new Vector(
          (Math.random() - 0.5) * Renderer.screenSize.x,
          (Math.random() - 0.5) * Renderer.screenSize.y
        )
      ),
      Math.random() * 10 + 3
    );
  }

  static spawnFood(position, radius) {
    let food = new Food(position, radius);
    Map.foods.push(food);
  }
}

export class Food {
  constructor(position, radius) {
    this.position = position;
    this.radius = radius;

    setInterval(() => {
      this.tick();
    }, interval);
  }

  tick() {
    this.radius -= foodShrink;
    if (this.radius <= 0) {
      this.radius = 0;
    }
  }
}
