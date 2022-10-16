import { Texture, Sprite, Application } from "pixi.js";

export const Map = (app: Application, texture: Texture) => {
  // Create a new texture from the image
  const map = new Sprite(texture);
  // Add the sprite to the stage
  app.stage.addChild(map);
};
