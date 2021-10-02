import { Map, Food } from './Map.js';
import { Amoeba, Joint } from './Amoeba.js';
import { Vector } from './Helper.js';

let _canvas = document.querySelector('canvas');
let _context = canvas.getContext('2d');

export class Renderer {
  static canvas = _canvas;
  static context = _context;
  static screenSize = new Vector(_canvas.width, _canvas.height);
  static camPosition = new Vector(-_canvas.width / 2, -_canvas.height / 2);

  static numSidePoints = 15;

  static clear() {
    Renderer.context.clearRect(
      0,
      0,
      Renderer.canvas.width,
      Renderer.canvas.height
    );
  }
  static moveTo(point) {
    let projectedPoint = Renderer.projectToScreen(point);
    Renderer.context.moveTo(projectedPoint.x, projectedPoint.y);
  }
  static lineTo(point) {
    let projectedPoint = Renderer.projectToScreen(point);
    Renderer.context.lineTo(projectedPoint.x, projectedPoint.y);
  }
  static quadraticCurveTo(controlPoint, targetPoint) {
    // Renderer.lineTo(controlPoint);
    // Renderer.lineTo(targetPoint);
    let projectedControlPoint = Renderer.projectToScreen(controlPoint);
    let projectedTargetPoint = Renderer.projectToScreen(targetPoint);
    Renderer.context.quadraticCurveTo(
      projectedControlPoint.x,
      projectedControlPoint.y,
      projectedTargetPoint.x,
      projectedTargetPoint.y
    );
  }

  static renderMap(map) {
    Renderer.renderAmoeba(map.amoeba);

    for (let food of map.foods) {
      Renderer.renderFood(food);
    }
  }
  static renderAmoeba(amoeba) {
    for (let joint of amoeba.joints) Renderer.renderJoint(joint);

    let point = Vector.getAddition(
      amoeba.head.position,
      Vector.getMultiple(amoeba.head.heading, amoeba.head.radius)
    );
    let heading = amoeba.head.heading;

    Renderer.context.strokeStyle = '#666';
    Renderer.context.beginPath();
    Renderer.moveTo(point);
    for (let joint of amoeba.joints) {
      let right = Vector.getVectorFromDirection(
        joint.heading.getDirection() + Math.PI / 2
      );
      let nextPoint = Vector.getAddition(
        joint.position,
        Vector.getMultiple(right, joint.radius)
      );
      let nextHeading = right;
      let controlPoint = Vector.getAddition(point, nextPoint).multiply(0.5);
      controlPoint.add(
        Vector.getVectorFromDirection(
          (heading.getDirection() + nextHeading.getDirection()) / 2
        ).multiply(joint.radius / 2)
      );
      Renderer.quadraticCurveTo(controlPoint, nextPoint);
      point = nextPoint;
      heading = nextHeading;
    }

    amoeba.joints.reverse();
    for (let joint of amoeba.joints) {
      let right = Vector.getVectorFromDirection(
        joint.heading.getDirection() - Math.PI / 2
      );
      let nextPoint = Vector.getAddition(
        joint.position,
        Vector.getMultiple(right, joint.radius)
      );
      let nextHeading = right;
      let controlPoint = Vector.getAddition(point, nextPoint).multiply(0.5);
      controlPoint.add(
        Vector.getVectorFromDirection(
          (heading.getDirection() + nextHeading.getDirection()) / 2
        ).multiply(joint.radius / 2)
      );
      Renderer.quadraticCurveTo(controlPoint, nextPoint);
      point = nextPoint;
      heading = nextHeading;
    }
    amoeba.joints.reverse();

    Renderer.context.closePath();
    Renderer.context.stroke();
  }
  static renderJoint(joint) {
    let projectedPoint = Renderer.projectToScreen(joint.position);
    Renderer.context.strokeStyle = '#CCC';
    Renderer.context.beginPath();
    Renderer.context.arc(
      projectedPoint.x,
      projectedPoint.y,
      joint.radius,
      0,
      Math.PI * 2
    );
    Renderer.context.stroke();
    Renderer.context.closePath();
  }
  static renderFood(food) {
    let projectedPoint = Renderer.projectToScreen(food.position);
    Renderer.context.strokeStyle = '#C00';
    Renderer.context.strokeRect(
      projectedPoint.x,
      projectedPoint.y,
      food.size.x,
      food.size.y
    );
  }

  static focusTo(point) {
    Renderer.camPosition = Vector.getAddition(
      point,
      Vector.getMultiple(Renderer.screenSize, -0.5)
    );
  }
  static smoothlyFocusTo(point) {
    let target = Vector.getAddition(
      point,
      Vector.getMultiple(Renderer.screenSize, -0.5)
    );
    Renderer.camPosition.add(
      Vector.getMinus(target, Renderer.camPosition).multiply(0.9)
    );
  }

  static projectToScreen(vector) {
    return new Vector(
      vector.x - Renderer.camPosition.x,
      vector.y - Renderer.camPosition.y
    );
  }
}
