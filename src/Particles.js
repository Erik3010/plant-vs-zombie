import Drawable from "./Engine/Drawable.js";

class Particles extends Drawable {
  constructor({ ctx, x, y, amount = 100, color }) {
    super({ ctx });

    this.x = x;
    this.y = y;

    this.amount = amount;
    this.color = color;

    this.particles = [];

    this.generateParticle();
  }
  update() {
    this.particles.forEach((particle) => {
      // particle.x += Math.random() * 10 - 5;
      // particle.y += Math.random() * 10 - 5;

      particle.x += particle.velocity.x;
      particle.y += particle.velocity.y;

      particle.opacity -= 0.01;
    });
  }
  generateParticle() {
    this.particles = Array(this.amount)
      .fill(null)
      .map(() => {
        const size = Math.random() * 5;

        return {
          size,
          x: this.x,
          y: this.y,
          color: this.color,
          opacity: 1,
          velocity: {
            x: Math.random() - 0.5 * (Math.random() * 3),
            y: Math.random() - 0.5 * (Math.random() * 3),
          },
        };
      });
  }
  draw() {
    this.update();

    this.particles.forEach((particle, index) => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.opacity;

      this.ctx.beginPath();
      // this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.rect(particle.x, particle.y, particle.size, particle.size);
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();

      this.ctx.closePath();
      this.ctx.restore();

      if (particle.opacity <= 0) {
        this.particles.splice(index, 1);
      }
    });
  }
}

export default Particles;
