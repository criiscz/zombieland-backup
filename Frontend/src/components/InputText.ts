import {
  Application,
  Container,
  DisplayObject,
  Graphics,
  Sprite,
  Text,
  TextStyle,
} from 'pixi.js';

class InputText {
  app: Application;
  text?: string;
  width: number;
  height: number;
  x: number;
  y: number;
  placeholder?: string;
  password: boolean;

  constructor(
    app: Application,
    text: string,
    placeholder = 'Input a text...',
    textStyle: TextStyle,
    width = 200,
    height = 50,
    password = false,
    xyPoint = [0, 0]
  ) {
    this.app = app;
    this.text = text;
    this.placeholder = placeholder;
    this.width = width;
    this.height = height;
    this.password = password;
    this.x = xyPoint[0];
    this.y = xyPoint[1];
    const rect = this.createRect();
    this.createText(new Text(this.text || this.placeholder || -1, textStyle));
    this.initListeners(rect);
  }

  private createRect() {
    const rect = new Graphics();
    rect.beginFill(0xfff000, 1);
    rect.drawRoundedRect(0, 500, 100, 200, 10);
    rect.endFill();
    return this.app.stage.addChild(rect);
  }

  public createText(text: Text) {
    text.x = this.x + this.width / 2;
    text.y = this.y + this.height / 2;
    text.anchor.set(0.5, 0.5);
    return this.app.stage.addChild(text);
  }

  public createcaret() {
    const caret = new Graphics();
    caret.beginFill(0x000000, 1);
    caret.drawRect(this.x + this.width / 2, this.y + this.height / 2, 1, 20);
    caret.endFill();
    return this.app.stage.addChild(caret);
  }

  public animateCaret() {
    const caret = this.createcaret();
    caret.alpha = 0;
    setInterval(() => {
      caret.alpha = caret.alpha === 0 ? 1 : 0;
    }, 500);
  }

  public initListeners(component: DisplayObject) {
    component.on('click', () => {
      this.animateCaret();
    });

    component.on('keydown', (e) => {
      console.log(e);
    });
  }
}

export default InputText;
