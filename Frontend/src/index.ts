import * as PIXI from 'pixi.js';
import { main } from './main';

// Create a Pixi Application
const app = new PIXI.Application({
  width: 1368,
  height: 720,
});
document.body.appendChild(app.view);
app.renderer.resize(window.innerWidth - 15, window.innerHeight - 21);

// Start the game
main(app);
