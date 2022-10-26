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
const player = Assets.load('./assets/entities/player.png');

// create a list of assets
const assets = {
  map,
  player,
  mapTiles,
  bush,
};

export { assets };
