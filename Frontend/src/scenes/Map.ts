import { Application, Sprite } from 'pixi.js';
import { assets } from '../assetsLoader';

class Map {
  private readonly app: Application;
  public width!: number;
  public height!: number;

  constructor(app: Application) {
    this.app = app;
    this.generateMap(64);
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

  public generateMap(tileSize = 32) {
    this.load().then((tiles) => {
      for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
          const tile = new Sprite(tiles[Math.floor(Math.random() * 3)]);
          tile.x = i * tileSize;
          tile.y = j * tileSize;
          tile.scale.set(2, 2);
          this.app.stage.addChild(tile).zIndex = 0;
        }
      }
    });
    this.width = 150 * tileSize;
    this.height = 150 * tileSize;
  }

  public decorateMap(func: Function) {
    func(this.app);
  }
}

export { Map };
