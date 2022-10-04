import Plant from "../Plant.js";

import { WALL_NUT } from "../Enums/Plant.js";

class WallNut extends Plant {
  constructor({ ctx, x, y, width, height, sprites, specialPowerConfig }) {
    super({ ctx, x, y, width, height, sprites });

    this.specialPowerConfig = specialPowerConfig;

    this.plantType = WALL_NUT;

    this.initSpecialPower();
  }
  initSpecialPower() {
    this.life = 5;
  }
}

export default WallNut;
