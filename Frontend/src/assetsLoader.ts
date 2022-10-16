import { Assets } from "@pixi/assets";

// load assets
const map = Assets.load('./assets/scenes/map.png');
const player = Assets.load('./assets/entities/player.png');


// create a list of assets
const assets = {
  map,
  player,
};

export { assets };
