import { Application, Container, Graphics, Text } from 'pixi.js';

class MainScene extends Container {
  app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
    this.buildScene();
  }

  public buildScene() {
    this.initContainer();
    this.createBackground();
    this.createTitle();
    this.createButtons();
    this.visible = true;
    this.app.stage.addChild(this);
  }

  private createBackground() {
    const background = new Graphics();
    background.beginFill(0x000000, 0.2);
    background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
    background.endFill();
    this.addChild(background);
  }

  private createTitle() {
    const text = new Text('ZombieLand');
    text.x = this.app.screen.width / 2;
    text.y = this.app.screen.height / 4;
    text.style.fontFamily = 'Poppins';
    text.style.fontWeight = 'bold';
    text.style.fontSize = 60;
    text.style.stroke = 0x000000;
    text.style.strokeThickness = 6;
    text.style.fill = 0xffffff;
    text.anchor.set(0.5, 0.5);
    this.addChild(text);
  }

  private createButton(
    text: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const button = new Graphics();
    button.beginFill(0x0a2936, 1);
    button.drawRoundedRect(x, y, width, height, 10);
    button.endFill();

    const buttonText = new Text(text);
    buttonText.x = x + width / 2;
    buttonText.y = y + height / 2;
    buttonText.style.fontFamily = 'Poppins';
    buttonText.style.fontSize = 20;
    buttonText.style.fill = 0xffffff;
    buttonText.anchor.set(0.5, 0.5);
    button.buttonMode = true;
    button.interactive = true;
    button.addChild(buttonText);
    this.addChild(button);
    return button;
  }

  private initContainer() {
    this.createBorder();
  }

  private createBorder() {
    const border = new Graphics();
    border.lineStyle(2, 0x000000, 1);
    border.drawRect(this.x, this.y, this.width, this.height);
    this.addChild(border);
  }

  private createButtons() {
    const buttonWidth = 400;
    const buttonHeight = 60;
    const buttonX = this.app.screen.width / 2 - buttonWidth / 2;
    const buttonY = this.app.screen.height / 2 - buttonHeight / 2;

    const buttonLogin = this.createButton(
      'Login',
      buttonX,
      buttonY,
      buttonWidth,
      buttonHeight
    );
    const buttonRegister = this.createButton(
      'Register',
      buttonX,
      buttonY + 100,
      buttonWidth,
      buttonHeight
    );

    this.addListeners(buttonLogin, () => {});
    this.addListeners(buttonRegister, () => {});
  }

  private addListeners(button: Graphics, callback: () => void) {
    button.on('pointerdown', () => {
      button.scale.set(0.95, 0.95);
      button.x += (this.app.screen.width / 2) * 0.05;
      button.y += (this.app.screen.height / 2) * 0.05;
      callback();
    });

    button.on('pointerover', () => {
      button.alpha = 0.8;
    });

    button.on('pointerout', () => {
      button.alpha = 1;
    });

    button.on('pointerup', () => {
      button.scale.set(1, 1);
      button.x -= (this.app.screen.width / 2) * 0.05;
      button.y -= (this.app.screen.height / 2) * 0.05;
    });
  }
}

export { MainScene };
