import Scene from './Scene';
import {Application, Sprite, Texture} from 'pixi.js';
import { assets } from '../assetsLoader';
import {Player} from "../entities/Player";

class ScreenGame extends Scene {
  app: Application;
  health: Sprite[] = [];

  constructor(app: Application, player: Player) {
    super(app);
    this.app = app;
    this.buildScene();
  }

  public buildScene() {
    assets.heart.then((texture: Texture) => {
      this.health.push(new Sprite(texture));
      this.health[0].x = 10;
      this.health[0].y = 10;
      this.health[0].width = 50;
      this.health[0].height = 50;
      this.addChild(this.health[0]);

      this.health.push(new Sprite(texture));
      this.health[1].x = 70;
      this.health[1].y = 10;
      this.health[1].width = 50;
      this.health[1].height = 50;
      this.addChild(this.health[1]);

      this.health.push(new Sprite(texture));
      this.health[2].x = 130;
      this.health[2].y = 10;
      this.health[2].width = 50;
      this.health[2].height = 50;
      this.addChild(this.health[2]);
    });
    this.app.stage.addChild(this);
  }
}

export default ScreenGame;
