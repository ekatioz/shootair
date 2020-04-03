import {
  Application, Sprite, SCALE_MODES, settings, AnimatedSprite,
} from 'pixi.js';
import Keyboard from './keyboard';


settings.SCALE_MODE = SCALE_MODES.NEAREST;

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
const app = new Application({
  width: 800, // default: 800
  height: 1200, // default: 600
  antialias: true, // default: false
});


const hornetTextures = {
  top: { name: 'top', file: 'assets/hornet.png' },
  topThrusting: { name: 'topThrusting', file: 'assets/hornet-thrusting.png' },
  left: { name: 'left', file: 'assets/hornet-left.png' },
  leftThrusting: { name: 'leftThrusting', file: 'assets/hornet-left-thrusting.png' },
  right: { name: 'right', file: 'assets/hornet-right.png' },
  rightThrusting: { name: 'rightThrusting', file: 'assets/hornet-right-thrusting.png' },
};

const getHornetFrame = (texture) => Object.values(hornetTextures).indexOf(texture);

// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);

Object.values(hornetTextures).forEach((hornet) => app.loader.add(hornet.name, hornet.file));

app.loader.load((loader, resources) => {
  // This creates a texture from a 'bunny.png' image.
  const hornet = new AnimatedSprite(Object.keys(hornetTextures).map((key) => resources[key].texture));

  const boundaries = {
    top: 0,
    left: hornet.width,
    bottom: app.renderer.height - hornet.height * 2,
    right: app.renderer.width - hornet.width,
  };


  hornet.x = app.renderer.width / 2;
  hornet.y = boundaries.bottom;


  // Rotate around the center
  hornet.anchor.x = 0.5;
  hornet.anchor.y = 0;

  hornet.scale = { x: 2, y: 2 };

  // Add the bunny to the scene we are building.
  app.stage.addChild(hornet);

  app.view.setAttribute('tabindex', 0);
  const keyboard = new Keyboard();
  keyboard.watch(app.view);

  let speed = 0;
  const maxSpeed = 12;
  const minSpeed = -12;
  const accelerate = () => { speed = (speed > maxSpeed) ? maxSpeed : speed + 0.2; };
  const brake = () => { speed = (speed < minSpeed) ? minSpeed : speed - 0.5; };
  let rollSpeed = 0;
  const roll = ({ direction }) => {
    if (direction === 'right') {
      rollSpeed = (rollSpeed < minSpeed) ? minSpeed : rollSpeed + 0.5;
    } else {
      rollSpeed = (rollSpeed < minSpeed) ? minSpeed : rollSpeed - 0.5;
    }
  };

  // Listen for frame updates
  app.ticker.add(() => {
    hornet.gotoAndStop(getHornetFrame(hornetTextures.topThrusting));
    if (keyboard.pressed.ArrowUp) {
      hornet.gotoAndStop(getHornetFrame(hornetTextures.topThrusting));
      accelerate();
    }
    if (keyboard.pressed.ArrowDown) {
      hornet.gotoAndStop(getHornetFrame(hornetTextures.top));
      brake();
    }
    if (keyboard.pressed.ArrowLeft) {
      hornet.gotoAndStop(getHornetFrame(hornetTextures.leftThrusting));
      if (keyboard.pressed.ArrowDown) {
        hornet.gotoAndStop(getHornetFrame(hornetTextures.left));
      }
      roll({ direction: 'left' });
    }
    if (keyboard.pressed.ArrowRight) {
      hornet.gotoAndStop(getHornetFrame(hornetTextures.rightThrusting));
      if (keyboard.pressed.ArrowDown) {
        hornet.gotoAndStop(getHornetFrame(hornetTextures.right));
      }
      roll({ direction: 'right' });
    }

    hornet.y -= speed;
    hornet.x += rollSpeed;

    if (hornet.y < boundaries.top) {
      hornet.y = boundaries.top;
      speed = 0;
    }
    if (hornet.y > boundaries.bottom) {
      hornet.y = boundaries.bottom;
      speed = 0;
    }
    if (hornet.x < boundaries.left) {
      hornet.x = boundaries.left;
      rollSpeed = 0;
    }
    if (hornet.x > boundaries.right) {
      hornet.x = boundaries.right;
      rollSpeed = 0;
    }
    /*     if (rollTime > 60) {
      const currentRoll = roll();
      lastRoll = currentRoll;
      rollTime = 0;
    }
    rollTime++;
    hornet.x += lastRoll;
    if (direction === 'FORWARDS') {
      hornet.gotoAndStop(1);
      hornet.y -= speed;
      if (hornet.y < 200) {
        brake();
        hornet.gotoAndStop(0);
      } else {
        accelerate();
      }
    } else {
      hornet.gotoAndStop(0);
      hornet.y += speed;
      if (hornet.y > app.renderer.screen.height - 200) {
        brake();
        hornet.gotoAndStop(1);
      } else {
        accelerate();
      }
    } */
  });
});
