import Sprite from "./Engine/Sprite.js";
import PlantMap from "./Constants/PlantMap.js";

class Plant extends Sprite {
  constructor({ ctx, x, y, width, height, sprites, shootCb }) {
    super({ ctx, x, y, width, height, sprites });

    // this.plantOption = PlantMap[this.plantType];

    this.shootCb = shootCb;
    this.life = 3;

    this.opacityInterval = null;
  }
  async receivedDamage() {
    return new Promise((resolve) => {
      this.opacity = 0.5;

      this.opacityInterval = setTimeout(() => {
        this.opacity = 1;
        return resolve();
      }, 400);
    });
  }
  destroy() {
    super.destroy();

    if (this.opacityInterval) {
      clearTimeout(this.opacityInterval);
    }
  }
}

export default Plant;
