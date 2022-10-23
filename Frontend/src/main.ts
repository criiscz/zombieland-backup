import { Application } from 'pixi.js';
import { Map } from './scenes/Map';
import { Player } from './entities/Player';
import { Connection } from './connections/connection';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const main = (app: Application) => {
  const myId = getRandomInt(20);
  const connection = new Connection(app, myId);
  const keys: { [key: string]: boolean } = {};
  const player = new Player(app, {
    id: myId,
    name: 'Player',
    x: 100,
    y: 100,
    axis: 0,
    speed: 15,
    hp: 100,
    maxHp: 100,
    score: 0,
    isDead: false,
  });
  const keydown = (e: KeyboardEvent) => {
    keys[e.key] = true;
  };

  const keyup = (e: KeyboardEvent) => {
    keys[e.key] = false;
  };

  const initGameLoop = () => {
    app.ticker.add(() => {
      player.update(keys, connection);
    });
  };

  const initListeners = () => {
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
  };

  const initGame = () => {
    new Map(app);
    // new ScreenInitial(app);
    // new ScreenGameOver(app);
    // new ScreenGame(app);
    initListeners();
    initGameLoop();
  };
  // COMMIT #100 !!!

  initGame();
};

export { main };
