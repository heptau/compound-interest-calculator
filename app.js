const context = document.getElementById("data-set").getContext("2d");

let lang = "en";
let translations = {};

let line = new Chart(context, {
	type: 'line',
	data: {
		labels: [],
		datasets: [
			{
				label: translations["totalBalance"] || 'Total Balance',
				data: [],
				fill: true,
				backgroundColor: 'rgba(12, 141, 0, 0.7)',
				borderWidth: 3
			},
			{
				label: translations["totalDeposits"] || 'Total Deposits',
				data: [],
				fill: true,
				backgroundColor: 'rgba(0, 123, 255, 0.7)',
				borderWidth: 3
			}
		]
	},
	options: {
		scales: {
			y: {
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
				labels.push(translations[`year`] + " " + year);
				growth = toDecimal(balance, 2);
			}
		}

		const growthHuman = growth.toLocaleString(lang, {minimumFractionDigits: 2, maximumFractionDigits: 2});
		message.innerText = translations["message"]
			.replace("{period}", period)
			.replace("{amount}", growthHuman);

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
					label: translations["totalBalance"] || 'Total Balance',
					data: totalData,
					fill: true,
					backgroundColor: 'rgba(12, 141, 0, 0.7)',
					borderWidth: 3,
					order: 1
				},
				{
					label: translations["totalDeposits"] || 'Total Deposits',
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
				y: {
					beginAtZero: true
				}
			}
		}
	});
}


// Function to automatically add events to form elements
function setupAutoSave(formId, cookieName) {
	const form = document.getElementById(formId);
	if (!form) {
		console.log(`Form with ID '${formId}' was not found.`);
		return;
	}

	form.querySelectorAll('input, select').forEach(input => {
		if (!input.id) {
			//console.log(`Element without attribute 'id' was skipped.`);
			return;
		}

		if (input.type === 'text' || input.type === 'number') {
			input.addEventListener('blur', () => {
				//console.log(`Saving for element with id '${input.id}' on loss of focus.`);
				saveFormToCookie(formId, cookieName);
			});
		} else if (input.type === 'checkbox') {
			input.addEventListener('change', () => {
				//console.log(`Saving for checkbox with id '${input.id}' on change.`);
				saveFormToCookie(formId, cookieName);
			});
		} else if (input.tagName === 'SELECT') {
			input.addEventListener('change', () => {
				//console.log(`Saving for select with id '${input.id}' on change.`);
				saveFormToCookie(formId, cookieName);
			});
		}
	});

	//console.log(`AutoSave set for form '${formId}'.`);
}


// Function to create a cookie expiration (for example, 7 days)
function getExpiryDate(days) {
	const date = new Date();
	date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Sets the expiration for the number of days
	return date.toUTCString();
}

// Stores form values in a cookie based on id
function saveFormToCookie(formId, cookieName, expiryDays = 369) { // 369 days as default (1 year + 2 weekend days + 1 or 2 reserve days)
	const form = document.getElementById(formId);
	if (!form) {
		console.log(`Form with ID '${formId}' was not found.`);
		return;
	}

	const formData = {};

	form.querySelectorAll('input, select').forEach(input => {
		if (input.id) {
			if (input.type === 'checkbox') {
				formData[input.id] = input.checked;
			} else {
				formData[input.id] = input.value;
			}
		}
	});

	const expires = getExpiryDate(expiryDays);
	document.cookie = `${cookieName}=${encodeURIComponent(JSON.stringify(formData))}; expires=${expires}; path=/;`;
	//console.log("The form data was stored in a cookie:", formData);
}

// Initializing form auto-save
setupAutoSave('compound-form', 'LastCompoundFormData');

// Retrieves values from the cookie and fills in the form based on the id
function loadFormFromCookie(formId, cookieName) {
	const form = document.getElementById(formId);
	if (!form) {
		console.log(`Form with ID '${formId}' was not found.`);
		return;
	}

	const cookies = document.cookie.split('; ').find(row => row.startsWith(`${cookieName}=`));
	if (!cookies) {
		//console.log(`A cookie named '${cookieName}' was not found.`);
		return;
	}

	const formData = JSON.parse(decodeURIComponent(cookies.split('=')[1]));

	Object.keys(formData).forEach(id => {
		const input = form.querySelector(`#${id}`);
		if (input) {
			if (input.type === 'checkbox') {
				input.checked = formData[id];
			} else {
				input.value = formData[id];
			}
		} else {
			//console.log(`Element with id '${id}' was not found in the form.`);
		}
	});

	//console.log("The form data was retrieved from a cookie:", formData);
}

