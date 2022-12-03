import { AnimatedSprite, Application } from 'pixi.js';
import '../assets/entities/player.json';
import { Assets } from '@pixi/assets';

// load assets
const map = Assets.load('./assets/scenes/map.png');
const bush = Assets.load('./assets/scenes/bush_1.png');
const mapTiles = [
  Assets.load('./assets/scenes/map_0.png'),
  Assets.load('./assets/scenes/map_1.png'),
  Assets.load('./assets/scenes/map_2.png'),
  Assets.load('./assets/scenes/map_3.png'),
];

/**
 * Base player animation loader, needs a call function and the context (app) of the game
 **/
const playerLoader = (app: Application, callback: () => void) => {
  app.loader.add('player', './assets/entities/player.json');
  app.loader.load(callback);
};
// const enemyLoader = (app: Application, callback: () => void) => {
//   app.loader.add('player', './assets/entities/player.json').load(callback);
// };

const hearth = Assets.load('./assets/');
const sheetEnemy = Assets.load('./assets/entities/zombie.json');

// create a list of assets
const assets = {
  playerLoader,
  map,
  mapTiles,
  bush,
  sheetEnemy,
};

export { assets };
