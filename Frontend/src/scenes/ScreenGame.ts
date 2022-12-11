import Scene from './Scene';
import { Application } from 'pixi.js';
import { assets } from '../assetsLoader';

class ScreenGame extends Scene {
  app: Application;

  constructor(app: Application) {
    super(app);
    this.app = app;
    this.buildScene();
  }

  public buildScene() {
    this.app.stage.addChild(this);
  }
}

export default ScreenGame;
