import { Renderer } from './Renderer.js';
import { Vector } from './Helper.js';

export class Controller {
  static amoeba;
  static initialize(amoeba) {
    Controller.setControllingAmoeba(amoeba);
    window.addEventListener('click', Controller.clickHandler);
    window.addEventListener('vmousedown', Controller.touchStartHandler);
    window.addEventListener('vmouseup', Controller.touchEndHandler);
  }
  static setControllingAmoeba(amoeba) {
    Controller.controllingAmoeba = amoeba;
  }
  static clickHandler(e) {
    Controller.controllingAmoeba.setTargetPosition(
      new Vector(
        e.offsetX + Renderer.camPosition.x,
        e.offsetY + Renderer.camPosition.y
      )
    );
  }
  static touchStartHandler(e) {
    console.log(e);
  }
  static touchEndHandler(e) {
    console.log(e);
  }
}
