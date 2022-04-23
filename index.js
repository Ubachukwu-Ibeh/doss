import { Box } from "./Box/box.js";
import { gameLoop } from "./gameLoop/gameLoop.js";
import {
  addScenes,
  deleteComponent,
  switchScenes,
  set,
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

const doss = {
  gameLoop,
  Box,
  deleteComponent,
  addScenes,
  switchScenes,
  set,
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

export default doss;
