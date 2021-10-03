import { Renderer } from './Renderer.js';
import { Map } from './Map.js';
import { Amoeba } from './Amoeba.js';
import { Controller } from './Controller.js';
import { interval } from './Helper.js';

const READY = 'READY',
  PLAYING = 'PLAYING',
  END = 'END';

export class Game {
  static state = PLAYING;
  static amoeba;
  static initialize() {
    Game.amoeba = new Amoeba();
    Map.initialize(Game.amoeba);
    Controller.initialize(Game.amoeba);

    setInterval(Game.tick, interval);
  }

  static tick() {
    switch (Game.state) {
      case READY:
        break;
      case PLAYING:
        break;
      case END:
        break;
      default:
    }

    Renderer.clear();
    Renderer.smoothlyFocusTo(Game.amoeba.position);
    Renderer.renderMap();
    Renderer.renderScore(Game.amoeba);
  }

  static action() {
    switch (Game.state) {
      case READY:
        break;
      case PLAYING:
        break;
      case END:
        break;
      default:
    }
  }
}
