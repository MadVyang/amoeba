export class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }
  minus(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }
  multiply(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }
  getSize() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  getNormal() {
    return Vector.getMultiple(this, 1 / this.getSize());
  }
  getDirection() {
    return Math.atan2(this.y, this.x);
  }

  static getVectorFromDirection(direction) {
    return new Vector(Math.cos(direction), Math.sin(direction));
  }
  static getLookAt(a, b) {
    let rot = Math.atan2(a.y - b.y, a.x - b.x);
    return new Vector(Math.cos(rot), Math.sin(rot));
  }
  static getDistance(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
  }
  static getAddition(a, b) {
    return new Vector(a.x + b.x, a.y + b.y);
  }
  static getMinus(a, b) {
    return new Vector(a.x - b.x, a.y - b.y);
  }
  static getMultiple(a, b) {
    return new Vector(a.x * b, a.y * b);
  }
}

export let interval = 20;
