import Game from "./Game.js";

const canvas = document.querySelector("#canvas");

const game = new Game({ canvas });
game.init();

// const username = document.querySelector("#username");
// const level = document.querySelector("#level");

// const startBtn = document.querySelector("#start-btn");
// const instructionBtn = document.querySelector("#instruction-btn");

// const startGameHandler = () => {};

// startBtn.addEventListener("click", startGameHandler);
