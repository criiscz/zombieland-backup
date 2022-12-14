import { Texture } from 'pixi.js';

interface SpritesList {
  [key: string]: Texture | undefined;
}

interface IPlayer {
  id: number;
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

interface IEnemy {
  id: number;
  x: number;
  y: number;
  axis: number;
  speed: number;
  hp: number;
}

export { SpritesList, IPlayer, IEnemy };
