import {
  AnimatedSprite,
  Application,
  Sprite,
  Spritesheet,
  Texture,
} from 'pixi.js';
import { IEnemy } from '../types';
import { Map } from '../scenes/Map';
import { assets } from '../assetsLoader';

class Enemy {
  enemy: Sprite;
  id: number;
  x: number;
  y: number;
  speed: number;
  axis: number;
  private hp: number;

  constructor(app: Application, map: Map, enemy: IEnemy) {
    this.enemy = new Sprite();
    this.id = enemy.id;
    this.x = enemy.x;
    this.y = enemy.y;
    this.axis = enemy.axis;
    this.speed = enemy.speed;
    this.hp = enemy.hp;
    assets.sheetEnemy.then((texture) => {
      this.initEnemy(app, map, texture);
    });
  }

  public initEnemy(app: Application, map: Map, texture: Spritesheet) {
    if (!texture) {
      console.error("Can't load player animation");
      return;
    }
    const enemyTexture = new AnimatedSprite(texture.animations.enemy);
    enemyTexture.animationSpeed = 0.1;
    enemyTexture.play();
    this.enemy = enemyTexture;
    this.enemy.x = this.x;
    this.enemy.y = this.y;
    this.enemy.width = 50;
    this.enemy.height = 50;
    this.enemy.scale.set(1.2, 1.2);
    this.enemy.anchor.set(0, 0);
    this.enemy.zIndex = 100;
    map.addChild(this.enemy);
  }

  public getData(): Object {
    return {
      id: this.id,
      position_x: this.enemy.x,
      position_y: this.enemy.y,
      skin: 2,
      axis: 1,
    };
  }

  public getId(): number {
    return this.id;
  }

  public updatePosition(x: number, y: number) {
    this.enemy.x = x;
    this.enemy.y = y;
  }

  public delete(map: Map) {
    map.removeChild(this.enemy);
  }
}

export { Enemy };
