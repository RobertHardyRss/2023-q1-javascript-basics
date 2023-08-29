let btn = document.getElementById("advice-button");
let output = document.getElementById("advice");

let advisors = [
	"A wise man once told me",
	"Mother always says",
	"My Uncle Rupert once said",
];

let howOften = ["never", "always", "as often as you can", "never ever"];

let verbs = ["run with", "swim in", "eat", "climb", "dance with"];

let adjectives = ["spiky", "furry", "funny", "spicy", "odd", "loud", "scary"];

let nouns = [
	"elephants",
	"humans",
	"chainsaws",
	"nuclear bombs",
	"computers",
	"commuters",
	"video games",
];

let getRandomIndex = function (a) {
	let rand = Math.random() * a.length;
	return Math.floor(rand);
};

let getRandomWord = function (a) {
	return a[getRandomIndex(a)];
};

let generateAdvice = function (a, h, v, adj, n) {
	let randomAdvice =
		getRandomWord(a) +
		" " +
		getRandomWord(h) +
		" " +
		getRandomWord(v) +
		" " +
		getRandomWord(adj) +
		" " +
		getRandomWord(n);

	console.log(randomAdvice);

	return randomAdvice;
};

//generateAdvice(advisors, howOften, verbs, adjectives, nouns);

btn.addEventListener("click", function () {
	//console.log("clicked!");
	let advice = generateAdvice(advisors, howOften, verbs, adjectives, nouns);
	output.textContent = advice;
});
