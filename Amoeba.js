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
        new Arm(position, armRadius + armRadius * 0.4 * (Math.random() - 0.5))
      );
    }
    this.position = new Vector();
    this.velocity = new Vector();
    this.selectedArm = null;
    this.controlVector = new Vector();

    setInterval(() => {
      this.tick();
    }, interval);
  }

  tryStartControl(controlPosition) {
    this.controlVector = new Vector();
    let localControlPosition = Vector.getMinus(controlPosition, this.position);
    for (let arm of this.arms) {
      if (
        Vector.getDistance(arm.position, localControlPosition) <
        arm.radius * 2
      ) {
        arm.isSelected = true;
        this.selectedArm = arm;
        // TODO: select nearest
        break;
      }
    }
  }
  endControl() {
    const controlPower = 0.01;
    if (this.selectedArm) {
      this.selectedArm.velocity.add(
        Vector.getMultiple(this.controlVector, controlPower)
      );
      this.selectedArm.isSelected = false;
      this.selectedArm = null;
    }
  }

  setControlVector(controlVector) {
    this.controlVector = controlVector;
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
          arm.velocity.add(Vector.getMultiple(direction, -1 / delta.getSize()));
        }
      }
    }
  }
  attachArmToNucleus() {
    const gravity = 0.005;
    for (let arm of this.arms) {
      let excess = arm.position.getSize() - this.radius / 2;
      if (excess > 0) {
        arm.velocity.add(
          Vector.getMultiple(arm.position.getNormal(), -excess * gravity)
        );
        this.velocity.add(
          Vector.getMultiple(
            arm.position.getNormal(),
            (excess * gravity) / (this.radius / 2 / arm.radius)
          )
        );
      }
    }
  }
  move() {
    const amoebaMoveFraction = 0.94;
    this.velocity.multiply(amoebaMoveFraction);
    this.position.add(this.velocity);
  }
}

export class Arm {
  constructor(position, radius) {
    this.position = position;
    this.radius = radius;

    this.velocity = new Vector();
    this.velocityMax = this.radius;

    this.isSelected = false;
    this.controlVector = new Vector();

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
    const armMoveFraction = 0.95;
    this.velocity.multiply(armMoveFraction);
    this.position.add(this.velocity);
  }
}
