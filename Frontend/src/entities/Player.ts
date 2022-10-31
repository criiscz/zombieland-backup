import { AnimatedSprite, Application, Sprite } from 'pixi.js';
import { IPlayer } from '../types';
import { assets } from '../assetsLoader';
import { Map } from '../scenes/Map';
import { Connection } from '../connections/connection';

class Player {
  player: Sprite;
  private id: number;
  name: string;
  x: number;
  y: number;
  private axis: number;
  speed: number;
  private hp: number;
  private maxHp: number;
  private score: number;
  private isDead: boolean;

  constructor(app: Application, map: Map, player: IPlayer) {
    this.player = new Sprite();
    this.id = player.id;
    this.name = player.name;
    this.x = player.x;
    this.y = player.y;
    this.axis = player.axis;
    this.speed = player.speed;
    this.hp = player.hp;
    this.maxHp = player.maxHp;
    this.score = player.score;
    this.isDead = player.isDead;

    if (
      app.loader.resources.player &&
      app.loader.resources.player.spritesheet
    ) {
      this.initPlayer(app, map);
    } else {
      assets.playerLoader(app, () => {
        this.initPlayer(app, map);
      });
    }
  }

  public initPlayer(app: Application, map: Map) {
    const texture = app.loader.resources.player.spritesheet;
    if (!texture) {
      console.error("Can't load player animation");
      return;
    }
    const playerTexture = new AnimatedSprite(texture.animations.player);
    playerTexture.animationSpeed = 0.1;
    playerTexture.play();
    this.player = playerTexture;
    this.player.x = this.x;
    this.player.y = this.y;
    this.player.width = 50;
    this.player.height = 50;
    this.player.scale.set(1.2, 1.2);
    this.player.anchor.set(0, 0);
    this.player.name = 'player';
    map.addChild(this.player);
  }

  public update(
    keysMap: { [key: string]: boolean },
    connection: Connection,
    map: Map
  ) {
    let hasChangedPosition = false;
    if (keysMap['w'] || keysMap['ArrowUp'] || keysMap['W']) {
      this.y = this.player.y;
      this.player.y -= this.speed;
      map.updatePivot(this.player.x, this.player.y);
      hasChangedPosition = true;
    }
    if (keysMap['a'] || keysMap['ArrowLeft'] || keysMap['A']) {
      this.x = this.player.x;
      this.player.x -= this.speed;
      map.updatePivot(this.player.x, this.player.y);
      hasChangedPosition = true;
    }
    if (keysMap['s'] || keysMap['ArrowDown'] || keysMap['S']) {
      this.y = this.player.y;
      this.player.y += this.speed;
      map.updatePivot(this.player.x, this.player.y);
      hasChangedPosition = true;
    }
    if (keysMap['d'] || keysMap['ArrowRight'] || keysMap['D']) {
      this.x = this.player.x;
      this.player.x += this.speed;
      map.updatePivot(this.player.x, this.player.y);
      hasChangedPosition = true;
    }
    if (!hasChangedPosition) return;

    const data = JSON.stringify({
      player: this.getData(),
      attacks: [],
    });
    if (connection.isConnected()) {
      connection.sendData(data);
    }
  }

  public getData(): Object {
    return {
      id: this.id,
      name: this.name,
      position_x: this.player.x,
      position_y: this.player.y,
      skin: 2,
      axis: 1,
    };
  }

  public getId(): number {
    return this.id;
  }

  public updatePosition(x: number, y: number) {
    this.player.x = x;
    this.player.y = y;
  }

  public delete(map: Map) {
    map.removeChild(this.player);
  }
}

export { Player };
