import { Vector } from './Helper.js';

const RED = '#A00',
  BLUE = '#00A',
  GREEN = '#0A0',
  BLACK = '#AAA';
const smoothness = 0.9;

let _canvas = document.querySelector('#canvas');
let _context = canvas.getContext('2d');

export class Renderer {
  static canvas = _canvas;
  static context = _context;
  static screenSize = new Vector(_canvas.width, _canvas.height);
  static camPosition = new Vector(-_canvas.width / 2, -_canvas.height / 2);

  static clear() {
    Renderer.context.clearRect(
      0,
      0,
      Renderer.canvas.width,
      Renderer.canvas.height
    );
  }
  static setStyle(color, lineWidth) {
    Renderer.context.strokeStyle = color;
    Renderer.context.lineWidth = lineWidth;
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
  static circle(point, radius) {
    let projectedPoint = Renderer.projectToScreen(point);
    Renderer.context.beginPath();
    Renderer.context.arc(
      projectedPoint.x,
      projectedPoint.y,
      radius,
      0,
      Math.PI * 2
    );
    Renderer.context.stroke();
    Renderer.context.closePath();
  }

  static renderMap(map) {
    Renderer.renderAmoeba(map.amoeba);
    for (let food of map.foods) {
      Renderer.renderFood(food);
    }
  }
  static renderAmoeba(amoeba) {
    for (let arm of amoeba.arms) {
      if (arm.isSelected) {
        Renderer.setStyle(BLUE, 1);
        Renderer.context.beginPath();
        let armWorldPosition = Vector.getAddition(
          amoeba.position,
          arm.position
        );
        Renderer.moveTo(armWorldPosition);
        Renderer.lineTo(
          Vector.getAddition(armWorldPosition, amoeba.controlVector)
        );
        Renderer.context.stroke();
      } else Renderer.setStyle(BLACK, 1);
      // Renderer.context.beginPath();
      // Renderer.moveTo(amoeba.position);
      // Renderer.lineTo(Vector.getAddition(amoeba.position, arm.position));
      // Renderer.context.stroke();
      Renderer.renderArm(amoeba.position, arm);
    }
  }
  static renderArm(amoebaPosition, arm) {
    if (arm.isSelected) Renderer.setStyle(BLUE, 1);
    else Renderer.setStyle(BLACK, 1);
    Renderer.circle(
      Vector.getAddition(amoebaPosition, arm.position),
      arm.radius
    );
  }
  static renderFood(food) {
    Renderer.setStyle(GREEN, 1);
    Renderer.circle(food.position, food.radius);
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
      Vector.getMinus(target, Renderer.camPosition).multiply(smoothness)
    );
  }

  static projectToScreen(vector) {
    return new Vector(
      vector.x - Renderer.camPosition.x,
      vector.y - Renderer.camPosition.y
    );
  }

  static printDebug(debugString) {
    let debugContext = document.querySelector('#debugPanel').getContext('2d');
    debugContext.clearRect(
      0,
      0,
      document.querySelector('#debugPanel').width,
      document.querySelector('#debugPanel').height
    );
    debugContext.fillText(debugString, 0, 12);
  }
}
