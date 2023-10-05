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
		this.width = 100;

		this.x = this.initX();
		this.y = this.initY();

		this.xDirection = this.initDirectionX();
		this.yDirection = this.initDirectionY();

		this.speed = 5;

		this.isVisible = true;
		this.isClicked = false;

		this.color = "silver";

		/** @type {Path2D | undefined} */
		this.path;
	}

	initDirectionY() {
		switch (this.moveDirection) {
			case direction.down:
				return 1;
			case direction.up:
				return -1;
		}
		return 0;
	}

	initDirectionX() {
		switch (this.moveDirection) {
			case direction.right:
				return 1;
			case direction.left:
				return -1;
		}
		return 0;
	}

	initY() {
		switch (this.moveDirection) {
			case direction.down:
				return -this.width;
			case direction.up:
				return this.width + canvas.height;
			default:
				let ry = Math.floor(
					Math.random() * (canvas.height / this.width)
				);
				return ry * this.width;
		}
	}

	initX() {
		switch (this.moveDirection) {
			case direction.right:
				return -this.width;
			case direction.left:
				return this.width + canvas.width;
			default:
				let rx = Math.floor(
					Math.random() * (canvas.width / this.width)
				);
				return rx * this.width;
		}
	}

	update() {
		if (!this.isVisible) {
			return; // leave this method, nothing to do
		}

		// oob = out of bounds
		let oob = this.width * 3;
		if (
			this.isClicked ||
			this.y < -oob ||
			this.y > canvas.height + oob ||
			this.x < -oob ||
			this.x > canvas.width + oob
		) {
			this.isVisible = false;
		}

		this.x += this.xDirection * this.speed;
		this.y += this.yDirection * this.speed;
	}

	draw() {}

	/**
	 * @param {number} x
	 * @param {number} y
	 */
	checkForClicked(x, y) {
		if (this.isClicked) {
			return; // leave if we are clicked so we can't be un-clicked
		}

		//@ts-ignore path will not be undefined here
		this.isClicked = this.ctx.isPointInPath(this.path, x, y);
		// if (this.isClicked) {
		// 	debugger;
		// }
		// console.log(this);
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
		this.ctx.save();
		this.ctx.fillStyle = this.color;
		this.path = new Path2D();
		this.path.rect(this.x, this.y, this.width, this.width);
		this.ctx.fill(this.path);
		this.ctx.restore();
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
		const halfWidth = this.width / 2;
		this.ctx.save();
		this.ctx.fillStyle = this.color;
		this.path = new Path2D();
		this.path.arc(
			this.x + halfWidth,
			this.y + halfWidth,
			halfWidth,
			0,
			Math.PI * 2
		);
		this.ctx.fill(this.path);
		this.ctx.restore();
	}
}

class TriangleClickShape extends ClickShape {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {string} moveDirection
	 */
	constructor(ctx, moveDirection) {
		super(ctx, moveDirection);
		this.type = "triangle";
	}

	draw() {
		const halfWidth = this.width / 2;
		this.ctx.save();
		this.ctx.fillStyle = this.color;
		this.path = new Path2D();
		this.path.moveTo(this.x + halfWidth, this.y);
		this.path.lineTo(this.x, this.y + this.width);
		this.path.lineTo(this.x + this.width, this.y + this.width);
		this.path.lineTo(this.x + halfWidth, this.y);
		this.ctx.fill(this.path);
		this.ctx.restore();
	}
}

class StarClickShape extends ClickShape {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {string} moveDirection
	 */
	constructor(ctx, moveDirection) {
		super(ctx, moveDirection);
		this.type = "5-point-star";
	}

	draw() {
		this.ctx.save();
		this.drawStar(5);
		this.ctx.restore();
	}

	/**
	 * @param {number} points
	 */
	drawStar(points) {
		const halfWidth = this.width / 2;
		const outerRadius = halfWidth;
		const innerRadius = halfWidth / 2;
		let rot = (Math.PI / 2) * 3;
		let x = this.x + halfWidth;
		let y = this.y + halfWidth;
		const cx = x;
		const cy = y;
		let step = Math.PI / points;

		this.path = new Path2D();

		this.path.moveTo(cx, cy - outerRadius);
		for (let i = 0; i < points; i++) {
			x = cx + Math.cos(rot) * outerRadius;
			y = cy + Math.sin(rot) * outerRadius;
			this.path.lineTo(x, y);
			rot += step;

			x = cx + Math.cos(rot) * innerRadius;
			y = cy + Math.sin(rot) * innerRadius;
			this.path.lineTo(x, y);
			rot += step;
		}
		this.path.lineTo(cx, cy - outerRadius);
		this.path.closePath();
		this.ctx.fillStyle = this.color;
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
		let s = this.getRandomShape(scoreCtx, direction.down);
		s.color = this.getRandomColor();
		s.width = scoreCanvas.height * 0.8;
		s.x = scoreCanvas.width / 2 - s.width / 2;
		s.y = 5;
		return s;
	}

	/**
	 * @param {CanvasRenderingContext2D} context
	 * @param {string} direction
	 */
	getRandomShape(context, direction) {
		const numberOfShapes = Math.min(this.difficultyLevel, 4);
		let r = Math.floor(Math.random() * numberOfShapes);
		switch (r) {
			case 1:
				return new CircleClickShape(context, direction);
			case 2:
				return new TriangleClickShape(context, direction);
			case 3:
				return new StarClickShape(context, direction);
			default:
				return new SquareClickShape(context, direction);
		}
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

		// reset our last spawn time
		this.lastSpawnTime = 0;

		let directionLimit = Math.min(this.difficultyLevel, 4);
		let randomDirection = Math.floor(Math.random() * directionLimit);
		let spawnDirection = direction.down;

		switch (randomDirection) {
			case 1:
				spawnDirection = direction.up;
				break;
			case 2:
				spawnDirection = direction.right;
				break;
			case 3:
				spawnDirection = direction.left;
				break;
		}

		let s = this.getRandomShape(ctx, spawnDirection);
		s.color = this.getRandomColor();

		// push the new shape into our array
		this.shapes.push(s);
	}

	update(elapsedTime) {
		this.spawnShape(elapsedTime);

		this.shapes.forEach((s) => {
			s.update();
		});

		this.shapes = this.shapes.filter((s) => s.isVisible);
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
	// console.log("mouse event", ev.offsetX, ev.offsetY);
	game.checkForClicked(ev.offsetX, ev.offsetY);
});
