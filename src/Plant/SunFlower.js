import Plant from "../Plant.js";

import { SUN_FLOWER } from "../Enums/Plant.js";

class SunFlower extends Plant {
  constructor({ ctx, x, y, width, height, sprites, specialPowerConfig }) {
    super({ ctx, x, y, width, height, sprites });

    this.generateSunInterval = null;
    this.generateSunIntervalTime = 7000;

    this.plantType = SUN_FLOWER;

    this.specialPowerConfig = specialPowerConfig;

    this.initSpecialPower();
  }
  initSpecialPower() {
    this.generateSunInterval = setInterval(() => {
      this.specialPowerConfig.generateSunCb(this);
    }, this.generateSunIntervalTime);
  }
  destroy() {
    super.destroy();

    if (this.generateSunInterval) {
      clearInterval(this.generateSunInterval);
    }
  }
}

export default SunFlower;
