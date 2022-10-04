import Sprite from "./Engine/Sprite.js";
import { ICE_PEA } from "./Enums/Plant.js";

class Zombie extends Sprite {
  constructor({ ctx, x, y, width, height, sprites, lane, id }) {
    super({ ctx, x, y, width, height, sprites, isDrawWithAngle: true });

    this.id = id;

    this.speed = 0.2;
    this.veloX = this.speed;

    this.life = 100;

    this.attackPower = 1;

    this.isBiting = false;

    this.biteTimeout = null;

    this.lane = lane;

    this.isAnimatingDie = false;
    this.dieAnimationInterval = null;
  }
  update() {
    super.update();

    this.x -= this.veloX;
  }
  receivedDamage(bullet) {
    this.life -= bullet.shootPower;
    if (bullet.plantType === ICE_PEA) {
      this.veloX = 0.1;
    }
  }
  bite(plant, afterBite) {
    if (this.isBiting) return;
    this.isBiting = true;

    const bite = async () => {
      await plant.receivedDamage();
      plant.life -= this.attackPower;

      if (plant.life <= 0) {
        this.isBiting = false;
        afterBite();
        return;
      }
      this.biteTimeout = setTimeout(bite.bind(this), 1000);
    };
    bite();
  }
  draw() {
    this.update();

    this.ctx.save();
    this.ctx.translate(this.x + this.width, this.y + this.height);
    this.ctx.rotate(this.angle * (Math.PI / 180));
    // super.draw();
    this.ctx.drawImage(
      this.image,
      -this.width,
      -this.height,
      this.width,
      this.height
    );
    this.ctx.restore();
  }
  async animateDie(afterAnimate) {
    return new Promise((resolve) => {
      this.isAnimatingDie = true;
      this.spriteSpeed = 0;
      this.veloX = 0;

      this.dieAnimationInterval = setInterval(() => {
        this.angle += 10;
        if (this.angle >= 90) {
          clearInterval(this.dieAnimationInterval);
          this.dieAnimationInterval = null;
          this.isAnimatingDie = false;
          afterAnimate();
          return resolve();
        }
      }, 50);

      // const interval = setInterval(() => {
      //   this.angle += 10;
      //   if (this.angle >= 90) {
      //     clearInterval(interval);
      //     this.isAnimatingDie = false;
      //     afterAnimate();
      //     // setTimeout(() => {
      //     //   this.isAnimatingDie = false;
      //     //   afterAnimate();
      //     // }, 100);
      //     return resolve();
      //   }
      // }, 50);
    });
  }
  resetZombieSpeed() {
    this.veloX = this.speed;
  }
  destroy() {
    if (this.biteTimeout) {
      clearInterval(this.biteTimeout);
    }
  }
}

export default Zombie;
