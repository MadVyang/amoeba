import { Renderer } from './Renderer.js';
import { Map } from './Map.js';
import { Amoeba } from './Amoeba.js';
import { Controller } from './Controller.js';
import { Vector, interval } from './Helper.js';

let map;
let amoeba;

let frameHandler = () => {
  Renderer.clear();
  Renderer.smoothlyFocusTo(amoeba.position);
  Renderer.renderMap(map);
};

let init = () => {
  amoeba = new Amoeba();
  map = new Map(amoeba);

  setInterval(frameHandler, interval);
  Controller.initialize(amoeba);
};

init();
