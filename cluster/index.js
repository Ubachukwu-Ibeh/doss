import { Box } from "./Box/box.js";
import { gameLoop } from "./gameLoop/gameLoop.js";
import {
  addScenes,
  deleteComponent,
  switchScenes,
  set,
  cameraShake,
  zoom,
  save,
  pause,
  play,
  preloadImage,
  preloadSound,
  currentScene,
  handleAnimation,
  setGame,
  game,
} from "./globals/globals.js";

const cluster = {
  gameLoop,
  Box,
  deleteComponent,
  addScenes,
  switchScenes,
  set,
  cameraShake,
  zoom,
  save,
  pause,
  play,
  preloadImage,
  preloadSound,
  currentScene,
  handleAnimation,
  setGame,
  game,
};

export default cluster;