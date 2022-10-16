import { Texture, Sprite, Application } from "pixi.js";

export const Map = (app: Application) => {
  // Create a new texture from the image
  const texture = Texture.from("./assets/map.png");
  // Create a new sprite from the texture
  const sprite = new Sprite(texture);

  app.stage.addChild(sprite);
};
