import { Renderer } from './Renderer.js';
import { Vector } from './Helper.js';

export class Controller {
  static controllingAmoeba;
  static controlStartPosition = new Vector();
  static isControllingNow = false;

  static initialize(amoeba) {
    Controller.setControllingAmoeba(amoeba);

    window.addEventListener('mousedown', Controller.mouseDownHandler);
    window.addEventListener('mouseup', Controller.mouseUpHandler);
    window.addEventListener('mousemove', Controller.mouseMoveHandler);

    window.addEventListener('touchstart', Controller.touchStartHandler);
    window.addEventListener('touchend', Controller.touchEndHandler);
    window.addEventListener('touchmove', Controller.touchMoveHandler);
  }

  static setControllingAmoeba(amoeba) {
    Controller.controllingAmoeba = amoeba;
  }

  static mouseDownHandler(e) {
    e.preventDefault();
    Controller.startControl(new Vector(e.offsetX, e.offsetY));
  }
  static mouseUpHandler(e) {
    e.preventDefault();
    Controller.endControl();
  }
  static mouseMoveHandler(e) {
    e.preventDefault();
    Controller.moveControl(new Vector(e.offsetX, e.offsetY));
  }
  static touchStartHandler(e) {
    e.preventDefault();
    for (let touch of e.changedTouches) {
      Controller.startControl(new Vector(touch.offsetX, touch.offsetY));
    }
  }
  static touchEndHandler(e) {
    e.preventDefault();
    Controller.endControl();
  }
  static touchMoveHandler(e) {
    e.preventDefault();
    for (let touch of e.changedTouches) {
      Controller.moveControl(new Vector(touch.offsetX, touch.offsetY));
    }
  }

  static startControl(controlVector) {
    Controller.isControllingNow = true;
    Controller.controlStartPosition = controlVector;
    Controller.controllingAmoeba.tryStartControl(
      Vector.getAddition(controlVector, Renderer.camPosition)
    );
  }
  static endControl() {
    Controller.isControllingNow = false;
    Controller.controllingAmoeba.endControl();
  }
  static moveControl(controlVector) {
    if (Controller.isControllingNow) {
      Controller.controllingAmoeba.setControlVector(
        controlVector.minus(Controller.controlStartPosition)
      );
    }
  }
}
