import { components, rotate, game } from "../globals/globals.js";

export const render = (
  { ctx, scaledWidth, scaledHeight } = game.newDisplaySettings
) => {
  ctx.clearRect(0, 0, scaledWidth, scaledHeight);
  ctx.fillStyle = game.backgroundColor;
  ctx.fillRect(0, 0, scaledWidth, scaledHeight);

  const tray = Object.values(components);

  tray.sort((A, B) => A.layer - B.layer);

  tray.forEach((component) => {
    //show camera
    const {
      focus,
      x: camX,
      y: camY,
      width: camWidth,
      height: camHeight,
      view,
    } = game.camera;

    if (view && component === focus) {
      ctx.fillStyle = "pink";
      ctx.fillRect(camX, camY, camWidth, camHeight);
    }

    const { x, y, width, height, color } = component;

    if (component.blendMode) {
      ctx.globalCompositeOperation = component.blendMode;
    }

    if (color) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
    }
    if (component.animations) {
      const { currentFrame, spriteSheet } = component.animations;

      if (currentFrame) {
        let [sx, sy, sw, sh, ix, iy, iw, ih] = currentFrame;

        const rotateImg = component.animations.rotate;
        const flipAxis = component.animations.flip;

        ctx.save();

        if (rotateImg) {
          rotate(rotateImg);
        } else if (flipAxis) {
          if (flipAxis === "x") {
            ctx.translate(ix, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(spriteSheet, sx, sy, sw, sh, -iw, iy, iw, ih);
          }
          if (flipAxis === "y") {
            ctx.translate(0, iy);
            ctx.scale(1, -1);
            ctx.drawImage(spriteSheet, sx, sy, sw, sh, ix, -ih, iw, ih);
          }
        } else {
          ctx.drawImage(spriteSheet, sx, sy, sw, sh, ix, iy, iw, ih);
        }
      }
    }

    ctx.restore();
    ctx.globalCompositeOperation = "normal";
  });
};
