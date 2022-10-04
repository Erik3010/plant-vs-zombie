import Plant from "../Plant.js";
import { PEA_SHOOTER } from "../Enums/Plant.js";

class PeaShooter extends Plant {
  constructor({ ctx, x, y, width, height, sprites, specialPowerConfig }) {
    super({ ctx, x, y, width, height, sprites });

    this.shootInterval = null;
    this.shootIntervalTime = 1000;

    this.plantType = PEA_SHOOTER;

    this.specialPowerConfig = specialPowerConfig;

    this.shootPower = 100 / 5;

    this.initSpecialPower();
  }
  initSpecialPower() {
    this.shootInterval = setInterval(() => {
      this.specialPowerConfig.shootCb(this);
    }, this.shootIntervalTime);
  }
  destroy() {
    super.destroy();

    if (this.shootInterval) {
      clearInterval(this.shootInterval);
    }
  }
}

export default PeaShooter;
