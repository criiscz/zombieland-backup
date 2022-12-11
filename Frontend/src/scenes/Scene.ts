import { Application, Container, DisplayObject, Graphics, Text } from 'pixi.js';

class Scene extends Container {
  app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
    this.buildScene();
  }

  buildScene() {
    this.visible = false;
    this.app.stage.addChild(this);
  }

  public setBackground(
    color: number,
    alpha: number,
    xyPoint = [0, 0],
    width = this.app.screen.width,
    height = this.app.screen.height
  ) {
    const background = new Graphics();
    background.beginFill(color, alpha);
    background.drawRect(xyPoint[0], xyPoint[1], width, height);
    background.endFill();
    return this.addChild(background);
  }

  public createText(text: Text) {
    return this.addChild(text);
  }

  public createButton(
    text: Text,
    x: number,
    y: number,
    width: number,
    height: number,
    color = 0x0a2936,
    alpha = 1,
    radius = 10
  ) {
    const button = new Graphics();
    button.beginFill(color, alpha);
    button.drawRoundedRect(x, y, width, height, radius);
    button.endFill();

    const buttonText = text;
    buttonText.x = x + width / 2;
    buttonText.y = y + height / 2;
    buttonText.anchor.set(0.5, 0.5);
    button.buttonMode = true;
    button.interactive = true;
    button.addChild(buttonText);
    this.addChild(button);
    return button;
  }

  public addElement(element: DisplayObject) {
    return this.addChild(element);
  }
}

export default Scene;
