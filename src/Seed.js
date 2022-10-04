import CanvasImage from "./Engine/Image.js";
import PlantMap from "./Constants/PlantMap.js";

class Seed extends CanvasImage {
  constructor({ ctx, x, y, width, height, onClick = null, plantType }) {
    const imageSrc = `assets/Seeds/${plantType}Seed.png`;

    super({ ctx, x, y, width, height, imageSrc, onClick });

    this.plantType = plantType;
    this.plantOption = PlantMap[this.plantType];
  }
  draw() {
    super.draw();
  }
  setAsActiveSeed() {
    this.opacity = 0.5;
  }
  unsetActiveSeed() {
    this.opacity = 1;
  }
}

export default Seed;
