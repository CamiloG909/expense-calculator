const reloadBtn = document.querySelector("#reload-budget");

eventListeners();

function eventListeners() {
	reloadBtn.addEventListener("click", reloadBudget);
}

function reloadBudget() {
	localStorage.setItem("expenses", "[]");
	location.reload();
}
