import { Renderer } from './Renderer.js';
import { Map } from './Map.js';
import { Amoeba } from './Amoeba.js';
import { Controller } from './Controller.js';
import { Vector, interval } from './Helper.js';

let map;
let amoeba;

let frameHandler = () => {
  Renderer.clear();
  Renderer.smoothlyFocusTo(amoeba.head.position);
  Renderer.renderMap(map);
};

let init = () => {
  amoeba = new Amoeba(10, 15);
  map = new Map(amoeba);

  setInterval(frameHandler, interval);
  window.addEventListener('click', Controller.clickHandler);
  Controller.setAmoeba(amoeba);
};

init();
