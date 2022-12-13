import {Application, Sprite, Spritesheet, Texture} from "pixi.js";
import {assets} from "../assetsLoader";
import { Map } from '../scenes/Map';
import {Player} from "./Player";

class Bullet {

  bullet: Sprite;
  constructor(
    public app: Application,
    public map: Map,
    public x: number,
    public y: number,
    public angle: number,
    public ownerID: number,
    public id: number,
  ) {
    this.bullet = new Sprite();
    assets.bullet.then((texture) => {
      this.initBullet(app, map, texture);
    });
  }

  private initBullet(app: Application, map: Map, texture:Texture) {
    if (!texture) {
      console.error("Can't load player animation");
      return;
    }
    const bulletTexture = new Sprite(texture);
    bulletTexture.x = this.x;
    bulletTexture.y = this.y;
    bulletTexture.width = 50;
    bulletTexture.height = 50;
    bulletTexture.scale.set(0.1, 0.1);
    bulletTexture.anchor.set(0.5,0.5 );
    bulletTexture.zIndex = 100;
    this.bullet = bulletTexture;
    map.addChild(this.bullet);
  }

  public updatePosition(x: number, y: number) {
    this.bullet.x = x;
    this.bullet.y = y;
  }

  getId() {
    return this.id;
  }

  delete(map: Map) {
    map.removeChild(this.bullet);
  }

  getData() {
    return {
      attack_type: 'bullet',
      id: this.id,
      position_x: this.x,
      position_y: this.y,
      angle: this.angle,
      player_id: this.ownerID,
    };
  }
}

export { Bullet };
