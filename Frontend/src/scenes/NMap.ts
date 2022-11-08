// import { Application, DisplayObject, filters, Sprite } from 'pixi.js';
// import { assets } from '../assetsLoader';
// // eslint-disable-next-line node/no-unpublished-import
// import { Viewport } from 'pixi-viewport';
//
// // eslint-disable-next-line node/no-unpublished-import
//
class NMap {}
//   private readonly app: Application;
//   private readonly view: Viewport;
//
//   width: number;
//   height: number;
//
//   constructor(app: Application, width = 1000, height = 1000) {
//     this.app = app;
//     this.width = width;
//     this.height = height;
//     this.view = new Viewport({
//       screenWidth: window.innerWidth,
//       screenHeight: window.innerHeight,
//       worldWidth: this.width,
//       worldHeight: this.height,
//       interaction: app.renderer.plugins.interaction,
//     });
//
//     this.view.interactive = true;
//     this.view.interactiveChildren = true;
//     this.generateMap();
//     this.app.stage.addChild(this.view);
//     this.initParams();
//   }
//
//   public async load() {
//     return Promise.all([
//       assets.mapTiles[0],
//       assets.mapTiles[1],
//       assets.mapTiles[2],
//     ]).then((textures) => {
//       return textures;
//     });
//   }
//
//   public generateMap(sizeMap = 100, tileSize = 10) {
//     this.load().then((tiles) => {
//       for (let i = 0; i < sizeMap; i++) {
//         for (let j = 0; j < sizeMap; j++) {
//           const tile = this.view.addChild(
//             new Sprite(tiles[Math.floor(Math.random() * 3)])
//           );
//           tile.zIndex = 0;
//           tile.position.set(i * tileSize, j * tileSize);
//         }
//       }
//     });
//   }
//
//   private initParams() {
//     this.view.drag().pinch().wheel().decelerate();
//
//     // this.view.moveCenter(this.width / 2, this.height / 2);
//   }
//
//   public updatePivot(x: number, y: number) {
//     this.view.moveCenter(x, y);
//   }
//
//   public addChild(object: DisplayObject): DisplayObject {
//     return this.view.addChild(object);
//   }
//
//   public getChildren(): DisplayObject[] {
//     return this.view.children;
//   }
//
//   public removeChild(object: DisplayObject) {
//     this.view.removeChild(object);
//   }
//
//   public setBlur(value = 5) {
//     this.view.filters = [new filters.BlurFilter(value)];
//   }
//
//   public removeBlur() {
//     this.view.filters = [];
//   }
// }
//
export { NMap };
