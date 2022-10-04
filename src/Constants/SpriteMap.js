import { ICE_PEA, PEA_SHOOTER, SUN_FLOWER, WALL_NUT } from "../Enums/Plant.js";
import { ZOMBIE } from "../Enums/Zombie.js";

export default {
  [ICE_PEA]: {
    start: 2,
    end: 31,
    suffix: "12",
  },
  [PEA_SHOOTER]: {
    start: 0,
    end: 30,
    suffix: "12",
  },
  [SUN_FLOWER]: {
    start: 1,
    end: 24,
    suffix: "06",
  },
  [WALL_NUT]: {
    start: 0,
    end: 32,
    suffix: "12",
  },
  [ZOMBIE]: {
    start: 0,
    end: 33,
    suffix: "05",
  },
};
