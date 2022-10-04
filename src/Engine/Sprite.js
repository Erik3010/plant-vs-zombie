import CanvasImage from "./Image.js";

class Sprite extends CanvasImage {
  constructor({ ctx, x, y, width, height, sprites }) {
    super({ ctx, x, y, width, height });
    this.sprites = sprites;
    this.spriteCounter = 0;

    this.spriteSpeed = 0.15;
  }
  update() {
    super.update();

    const frame = Math.floor(this.spriteCounter % this.sprites.length);

    this.spriteCounter += this.spriteSpeed;
    this.image = this.sprites[frame];
  }
}

export default Sprite;
