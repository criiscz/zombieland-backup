import { Application, Sprite } from 'pixi.js';
import { IPlayer } from '../types';
import { assets } from '../assetsLoader';
import { Connection } from '../connections/connection';

class Player {
    private player: Sprite;
    private id: number;
    private name: string;
    private x: number;
    private y: number;
    private axis: number;
    private speed: number;
    private hp: number;
    private maxHp: number;
    private score: number;
    private isDead: boolean;

    constructor(app: Application, player: IPlayer) {
        this.player = new Sprite();
        this.id = player.id;
        this.name = player.name;
        this.x = player.x;
        this.y = player.y;
        this.axis = player.axis;
        this.speed = player.speed;
        this.hp = player.hp;
        this.maxHp = player.maxHp;
        this.score = player.score;
        this.isDead = player.isDead;

        assets.player.then((texture) => {
            this.player = new Sprite(texture);
            this.player.x = this.x;
            this.player.y = this.y;
            this.player.anchor.set(0.5, 0.5);
            this.player.scale.set(0.1, 0.1);
            app.stage.addChild(this.player);
        });
    }

    public update(map: { [key: string]: boolean }, connection: Connection) {
        const validKeys = [
            'w',
            'a',
            's',
            'd',
            'ArrowUp',
            'ArrowLeft',
            'ArrowDown',
            'ArrowRight',
            'W',
            'A',
            'S',
            'D',
        ];
        const keys = Object.keys(map).filter((key) => validKeys.includes(key));
        const isMoving = keys.length > 0;

        if (isMoving) {
            if (map['w'] || map['ArrowUp'] || map['W']) {
                this.player.y -= this.speed;
            }
            if (map['a'] || map['ArrowLeft'] || map['A']) {
                this.player.x -= this.speed;
            }
            if (map['s'] || map['ArrowDown'] || map['S']) {
                this.player.y += this.speed;
            }
            if (map['d'] || map['ArrowRight'] || map['D']) {
                this.player.x += this.speed;
            }
            const data = JSON.stringify({
                player: this.getData(),
                attacks: [],
            });
            connection.sendData(data);
        }
    }

    public getData(): Object {
        return {
            id: this.id,
            name: this.name,
            position_x: this.player.x,
            position_y: this.player.y,
            skin: 2,
            axis: 1,
        };
    }
    public getId(): number {
        return this.id;
    }
    public updatePosition(x: number, y: number) {
        this.player.x = x;
        this.player.y = y;
    }
}

export { Player };
