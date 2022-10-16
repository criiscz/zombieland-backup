import { Texture } from "pixi.js";

interface SpritesList {
  [key: string]: Texture | undefined;
}

interface IPlayer {
  id: string;
  name: string;
  x: number;
  y: number;
  axis: number;
  speed: number;
  hp: number;
  maxHp: number;
  score: number;
  isDead: boolean;
}

export { SpritesList, IPlayer };
