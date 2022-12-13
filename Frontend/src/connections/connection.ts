import { Application } from 'pixi.js';
import { Player } from '../entities/Player';
import { Map } from '../scenes/Map';
import { NMap } from '../scenes/NMap';
import { Enemy } from '../entities/Enemy';
import {Bullet} from "../entities/Bullet";

export class Connection {
  private readonly app: Application;
  private readonly map: Map;
  private readonly ws: WebSocket = new WebSocket('ws://127.0.0.1:8090');
  private renderedPlayers: Player[] = [];
  private renderedEnemies: Enemy[] = [];
  private renderedBullets: Bullet[] = [];

  constructor(app: Application, map: Map, myId: number) {
    this.app = app;
    this.map = map;
    this.ws.onmessage = (event) => {
      this.handleInput(event.data, myId);
    };
  }

  sendData(data: string) {
    this.ws.send(data);
  }

  /**
   My logic here was shit, sorry (again) friend :D
   We need to check if a player has been disconnected from the server, and remove the sprite!
   I think an inner join can work here, this logic must be perfect!
   **/
  handleInput(input: string, myId: number) {

    if(JSON.parse(input).bullets.length > 0) {
      console.log(JSON.parse(input));
    }
    this.handlePlayer(input, myId);
    this.handleEnemies(input);
    this.handleBullets(input)
  }

  private handleEnemies(input: string) {
    const enemies: any[] = JSON.parse(input).enemies;
    this.renderedEnemies.forEach((renderedEnemy) => {
      const incommingEnemy: any = enemies.find(
        (enemy) => enemy.id === renderedEnemy.getId()
      );
      if (incommingEnemy) {
        renderedEnemy.updatePosition(
          incommingEnemy.position_x,
          incommingEnemy.position_y
        );
      } else {
        renderedEnemy.delete(this.map);
      }
    });
    enemies.forEach((current) => {
      const isAlreadyInList = this.renderedEnemies.find(
        (enemy) => enemy.getId() === current.id
      );
      if (!isAlreadyInList) {
        this.renderedEnemies.push(
          new Enemy(this.app, this.map, {
            id: current.id,
            x: current.x,
            y: current.y,
            speed: current.speed,
            axis: current.axis,
            hp: current.hp,
          })
        );
      }
    });
  }
  private handleBullets(input: string) {
    const bullets: any[] = JSON.parse(input).bullets;
    this.renderedBullets.forEach((renderedBullet) => {
      const incommingBullet: any = bullets.find(
        (bullet) => bullet.player_id === renderedBullet.ownerID
      );
      if (incommingBullet) {
        renderedBullet.updatePosition(
          incommingBullet.position_x,
          incommingBullet.position_y
        );
      } else {
        renderedBullet.delete(this.map);
      }
    });
    bullets.forEach((current) => {
      const isAlreadyInList = this.renderedBullets.find(
        (bullet) => bullet.ownerID === -1
      );
      if (!isAlreadyInList) {
        console.log("Agrego bullet")
        this.renderedBullets.push(
          new Bullet(this.app, this.map,current.x,current.y,current.axis, current.player_id, 123, true)
        );
      }
    });
  }

  private handlePlayer(input: string, myId: number) {
    const players: any[] = JSON.parse(input).players.filter(
      (player: any) => player.id !== myId
    );
    this.renderedPlayers.forEach((renderedPlayer) => {
      const incommingPlayer: any = players.find(
        (element) => element.id === renderedPlayer.getId()
      );
      if (incommingPlayer) {
        renderedPlayer.updatePosition(
          incommingPlayer.position_x,
          incommingPlayer.position_y
        );
      } else {
        renderedPlayer.delete(this.map);
      }
    });
    players.forEach((current) => {
      const isAlreadyInList = this.renderedPlayers.find(
        (player) => player.getId() === current.id
      );
      if (!isAlreadyInList) {
        this.renderedPlayers.push(
          new Player(this.app, this.map, {
            id: current.id,
            name: current.name,
            x: current.position_x,
            y: current.position_y,
            axis: current.axis,
            speed: 15,
            hp: current.hp,
            maxHp: 100,
            score: current.kills,
            isDead: false,
          })
        );
      }
    });
  }

  isConnected() {
    return this.ws.readyState === this.ws.OPEN;
  }
}
