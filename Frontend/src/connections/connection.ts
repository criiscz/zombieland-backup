import { Application } from 'pixi.js';
import { Player } from '../entities/Player';
import { Map } from '../scenes/Map';

export class Connection {
  private readonly app: Application;
  private readonly map: Map;
  private readonly ws: WebSocket = new WebSocket('ws://127.0.0.1:8090');
  private renderedPlayers: Player[] = [];

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
    I think a inner join can work here, this logic must be perfect!
  **/
  handleInput(input: string, myId: number) {
    const players: any[] = JSON.parse(input).players.filter(
      (player: any) => player.id !== myId
    );
    this.renderedPlayers.forEach((renderedPlayer) => {
      let incommingPlayer: any = players.find(
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
        (player) => player.getId() == current.id
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
