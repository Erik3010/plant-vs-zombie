import { ICE_PEA, PEA_SHOOTER, SUN_FLOWER, WALL_NUT } from "../Enums/Plant.js";

export default {
  [PEA_SHOOTER]: {
    sunCost: 100,
    canShoot: true,
    shootPower: 100 / 5,
  },
  [ICE_PEA]: {
    sunCost: 175,
    canShoot: true,
    shootPower: 100 / 7,
  },
  [SUN_FLOWER]: {
    sunCost: 50,
    canShoot: false,
    shootPower: null,
  },
  [WALL_NUT]: {
    sunCost: 50,
    canShoot: false,
    shootPower: null,
  },
};
