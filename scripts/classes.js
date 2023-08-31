class Person {
	constructor(firstName, lastName) {
		this.firstName = firstName;
		this.lastName = lastName;
	}

	getFullName() {
		let fullName = `${this.firstName} ${this.lastName}`;
		// this is the same as: this.firstName + " " + this.lastName
		return fullName;
	}
}

// Student inherits, or extends, the Person class
class Student extends Person {
	constructor(firstName, lastName, grade) {
		super(firstName, lastName);
		this.grade = grade;
	}
}

let p1 = new Person("Jack", "Black");
let s1 =  new Student("Griffin", "Hardy", 8);

p1.firstName = "Joe";
console.log(p1.getFullName());
console.log(s1.getFullName());
