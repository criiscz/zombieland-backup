import Scene from './Scene';
import { Application, Graphics, Text } from 'pixi.js';
import InputText from '../components/InputText';

class LoginScene extends Scene {
  constructor(app: Application) {
    super(app);
    this.buildScene();
    this.app.stage.addChild(this);
  }

  public buildScene() {
    this.setBackground(0x000000, 0.2);
    this.createBackgroundRect();
    this.createLoginText();
    this.createInput();
    this.createLoginButton();
    this.createRegisterText();
  }

  private createLoginText() {
    const loginText = this.createText(
      new Text('Login', {
        fontFamily: 'Poppins',
        fontSize: 40,
        fill: 0x000000,
      })
    );
    loginText.x = this.app.screen.width / 2;
    loginText.y = this.app.screen.height / 2 - 100;
    loginText.anchor.set(0.5, 0.5);
  }

  private createInput() {
    const inputLogin = new InputText(
      400,
      50,
      new Text('Username', {
        fontFamily: 'Poppins',
        fontSize: 20,
        fill: 0x000000,
      })
    );

    inputLogin.x = this.app.screen.width / 2 - 200;
    inputLogin.y = this.app.screen.height / 2;

    this.addChild(inputLogin);

    const inputPassword = new InputText(
      400,
      50,
      new Text('Password', {
        fontFamily: 'Poppins',
        fontSize: 20,
        fill: 0x000000,
      }),
      true
    );

    inputPassword.x = this.app.screen.width / 2 - 200;
    inputPassword.y = this.app.screen.height / 2 + 100;

    this.addChild(inputPassword);
  }

  private createBackgroundRect() {
    const background = new Graphics();
    background.beginFill(0xffffff, 1);
    background.drawRoundedRect(
      this.app.screen.width / 2 - 300,
      this.app.screen.height / 2 - 200,
      600,
      550,
      20
    );
    background.endFill();
    this.addChild(background);
  }

  private createLoginButton() {
    const button = new Graphics();
    button.beginFill(0x000000, 1);
    button.drawRoundedRect(
      this.app.screen.width / 2 - 100,
      this.app.screen.height / 2 + 200,
      200,
      50,
      10
    );
    button.endFill();
    button.interactive = true;
    button.buttonMode = true;
    button.on('pointerdown', () => {
      console.log('Register ');
    });

    const buttonText = new Text('Login', {
      fontFamily: 'Poppins',
      fontSize: 20,
      fill: 0xffffff,
    });

    buttonText.x = this.app.screen.width / 2;
    buttonText.y = this.app.screen.height / 2 + 225;
    buttonText.anchor.set(0.5, 0.5);

    this.addChild(button);
    this.addChild(buttonText);

    button.on('pointerover', () => {
      button.alpha = 0.5;
    });

    button.on('pointerout', () => {
      button.alpha = 1;
    });
  }

  private createRegisterText() {
    const registerText = this.createText(
      new Text('Register', {
        fontFamily: 'Poppins',
        fontSize: 20,
        fill: 0x000000,
      })
    );
    registerText.x = this.app.screen.width / 2;
    registerText.y = this.app.screen.height / 2 + 300;
    registerText.anchor.set(0.5, 0.5);
    registerText.interactive = true;
    registerText.buttonMode = true;
    registerText.on('pointerdown', () => {
      console.log('Register ');
    });
    this.addChild(registerText);
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

export default LoginScene;
