import CanvasImage from "./Engine/Image.js";

class Lawnmover extends CanvasImage {
  constructor({ ctx, x, y, width, height, sprites, lane }) {
    super({ ctx, x, y, width, height });

    this.sprites = sprites;

    this.state = "idle";

    this.speed = 3.5;

    this.veloX = 0;

    this.lane = lane;
  }
  update() {
    super.update();

    this.image = this.sprites[this.state];
    this.x += this.veloX;
  }
  active() {
    this.state = "activated";
    this.veloX = this.speed;
  }
}

export default Lawnmover;
