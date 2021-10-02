import { Renderer } from './Renderer.js';
import { Vector } from './Helper.js';

export class Controller {
  static controllingAmoeba;
  static touchStartPosition = new Vector();
  static isTouchingNow = false;

  static initialize(amoeba) {
    Controller.setControllingAmoeba(amoeba);
    window.addEventListener('click', Controller.clickHandler);
    window.addEventListener('touchstart', Controller.touchStartHandler);
    window.addEventListener('touchend', Controller.touchEndHandler);
    window.addEventListener('touchmove', Controller.touchMoveHandler);
    window.addEventListener('mousedown', Controller.touchStartHandler);
    window.addEventListener('mouseup', Controller.touchEndHandler);
    window.addEventListener('mousemove', Controller.touchMoveHandler);
  }

  static setControllingAmoeba(amoeba) {
    Controller.controllingAmoeba = amoeba;
  }

  static clickHandler(e) {}
  static touchStartHandler(e) {
    Controller.isTouchingNow = true;
    Controller.touchStartPosition = new Vector(e.offsetX, e.offsetY);
    Controller.controllingAmoeba.tryStartControl(
      Vector.getAddition(Controller.touchStartPosition, Renderer.camPosition)
    );
  }
  static touchEndHandler(e) {
    Controller.isTouchingNow = false;
    Controller.controllingAmoeba.endControl();
  }
  static touchMoveHandler(e) {
    if (Controller.isTouchingNow) {
      Controller.controllingAmoeba.setControlVector(
        new Vector(e.offsetX, e.offsetY).minus(Controller.touchStartPosition)
      );
    }
  }
}
