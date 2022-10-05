import { ICE_PEA, PEA_SHOOTER, SUN_FLOWER, WALL_NUT } from "./Enums/Plant.js";
import { ZOMBIE } from "./Enums/Zombie.js";
import Utility from "./Utility.js";

import Background from "./Background.js";
import Seed from "./Seed.js";

import Tile from "./Tile.js";
import Rect from "./Engine/Rect.js";

import SpriteMap from "./Constants/SpriteMap.js";
import Sun from "./Sun.js";
import Bullet from "./Bullet.js";
import Zombie from "./Zombie.js";
import Lawnmower from "./Lawnmower.js";

import Text from "./Engine/Text.js";
import CanvasImage from "./Engine/Image.js";

import Particles from "./Particles.js";

class Game {
  constructor({ canvas }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.board = {
      start: {
        y: 120,
        x: 90,
      },
      end: {
        y: 570,
        x: 750,
      },
      y: 5,
      x: 8,
    };

    this.boardSize = {
      width: this.board.end.x - this.board.start.x,
      height: this.board.end.y - this.board.start.y,
    };

    this.tileConfig = {
      width: this.boardSize.width / this.board.x,
      height: this.boardSize.height / this.board.y,
    };

    this.tiles = Array(this.board.y)
      .fill([])
      .map((_) => Array(this.board.x).fill(null));

    this.plantsType = [ICE_PEA, PEA_SHOOTER, SUN_FLOWER, WALL_NUT];

    this.spriteCharacter = {};

    this.seeds = Array(4).fill(null);

    this.background = null;

    this.selectedSeed = null;

    this.suns = [];

    this.sunPoint = 1000;

    this.plantBullets = [];

    this.zombies = [];
    this.lawnmowers = Array(this.board.y).fill(null);

    this.lawnmowerSprites = {
      activated: null,
      idle: null,
    };

    this.shovel = null;
    this.shovelActiveRect = null;
    this.sunPointText = null;
    this.playerNameText = null;
    this.scoreText = null;
    this.timeText = null;

    this.shovelMode = false;

    this.particles = [];

    this.playerName = null;
    this.level = null;
    this.score = 0;
    this.time = 0;
  }
  async init({ playerName, level }) {
    this.playerName = playerName;
    this.level = level;

    await this.preloadAssets();

    this.generateGameUI();

    this.generateTiles();
    this.generateSeeds();
    this.generateSuns();
    this.generateZombies();
    this.generateLawnmowers();

    this.render();
    this.eventHandler();
  }
  async preloadAssets() {
    for (const [key, value] of Object.entries(SpriteMap)) {
      const { start, end, suffix } = value;
      const sprite = [];
      for (let i = start; i <= end; i++) {
        const frame = Utility.pad(i);
        const image = await Utility.loadImage(
          `./assets/${key}/frame_${frame}_delay-0.${suffix}s.gif`
        );
        sprite.push(image);
      }
      this.spriteCharacter[key] = sprite;
    }

    for (const key of Object.keys(this.lawnmowerSprites)) {
      const state = key.charAt(0).toUpperCase() + key.substring(1);
      this.lawnmowerSprites[key] = await Utility.loadImage(
        `./assets/General/lawnmower${state}.gif`
      );
    }
  }
  eventHandler() {
    this.canvas.addEventListener("click", this.canvasClickHandler.bind(this));

    this.canvas.addEventListener(
      "mousemove",
      this.canvasHoverHandler.bind(this)
    );
  }
  canvasClickHandler({ offsetY, offsetX }) {
    const { y, x } = this.getCoordinate({ offsetY, offsetX });

    if (!Utility.inBound({ y, x, width: this.board.x, height: this.board.y }))
      return;

    if (this.shovelMode) {
      this.shovelMode = false;
      if (!this.tiles[y][x].plant) return;

      this.tiles[y][x].plant.destroy();
      this.tiles[y][x].plant = null;
      return;
    }

    if (!this.selectedSeed || this.tiles[y][x].plant) return;

    this.tiles[y][x].removeTempPlant();

    this.tiles[y][x].setPlant(
      this.selectedSeed.plantType,
      this.spriteCharacter[this.selectedSeed.plantType],
      {
        shootCb: (instance) => {
          const bullet = new Bullet({
            ctx: this.ctx,
            x: instance.x + instance.width,
            y: instance.y + 10,
            width: 24,
            height: 24,
            plantType: instance.plantType,
            shootPower: instance.shootPower,
          });

          this.plantBullets.push(bullet);
        },
        generateSunCb: (instance) => {
          const size = 90 / 1.5;

          const sun = new Sun({
            ctx: this.ctx,
            id: Date.now(),
            x: Utility.random(instance.x, instance.x + instance.width),
            y: instance.y,
            width: size,
            height: size,
            stopAt: instance.y + 35,
            onClick: (_, { id }) => {
              const index = this.suns.findIndex((sun) => sun.id === id);

              this.sunPoint += this.suns[index].point;

              this.suns[index].destroy();
              this.suns.splice(index, 1);
            },
          });

          this.suns.push(sun);
        },
      }
    );

    this.sunPoint -= this.selectedSeed.plantOption.sunCost;

    this.selectedSeed = null;
    this.setAllSeedAsUnactive();
  }
  canvasHoverHandler({ offsetY, offsetX }) {
    const { y, x } = this.getCoordinate({ offsetY, offsetX });
    this.placeTempPlant({ y, x });
  }
  placeTempPlant({ y, x }) {
    if (!Utility.inBound({ y, x, width: this.board.x, height: this.board.y }))
      return;

    this.hideAllTiles({ y, x });

    if (this.selectedSeed && !this.tiles[y][x].plant) {
      this.tiles[y][x].setTempPlant(
        this.selectedSeed.plantType,
        this.spriteCharacter[this.selectedSeed.plantType][0]
      );
    }
  }
  getCoordinate({ offsetY, offsetX }) {
    const { y, x } = {
      y: Math.floor((offsetY - this.board.start.y) / this.tileConfig.height),
      x: Math.floor((offsetX - this.board.start.x) / this.tileConfig.width),
    };

    return {
      y,
      x,
      clamp: {
        y: Utility.clamp(y, [0, this.board.y - 1]),
        x: Utility.clamp(x, [0, this.board.x - 1]),
      },
    };
  }
  generateGameUI() {
    this.background = new Background({
      ctx: this.ctx,
      x: 0,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height,
    });

    this.sunPointText = new Text({
      ctx: this.ctx,
      x: 135,
      y: 88,
      text: this.sunPoint,
      fontSize: 18,
      fontWeight: "bold",
    });

    this.shovelActiveRect = new Rect({
      ctx: this.ctx,
      x: 635,
      y: 15,
      width: 55,
      height: 60,
      strokeColor: "rgb(0,141,0)",
      strokeWidth: 3,
    });

    this.shovel = new CanvasImage({
      ctx: this.ctx,
      x: 640,
      y: 10,
      width: 55,
      height: 65,
      imageSrc: "./assets/General/Shovel.png",
      onClick: () => {
        this.shovelMode = !this.shovelMode;
      },
    });

    this.playerNameText = new Text({
      ctx: this.ctx,
      x: 450,
      y: 35,
      text: `Username: ${this.playerName}`,
      fontSize: 18,
      fontWeight: "bold",
      color: "#fff",
    });

    this.scoreText = new Text({
      ctx: this.ctx,
      x: 450,
      y: 55,
      text: `Score: ${this.score}`,
      fontSize: 18,
      fontWeight: "bold",
      color: "#fff",
    });

    this.timeText = new Text({
      ctx: this.ctx,
      x: 450,
      y: 75,
      text: `Time: ${this.time}`,
      fontSize: 18,
      fontWeight: "bold",
      color: "#fff",
    });
  }
  generateLawnmowers() {
    this.lawnmowers.forEach((_, index) => {
      const image = this.lawnmowerSprites.idle;

      this.lawnmowers[index] = new Lawnmower({
        lane: index + 1,
        ctx: this.ctx,
        x: -10,
        y: this.board.start.y + index * this.tileConfig.height,
        width: this.tileConfig.width / 1.2,
        height: this.tileConfig.height / 1.2,
        sprites: this.lawnmowerSprites,
      });
    });
  }
  generateTiles() {
    this.tiles.forEach((row, rowIndex) => {
      row.forEach((_, colIndex) => {
        this.tiles[rowIndex][colIndex] = new Tile({
          ctx: this.ctx,
          x: colIndex * this.tileConfig.width + this.board.start.x,
          y: rowIndex * this.tileConfig.height + this.board.start.y,
          width: this.tileConfig.width,
          height: this.tileConfig.height,
        });
      });
    });
  }
  generateSeeds() {
    this.seeds.forEach((_, index) => {
      const seed = new Seed({
        ctx: this.ctx,
        x: 190 + index * 55,
        y: 15,
        width: 50,
        height: 70,
        plantType:
          this.plantsType[Utility.random(0, this.plantsType.length - 1)],
        onClick: ({ offsetY, offsetX }, instance) => {
          if (this.sunPoint < instance.plantOption.sunCost) return;

          this.selectedSeed = instance;

          this.setAllSeedAsUnactive();
          instance.setAsActiveSeed();

          const {
            clamp: { y, x },
          } = this.getCoordinate({ offsetY, offsetX });
          this.placeTempPlant({ y, x });
        },
      });

      this.seeds[index] = seed;
    });
  }
  generateSuns() {
    const size = 90 / 1.5;

    const sun = new Sun({
      ctx: this.ctx,
      id: Date.now(),
      x: Utility.random(0, this.canvas.width - size),
      y: size * -1,
      width: size,
      height: size,
      stopAt: this.canvas.height - (size + Utility.random(80, 150)),
      onClick: (_, { id }) => {
        const index = this.suns.findIndex((sun) => sun.id === id);

        this.sunPoint += this.suns[index].point;

        this.suns[index].destroy();
        this.suns.splice(index, 1);
      },
    });
    this.suns.push(sun);

    setTimeout(this.generateSuns.bind(this), 5000);
  }
  generateZombies() {
    const image = this.spriteCharacter[ZOMBIE][0];

    const lane = Utility.random(1, this.board.y);

    const zombie = new Zombie({
      lane,
      id: Date.now(),
      ctx: this.ctx,
      x: this.canvas.width,
      y: lane * this.tileConfig.height + 20,
      width: image.width / 1.4,
      height: image.height / 1.4,
      sprites: this.spriteCharacter[ZOMBIE],
    });

    this.zombies.push(zombie);

    setTimeout(this.generateZombies.bind(this), 2000);
  }
  renderGameUI() {
    this.sunPointText.updateText(this.sunPoint);
    this.scoreText.updateText(`Score: ${this.score}`);
    this.timeText.updateText(`Time: ${this.time}`);

    this.sunPointText.draw();
    this.shovel.draw();
    this.playerNameText.draw();
    this.scoreText.draw();
    this.timeText.draw();

    this.shovelMode && this.shovelActiveRect.draw();
  }
  renderTiles() {
    this.tiles.forEach((row) => {
      row.forEach((tile) => {
        tile.draw();

        tile.tempPlant && tile.tempPlant.draw();
        tile.plant && tile.plant.draw();
      });
    });
  }
  renderBullets() {
    this.plantBullets.forEach((bullet, bulletIndex) => {
      if (bullet.x >= this.canvas.width) {
        this.plantBullets.splice(bulletIndex, 1);
        return;
      }

      bullet.draw();
    });
  }
  showParticle({ x, y, color }) {
    this.particles.push(
      new Particles({
        x,
        y,
        color,
        ctx: this.ctx,
        amount: 50,
      })
    );
  }
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.background.draw();
    this.renderTiles();
    this.renderBullets();

