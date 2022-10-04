import Rect from "./Engine/Rect.js";
import CanvasImage from "./Engine/Image.js";
import { ICE_PEA, PEA_SHOOTER, SUN_FLOWER, WALL_NUT } from "./Enums/Plant.js";

import Plant from "./Plant.js";

import PeaShooter from "./Plant/PeaShooter.js";
import IcePea from "./Plant/IcePea.js";
import SunFlower from "./Plant/SunFlower.js";
import WallNut from "./Plant/WallNut.js";

class Tile extends Rect {
  constructor({ ctx, x, y, width, height }) {
    super({ ctx, x, y, width, height });

    this.opacity = 0;

    this.tempPlant = new CanvasImage({
      ctx: this.ctx,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      opacity: 0.7,
    });
    this.tempPlantType = null;

    this.plantThumbnail = {
      [ICE_PEA]: "assets/IcePea/frame_02_delay-0.12s.gif",
      [PEA_SHOOTER]: "assets/PeaShooter/frame_00_delay-0.12s.gif",
      [SUN_FLOWER]: "assets/SunFlower/frame_01_delay-0.06s.gif",
      [WALL_NUT]: "assets/WallNut/frame_00_delay-0.12s.gif",
    };

    this.plant = null;
  }
  draw() {
    this.ctx.save();
    this.ctx.globalAlpha = this.opacity;
    super.draw();
    this.ctx.restore();
  }
  hide() {
    this.opacity = 0;
  }
  show() {
    this.opacity = 1;
  }
  setTempPlant(plant, image) {
    this.tempPlantType = plant;
    this.tempPlant.image = image;
  }
  removeTempPlant() {
    this.tempPlant.image = null;
    this.tempPlantType = null;
  }
  setPlant(plantType, sprites, { shootCb, generateSunCb }) {
    const params = {
      sprites,
      ctx: this.ctx,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };

    switch (plantType) {
      case PEA_SHOOTER:
        params.specialPowerConfig = { shootCb };
        this.plant = new PeaShooter(params);
        break;
      case ICE_PEA:
        params.specialPowerConfig = { shootCb };
        this.plant = new IcePea(params);
        break;
      case SUN_FLOWER:
        params.specialPowerConfig = { generateSunCb };
        this.plant = new SunFlower(params);
        break;
      case WALL_NUT:
        params.specialPowerConfig = {};
        this.plant = new WallNut(params);
        break;
    }
  }
}

export default Tile;
