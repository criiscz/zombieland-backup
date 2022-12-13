import { Application, Graphics, Point, Text } from 'pixi.js';
import { Player } from '../entities/Player';

class ViewPointer {
  private xPlayer: number;
  private yPlayer: number;

  constructor(private app: Application, private player: Player | null) {
    if (player) {
      this.xPlayer = player.x;
      this.yPlayer = player.y;
    } else {
      this.xPlayer = 0;
      this.yPlayer = 0;
    }
  }

  public getAngle(point: Point): number {
    const x = point.x - this.app.screen.width / 2;
    const y = point.y - this.app.screen.height / 2;
    return (Math.atan2(y, x) * 180) / Math.PI;
  }

  public drawPointer(point: Point): void {
    const pointer = new Graphics();
    pointer.lineStyle(5, 0x000000, 1);
    pointer.moveTo(this.xPlayer, this.yPlayer);
    pointer.lineTo(point.x, point.y);
    pointer.endFill();
    this.app.stage.addChild(pointer);
  }

  public drawPointer2(point: Point): void {
    const angle = this.getAngle(point);
    const pointer = new Graphics();
    pointer.lineStyle(2, 0xc1c1c1, 1, 0.5, true);
    pointer.x = point.x;
    pointer.y = point.y;
    // pointer.lineTo(
    //   1000 * Math.cos(angle * (Math.PI / 180)),
    //
    //   1000 * Math.sin(angle * (Math.PI / 180))
    // );
    pointer.beginFill(0xc1c1c1, 1);
    pointer.drawCircle(0, 0, 5);
    pointer.endFill();
    pointer.name = 'pointer';
    pointer.endFill();

    const text = new Text(angle.toString(), {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xff1010,
      align: 'center',
    });
    text.x = pointer.x;
    text.y = pointer.y - 50;
    text.name = 'pointerText';

    this.app.stage.removeChild(this.app.stage.getChildByName('pointer'));
    this.app.stage.removeChild(this.app.stage.getChildByName('pointerText'));

    this.app.stage.addChild(pointer).zIndex = 1;
    // this.app.stage.addChild(text).zIndex = 1;

    // draw the pointer
  }
}

export { ViewPointer };
