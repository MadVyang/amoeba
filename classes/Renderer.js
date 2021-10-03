import { Map } from './Map.js';
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

  static renderScore(score) {
    Renderer.context.font = '12px Arial';
    Renderer.context.fillText('Weight: ' + score, 8, 20);
  }

  static renderMap() {
    Renderer.renderAmoeba(Map.amoeba);
    for (let food of Map.foods) {
      Renderer.renderFood(food);
    }
  }
  static renderAmoeba(amoeba) {
    Renderer.renderAmoebaBorder(amoeba);
    for (let arm of amoeba.arms) {
      if (arm.isSelected) {
        Renderer.setStyle(BLUE, 1);
        Renderer.renderArmControl(amoeba, arm);
      } else Renderer.setStyle(BLACK, 1);
      Renderer.renderArm(amoeba.position, arm);
    }
  }
  static renderAmoebaBorder(amoeba) {
    let accuracy = 360;
    let distances = new Array(accuracy).fill(0);
    for (let arm of amoeba.arms) {
      let direction = arm.position.getDirection() + Math.PI * 2;
      if (direction > Math.PI * 2) direction -= Math.PI * 2;
      let index = Math.floor(accuracy * (direction / (Math.PI * 2)));
      let distance = arm.position.getLength() + arm.radius;
      if (distances[index] < distance) distances[index] = distance;
    }
    let points = [];
    let prevDistance = amoeba.radius;
    for (let i = 0; i < accuracy * 2; i++) {
      let index = i % accuracy;
      if (distances[index] < prevDistance * 0.98)
        distances[index] = prevDistance * 0.98;
      prevDistance = distances[index];
    }
    for (let i = accuracy * 2; i >= 0; i--) {
      let index = i % accuracy;
      if (distances[index] < prevDistance * 0.98)
        distances[index] = prevDistance * 0.98;
      prevDistance = distances[index];
    }
    for (let i = 0; i < accuracy; i++) {
      let direction = (i / accuracy) * (Math.PI * 2);
      points.push(
        new Vector(
          distances[i] * Math.cos(direction),
          distances[i] * Math.sin(direction)
        ).add(amoeba.position)
      );
    }
    Renderer.setStyle('#000', 1);
    Renderer.context.beginPath();
    Renderer.moveTo(points[0]);
    for (let i in points) {
      Renderer.lineTo(points[i]);
    }
    Renderer.lineTo(points[0]);
    Renderer.context.stroke();
    Renderer.context.closePath();
  }
  static renderArm(amoebaPosition, arm) {
    Renderer.circle(
      Vector.getAddition(amoebaPosition, arm.position),
      arm.radius
    );
  }
  static renderArmControl(amoeba, arm) {
    Renderer.context.beginPath();
    let armWorldPosition = Vector.getAddition(amoeba.position, arm.position);
    Renderer.moveTo(armWorldPosition);
    Renderer.lineTo(
      Vector.getAddition(
        armWorldPosition,
        Vector.getMultiple(amoeba.controlVector, arm.selectRatio)
      )
    );
    Renderer.context.stroke();
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

  static blendColor(color1, color2, ratio) {
    let R1 = Number('0x' + color1.substr(1, 1));
    let G1 = Number('0x' + color1.substr(2, 1));
    let B1 = Number('0x' + color1.substr(3, 1));
    let R2 = Number('0x' + color2.substr(1, 1));
    let G2 = Number('0x' + color2.substr(2, 1));
    let B2 = Number('0x' + color2.substr(3, 1));
    let R = R1 * ratio + R2 * (1 - ratio);
    let G = G1 * ratio + G2 * (1 - ratio);
    let B = B1 * ratio + B2 * (1 - ratio);
    return (
      '#' +
      Math.round(R).toString(16) +
      Math.round(G).toString(16) +
      Math.round(B).toString(16)
    );
  }
}