    this.suns.forEach((sun) => sun.draw());
    this.seeds.forEach((seed) => seed.draw());

    this.lawnmowers.forEach((lawnmower, lawnmowerIndex) => {
      if (lawnmower.x >= this.canvas.width) {
        this.lawnmowers.splice(lawnmowerIndex, 1);
        return;
      }

      lawnmower.draw();
    });

    this.zombies.forEach((zombie, zombieIndex) => {
      zombie.draw();

      // activate lawnmower
      if (zombie.x <= this.board.start.x) {
        const index = this.lawnmowers.findIndex(
          (lawnmower) => lawnmower.lane === zombie.lane
        );
        const lawnmower = this.lawnmowers[index];
        if (lawnmower && lawnmower.state === "idle") {
          lawnmower.active();
        }
      }

      this.plantBullets.forEach((bullet, bulletIndex) => {
        if (!Utility.isCollide(bullet, zombie)) return;

        this.plantBullets.splice(bulletIndex, 1);
        zombie.receivedDamage(bullet);
        this.showParticle({
          x: zombie.x,
          y: zombie.y + zombie.height / 2,
          color:
            bullet.plantType === ICE_PEA
              ? "rgb(62, 208, 242)"
              : "rgb(255,246,1)",
        });

        if (zombie.life <= 0) {
          zombie.destroy();
          this.removeZombieById(zombie.id);
        }
      });

      this.tiles.forEach((row, y) => {
        row.forEach((tile, x) => {
          if (!tile.plant || !Utility.isCollide(tile.plant, zombie)) return;

          zombie.veloX = 0;
          zombie.bite(tile.plant, () => {
            tile.plant && tile.plant.destroy();
            zombie.resetZombieSpeed();
            this.tiles[y][x].plant = null;
          });
        });
      });

      this.lawnmowers.forEach((lawnmower) => {
        if (!Utility.isCollide(lawnmower, zombie) || zombie.isAnimatingDie)
          return;

        zombie.animateDie(() => {
          zombie.destroy();
          this.removeZombieById(zombie.id);
        });
      });

      if (zombie.x + zombie.width < 0) {
        zombie.destroy();
        this.removeZombieById(zombie.id);
      }
    });

    this.particles.forEach((particle, index) => {
      particle.draw();

      if (!particle.particles.length) {
        this.particles.splice(index, 1);
      }
    });

    this.renderGameUI();

    setTimeout(this.render.bind(this), 10);
  }
  removeZombieById(id) {
    const index = this.zombies.findIndex((zombie) => zombie.id === id);
    this.zombies.splice(index, 1);
  }
  hideAllTiles() {
    this.tiles.forEach((row) => row.forEach((tile) => tile.removeTempPlant()));
  }
  setAllSeedAsUnactive() {
    this.seeds.forEach((seed) => seed.unsetActiveSeed());
  }
}

export default Game;
