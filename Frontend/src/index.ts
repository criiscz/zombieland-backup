import * as PIXI from 'pixi.js';
import {assets as ass} from "./assetsLoader";
import {Player} from "./entities/Player";
import {Map} from "./scenes/Map";
// Create the application helper and add its render target to the page
const app = new PIXI.Application({ width: 1368, height: 720 });
// resize the canvas to fill browser window dynamically
document.body.appendChild(app.view);
app.renderer.resize(window.innerWidth-15, window.innerHeight - 21);


const loadAssets = async () => {
  const map = await ass.map;
  const player = await ass.player;

  return {
    map,
    player,
  };
}

// Create the map
const map = new Map(app);


// Create the player.png
const player = new Player(app, {
  id: "1",
  name: "Player",
  x: 100,
  y: 100,
  axis: 0,
  speed: 5,
  hp: 100,
  maxHp: 100,
  score: 0,
  isDead: false,
});




// Listen for keydown events

const mapKeys : any = {}; // You could also use an array
onkeydown = onkeyup = (e) => {
  mapKeys[e.key] = e.type == 'keydown';
  player.update(mapKeys);
}

