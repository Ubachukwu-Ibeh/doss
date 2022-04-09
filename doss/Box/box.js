import { addComponent } from "../globals/globals.js";

export class Box {
  constructor(props) {
    this.type = "component";
    this.depth = 1;
    Object.keys(props).forEach((key) => (this[key] = props[key]));
  }
  init() {
    if (this.animations) {
      this.animations.frameTick = 1;
      this.animations.frameNumber = 0;
      this.animations.done = true;

      this.playAnimation = (animationName) => {
        const isPrevious = this.animations.currentAnimation === animationName;
        const currImportance = this.animations[animationName].importance;

        let prevImportance;

        if (this.animations.currentAnimation) {
          prevImportance =
            this.animations[this.animations.currentAnimation].importance;
        } else {
          prevImportance = 0;
        }

        const isDone = this.animations.done;

        if (isPrevious || (prevImportance >= currImportance && !isDone)) return;
        this.animations.frameTick = 1;
        this.animations.frameNumber = 0;
        this.animations.currentAnimation = animationName;
      };
    }

    addComponent(this);

    return this;
  }
}
