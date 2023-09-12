//@ts-check
/** @type {HTMLCanvasElement} */
//@ts-ignore canvas is an HTMLCanvasElement
const canvas = document.getElementById("game-canvas");
/** @type {CanvasRenderingContext2D} */
//@ts-ignore we know ctx is not null
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

class Game {
	constructor() {
		this.score = 0;

		this.colors = [
			"red",
			"orange",
			"yellow",
			"green",
			"blue",
			"indigo",
			"violet",
		];

		this.targetColor = this.getRandomColor();
	}

	getRandomColor() {
		let randomIndex = Math.floor(Math.random() * this.colors.length);
		return this.colors[randomIndex];
	}
}

let game = new Game();

console.log(game);
