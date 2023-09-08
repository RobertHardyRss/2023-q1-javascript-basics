//@ts-check
/** @type {HTMLCanvasElement} */
//@ts-ignore canvas is an HTMLCanvasElement
const canvas = document.getElementById("game-canvas");
/** @type {CanvasRenderingContext2D} */
//@ts-ignore we know ctx is not null
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

class Shape {
	constructor(startX, startY) {
		this.x = startX;
		this.y = startY;

		this.width = 100;
		this.height = 100;

		this.color = "red";

		this.speed = 10;
		this.xDirection = 1;
		this.yDirection = 1;
	}

	update() {
		if (this.x < 0 || this.x + this.width > canvas.width) {
			this.xDirection *= -1;
		}

		if (this.y < 0 || this.y + this.height > canvas.height) {
			this.yDirection *= -1;
		}

		this.x += this.speed * this.xDirection;
		this.y += this.speed * this.yDirection;
	}

	draw() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

let shapes = [];

for (let i = 0; i < 20; i++) {
	let s = new Shape(
		Math.random() * canvas.width,
		Math.random() * canvas.height
	);

	s.speed = Math.random() * 5 + 5;

	shapes.push(s);
}

let animationLoop = function () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	shapes.forEach((s) => {
		s.update();
		s.draw();
	});

	window.requestAnimationFrame(animationLoop);
};

window.requestAnimationFrame(animationLoop);
