import * as PIXI from 'pixi.js';
import {assets as ass} from "./assetsLoader";
import {Player} from "./entities/Player";
// Create the application helper and add its render target to the page
const app = new PIXI.Application({ width: 1368, height: 720 });
document.body.appendChild(app.view);

const loadAssets = async () => {
  const map = await ass.map;
  const player = await ass.player;

  return {
    map,
    player,
  };
}

// Create the player.png
const player = new Player(app, {
  id: "1",
  name: "Player",
  x: 100,
  y: 100,
  axis: 0,
  speed: 10,
  hp: 100,
  maxHp: 100,
  score: 0,
  isDead: false,
});

// Listen for keydown events

const map : any = {}; // You could also use an array
onkeydown = onkeyup = (e) => {
  map[e.key] = e.type == 'keydown';
  player.update(map);
}

