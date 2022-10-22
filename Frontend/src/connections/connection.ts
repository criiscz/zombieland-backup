import { Application } from 'pixi.js';
import { Player } from '../entities/Player';

export class Connection {
  ws: WebSocket = new WebSocket('ws://127.0.0.1:8080');
  renderedPlayers: Player[] = [];

  constructor(app: Application, myId: number) {
    this.ws.onmessage = (event) => {
      this.handleInput(event.data, app, myId);
    };
  }

  sendData(data: string) {
    this.ws.send(data);
  }

  handleInput(input: string, app: Application, myId: number) {
    const players: any[] = JSON.parse(input).players;
    players
      .filter((current) => current.id != myId)
      .forEach((current) => {
        const isAlreadyInList = this.renderedPlayers.find(
          (player) => player.getId() == current.id
        );
        if (isAlreadyInList) {
          isAlreadyInList.updatePosition(
            current.position_x,
            current.position_y
          );
        } else {
          this.renderedPlayers.push(
            new Player(app, {
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
