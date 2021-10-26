const reloadBtn = document.querySelector("#reload-budget");
const form = document.querySelector("#add-form");
const container = document.querySelector("#expenses-container");

eventListeners();

function eventListeners() {
	messageBudget();
	form.addEventListener("submit", addExpense);
	reloadBtn.addEventListener("click", reloadBudget);
}

class Budget {
	constructor(budget, remaining) {
		this.budget = Number(budget);
		this.remaining = Number(remaining);
		this.expenses = [];
	}

	newSpending(spending) {
		this.expenses.push(spending);

		ui.showSpending(this.expenses);
		this.calculateRemaining();
	}

	calculateRemaining() {
		const remaining = this.expenses.reduce(
			(total, expense) => total + expense.amount,
			0
		);

		this.remaining = this.budget - remaining;
	}

	removeSpending(id) {
		this.expenses = this.expenses.filter((expense) => expense.id !== id);
	}
}

class UI {
	showBudget(budget) {
		document.querySelector("#budget").textContent = "$ " + budget.budget;
		document.querySelector("#remaining").textContent = "$ " + budget.remaining;
	}

	showError(message) {
		const titleError = document.querySelector(".box__title");
		titleError.textContent = message;
		titleError.style.backgroundColor = "#d31225";

		// Remove error
		setTimeout(() => {
			titleError.textContent = "Weekly expenses";
			titleError.style.backgroundColor = null;
		}, 1500);
	}

	showSpending(expenses) {
		container.innerHTML = "";
		expenses.forEach((expense) => {
			const article = document.createElement("article");
			article.className = "card-expense";
			article.innerHTML = `<p class="card-expense__name">${expense.name}</p><span id="cost-expense" class="card-expense__cost">$ ${expense.amount}</span><i id="delete-exponse" class="bi bi-x-square-fill card-expense__btn-delete" onclick="removeSpending(${expense.id})"></i>`;
			container.appendChild(article);
		});
	}

	refreshRemaining(remaining) {
		document.querySelector("#remaining").textContent = "$ " + remaining;
	}

	verifyBudget(budgetObj) {
		const { budget, remaining } = budgetObj;
		const statusRemaining = document.querySelector("#remaining").parentElement;

		if (budget / 4 > remaining) {
			statusRemaining.classList.add("red");
		} else if (budget / 2 > remaining) {
			statusRemaining.classList.add("orange");
		} else {
			statusRemaining.classList.remove("red", "orange");
		}

		if (remaining < 0) {
			this.showError("You are out of budget");
			form.querySelector(".box__btn-add").disabled = true;
		}
	}
}

function messageBudget() {
	const messageContainer = document.createElement("div");
	messageContainer.className = "message-container";
	messageContainer.style.opacity = 1;
	messageContainer.innerHTML = `
	<div class="message">
		<i class="bi bi-caret-up-fill message__arrow"></i>
		<p class="message__title">What is your budget?</p>
		<input class="message__input" type="text" placeholder="Your budget">
		<button onclick="getBudget()" id="send-budget" class="message__btn">Set Budget</button>
	</div>
	`;

	document.body.appendChild(messageContainer);
}

// Instances
const ui = new UI();
let budget;

function getBudget() {
	let userBudget = document.querySelector("#send-budget").parentElement;
	userBudget = userBudget.querySelector(".message__input").value;

	// Validate budget
	if (
		userBudget === null ||
		userBudget === "" ||
		isNaN(userBudget) ||
		userBudget <= 0
	)
		window.location.reload();

	// Hidden message
	document.querySelector(".message-container").style.opacity = 0;
	setTimeout(() => {
		document.querySelector(".message-container").remove();
	}, 100);

	budget = new Budget(userBudget, userBudget);

	ui.showBudget(budget);
}

function addExpense(e) {
	e.preventDefault();

	const nameSpending = document.querySelector("#spending").value;
	const totalSpending = document.querySelector("#total").value;

	if (nameSpending === "" || totalSpending === "") {
		ui.showError("Please fill in the fields");
		return;
	} else if (totalSpending <= 0 || isNaN(totalSpending)) {
		ui.showError("Please enter a valid amount");
		return;
	}

	const spending = {
		id: Date.now(),
		name: nameSpending,
		amount: Number(totalSpending),
	};
	form.reset();

	// Add to budget
	budget.newSpending(spending);
	ui.refreshRemaining(budget.remaining);
	ui.verifyBudget(budget);
}

function removeSpending(id) {
	budget.removeSpending(id);
	ui.showSpending(budget.expenses);
	budget.calculateRemaining();
	ui.refreshRemaining(budget.remaining);
	ui.verifyBudget(budget);
}

function reloadBudget() {
	localStorage.setItem("expenses", "[]");
	window.location.reload();
}
