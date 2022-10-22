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

    const initKeyboardControl = () => {
        const mapKeys: { [key: string]: boolean } = {};
        onkeydown = onkeyup = (e) => {
            mapKeys[e.key] = e.type == 'keydown';
        };
        setInterval(() => {
            player.update(mapKeys, connection);
        }, 20);
    };

    const initGame = () => {
        new Map(app);
        // new ScreenInitial(app);
        // new ScreenGameOver(app);
        // new ScreenGame(app);
        initKeyboardControl();
    };

    initGame();
};

export { main };
