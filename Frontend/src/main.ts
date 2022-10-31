import { Application, InteractionEvent, Sprite } from 'pixi.js';
import { Map } from './scenes/Map';
import { Player } from './entities/Player';
import { Connection } from './connections/connection';
import { assets } from './assetsLoader';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const main = (app: Application) => {
  const myId = getRandomInt(20);
  const map = new Map(app);
  const connection = new Connection(app, map, myId);
  const keys: { [key: string]: boolean } = {};
  const player = new Player(app, map, {
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
  const initAppPreferences = () => {
    app.stage.sortableChildren = true;
    app.stage.interactive = true;
  };

  const keydown = (e: KeyboardEvent) => {
    keys[e.key] = true;
  };

  const keyup = (e: KeyboardEvent) => {
    keys[e.key] = false;
  };

  const mouseMove = (event: InteractionEvent) => {
    const position = event.data.global;
    // TODO: Create the angle of the shoot
  };

  const initListeners = () => {
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
    app.stage.on('pointermove', mouseMove);
  };

  const collisionBush = (player: Player) => {
    map.getChildren().forEach((child) => {
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
    map.getChildren().forEach((child) => {
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
      player.update(keys, connection, map);
      collisionPlayer(player);
      collisionBush(player);
      collisionMap(player);
    });
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
            map.addChild(bush).zIndex = 2;
          }
        }
      });
    });
  };

  const initGame = () => {
    addBushes();
    // new ScreenInitial(app);
    // new ScreenGameOver(app);
    // new ScreenGame(app);
    initAppPreferences();
    initListeners();
    initGameLoop();
  };

  initGame();
};

export { main };
