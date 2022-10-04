import Game from "./Game.js";

const canvas = document.querySelector('#canvas');

const game = new Game({canvas});
game.init();
