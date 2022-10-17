import { Application } from 'pixi.js';
import { Map } from './scenes/Map';
import { Player } from './entities/Player';

let app = new Application();

const main = (app: Application) => {
    const initGame = () => {
        new Map(app);
        new ScreenInitial(app);
        // new ScreenGameOver(app);
        // new ScreenGame(app);
    };

    const initSocket = () => {
        // const socket = io('http://localhost:3000');
        // socket.on('connect', () => {
        //     console.log('connected');
        //     initGame();
        // });
        // socket.on('disconnect', () => {
        //     console.log('disconnected');
        // });
        // socket.on('player', (player: IPlayer) => {
        //     console.log(player);
        //     new Player(app, player);
        // });
    };

    const player = new Player(app, {
        id: '1',
        name: 'Player',
        x: 100,
        y: 100,
        axis: 0,
        speed: 5,
        hp: 100,
        maxHp: 100,
        score: 0,
        isDead: false,
    });

    // Listen for keydown events

    const mapKeys: { [key: string]: boolean } = {};
    onkeydown = onkeyup = (e) => {
        mapKeys[e.key] = e.type == 'keydown';
        player.update(mapKeys);
    };
};

export { main };
