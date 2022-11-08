import {
  Application,
  Container,
  DisplayObject,
  filters,
  Sprite,
} from 'pixi.js';
import { assets } from '../assetsLoader';

class Map {
  private readonly app: Application;
  private readonly container: Container;
  public width!: number;
  public height!: number;

  constructor(app: Application) {
    this.app = app;
    this.container = new Container();
    this.generateMap(64);
    this.setContainerParameters();
    this.setBlur(5);
  }

  public async load() {
    return Promise.all([
      assets.mapTiles[0],
      assets.mapTiles[1],
      assets.mapTiles[2],
    ]).then((textures) => {
      return textures;
    });
  }

  public setContainerParameters() {
    this.container.x = this.app.screen.width / 2;
    this.container.y = this.app.screen.height / 2;
    this.container.pivot.x = this.app.screen.width / 2;
    this.container.pivot.y = this.app.screen.height / 2;
  }

  public generateMap(tileSize = 32, mapSize = 64) {
    this.load().then((tiles) => {
      for (let i = 0; i < mapSize; i++) {
        for (let j = 0; j < mapSize; j++) {
          const tile = new Sprite(tiles[Math.floor(Math.random() * 3)]);
          tile.x = i * tileSize;
          tile.y = j * tileSize;
          tile.scale.set(2, 2);
          this.container.addChild(tile).zIndex = 0;
        }
      }
    });
    this.width = mapSize * tileSize;
    this.height = mapSize * tileSize;
    this.app.stage.addChild(this.container);
  }

  public addChild(object: DisplayObject): DisplayObject {
    return this.container.addChild(object);
  }

  public getChildren(): DisplayObject[] {
    return this.container.children;
  }

  public removeChild(object: DisplayObject) {
    this.container.removeChild(object);
  }

  public decorateMap(func: Function) {
    func(this.app);
  }

  public updatePivot(x: number, y: number) {
    this.container.pivot.x = x;
    this.container.pivot.y = y;
  }

  public setBlur(value = 5) {
    this.container.filters = [new filters.BlurFilter(value)];
  }

  public removeBlur() {
    this.container.filters = [];
  }
}

export { Map };
