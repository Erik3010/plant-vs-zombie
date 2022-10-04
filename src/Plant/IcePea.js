import Plant from "../Plant.js";

import { ICE_PEA } from "../Enums/Plant.js";

class IcePea extends Plant {
  constructor({ ctx, x, y, width, height, sprites, specialPowerConfig }) {
    super({ ctx, x, y, width, height, sprites });

    this.shootInterval = null;
    this.shootIntervalTime = 1000;

    this.plantType = ICE_PEA;

    this.specialPowerConfig = specialPowerConfig;

    this.shootPower = 100 / 7;

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

export default IcePea;
