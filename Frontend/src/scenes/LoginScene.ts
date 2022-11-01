import Scene from './Scene';
import { Application, Graphics, Text } from 'pixi.js';

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
    this.createUsernameInput();
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

  private createUsernameInput() {
    const _text = '';
    const rect = new Graphics();
    rect.beginFill(0xdddddd, 1);
    rect.drawRoundedRect(0, 500, 400, 50, 10);
    rect.endFill();

    const text = new Text('Username...', {
      fontFamily: 'Poppins',
      fontSize: 20,
      fill: 0x888888,
    });

    text.x = 200;
    text.y = 525;
    text.anchor.set(0.5, 0.5);

    const caret = new Graphics();
    caret.beginFill(0x000000, 1);
    caret.drawRect(200, 512, 1, 30);
    caret.endFill();
    caret.alpha = 0;

    rect.interactive = true;
    rect.on('pointerdown', () => {
      text.text = '';
      text.style.fill = 0x000000;
      animate();
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Alt' || e.key === 'Control') return;
        if (e.key === 'Backspace') {
          text.text = text.text.slice(0, -1);
          animateCaret(false);
        } else {
          text.text += e.key;
          animateCaret(true);
        }
      });
    });

    const animate = () => {
      setInterval(() => {
        caret.alpha = caret.alpha === 0 ? 1 : 0;
      }, 500);
    };

    const animateCaret = (back: boolean) => {
      if (!back) caret.x -= 5;
      else caret.x += 5;
      if (caret.x > 600) caret.x = 200;
      if (caret.x < 0) caret.x = 0;
    };

    rect.addChild(text);
    rect.addChild(caret);
    this.addChild(rect);
  }

  private createBackgroundRect() {
    const background = new Graphics();
    background.beginFill(0xffffff, 1);
    background.drawRect(
      this.app.screen.width / 2 - 300,
      this.app.screen.height / 2 - 200,
      600,
      400
    );
    background.endFill();
    this.addChild(background);
  }
}

export default LoginScene;
