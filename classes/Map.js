import { Renderer } from './Renderer.js';
import { Vector, interval } from './Helper.js';

const foodShrink = 0.005;
const foodCellSize = 20;
const foodSpawnRate = 200;
const foodMax = 30;

export class Map {
  static amoeba;
  static foods = [];
  static foodGrid;
  static foodGridW;
  static foodGridH;

  static initialize(amoeba) {
    Map.amoeba = amoeba;
    Map.foodGrid = [];
    Map.foodGridW = Renderer.screenSize.x / foodCellSize;
    Map.foodGridH = Renderer.screenSize.y / foodCellSize;
    Map.setFoodGrid();

    setInterval(Map.tick, interval);
    setInterval(Map.autoSpawnFood, foodSpawnRate);
  }

  static tick() {
    Map.deleteGoneFood();
    Map.setFoodGrid();
  }

  static autoSpawnFood() {
    if (Map.foods.length > foodMax) return;
    let distance =
      Math.random() * Map.amoeba.radius * 6 + Map.amoeba.radius * 4;
    let direction = Math.random() * Math.PI * 2;
    let delta = new Vector(
      Math.cos(direction) * distance,
      Math.sin(direction) * distance
    );
    Map.spawnFood(
      Vector.getAddition(Map.amoeba.position, delta),
      Math.random() * 4 + 10
    );
  }

  static spawnFood(position, radius) {
    let food = new Food(position, radius);
    Map.foods.push(food);
  }

  static setFoodGrid() {
    for (let i = 0; i < Map.foodGridH; i++) {
      Map.foodGrid[i] = [];
      for (let j = 0; j < Map.foodGridW; j++) {
        Map.foodGrid[i][j] = null;
      }
    }
    for (let food of Map.foods) {
      let screenPosition = Vector.getMinus(food.position, Renderer.camPosition);
      let w = Math.floor(screenPosition.x / foodCellSize);
      let h = Math.floor(screenPosition.y / foodCellSize);
      if (w >= 0 && w < Map.foodGridW && h >= 0 && h < Map.foodGridH)
        Map.foodGrid[h][w] = food;
    }
  }

  static deleteGoneFood() {
    for (let i in Map.foods) {
      let food = Map.foods[i];
      if (food.isGone) {
        Map.foods.splice(i, 1);
        let screenPosition = Vector.getMinus(
          food.position,
          Renderer.camPosition
        );
        let w = Math.floor(screenPosition.x / foodCellSize);
        let h = Math.floor(screenPosition.y / foodCellSize);
        if (w >= 0 && w < Map.foodGridW && h >= 0 && h < Map.foodGridH)
          Map.foodGrid[h][w] = null;
      }
    }
  }

  static tryGetFood(armLocalPosition) {
    let screenPosition = Vector.getAddition(
      armLocalPosition,
      Vector.getMultiple(Renderer.screenSize, 0.5)
    );
    let w = Math.floor(screenPosition.x / foodCellSize);
    let h = Math.floor(screenPosition.y / foodCellSize);
    if (w >= 0 && w < Map.foodGridW && h >= 0 && h < Map.foodGridH)
      return Map.foodGrid[h][w];
    else return null;
  }
}

export class Food {
  constructor(position, radius) {
    this.position = position;
    this.radius = radius;
    this.isGone = false;

    this.tickPointer = setInterval(() => {
      this.tick();
    }, interval);
  }

  tick() {
    this.radius -= foodShrink;
    if (this.radius <= 0) {
      this.radius = 0;
      this.isGone = true;
      clearInterval(this.tickPointer);
    }
  }

  getAmoebaLocalPosition() {
    return Vector.getMinus(this.position, Renderer.camPosition).minus(
      Vector.getMultiple(Renderer.screenSize, 0.5)
    );
  }
}
