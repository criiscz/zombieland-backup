import { Application, Sprite } from 'pixi.js';
import { Map } from './scenes/Map';
import { Player } from './entities/Player';
import { Connection } from './connections/connection';
import { assets } from './assetsLoader';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const main = (app: Application) => {
  const myId = getRandomInt(20);
  const connection = new Connection(app, myId);
  const keys: { [key: string]: boolean } = {};
  const map = new Map(app);
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

  const collisionBush = (player: Player) => {
    app.stage.children.forEach((child) => {
      if (child instanceof Sprite && child.name === 'bush') {
        if (child.getBounds().intersects(player.player.getBounds())) {
          console.log('collision');
          console.log(child.getBounds());
          player.player.x = player.x;
          player.player.y = player.y;
        }
      }
    });
  };

  const collisionPlayer = (player: Player) => {
    app.stage.children.forEach((child) => {
      if (
        child instanceof Sprite &&
        child.name === 'player' &&
        child !== player.player
      ) {
        if (child.getBounds().intersects(player.player.getBounds())) {
          player.player.x = player.x;
          player.player.y = player.y;
        }
      }
    });
  };

  const collisionMap = (player: Player) => {
    // use screen width and height
    if (player.player.x < 0) {
      player.player.x = 0;
    }
    if (player.player.x > app.screen.width - player.player.width) {
      player.player.x = app.screen.width - player.player.width;
    }
    if (player.player.y < 0) {
      player.player.y = 0;
    }
    if (player.player.y > app.screen.height - player.player.height) {
      player.player.y = app.screen.height - player.player.height;
    }
  };

  const initGameLoop = () => {
    app.ticker.add(() => {
      player.update(keys, connection);
      collisionBush(player);
      collisionPlayer(player);
      collisionMap(player);
    });
  };

  const initListeners = () => {
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
  };

  const initGame = () => {
    addBushes();
    // new ScreenInitial(app);
    // new ScreenGameOver(app);
    // new ScreenGame(app);
    initListeners();
    initGameLoop();
    app.stage.sortableChildren = true;
  };

  // extract to another file
  const addBushes = () => {
    map.decorateMap((app: Application) => {
      assets.bush.then((texture) => {
        const scale = 3;
        for (let i = 0; i < 50; i++) {
          for (let j = 0; j < 50; j++) {
            const bush = new Sprite(texture);
            bush.x = Math.floor(Math.random() * 500) * scale * 32;
            bush.y = Math.floor(Math.random() * 500) * scale * 32;
            bush.anchor.set(0, 0);
            bush.scale.set(scale, scale);
            bush.name = 'bush';
            app.stage.addChild(bush).zIndex = 2;
          }
        }
      });
    });
  };

  initGame();
};

export { main };
