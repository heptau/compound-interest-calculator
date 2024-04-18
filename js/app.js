const context = document.getElementById("data-set").getContext("2d");
let line = new Chart(context, {});
//Values from the form
const intialAmount = document.getElementById("initialamount");
const years = document.getElementById("years");
const rates = document.getElementById("rates");
const compound = document.getElementById("compound");

var lang = "en";

//Messge
const message = document.getElementById("message");

//The calculate button
// Find all buttons inside a div with class "input-group"
const buttons = document.querySelectorAll(".input-group button");

// Add event listeners for each button
buttons.forEach(button => {
    button.addEventListener("click", calculateGrowth);
});

const data = [];
const labels = [];

function calculateGrowth(e) {
	e.preventDefault();
	data.length = 0;
	labels.length = 0;
	let growth = 0;
	try {
		const initial = parseInt(intialAmount.value);
		const period = parseInt(years.value);
		const interest = parseInt(rates.value);
		const comp = parseInt(compound.value);

		for(let i = 1; i <= period; i++) {
			const final = initial * Math.pow(1 + ((interest / 100) / comp), comp * i);
			data.push(toDecimal(final, 2));
			if (lang === "cs") {
				labels.push("Rok " + i);
			} else {
				labels.push("Year " + i);
			}

			growth = toDecimal(final, 2);
		}
		//
		if (lang === "cs") {
			message.innerText = `Po ${period} letech budete mít ${growth} USD`;
		} else {
			message.innerText = `You will have ${growth} USD after ${period} years`;
		}

		drawGraph();
	} catch (error) {
		console.error(error);
	}
}

function drawGraph() {
	line.destroy();
	line = new Chart(context, {
		type: 'line',
		data: {
			labels,
			datasets: [{
				label: "compound",
				data,
				fill: true,
				backgroundColor: "rgba(12, 141, 0, 0.7)",
				borderWidth: 3
			}]
		}
	});
}

function toDecimal(value, decimals) {
	return +value.toFixed(decimals);
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
		 langSelect.value = "cs"; // Pokud je preferovaný jazyk čeština nebo slovenština, nastavíme češtinu
	} else {
		 langSelect.value = "en"; // Jinak nastavíme angličtinu
	}

	// Call the function to change the language
	switchLanguage(langSelect.value);
});
