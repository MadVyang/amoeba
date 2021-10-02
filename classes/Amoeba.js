import { Vector, interval } from './Helper.js';

const controlRadius = 50;
const controlPower = 0.1;

const amoebaVelocityMax = 10;
const amoebaFriction = 0.05;
const amoebaBoundary = 1.3;
const amoebaGravity = 0.003;

const armVelocityMax = 3;
const armFriction = 0.1;
const armExpansionMax = 1.2;
const armRepulsion = 0.03;
const armGravity = 0.2;
const armRadiusMin = 2;

export class Amoeba {
  constructor(numArms = 100, armDefaultRadius = 5) {
    this.arms = [];
    let tempSpawnRadius = armDefaultRadius / Math.sin(Math.PI / numArms);
    let sumArmRadiusSquare = 0;
    for (let i = 0; i < numArms; i++) {
      let armPosition = new Vector(
        Math.cos(i * ((Math.PI * 2) / numArms)) * tempSpawnRadius,
        Math.sin(i * ((Math.PI * 2) / numArms)) * tempSpawnRadius
      );
      let armRadius =
        armDefaultRadius + armDefaultRadius * (Math.random() - 0.5);
      this.arms.push(new Arm(armPosition, armRadius));
      sumArmRadiusSquare += armRadius;
    }
    this.radius = Math.sqrt(sumArmRadiusSquare) * amoebaBoundary;
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
      if (arm.position.getLength() > this.radius * amoebaBoundary) {
        let distance = Vector.getDistance(arm.position, localControlPosition);
        if (distance < controlRadius) {
          arm.isSelected = true;
        }
      }
    }
  }
  endControl() {
    for (let arm of this.arms) {
      if (arm.isSelected) {
        arm.velocity.add(Vector.getMultiple(this.controlVector, controlPower));
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
    this.attachArmToNucleus();
    this.move();
  }
  collideArms() {
    for (let i in this.arms) {
      for (let j in this.arms) {
        if (i == j) continue;
        let armA = this.arms[i];
        let armB = this.arms[j];
        let delta = Vector.getMinus(armA.position, armB.position);
        let direction = Vector.getLookAt(armA.position, armB.position);
        if (delta.getLength() < armA.radius + armB.radius) {
          armA.velocity.add(
            Vector.getMultiple(direction, delta.getLength() * armRepulsion)
          );
          armB.velocity.add(
            Vector.getMultiple(direction, -delta.getLength() * armRepulsion)
          );
        } else if (delta.getLength() < this.radius) {
          // armA.velocity.add(
          //   Vector.getMultiple(direction, -armGravity / delta.getLength())
          // );
          // armB.velocity.add(
          //   Vector.getMultiple(direction, armGravity / delta.getLength())
          // );
        }
      }
    }
  }
  attachArmToNucleus() {
    for (let arm of this.arms) {
      let excess = arm.position.getLength() * armExpansionMax - this.radius;
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
