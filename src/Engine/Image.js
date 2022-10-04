import Drawable from "./Drawable.js";
import Utility from "../Utility.js";

class CanvasImage extends Drawable {
  constructor({
    ctx,
    x,
    y,
    width,
    height,
    imageSrc = null,
    opacity = 1,
    onClick = null,
  }) {
    super({ ctx });

    this.x = x;
    this.y = y;
    this.width = width;

    this.height = height;

    this.imageSrc = imageSrc;

    if (this.imageSrc) {
      this.image = new Image();
      this.image.src = this.imageSrc;
    }

    this.opacity = opacity;

    this.onClick = onClick;

    this.clickHandlerFn = this.clickHandler.bind(this);

    this.angle = 0;

    this.init();
  }
  init() {
    this.onClick && window.addEventListener("click", this.clickHandlerFn);
  }
  draw() {
    this.update();

    if (!this.image) return;

    this.ctx.save();
    this.ctx.globalAlpha = this.opacity;
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    this.ctx.restore();
  }
  clickHandler(event) {
    event.stopPropagation();

    const { offsetY: y, offsetX: x } = event;
    if (!Utility.isIntersecting({ y, x }, this)) return;

    this.onClick(event, this);
  }
  update() {}
  destroy() {
    this.onClick && window.removeEventListener("click", this.clickHandlerFn);
  }
}

export default CanvasImage;
