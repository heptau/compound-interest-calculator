const context = document.getElementById("data-set").getContext("2d");
let line = new Chart(context, {
	type: 'line',
	data: {
		labels: [],
		datasets: [
			{
				label: 'Total Balance',
				data: [],
				fill: true,
				backgroundColor: 'rgba(12, 141, 0, 0.7)',
				borderWidth: 3
			},
			{
				label: 'Total Deposits',
				data: [],
				fill: true,
				backgroundColor: 'rgba(0, 123, 255, 0.7)',
				borderWidth: 3
			}
		]
	},
	options: {
		scales: {
			y:	{
				beginAtZero: true
			}
		}
	}
});

// Values from the form
const initialAmount = document.getElementById("initialamount");
const years = document.getElementById("years");
const rates = document.getElementById("rates");
const monthlyDeposit = document.getElementById("monthlyDeposit");

var lang = "en";

// Message
const message = document.getElementById("message");

// The calculate button
// Find all buttons inside a div with class "input-group"
const buttons = document.querySelectorAll(".input-group button");

// Add event listeners for each button
buttons.forEach(button => {
	button.addEventListener("click", calculateGrowth);
});

const totalData = [];
const depositData = [];
const labels = [];

function calculateGrowth(e) {
	e.preventDefault();
	totalData.length = 0;
	depositData.length = 0;
	labels.length = 0;
	let growth = 0;
	try {
		const initial = parseFloat(initialAmount.value) || 0;
		const period = parseInt(years.value) || 0;
		const interest = parseFloat(rates.value) || 0;
		const monthlyDepositAmount = parseFloat(monthlyDeposit.value) || 0;

		const months = period * 12;
		const monthlyInterestRate = (interest / 100) / 12;

		let balance = initial;
		let totalDeposits = initial;

		for (let i = 1; i <= months; i++) {
			balance += monthlyDepositAmount; // Add monthly deposit
			totalDeposits += monthlyDepositAmount; // Track total deposits
			balance *= 1 + monthlyInterestRate; // Apply monthly interest

			// Save data for each year
			if (i % 12 === 0) { // Update annually for the graph
				const year = i / 12;
				totalData.push(toDecimal(balance, 2));
				depositData.push(toDecimal(totalDeposits, 2));
				if (lang === "cs") {
					labels.push(year + ". rok");
				} else {
					labels.push("Year " + year);
				}
				growth = toDecimal(balance, 2);
			}
		}

		growthHuman = growth.toLocaleString(lang, {minimumFractionDigits: 2, maximumFractionDigits: 2});
		if (lang === "cs") {
			message.innerText = `Za ${period} let budete mít ${growthHuman} Kč`;
		} else if (lang === "uk") {
			message.innerText = `Через ${period} років ви матимете ${growthHuman} ₴`;
		} else if (lang === "pl") {
			message.innerText = `Po ${period} lat będziesz mieć ${growthHuman} zł`;
		} else if (lang === "pt") {
			message.innerText = `Após ${period} anos, terá ${growthHuman} €`;
		} else if (lang === "it") {
			message.innerText = `Dopo ${period} anni avrete ${growthHuman} €`;
		} else if (lang === "de") {
			message.innerText = `Nach ${period} Jahren werden Sie ${growthHuman} € haben`;
		} else if (lang === "fr") {
			message.innerText = `Au bout de ${period} ans, vous disposerez de ${growthHuman} €`;
		} else if (lang === "es") {
			message.innerText = `Después de ${period} años tendrás ${growthHuman} €`;
		} else {
			message.innerText = `After ${period} years you will have $${growthHuman}`;
		}

		drawGraph();
	} catch (error) {
		console.error(error);
	}
}

function toDecimal(value, decimals) {
	return +value.toFixed(decimals);
}

function drawGraph() {
	line.destroy();
	line = new Chart(context, {
		type: 'line',
		data: {
			labels,
			datasets: [
				{
					label: 'Total Balance',
					data: totalData,
					fill: true,
					backgroundColor: 'rgba(12, 141, 0, 0.7)',
					borderWidth: 3,
					order: 1
				},
				{
					label: 'Total Deposits',
					data: depositData,
					fill: true,
					backgroundColor: 'rgba(0, 123, 255, 0.7)',
					borderWidth: 3,
					order: 0
				}
			]
		},
		options: {
			scales: {
				y:	{
						beginAtZero: true
					}
			}
		}
	});
}


function switchLanguage(newLang) {
	lang = newLang;
	// Show and hide corresponding elements
	const elements = document.querySelectorAll('[data-lang]');
	elements.forEach(element => {
		if (element.getAttribute('data-lang') === newLang) {
			element.classList.remove('hidden');
		} else {
			element.classList.add('hidden');
		}
	});

	// Change the page title based on the selected language
	if (lang === "cs") {
		document.title = "Kalkulačka složeného úročení";
	} else if (lang === "uk") {
		document.title = "Калькулятор складних відсотків";
	} else if (lang === "pl") {
		document.title = "Kalkulator odsetek składanych";
	} else if (lang === "pt") {
		document.title = "Calculadora de juros compostos";
	} else if (lang === "it") {
		document.title = "Calcolatore dell'interesse composto";
	} else if (lang === "de") {
		document.title = "Zinseszins-Rechner";
	} else if (lang === "fr") {
		document.title = "Calculateur d'intérêts composés";
	} else if (lang === "es") {
		document.title = "Calculadora de interés compuesto";
	} else {
		document.title = "Compound Interest Calculator";
	}
}

document.addEventListener("DOMContentLoaded", function() {
	// Find out your preferred browser language
	const preferredLanguage = navigator.language || navigator.languages[0];

	// Find out the language abbreviation (e.g. "en", "cs")
	const languageCode = preferredLanguage.substring(0, 2);

	// We find the language selection element
	const langSelect = document.getElementById("langSelect");

	// Set the selected language based on browser preference
	if (languageCode === "cs" || languageCode === "sk") {
		langSelect.value = "cs";
	} else {
		langSelect.value = "en";
	}

	// Call the function to change the language
	switchLanguage(langSelect.value);
});
