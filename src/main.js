import Game from "./Game.js";

const canvas = document.querySelector("#canvas");

const game = new Game({ canvas });
// game.init();

const username = document.querySelector("#username");
const level = document.querySelector("#level");

const startBtn = document.querySelector("#start-btn");
const instructionBtn = document.querySelector("#instruction-btn");
const closeBtn = document.querySelector(".btn-close");

const welcomePageWrapper = document.querySelector(".welcome-page-wrapper");
const instructionWrapper = document.querySelector(".instruction-wrapper");

const welcomePage = document.querySelector(".welcome-page");

let isShowInstruction = false;

const openInstruction = async () => {
  await animate(welcomePageWrapper, "slide-out", "add");

  instructionWrapper.style.visibility = "visible";
  await animate(instructionWrapper, "show", "add");
};

const closeInstruction = async () => {
  await Promise.all([
    animate(welcomePageWrapper, "slide-out", "remove"),
    animate(instructionWrapper, "show", "remove"),
  ]);
  instructionWrapper.style.visibility = "hidden";
};

const startGameHandler = () => {
  welcomePage.style.display = "none";

  game.init({
    playerName: username.value,
    level: level.value,
  });
};
const instructionHandler = async () => {
  isShowInstruction = !isShowInstruction;

  if (isShowInstruction) {
    await openInstruction();
  } else {
    await closeInstruction();
  }
};

const closeInstructionHandler = async () => {
  isShowInstruction = false;

  await closeInstruction();
};

startBtn.addEventListener("click", startGameHandler);
instructionBtn.addEventListener("click", instructionHandler);
closeBtn.addEventListener("click", closeInstructionHandler);

const animate = (el, className, action = "add") => {
  return new Promise((resolve) => {
    el.classList[action](className);

    const animationEndHandler = () => {
      el.removeEventListener("transitionend", animationEndHandler);
      return resolve();
    };

    el.addEventListener("transitionend", animationEndHandler);
  });
};

username.addEventListener("input", (e) => {
  const { value } = e.target;
  startBtn.disabled = value === "";
});
