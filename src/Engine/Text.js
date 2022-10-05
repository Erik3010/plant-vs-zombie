import Drawable from "./Drawable.js";

class Text extends Drawable {
  constructor({
    ctx,
    x,
    y,
    text,
    fontSize = "24",
    color = "#000",
    font = "Arial",
    fontWeight = "normal",
  }) {
    super({ ctx });

    this.x = x;
    this.y = y;

    this.text = text;

    this.fontSize = fontSize;
    this.fontWeight = fontWeight;
    this.color = color;
    this.font = font;
  }
  draw() {
    this.ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.font}`;
    this.ctx.fillStyle = this.color;
    this.ctx.fillText(this.text, this.x, this.y);
  }
  updateText(text) {
    this.text = text;
  }
}

export default Text;
