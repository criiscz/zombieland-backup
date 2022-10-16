import * as PIXI from 'pixi.js';
import { Map } from './scenes/Map';
import { manifest} from "./manifest-assets";
// Create the application helper and add its render target to the page
const app = new PIXI.Application({ width: 1368, height: 720 });
document.body.appendChild(app.view);

// Load a map image
Map(app);
