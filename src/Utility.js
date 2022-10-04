class Utility {
  static async loadImage(path) {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = path;

      image.addEventListener("load", () => resolve(image));
    });
  }
  static pad(value, padCount = 2) {
    return value.toString().padStart(padCount, "0");
  }
  static clamp(value, [min, max]) {
    return Math.min(max, Math.max(min, value));
  }
  static isIntersecting(cursor, element) {
    return (
      cursor.x > element.x &&
      cursor.x < element.x + element.width &&
      cursor.y > element.y &&
      cursor.y < element.y + element.height
    );
  }
  static random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  static inBound({ x, y, width, height }) {
    return x >= 0 && y >= 0 && x < width && y < height;
  }
  static isCollide(a, b) {
    return (
      a.x + a.width > b.x &&
      a.x < b.x + b.width &&
      a.y + a.height > b.y &&
      a.y < b.y + b.height
    );
  }
}

export default Utility;
