import { Vector, interval } from './Helper.js';

const controlPower = 0.03;

const ameobaGravity = 0.002;
const amoebaMoveFraction = 0.97;

const armMoveFraction = 0.95;
const armRadiusMin = 2;
const armVelocityMax = 2.1;

export class Amoeba {
  constructor(numArms = 10, armRadius = 20) {
    this.arms = [];
    this.radius = armRadius / Math.sin(Math.PI / numArms);
    for (let i = 0; i < numArms; i++) {
      let position = new Vector(
        Math.cos(i * ((Math.PI * 2) / numArms)) * this.radius,
        Math.sin(i * ((Math.PI * 2) / numArms)) * this.radius
      );
      this.arms.push(
        new Arm(position, armRadius + armRadius * (Math.random() - 0.5))
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
    for (let arm of this.arms) {
      let excess = arm.position.getSize() - this.radius;
      if (excess > 0) {
        arm.velocity.add(
          Vector.getMultiple(arm.position.getNormal(), -excess * ameobaGravity)
        );
        this.velocity.add(
          Vector.getMultiple(
            arm.position.getNormal(),
            (excess * ameobaGravity * arm.radius) / armRadiusMin
          )
        );
      }
    }
  }
  move() {
    this.velocity.multiply(amoebaMoveFraction);
    this.position.add(this.velocity);
    for (let arm of this.arms) {
      arm.position.minus(this.velocity);
    }
  }
}

export class Arm {
  constructor(position, radius) {
    this.position = position;
    this.radius = radius;

    this.velocity = new Vector();

    this.isSelected = false;
    this.controlVector = new Vector();

    setInterval(() => {
      this.tick();
    }, interval);
  }

  // private
  tick() {
    this.move();
    this.loss();
  }
  move() {
    this.velocity.multiply(armMoveFraction);
    this.position.add(this.velocity);
  }
  loss() {
    if (
      this.radius > armRadiusMin &&
      this.velocity.getSize() > armVelocityMax
    ) {
      this.radius -= (this.velocity.getSize() / armVelocityMax) * 0.3;
    }
  }
}
