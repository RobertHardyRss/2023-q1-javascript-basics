//@ts-check
/** @type {HTMLCanvasElement} */
//@ts-ignore canvas is an HTMLCanvasElement
const canvas = document.getElementById("game-canvas");
/** @type {CanvasRenderingContext2D} */
//@ts-ignore we know ctx is not null
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

class ClickShape {
	constructor() {
		this.x = 0;
		this.y = 0;

		this.width = 50;

		this.xDirection = 0;
		this.yDirection = 1;

		this.speed = 5;

		this.isVisible = true;
		this.isClicked = true;

		this.color = "silver";

		/** @type {Path2D | undefined} */
		this.path;
	}

	movingDirection() {
		if (this.xDirection === 0 && this.yDirection === 1) {
			return "down";
		}

		if (this.xDirection === 0 && this.yDirection === -1) {
			return "up";
		}

		if (this.xDirection === 1 && this.yDirection === 0) {
			return "right";
		}

		return "left";
	}

	update() {
		if (!this.isVisible) {
			return; // leave this method, nothing to do
		}

		switch (this.movingDirection()) {
			case "down":
				this.isVisible = this.y < canvas.height;
				break;
			case "up":
				this.isVisible = this.y + this.width > 0;
				break;
			case "right":
				this.isVisible = this.x < canvas.width;
				break;
			case "left":
				this.isVisible = this.x + this.width > 0;
				break;
		}

		this.x += this.xDirection * this.speed;
		this.y += this.yDirection * this.speed;
	}

	draw() {
		ctx.fillStyle = this.color;

		this.path = new Path2D();
		this.path.rect(this.x, this.y, this.width, this.width);
		ctx.fill(this.path);
		//ctx.fillRect(this.x, this.y, this.width, this.width);
	}
}

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

		/**@type {Array<ClickShape>} */
		this.shapes = [];

		this.spawnInterval = 500; // milliseconds
		this.lastSpawnTime = 0;
	}

	getRandomColor() {
		let randomIndex = Math.floor(Math.random() * this.colors.length);
		return this.colors[randomIndex];
	}

	spawnShape(elapsedTime) {
		this.lastSpawnTime += elapsedTime;
		if (this.lastSpawnTime < this.spawnInterval) {
			return; // leave, not enough time since last spawn
		}

		// console.log("in spawnShape");

		// reset our last spawn time
		this.lastSpawnTime = 0;

		let s = new ClickShape();
		s.color = this.getRandomColor();
		s.y = 0 - s.width;

		let randX = Math.floor(Math.random() * (canvas.width / s.width));

		s.x = randX * s.width;

		//console.log(s);

		// push the new shape into our array
		this.shapes.push(s);
	}

	update(elapsedTime) {
		this.spawnShape(elapsedTime);

		this.shapes.forEach((s) => {
			s.update();
		});

		this.shapes = this.shapes.filter((s) => s.isVisible);

		// console.log("length of shapes array", this.shapes.length);
	}

	draw() {
		this.shapes.forEach((s) => {
			s.draw();
		});
	}
}

let game = new Game();

//console.log(game);

let currentTime = 0;

let gameLoop = function (timestamp) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	let elapsedTime = timestamp - currentTime;
	currentTime = timestamp;

	game.update(elapsedTime);
	game.draw();

	window.requestAnimationFrame(gameLoop);
};

window.requestAnimationFrame(gameLoop);

canvas.addEventListener("click", (ev) => {
	console.log("mouse event", ev.offsetX, ev.offsetY);
});
