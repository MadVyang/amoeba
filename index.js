import { Renderer } from './classes/Renderer.js';
import { Map } from './classes/Map.js';
import { Amoeba } from './classes/Amoeba.js';
import { Controller } from './classes/Controller.js';
import { Vector, interval } from './classes/Helper.js';

let map;
let amoeba;

let frameHandler = () => {
  Renderer.clear();
  Renderer.smoothlyFocusTo(amoeba.position);
  Renderer.renderMap();
};

let init = () => {
  amoeba = new Amoeba();

  Map.initialize(amoeba);
  Controller.initialize(amoeba);

  setInterval(frameHandler, interval);
};

init();
