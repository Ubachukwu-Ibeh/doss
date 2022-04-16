//////////////////////////////World setting based functionalities

class Game {
  //World constuctor
  constructor(props) {
    this.pause = false;
    this.moveWorldX = 0;
    this.moveWorldY = 0;
    this.newDisplaySettings = {
      scaledX: 0,
      scaledY: 0,
      scaledWidth: undefined,
      scaledHeight: undefined,
      ctx: undefined,
    };
    this.camera = {
      focus: undefined,
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
    };
    this.scenes = {};

    for (const key in props) {
      this[key] = props[key];
    }

    return this;
  }
}

export const saved_game = JSON.parse(localStorage.getItem("saved-game"));

//initalize game object with Game constructor
export let game = new Game({});

//To set custom values for game object
export const setGame = (obj) => {
  for (const key in obj) {
    game[key] = obj[key];
  }
};

//Prepare canvas
const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

//Get scaleValue to resize world to screen
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const getScaleValue = () => {
  const { displayWidth, displayHeight, size } = game;

  const refX = windowWidth / 2 / (displayWidth / 2);
  const refY = windowHeight / 2 / (displayHeight / 2);

  const res = {
    refXY() {
      if (size === "fit") return refX;
      if (size === "fill") return refY;
    },
    refYX() {
      if (size === "fit") return refY;
      if (size === "fill") return refX;
    },
  };

  if (displayWidth > displayHeight) {
    if (windowHeight < windowWidth) {
      return res.refYX();
    } else {
      return res.refXY();
    }
  } else {
    if (windowHeight < windowWidth) {
      return res.refXY();
    } else {
      return res.refYX();
    }
  }
};

let osv; //original scale value.
let scaleValue;

export const addScenes = (name, scene) => {
  game.scenes[name] = scene;
};

export const switchScenes = (scene) => {
  osv = getScaleValue();
  scaleValue = osv;

  const { displayWidth, displayHeight } = game;

  const sceneType = typeof scene;

  if (sceneType === "number") {
    currentScene = {
      worldWidth: 0,
      worldHeight: 0,
      worldX: 0,
      worldY: 0,
      components: {},
    };
  } else if (sceneType === "string") {
    currentScene = game.scenes[scene];
  }

  components = currentScene.components;

  currentScene.worldWidth *= scaleValue;
  currentScene.worldHeight *= scaleValue;

  const scaledWidth = displayWidth * scaleValue;
  const scaledHeight = displayHeight * scaleValue;

  game.newDisplaySettings.scaledWidth = scaledWidth;
  game.newDisplaySettings.scaledHeight = scaledHeight;

  game.newDisplaySettings.yMargin = (windowHeight - scaledHeight) / 2;
  game.newDisplaySettings.xMargin = (windowWidth - scaledWidth) / 2;

  game.newDisplaySettings.ctx = ctx;

  canvas.width = scaledWidth;
  canvas.height = scaledHeight;
};

switchScenes(0);

//////////////////////////////Engine based functionalities

export let currentScene, components;

export const resolveComponents = () => {
  //Resolves which components should be calculated and rendered on screen
  const { scaledX, scaledY, scaledWidth, scaledHeight } =
    game.newDisplaySettings;

  const resolvedComponents = {};

  Object.keys(components).forEach((key) => {
    const component = components[key];
    if (
      component.important ||
      (component.x < scaledWidth &&
        scaledX < component.x + component.width &&
        component.y < scaledHeight &&
        scaledY < component.y + component.height)
    ) {
      resolvedComponents[key] = component;
    }
  });

  return resolvedComponents;
};

//Keyboard controls
export const keys = {}; //object for keeping track of keyboard keys boolean values

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

//Image preload
export const preloadImage = (src) => {
  const image = document.createElement("img");
  image.setAttribute("src", src.default);
  return image;
};

//Sound preload
export const preloadSound = (src) => {
  const sfx = new Audio(src);
  sfx.preload = "auto";
  return sfx;
};

//Set scale of values on initialization
export const set = (val) => {
  if (scaleValue !== osv) {
    return val * osv * scaleValue;
  } else {
    return val * scaleValue;
  }
};

//Camera shake
export const cameraShake = (axis, arr) => {
  game.cameraShake[`${axis}Values`] = arr;
};

//Zooming
const resolveZoom = (obj, val, reset) => {
  let amount = val;

  if (reset) amount = 1 / amount;

  scaleValue = amount;

  let { x, y } = obj;

  const initialPx = x;
  const initialPy = y;

  x *= amount;
  y *= amount;

  let dx = initialPx - x;
  let dy = initialPy - y;

  game.camera.x *= amount;
  game.camera.y *= amount;
  game.camera.width *= amount;
  game.camera.height *= amount;
  game.camera.x += dx;
  game.camera.y += dy;

  currentScene.worldX *= amount;
  currentScene.worldY *= amount;
  currentScene.worldWidth *= amount;
  currentScene.worldHeight *= amount;

  Object.values(components).forEach((component) => {
    component.x *= amount;
    component.y *= amount;
    component.width *= amount;
    component.height *= amount;
    component.x += dx;
    component.y += dy;
  });
};

let hasScaled = false;

export const zoom = (obj, amount) => {
  if (hasScaled) {
    resolveZoom(obj, scaleValue, true);
    hasScaled = false;
    zoom(obj, amount);
  } else {
    resolveZoom(obj, amount);
    hasScaled = true;
  }
};

export const addComponent = (component) => {
  components[component.id] = component;
};
export const deleteComponent = (component) => {
  delete components[component.id];
};

export const rotate = ({ x, y }, angle) => {
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.translate(-x, -y);
};

export const save = () => {
  localStorage.setItem("saved-game", JSON.stringify(game));
};

export const pause = () => {
  game.pause = true;
};

export const play = () => {
  game.pause = false;
};

export const handleAnimation = (component, framesArr) => {
  const frames = framesArr;

  if (frames[component.animations.frameNumber]) {
    //if frame exists
    let currW = component.width;
    let currH = component.height;

    let factor = osv;

    if (scaleValue !== osv) {
      factor = scaleValue * osv;
    }

    //Scale acnimation container for current frame of animation
    component.width = factor * frames[component.animations.frameNumber][2];
    component.height = factor * frames[component.animations.frameNumber][3];

    const resolveXAxis = () => {
      if (currW < component.width) {
        component.x -= component.width - currW;
      }
      if (currW > component.width) {
        component.x += currW - component.width;
      }
    };

    const resolveYAxis = () => {
      if (currH < component.height) {
        component.y -= component.height - currH;
      }
      if (currH > component.height) {
        component.y += currH - component.height;
      }
    };

    if (!component.animations.flip) {
      resolveXAxis();
      resolveYAxis();
    }

    if (component.animations.flip === "x") {
      resolveYAxis();
    }

    if (component.animations.flip === "y") {
      resolveXAxis();
    }

    frames[component.animations.frameNumber][4] = component.x;
    frames[component.animations.frameNumber][5] = component.y;
    frames[component.animations.frameNumber][6] = component.width;
    frames[component.animations.frameNumber][7] = component.height;

    return frames;
  }
};
