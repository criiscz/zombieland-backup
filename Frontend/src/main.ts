import { Application, InteractionEvent, Sprite } from 'pixi.js';
import { Player } from './entities/Player';
import { Connection } from './connections/connection';
import ScreenGame from './scenes/ScreenGame';
import { Map } from './scenes/Map';
import { assets } from './assetsLoader';
import { ViewPointer } from './events/ViewPointer';
import { Enemy } from './entities/Enemy';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const main = (app: Application) => {
  const myId = getRandomInt(20);
  const map = new Map(app);
  const connection = new Connection(app, map, myId);
  const keys: { [key: string]: boolean } = {};
  let player: Player;
  let enemy: Enemy;

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
    const vp = new ViewPointer(app, player);
    vp.drawPointer2(position);
  };

  const initListeners = (player: Player) => {
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
    app.stage.on('pointermove', mouseMove, player);
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
    if (player.player.x > map.width - player.player.width) {
      player.player.x = map.width - player.player.width;
    }
    if (player.player.y < 0) {
      player.player.y = 0;
    }
    if (player.player.y > map.height - player.player.height) {
      player.player.y = map.height - player.player.height;
    }
  };

  function updatePlayer(player: Player) {
    player.update(keys, connection, map);
    collisionPlayer(player);
    collisionMap(player);
  }

  const addZombie = () => {
    return new Enemy(app, map, {
      id: 12,
      x: 10,
      y: 10,
      axis: 32,
      speed: 5,
      hp: 100,
    });
  };

  const initGameLoop = (player: Player) => {
    app.ticker.add(() => {
      updatePlayer(player);
    });
  };

  const initPlayer = () => {
    return new Player(app, map, {
      id: myId,
      name: 'Player',
      x: Math.floor(Math.random() * map.width),
      y: Math.floor(Math.random() * map.height),
      axis: 0,
      speed: 15,
      hp: 100,
      maxHp: 100,
      score: 0,
      isDead: false,
    });
  };

  // extract to another file
  const addBushes = () => {
    map.decorateMap(() => {
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
            map.addChild(bush);
          }
        }
      });
    });
  };

  function checkIfUserIsLoggedIn() {
    const isUserLoggedIn = localStorage.getItem('token_user');
    console.warn(
      "[main.ts {ln:128}] This action is not implemented yet. It's just a" +
        ' mockup' +
        ' (att sTeck :D)'
    );
    if (isUserLoggedIn !== null) {
      map.setBlur(0);
      // add player and send data to server.
    } else {
      if (
        document.location.pathname !== '/login.html' &&
        document.location.pathname !== '/register.html'
      ) {
        map.setBlur(5);
        document.location.href = '/login.html';
      }
    }
  }

  const initGame = () => {
    checkIfUserIsLoggedIn();
    new ScreenGame(app);
    initAppPreferences();
    if (document.location.pathname === '/') {
      player = initPlayer();
      enemy = addZombie();
      initListeners(player);
      initGameLoop(player);
      map.updatePivot(
        player.x - player.player.width / 2,
        player.y - player.player.height / 2
      );
      addBushes();
    }
  };

  initGame();
};

export { main };
