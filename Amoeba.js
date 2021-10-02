import { Vector, interval } from './Helper.js';

export class Amoeba {
  constructor(numArms = 30, armRadius = 10) {
    this.arms = [];
    this.radius = (armRadius * 0.9) / Math.sin(Math.PI / numArms);
    for (let i = 0; i < numArms; i++) {
      let position = new Vector(
        Math.cos(i * ((Math.PI * 2) / numArms)) * this.radius,
        Math.sin(i * ((Math.PI * 2) / numArms)) * this.radius
      );
      this.arms.push(
        new Arm(position, armRadius + armRadius * 0.3 * (Math.random() - 0.5))
      );
    }
    this.position = new Vector(0, 0);
    this.velocity = new Vector(0, 0);

    setInterval(() => {
      this.tick();
    }, interval);
  }

  setTargetPosition(targetPosition) {
    let localTargetPosition = targetPosition.minus(this.position);
    for (let arm of this.arms) {
      arm.velocity.add(localTargetPosition);
    }
  }

  // private
  tick() {
    this.collideArms();
    this.attachArmToNucleus();
    this.move();
  }
  collideArms() {
    for (let i in this.arms) {
      for (let j in this.arms) {
        if (i >= j) continue;
        let prevArm = this.arms[i];
        let arm = this.arms[j];
        if (
          Vector.getDistance(prevArm.position, arm.position) <
          prevArm.radius + arm.radius
        ) {
          let delta = Vector.getMinus(prevArm.position, arm.position);
          let direction = Vector.getLookAt(prevArm.position, arm.position);
          arm.velocity.add(
            Vector.getMultiple(direction, -0.7 / delta.getSize())
          );
        }
      }
    }
  }
  attachArmToNucleus() {
    for (let arm of this.arms) {
      if (arm.position.getSize() > this.radius) {
        arm.velocity.add(Vector.getMultiple(arm.position, -0.005));
        this.velocity.add(Vector.getMultiple(arm.position, 0.0005));
      }
    }
  }
  move() {
    this.velocity.multiply(0.97);
    this.position.add(this.velocity);
  }
}

export class Arm {
  constructor(position, radius) {
    this.position = position;
    this.radius = radius;

    this.velocity = new Vector(0, 0);
    this.velocityMax = 2;

    setInterval(() => {
      this.tick();
    }, interval);
  }

  // private
  tick() {
    this.limitVelocity();
    this.move();
  }
  limitVelocity() {
    if (this.velocity.getSize() > this.velocityMax)
      this.velocity.multiply(this.velocityMax / this.velocity.getSize());
  }
  move() {
    this.velocity.multiply(0.97);
    this.position.add(this.velocity);
  }
}
