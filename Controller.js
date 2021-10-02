import { Renderer } from './Renderer.js';
import { Vector } from './Helper.js';

export class Controller {
  static amoeba;
  static setAmoeba(amoeba) {
    Controller.amoeba = amoeba;
  }
  static clickHandler(e) {
    Controller.amoeba.setTarget(
      new Vector(
        e.pageX + Renderer.camPosition.x,
        e.pageY + Renderer.camPosition.y
      )
    );
  }
}
