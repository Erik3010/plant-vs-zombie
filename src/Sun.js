import CanvasImage from "./Engine/Image.js";
import Utility from "./Utility.js";

class Sun extends CanvasImage {
  constructor({ ctx, x, y, width, height, onClick, stopAt, id }) {
    const imageSrc = "assets/General/Sun.png";

    super({ ctx, x, y, width, height, imageSrc, onClick });

    this.sunVelocityY = 0.5;
    this.stopAt = stopAt;

    this.point = 25;

    this.id = id;

    this.angle = 0;
    this.angleCounter = 0;

    this.rotateSpeed = 0.5;
  }
  update() {
    super.update();

    this.y < this.stopAt && (this.y += this.sunVelocityY);

    this.angleCounter += this.rotateSpeed;
    this.angle = this.angleCounter % 360;
  }
  draw() {
    this.update();

    this.ctx.save();
    this.ctx.translate(this.width / 2 + this.x, this.height / 2 + this.y);
    this.ctx.rotate(this.angle * (Math.PI / 180));
    // super.draw();
    this.ctx.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    this.ctx.restore();
  }
}

export default Sun;
