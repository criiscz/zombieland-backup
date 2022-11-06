import { Application, Container, Graphics, Text } from 'pixi.js';

class InputText extends Container {
  _width: number;
  _height: number;
  text: Text;
  realText: string;
  password: boolean;
  caret: Graphics;
  _active: boolean;

  constructor(width: number, height: number, text: Text, password = false) {
    super();
    this._width = width;
    this._height = height;
    this.text = text;
    this.caret = new Graphics();
    this.createBackground();
    this.createText();
    this.createEventText();
    this.password = password;
    this.realText = '';
    this._active = false;
    this.createViewPasswordButton();
  }

  private createBackground() {
    const rect = new Graphics();
    rect.beginFill(0xdddddd, 1);
    console.log(this.width);
    rect.drawRoundedRect(0, 0, this._width, this._height, 10);
    rect.endFill();
    rect.interactive = true;

    rect.on('click', () => {
      if (this.realText === '') {
        this.text.text = '';
      }
      this._active = true;
    });

    rect.on('pointerover', () => {
      rect.tint = 0xcccccc;
    });

    rect.on('pointerout', () => {
      rect.tint = 0xffffff;
      this._active = false;
    });

    this.addChild(rect);
  }

  private createText() {
    const text = this.text;
    text.x = this.width / 2;
    text.y = this.height / 2;
    text.anchor.set(0.5, 0.5);

    text.on('pointerover', () => {
      this._active = true;
    });

    text.on('pointerout', () => {
      this._active = false;
    });

    this.addChild(text);
  }

  private createViewPasswordButton() {
    const button = new Graphics();
    button.beginFill(0xddddff, 1);
    button.drawRoundedRect(this._width - 50, this._height / 2 - 25, 50, 50, 10);
    button.endFill();
    button.interactive = true;
    button.buttonMode = true;
    button.on('pointerdown', () => {
      if (this.password) {
        this.text.text = this.realText;
      }
    });

    button.on('pointerup', () => {
      if (this.password) {
        this.text.text = this.realText.replace(/./g, '*');
      }
    });

    if (this.password) {
      this.addChild(button);
    }
  }

  private createEventText() {
    this.text.on('click', () => {
      if (this.realText === '') {
        this.text.text = '';
      }
      this._active = true;
    });

    const specialKeys = [
      'Tab',
      'Enter',
      'Shift',
      'Control',
      'Alt',
      'CapsLock',
      'Escape',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Delete',
    ];

    document.addEventListener('keydown', (e) => {
      if (!this._active) return;
      if (specialKeys.includes(e.key)) return;
      if (e.key === 'Backspace') {
        this.text.text = this.text.text.slice(0, -1);
      } else {
        this.text.text += this.password ? '*' : e.key;
        this.realText += e.key;
      }
    });
  }

  public getText() {
    return this.realText;
  }
}

export default InputText;
