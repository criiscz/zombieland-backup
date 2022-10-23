import { Sprite, Application } from 'pixi.js';
import { assets } from '../assetsLoader';

class Map {
  private app: Application;
  private map: Sprite;

  constructor(app: Application) {
    this.app = app;
    this.map = new Sprite();

    assets.map.then((texture) => {
      this.map = new Sprite(texture);
      this.map.anchor.set(0.5, 0.5);
      this.map.x = this.app.screen.width / 2;
      this.map.y = this.app.screen.height / 2;

      this.app.stage.addChildAt(this.map, 0);
    });
  }
}

export { Map };
