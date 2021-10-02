import { Vector, interval } from './Helper.js';

export class Amoeba {
  constructor(numJoints = 10, radius = 10) {
    this.radius = radius;

    let joints = [];
    for (let i = 0; i < numJoints; i++) {
      joints.push(
        new Joint(
          new Vector(i * this.radius * 0.7, i * this.radius * 0.7),
          radius + radius * 0.1 * (Math.random() - 0.5)
        )
      );
    }
    this.joints = joints;
    this.head = joints[0];
    this.tail = joints[joints.length - 1];

    this.target = new Vector(0, 0);

    setInterval(() => {
      this.tick();
    }, interval);
  }

  // private
  tick() {
    this.collideJoints();
    this.attachJoints();
    this.setHeadings();
    this.followTarget();
  }
  collideJoints() {
    for (let i in this.joints) {
      for (let j in this.joints) {
        if (i >= j) continue;
        let prevJoint = this.joints[i];
        let joint = this.joints[j];
        if (
          Vector.getDistance(prevJoint.position, joint.position) <
          prevJoint.radius + joint.radius
        ) {
          let delta = Vector.getMinus(prevJoint.position, joint.position);
          let direction = Vector.getLookAt(prevJoint.position, joint.position);
          joint.addVelocity(
            Vector.getMultiple(direction, -0.7 / delta.getSize())
          );
          // if (i != 0)
          //   prevJoint.addVelocity(
          //     Vector.getMultiple(direction, 0.7 / delta.getSize())
          //   );
        }
      }
    }
  }
  attachJoints() {
    for (let i in this.joints) {
      if (i > 0) {
        let prevJoint = this.joints[i - 1];
        let joint = this.joints[i];
        if (
          Vector.getDistance(prevJoint.position, joint.position) >
          prevJoint.radius + joint.radius
        ) {
          joint.velocity.multiply(0.8);
          let gravity = Vector.getMinus(
            prevJoint.position,
            joint.position
          ).multiply(0.015);
          joint.addVelocity(gravity);
        }
      }
    }
  }
  setHeadings() {
    for (let i in this.joints) {
      if (i > 0) {
        let prevJoint = this.joints[i - 1];
        let joint = this.joints[i];
        joint.heading = Vector.getLookAt(prevJoint.position, joint.position);
      }
    }
  }
  followTarget() {
    let direction = Vector.getLookAt(this.target, this.head.position);
    let distance = Vector.getDistance(this.target, this.head.position);
    this.head.addVelocity(direction.multiply(distance * 0.1));
  }

  // public
  setTarget(target) {
    this.target.x = target.x;
    this.target.y = target.y;
    this.followTarget();

    this.head.heading = Vector.getLookAt(target, this.head.position);
  }
}

export class Joint {
  constructor(position, radius) {
    this.position = position;
    this.radius = radius;

    this.velocity = new Vector(0, 0);
    this.velocityMax = 2;
    this.heading = new Vector(0, -1);

    setInterval(() => {
      this.tick();
    }, interval);
  }

  addVelocity(velocity) {
    this.velocity.add(velocity);
  }

  tick() {
    if (this.velocity.getSize() > this.velocityMax)
      this.velocity.multiply(this.velocityMax / this.velocity.getSize());
    this.velocity.multiply(0.97);
    this.position.add(this.velocity);
  }
}
