import { Map } from './Map.js';
import { Vector, interval } from './Helper.js';

const controlRadius = 50;
const controlPower = 0.04;

const amoebaVelocityMax = 10;
const amoebaFriction = 0.05;
const amoebaGravity = 0.0015;
const amoebaWeightMax = 130;

const armDefaultRadius = 5;
const armVelocityMax = 5;
const armFriction = 0.1;
const armRepulsion = 0.01;
const armLossRatio = 0.001;

const ALIVE = 'ALIVE',
  EXPLODED = 'EXPLODED';

export class Amoeba {
  constructor(numArms = 100) {
    this.arms = [];
    this.weight = 0;
    for (let i = 0; i < numArms; i++) {
      let spawnRadius = Math.sqrt(numArms) * armDefaultRadius * Math.random();
      let armPosition = new Vector(
        Math.cos(i * ((Math.PI * 2) / numArms)) * spawnRadius,
        Math.sin(i * ((Math.PI * 2) / numArms)) * spawnRadius
      );
      let armRadius =
        armDefaultRadius + armDefaultRadius * (Math.random() - 0.5);
      this.arms.push(new Arm(armPosition, armRadius));
      this.weight += Math.PI * armRadius * armRadius;
    }
    this.radius = Math.sqrt(this.weight) / Math.PI;
    this.position = new Vector();
    this.velocity = new Vector();
    this.selectedArm = null;
    this.controlVector = new Vector();
    this.controlStartPosition = new Vector();

    this.state = ALIVE;

    setInterval(() => {
      this.tick();
    }, interval);
  }

  // public
  tryStartControl(controlPosition) {
    if (!this.isAlive()) return;

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

  addArm(localPosition, radius) {
    this.arms.push(new Arm(localPosition, radius));
  }

  isAlive() {
    return this.state == ALIVE;
  }

  // private
  tick() {
    if (this.isAlive()) {
      this.collideArms();
      this.pullArms();
      this.deleteGoneArms();
      this.move();
      this.tryEat();
      this.setWeight();
    }
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
          let weightA = armA.radius;
          let weightB = armB.radius;
          armA.velocity.add(
            Vector.getMultiple(
              direction,
              armRepulsion * distance * (weightB / (weightA + weightB))
            )
          );
          armB.velocity.add(
            Vector.getMultiple(
              direction,
              -armRepulsion * distance * (weightA / (weightA + weightB))
            )
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
  deleteGoneArms() {
    for (let i in this.arms) {
      if (this.arms[i].isGone) {
        this.arms.splice(i, 1);
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

  tryEat() {
    for (let arm of this.arms) {
      let food = Map.tryGetFood(arm.position);
      if (food && !food.isGone) {
        food.isGone = true;
        this.addArm(food.getAmoebaLocalPosition(), food.radius);
      }
    }
  }

  setWeight() {
    this.weight = 0;
    for (let arm of this.arms) {
      this.weight += arm.radius * arm.radius;
    }
    this.weight /= armDefaultRadius * armDefaultRadius;

    if (this.weight > amoebaWeightMax) {
      this.explode();
    }
  }

  explode() {
    this.state = EXPLODED;
    for (let arm of this.arms) {
      arm.velocity.add(Vector.getMultiple(arm.position, armVelocityMax));
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

    this.isGone = false;

    this.tickPointer = setInterval(() => {
      this.tick();
    }, interval);
  }

  // private
  tick() {
    this.move();
    this.loss();
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
    this.radius -= armLossRatio;
    if (this.radius <= 0) {
      this.isGone = true;
      this.radius = 0;
      clearInterval(this.tickPointer);
    }
  }
}
