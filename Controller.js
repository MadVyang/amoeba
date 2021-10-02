import { Renderer } from './Renderer.js';
import { Vector } from './Helper.js';

export class Controller {
  static amoeba;
  static setControllingAmoeba(amoeba) {
    Controller.controllingAmoeba = amoeba;
  }
  static clickHandler(e) {
    console.log(e.pageX, e.pageY);
    Controller.controllingAmoeba.setTargetPosition(
      new Vector(
        e.offsetX + Renderer.camPosition.x,
        e.offsetY + Renderer.camPosition.y
      )
    );
  }
}
