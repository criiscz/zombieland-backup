import { Application, Graphics, Text } from 'pixi.js';
import Scene from './Scene';

class MainScene extends Scene {
  app: Application;

  constructor(app: Application) {
    super(app);
    this.app = app;
    this.buildScene();
  }

  public buildScene() {
    this.setBackground(0x000000, 0.2);
    this.createTitle();
    this.createButtons();
    this.visible = false;
    this.app.stage.addChild(this);
  }

  private createTitle() {
    this.createText(
      new Text('ZombieLand', {
        fontFamily: 'Poppins',
        fontSize: 40,
        fill: 0x000000,
        stroke: 0xffffff,
        strokeThickness: 6,
        fontWeight: 'bold',
      })
    );
  }

  private createButtons() {
    const buttonWidth = 400;
    const buttonHeight = 60;
    const buttonX = this.app.screen.width / 2 - buttonWidth / 2;
    const buttonY = this.app.screen.height / 2 - buttonHeight / 2;

    const buttonLogin = this.createButton(
      new Text('Login', {
        fontFamily: 'Poppins',
        fontSize: 20,
        fill: 0xffffff,
      }),
      buttonX,
      buttonY,
      buttonWidth,
      buttonHeight
    );
    const buttonRegister = this.createButton(
      new Text('Register', {
        fontFamily: 'Poppins',
        fontSize: 20,
        fill: 0xffffff,
      }),
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
