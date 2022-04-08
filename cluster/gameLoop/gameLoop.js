import { engine } from "../engine/engine.js";
import { render } from "../renderer/renderer.js";

export const gameLoop = () => {
  const Engine = engine();

  Engine.resolveUpdate();

  Engine.resolveControls();

  Engine.resolveCollisions();

  Engine.resolveCamera();

  Engine.resolveAnimation();

  render();

  requestAnimationFrame(gameLoop);
};
