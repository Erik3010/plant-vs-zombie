import CanvasImage from "./Engine/Image.js";

class Background extends CanvasImage {
  constructor({ ctx, x, y, width, height }) {
    const imageSrc = "./assets/General/Background.jpg";

    super({ ctx, x, y, width, height, imageSrc });
  }
}

export default Background;