async function loadTranslations(languageCode) {
	try {
		const response = await fetch(`./locales/${languageCode}.json`);
		if (!response.ok) throw new Error(`Could not load translation: ${languageCode}`);
		translations = await response.json();
		switchLanguage(languageCode);
	} catch (error) {
		console.error("Translation loading error:", error);
	}
}

function switchLanguage(newLang) {
	lang = newLang;
	document.querySelectorAll('[data-lang]').forEach(el => {
		el.classList.toggle('hidden', el.getAttribute('data-lang') !== newLang);
	});

	document.title = translations["title"] || "Compound Interest Calculator";
	document.querySelectorAll('[data-i18n]').forEach(el => {
		const key = el.getAttribute('data-i18n');
		if (translations[key]) el.textContent = translations[key];
	});

	if (totalData.length > 0) {
		const period = parseInt(years.value) || 0;
		const growth = totalData[totalData.length - 1];
		const growthHuman = growth.toLocaleString(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		const messageTemplate = translations["message"] || "After {period} years you will have {amount}";
		message.innerText = messageTemplate
			.replace("{period}", period)
			.replace("{amount}", growthHuman);
	}

	drawGraph();
}

document.addEventListener("DOMContentLoaded", () => {
	// Load values from cookies (only once)
	loadFormFromCookie('compound-form', 'LastCompoundFormData');
	// Set up automatic saving
	setupAutoSave('compound-form', 'LastCompoundFormData');

	// Find out your preferred browser language
	const preferredLanguage = navigator.language?.substring(0, 2) || "en";
	// We find the language selection element
	const langSelect = document.getElementById("langSelect");

	// Array of supported languages
	const supportedLanguages = ["es", "fr", "de", "it", "pt", "pl", "uk", "cs"];

	// Setting the selected language according to browser preferences
	if (preferredLanguage === "sk") {
		langSelect.value = "cs"; // Use Czech for Slovak
	} else if (supportedLanguages.includes(preferredLanguage)) {
		langSelect.value = preferredLanguage;
	} else {
		langSelect.value = "en"; // The default language is English
	}

	loadTranslations(langSelect.value);
	langSelect.addEventListener("change", (e) => loadTranslations(e.target.value));
});

// PWA Install

function isRunningAsPWA() {
	// 1. Detection for Chrome/Edge/Firefox/Android
	const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

	// 2. Detection for iOS (old version)
	const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
	const isIOSPWA = isIOS && ('standalone' in navigator) && navigator.standalone;

	// Debug logs
	console.log('[DEBUG] display-mode standalone:', isStandalone);
	console.log('[DEBUG] iOS standalone:', isIOSPWA);

	return isStandalone || isIOSPWA;
}


// Detection of installation support (Chrome/Edge/Firefox + iOS 16.4+)
function isInstallSupported() {
	// Standard PWA installation (Chrome/Edge/Firefox)
	const isStandardPWA = window.hasOwnProperty('beforeinstallprompt');
	// iOS 16.4+ supports installation via `navigator.share()`
	const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
	const isNewIOS = isIOS && typeof navigator.standalone !== 'undefined';
	return isStandardPWA || isNewIOS;
}

// Display banner ONLY if installable
function showPWABanner() {
	if (!isRunningAsPWA() && isInstallSupported()) {
		const banner = document.getElementById('pwa-install-banner');
		const installBtn = document.getElementById('install-pwa-button');

		banner.style.display = 'flex';

		// Automatic hide after 3 seconds
		setTimeout(() => {
			banner.style.animation = 'fadeOut 0.3s forwards';
			setTimeout(() => banner.style.display = 'none', 300);
		}, 3000);

		// Actions of the "Install" button
		installBtn.addEventListener('click', async () => {
			if (window.deferredPrompt) {
				// For Chrome/Edge/Firefox
				window.deferredPrompt.prompt();
				const { outcome } = await window.deferredPrompt.userChoice;
				if (outcome === 'accepted') banner.style.display = 'none';
			} else if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
				// For iOS 16.4+
				try {
					await navigator.share({ title: 'Instalovat aplikaci', url: window.location.href });
				} catch (err) {
					console.log("Uživatel instalaci zrušil");
				}
			}
		});

		// Close button
		document.getElementById('close-pwa-banner').addEventListener('click', () => {
			banner.style.display = 'none';
		});
	}
}

// Installation event capture (for Chrome/Edge/Firefox)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault();
	deferredPrompt = e;
});

// Run after page load
window.addEventListener('load', showPWABanner);

