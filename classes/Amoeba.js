import { Vector, interval } from './Helper.js';

const controlRadius = 50;
const controlPower = 0.04;

const amoebaVelocityMax = 10;
const amoebaFriction = 0.05;
const amoebaGravity = 0.0015;

const armVelocityMax = 5;
const armFriction = 0.1;
const armExpansionMax = 1;
const armRepulsion = 0.01;
const armRadiusMin = 2;

export class Amoeba {
  constructor(numArms = 100, armDefaultRadius = 5) {
    this.arms = [];
    let tempSpawnRadius = armDefaultRadius / Math.sin(Math.PI / numArms);
    let armWeight = 0;
    for (let i = 0; i < numArms; i++) {
      let armPosition = new Vector(
        Math.cos(i * ((Math.PI * 2) / numArms)) * tempSpawnRadius,
        Math.sin(i * ((Math.PI * 2) / numArms)) * tempSpawnRadius
      );
      let armRadius =
        armDefaultRadius + armDefaultRadius * (Math.random() - 0.5);
      this.arms.push(new Arm(armPosition, armRadius));
      armWeight += Math.PI * armRadius * armRadius;
    }
    this.radius = Math.sqrt(armWeight) / Math.PI;
    this.position = new Vector();
    this.velocity = new Vector();
    this.selectedArm = null;
    this.controlVector = new Vector();
    this.controlStartPosition = new Vector();

    setInterval(() => {
      this.tick();
    }, interval);
  }

  tryStartControl(controlPosition) {
    this.controlVector = new Vector();
    let localControlPosition = Vector.getMinus(controlPosition, this.position);

    for (let arm of this.arms) {
      // select boundary only
      if (arm.position.getLength() > this.radius || true) {
        let distance = Vector.getDistance(arm.position, localControlPosition);
        if (distance < controlRadius) {
          arm.isSelected = true;
          arm.selectRatio = Math.pow(1 - distance / controlRadius, 1.5);
        }
      }
    }
  }
  endControl() {
    for (let arm of this.arms) {
      if (arm.isSelected) {
        arm.velocity.add(
          Vector.getMultiple(this.controlVector, controlPower * arm.selectRatio)
        );
        arm.isSelected = false;
      }
    }
  }

  setControlVector(controlVector) {
    this.controlVector = controlVector;
  }

  // private
  tick() {
    this.collideArms();
    this.pullArms();
    this.detachArms();
    this.move();
  }
  collideArms() {
    for (let i in this.arms) {
      for (let j in this.arms) {
        if (i == j) continue;
        let armA = this.arms[i];
        let armB = this.arms[j];
        let delta = Vector.getMinus(armA.position, armB.position);
        let distance = delta.getLength();
        let direction = Vector.getLookAt(armA.position, armB.position);
        if (distance < armA.radius + armB.radius) {
          armA.velocity.add(
            Vector.getMultiple(direction, armRepulsion * distance)
          );
          armB.velocity.add(
            Vector.getMultiple(direction, -armRepulsion * distance)
          );
        }
      }
    }
  }
  pullArms() {
    for (let arm of this.arms) {
      let excess = arm.position.getLength() - this.radius;
      if (excess > 0) {
        arm.velocity.add(
          Vector.getMultiple(arm.position.getUnit(), -excess * amoebaGravity)
        );
        this.velocity.add(
          Vector.getMultiple(arm.position.getUnit(), excess * amoebaGravity)
        );
      }
    }
  }
  detachArms() {
    for (let arm of this.arms) {
      let excess = arm.position.getLength() * armExpansionMax - this.radius;
      if (excess > 0) {
        //
      }
    }
  }
  move() {
    if (this.velocity.getLength() > amoebaVelocityMax) {
      this.velocity = Vector.getMultiple(
        this.velocity.getUnit(),
        amoebaVelocityMax
      );
    } else if (this.velocity.getLength() > amoebaFriction) {
      this.velocity.minus(
        Vector.getMultiple(this.velocity.getUnit(), amoebaFriction)
      );
    } else this.velocity.multiply(0.98);
    this.position.add(this.velocity);

    for (let arm of this.arms) {
      arm.position.minus(Vector.getMultiple(this.velocity, 0.8));
    }
  }
}

export class Arm {
  constructor(position, radius) {
    this.position = position;
    this.radius = radius;

    this.velocity = new Vector();

    this.isSelected = false;
    this.selectRatio = 0;
    this.controlVector = new Vector();

    setInterval(() => {
      this.tick();
    }, interval);
  }

  // private
  tick() {
    this.move();
    // this.loss();
  }
  move() {
    if (this.velocity.getLength() > armVelocityMax) {
      this.velocity = Vector.getMultiple(
        this.velocity.getUnit(),
        armVelocityMax
      );
    } else if (this.velocity.getLength() > armFriction) {
      this.velocity.minus(
        Vector.getMultiple(this.velocity.getUnit(), armFriction)
      );
    } else this.velocity.multiply(0.98);
    this.position.add(this.velocity);
  }
  loss() {
    if (this.radius > armRadiusMin) {
      let radiusLoss =
        Math.pow(this.velocity.getLength() / armVelocityMax, 2) * 0.1;
      this.radius -= radiusLoss;
    }
  }
}
