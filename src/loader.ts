import { Loader, Texture } from "pixi.js";
import { SpritesList } from "./types";

const loader = Loader.shared;
let sprites: SpritesList = {};

// Load all the sprites
loader.add("map", "./assets/map.png");


// When all the sprites are loaded, create the sprites
loader.load((loader, resources) => {
  sprites.map = resources.map.texture;
});

export { sprites };
