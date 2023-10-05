//@ts-check
/** @type {HTMLCanvasElement} */
//@ts-ignore canvas is an HTMLCanvasElement
const canvas = document.getElementById("game-canvas");
/** @type {CanvasRenderingContext2D} */
//@ts-ignore we know ctx is not null
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

/** @type {HTMLCanvasElement} */
//@ts-ignore canvas is an HTMLCanvasElement
const scoreCanvas = document.getElementById("score-canvas");
/** @type {CanvasRenderingContext2D} */
//@ts-ignore we know ctx is not null
const scoreCtx = scoreCanvas.getContext("2d");
scoreCanvas.width = 800;
scoreCanvas.height = 60;

const direction = {
	down: "down",
	up: "up",
	right: "right",
	left: "left",
};

class ClickShape {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {string} moveDirection
	 */
	constructor(ctx, moveDirection) {
		/** @type {CanvasRenderingContext2D} */
		this.ctx = ctx;
		this.moveDirection = moveDirection;

		this.type = null;

		this.x = 0;
		this.y = 0;

		this.width = 100;

		this.xDirection =
			this.moveDirection === direction.right
				? 1
				: this.moveDirection === direction.left
				? -1
				: 0;

		this.yDirection =
			this.moveDirection === direction.down
				? 1
				: this.moveDirection === direction.up
				? -1
				: 0;

		this.speed = 5;

		this.isVisible = true;
		this.isClicked = false;

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

	draw() {}

	checkForClicked(x, y) {
		if (this.isClicked) {
			return; // leave if we are clicked so we can't be un-clicked
		}

		//@ts-ignore path will not be undefined here
		this.isClicked = ctx.isPointInPath(this.path, x, y);
		console.log(this.path, x, y, this.x, this.y);
		//this.color = "silver";
	}
}

class SquareClickShape extends ClickShape {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {string} moveDirection
	 */
	constructor(ctx, moveDirection) {
		super(ctx, moveDirection);
		this.type = "square";
	}

	draw() {
		this.ctx.fillStyle = this.isClicked ? "silver" : this.color;

		this.path = new Path2D();
		this.path.rect(this.x, this.y, this.width, this.width);
		this.ctx.fill(this.path);
	}
}

class CircleClickShape extends ClickShape {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {string} moveDirection
	 */
	constructor(ctx, moveDirection) {
		super(ctx, moveDirection);
		this.type = "circle";
	}

	draw() {
		this.ctx.fillStyle = this.isClicked ? "silver" : this.color;

		const halfWidth = this.width / 2;

		this.path = new Path2D();
		this.path.arc(
			this.x + halfWidth,
			this.y + halfWidth,
			halfWidth,
			0,
			Math.PI * 2
		);
		this.ctx.fill(this.path);
	}
}

class Game {
	constructor() {
		this.score = 0;
		this.isGameOver = false;

		this.colors = [
			"red",
			"orange",
			"yellow",
			"green",
			"blue",
			"indigo",
			"violet",
		];

		this.targetShape = this.getRandomTargetShape();

		/**@type {Array<ClickShape>} */
		this.shapes = [];

		this.spawnInterval = 350; // milliseconds
		this.lastSpawnTime = 0;
		this.difficultyLevel = 1;
		// update difficulty for every x number of points scored
		this.difficultyInterval = 3;
	}

	getRandomTargetShape() {
		let randShape = Math.random();

		let s =
			randShape < 0.5
				? new SquareClickShape(scoreCtx, direction.down)
				: new CircleClickShape(scoreCtx, direction.down);

		s.color = this.getRandomColor();
		s.width = scoreCanvas.height * 0.8;
		s.x = scoreCanvas.width / 2 - s.width / 2;
		s.y = 5;
		return s;
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

		let randShape = Math.random();

		let spawnDirection = direction.down;

		if (this.difficultyLevel == 2) {
			spawnDirection =
				Math.random() > 0.5 ? direction.up : direction.down;
		} else if (this.difficultyLevel == 3) {
			let r = Math.floor(Math.random() * 3);
			switch (r) {
				case 0:
					spawnDirection = direction.down;
					break;
				case 1:
					spawnDirection = direction.up;
					break;
				case 2:
					spawnDirection = direction.right;
					break;
			}
		}

		let s =
			randShape < 0.5
				? new SquareClickShape(ctx, spawnDirection)
				: new CircleClickShape(ctx, spawnDirection);

		s.color = this.getRandomColor();
		s.y = 0 - s.width;

		let randX = Math.floor(Math.random() * (canvas.width / s.width));

		s.x = randX * s.width;

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
		scoreCtx.font = "50px fantasy";
		scoreCtx.fillStyle = "red";
		scoreCtx.fillText(`Score: ${this.score}`, 0, 55);

		if (this.isGameOver) {
			// write out game over!
			ctx.save();
			ctx.fillStyle = "red";
			ctx.strokeStyle = "yellow";
			ctx.font = "60px Comic Sans MS";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText("GAME OVER!", canvas.width / 2, canvas.height / 2);
			ctx.strokeText("GAME OVER!", canvas.width / 2, canvas.height / 2);
			ctx.restore();

			// make sure we don't draw anything else if the
			// game is over
			return;
		}

		this.shapes.forEach((s) => {
			s.draw();
		});

		this.targetShape.draw();
	}

	checkForClicked(x, y) {
		this.shapes.forEach((s) => {
			s.checkForClicked(x, y);
		});

		let clickedShapes = this.shapes.filter((s) => s.isClicked);
		// console.log(clickedShapes);
		// debugger;

		if (clickedShapes.length === 0) {
			return;
		}

		// get the last shape drawn that was clicked and see if it
		// matches our target color

		let clickedShape = clickedShapes[clickedShapes.length - 1];

		if (
			clickedShape.color === this.targetShape.color &&
			clickedShape.type === this.targetShape.type
		) {
			this.score++;
			this.updateDifficulty();
			this.targetShape = this.getRandomTargetShape();
		} else {
			this.isGameOver = true;
		}
	}

	updateDifficulty() {
		if (this.score % this.difficultyInterval === 0) {
			this.difficultyLevel++;
		}
	}
}

let game = new Game();

//console.log(game);

let currentTime = 0;

let gameLoop = function (timestamp) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	scoreCtx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);

	let elapsedTime = timestamp - currentTime;
	currentTime = timestamp;

	game.update(elapsedTime);
	game.draw();

	if (game.isGameOver === false) {
		window.requestAnimationFrame(gameLoop);
	}
};

window.requestAnimationFrame(gameLoop);

canvas.addEventListener("click", (ev) => {
	console.log("mouse event", ev.offsetX, ev.offsetY);
	game.checkForClicked(ev.offsetX, ev.offsetY);
});
