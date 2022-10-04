import Drawable from "./Drawable.js";

class Rect extends Drawable {
  constructor({
    ctx,
    x,
    y,
    width,
    height,
    fillColor = null,
    strokeColor = null,
    strokeWidth = 1,
  }) {
    super({ ctx });

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
  }
  draw() {
    this.ctx.beginPath();
    this.ctx.rect(this.x, this.y, this.width, this.height);
    if (this.fillColor) {
      this.ctx.fillStyle = this.fillColor;
      this.ctx.fill();
    }
    if (this.strokeColor) {
      this.ctx.strokeStyle = this.strokeColor;
      this.ctx.stroke();
    }
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.closePath();
  }
}

export default Rect;
