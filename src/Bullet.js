import CanvasImage from "./Engine/Image.js";
import bulletMap from "./Constants/BulletMap.js";

class Bullet extends CanvasImage {
  constructor({ ctx, x, y, width, height, plantType, shootPower }) {
    const imageSrc = bulletMap[plantType];

    super({ ctx, x, y, width, height, imageSrc });

    this.bulletVeloX = 3;
    this.plantType = plantType;

    this.shootPower = shootPower;
  }
  update() {
    super.update();

    this.x += this.bulletVeloX;
  }
}

export default Bullet;
