const canvasEl = document.getElementById("data-set");
const context = canvasEl ? canvasEl.getContext("2d") : null;


let lang = "en";
let translations = {};
const SUPPORTED_LANGUAGES = ['en', 'cs', 'de', 'es', 'fr', 'it', 'pl', 'pt', 'uk'];
const isFileProtocol = window.location.protocol === 'file:';
const LANGUAGE_NAMES = {
	en: '\u{1F1FA}\u{1F1F8} English',
	cs: '\u{1F1E8}\u{1F1FF} \u010cesky',
	de: '\u{1F1E9}\u{1F1EA} Deutsch',
	es: '\u{1F1EA}\u{1F1F8} Espa\u00f1ol',
	fr: '\u{1F1EB}\u{1F1F7} Fran\u00e7ais',
	it: '\u{1F1EE}\u{1F1F9} Italiano',
	pl: '\u{1F1F5}\u{1F1F1} Polski',
	pt: '\u{1F1F5}\u{1F1F9} Portugu\u00eas',
	uk: '\u{1F1FA}\u{1F1E6} \u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430'
};
const totalData = [];
const depositData = [];
const labels = [];

// Function to determine aspect ratio based on screen size and orientation
function getAspectRatio() {
	const isNarrow = window.innerWidth < 768;
	return isNarrow ? 1 : 2;
}

// Chart configuration
function createChartConfig() {
	const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
	return {
		type: 'line',
		data: {
			labels: labels,
			datasets: [
				{
					label: translations["balance"] || 'Balance',
					data: totalData,
					fill: true,
					backgroundColor: isDark ? 'rgba(76, 175, 80, 0.5)' : 'rgba(12, 141, 0, 0.7)',
					borderColor: isDark ? 'rgba(76, 175, 80, 0.9)' : 'rgba(12, 141, 0, 0.9)',
					borderWidth: 3,
					order: 1
				},
				{
					label: translations["deposits"] || 'Deposits',
					data: depositData,
					fill: true,
					backgroundColor: isDark ? 'rgba(66, 165, 245, 0.5)' : 'rgba(0, 123, 255, 0.7)',
					borderColor: isDark ? 'rgba(66, 165, 245, 0.9)' : 'rgba(0, 123, 255, 0.9)',
					borderWidth: 3,
					order: 0
				}
			]
		},
		options: {
			maintainAspectRatio: true,
			aspectRatio: getAspectRatio(), // Dynamic aspect ratio
			color: isDark ? '#e0e0e0' : undefined,
			scales: {
				y: {
					beginAtZero: true,
					grid: {
						color: isDark ? 'rgba(255,255,255,0.08)' : undefined
					},
					ticks: {
						font: {
							size: 12
						}
					}
				},
				x: {
					grid: {
						color: isDark ? 'rgba(255,255,255,0.08)' : undefined
					},
					ticks: {
						font: {
							size: 12
						},
						maxTicksLimit: 6
					}
				}
			},
			plugins: {
				legend: {
					labels: {
						font: {
							size: 14
						}
					}
				}
			},
			responsive: true,
			devicePixelRatio: window.devicePixelRatio || 1
		}
	};
}

// Initial chart
let line;

// Values from the form
const initialAmount = document.getElementById("initialamount");
const years = document.getElementById("years");
const rates = document.getElementById("rates");
const monthlyDeposit = document.getElementById("monthlyDeposit");

// Message
const message = document.getElementById("message");
const errorMessage = document.getElementById("error-message");

function validateInputs() {
	if (!initialAmount || !monthlyDeposit || !years || !rates) return false;
	const fields = [
		{ el: initialAmount, label: "initialDeposit", max: Infinity },
		{ el: monthlyDeposit, label: "monthlyDeposit", max: Infinity },
		{ el: years, label: "investmentPeriod", max: 100 },
		{ el: rates, label: "annualInterestRate", max: 1000 }
	];

	let isValid = true;

	fields.forEach(({ el, label, max }) => {
		const val = parseFloat(el.value);
		if (isNaN(val) || val < 0 || val > max) {
			el.classList.add("input-error");
			el.setAttribute("aria-invalid", "true");
			isValid = false;
		} else {
			el.classList.remove("input-error");
			el.setAttribute("aria-invalid", "false");
		}
	});

	if (!isValid && errorMessage) {
		errorMessage.textContent = translations["validationError"] || "Please enter a valid positive number.";
	} else if (errorMessage) {
		errorMessage.textContent = "";
	}

	return isValid;
}

// The calculate button
const buttons = document.querySelectorAll(".input-group button");

// Add event listeners for each button
buttons.forEach(button => {
	button.addEventListener("click", calculateGrowth);
});

function calculateGrowth(e) {
	e.preventDefault();

	if (!validateInputs()) return;

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
				labels.push((translations["year"] || "Year") + " " + year);
				growth = toDecimal(balance, 2);
			}
		}

		const growthHuman = growth.toLocaleString(lang, {minimumFractionDigits: 2, maximumFractionDigits: 2});
		message.innerText = (translations["message"] || "After {period} years you will have {amount}")
			.replace("{period}", period)
			.replace("{amount}", growthHuman);

		drawGraph();
		saveHistory();
		const shareBtn = document.getElementById('shareBtn');
		if (shareBtn) shareBtn.style.display = '';
	} catch (error) {
		console.error(error);
	 }
}

function toDecimal(value, decimals) {
	return +value.toFixed(decimals);
}

function drawGraph() {
	if (!context) return;
	if (typeof Chart === "undefined") {
		console.error("Chart.js not loaded");
		return;
	}
	if (line) line.destroy();

	const canvas = document.getElementById('data-set');
	if (canvas && translations.chartLabel) {
		canvas.setAttribute('aria-label', translations.chartLabel);
	}

	line = new Chart(context, createChartConfig());
}

// Redraw graph on resize or orientation change
window.addEventListener('resize', () => {
	if (totalData.length > 0) {
		try { drawGraph(); } catch (e) { console.error("Chart resize error:", e); }
	}
});

// Function to automatically add events to form elements
function setupAutoSave(formId, storageKey) {
	const form = document.getElementById(formId);
	if (!form) return;

	form.querySelectorAll('input, select').forEach(input => {
		if (!input.id) return;

		if (input.type === 'text' || input.type === 'number') {
			input.addEventListener('blur', () => {
				saveFormToStorage(formId, storageKey);
			});
		} else if (input.type === 'checkbox') {
			input.addEventListener('change', () => {
				saveFormToStorage(formId, storageKey);
			});
		} else if (input.tagName === 'SELECT') {
			input.addEventListener('change', () => {
				saveFormToStorage(formId, storageKey);
			});
		}
	});
}

// Stores form values in localStorage based on id
function saveFormToStorage(formId, storageKey) {
	const form = document.getElementById(formId);
	if (!form) return;

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

	try {
		localStorage.setItem(storageKey, JSON.stringify(formData));
	} catch (e) {
		// Storage full or unavailable
	}
}

// Retrieves values from localStorage and fills in the form based on the id
function loadFormFromStorage(formId, storageKey) {
	const form = document.getElementById(formId);
	if (!form) return;

	let formData;
	try {
		const raw = localStorage.getItem(storageKey);
		if (!raw) return;
		formData = JSON.parse(raw);
	} catch (e) {
		return;
	}

	Object.keys(formData).forEach(id => {
		const input = document.getElementById(id);
		if (input) {
			if (input.type === 'checkbox') {
				input.checked = formData[id];
			} else {
				input.value = formData[id];
			}
		}
	});
}

let enTranslations = null;

async function loadTranslations(languageCode) {
	if (isFileProtocol) {
		translations = {};
		switchLanguage('en');
		return;
	}
	const code = SUPPORTED_LANGUAGES.includes(languageCode) ? languageCode : 'en';
	try {
		if (!enTranslations) {
			const enRes = await fetch('locales/en.json');
			enTranslations = await enRes.json();
		}
		if (code === 'en') {
			translations = enTranslations;
			switchLanguage('en');
			return;
		}
		const res = await fetch('locales/' + code + '.json');
		if (!res.ok) throw new Error('HTTP ' + res.status);
		const data = await res.json();
		translations = { ...enTranslations, ...data };
		switchLanguage(code);
	} catch (e) {
		console.error("Failed to load translations for", code, e);
		if (enTranslations) {
			translations = enTranslations;
		} else {
			try {
				const enRes = await fetch('locales/en.json');
				enTranslations = await enRes.json();
				translations = enTranslations;
			} catch (e2) {
				console.error("Failed to load fallback translations", e2);
				translations = {};
			}
		}
		switchLanguage('en');
	}
}

function switchLanguage(newLang) {
	lang = newLang;
	document.documentElement.lang = newLang;

	document.title = translations["title"] || "Compound Interest Calculator";
	document.querySelectorAll('[data-i18n]').forEach(el => {
		const key = el.getAttribute('data-i18n');
		if (translations[key]) el.textContent = translations[key];
	});

	const closeBtn = document.getElementById('close-pwa-banner');
	if (closeBtn && translations["close"]) {
		closeBtn.setAttribute('aria-label', translations["close"]);
	}

	const printBtn = document.getElementById('print');
	if (printBtn && translations["print"]) {
		printBtn.setAttribute('aria-label', translations["print"]);
	}

	const shareBtn = document.getElementById('shareBtn');
	if (shareBtn && translations["share"]) {
		shareBtn.setAttribute('aria-label', translations["share"]);
	}

	const canvas = document.getElementById('data-set');
	if (canvas && translations["chartLabel"]) {
		canvas.setAttribute('aria-label', translations["chartLabel"]);
	}

	const clearBtn = document.getElementById('clearHistoryBtn');
	if (clearBtn && translations["historyClearAll"]) {
		clearBtn.setAttribute('title', translations["historyClearAll"]);
	}

	renderHistory();

	const appleMeta = document.querySelector('meta[name="apple-mobile-web-app-title"]');
	if (appleMeta && translations["shortTitle"]) {
		appleMeta.content = translations["shortTitle"];
	}
	const appMeta = document.querySelector('meta[name="application-name"]');
	if (appMeta && translations["shortTitle"]) {
		appMeta.content = translations["shortTitle"];
	}

	if (totalData.length > 0) {
		const period = parseInt(years.value) || 0;
		const growth = totalData[totalData.length - 1];
		const growthHuman = growth.toLocaleString(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		const messageTemplate = translations["message"] || "After {period} years you will have {amount}";
		message.innerText = messageTemplate
			.replace("{period}", period)
			.replace("{amount}", growthHuman);
		try { drawGraph(); } catch (e) { console.error("Chart error:", e); }
	}

	document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
	if (errorMessage) errorMessage.textContent = "";
	populateLanguageList();
}

document.addEventListener("DOMContentLoaded", async () => {
	loadFormFromStorage('compound-form', 'LastCompoundFormData');
	setupAutoSave('compound-form', 'LastCompoundFormData');

	const initialLang = getInitialLanguage();
	await loadTranslations(initialLang);

	const themeSetting = localStorage.getItem('settings_theme') || 'auto';
	applyTheme(themeSetting);

	const menuToggle = document.getElementById('menuToggle');
	const drawerOverlay = document.getElementById('drawerOverlay');

	if (menuToggle) {
		menuToggle.addEventListener('click', () => openDrawer());
	}
	if (drawerOverlay) {
		drawerOverlay.addEventListener('click', () => closeDrawer());
	}

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			const drawer = document.getElementById('drawer');
			if (drawer && drawer.classList.contains('open')) closeDrawer();
		}
	});

	document.querySelectorAll('.drawer-nav-item').forEach(item => {
		item.addEventListener('click', () => {
			const view = item.getAttribute('data-view');
			if (view) navigateTo(view);
		});
	});

	const settingsLangList = document.getElementById('settingsLangList');
	if (settingsLangList) {
		settingsLangList.addEventListener('click', async (e) => {
			if (isFileProtocol) return;
			const btn = e.target.closest('.settings-item');
			if (!btn) return;
			const val = btn.getAttribute('data-value');
			if (!val) return;
			localStorage.setItem('settings_language', val);
			settingsLangList.querySelectorAll('.settings-item').forEach(b => {
				b.classList.remove('selected');
				b.querySelector('.settings-checkmark').textContent = '';
			});
			btn.classList.add('selected');
			btn.querySelector('.settings-checkmark').textContent = '\u2713';
			await loadTranslations(val === 'auto' ? getInitialLanguage() : val);
		});
	}

	const appearanceList = document.getElementById('settingsAppearanceList');
	if (appearanceList) {
		appearanceList.addEventListener('click', (e) => {
			const btn = e.target.closest('.settings-item');
			if (!btn) return;
			const val = btn.getAttribute('data-value');
			if (!val) return;
			localStorage.setItem('settings_theme', val);
			appearanceList.querySelectorAll('.settings-item').forEach(b => {
				b.classList.remove('selected');
				b.querySelector('.settings-checkmark').textContent = '';
			});
			btn.classList.add('selected');
			btn.querySelector('.settings-checkmark').textContent = '\u2713';
			applyTheme(val);
		});
	}
	const savedTheme = localStorage.getItem('settings_theme') || 'auto';
	const themeBtn = document.querySelector('#settingsAppearanceList .settings-item[data-value="' + savedTheme + '"]');
	if (themeBtn) {
		themeBtn.classList.add('selected');
		themeBtn.querySelector('.settings-checkmark').textContent = '\u2713';
	}

	const shareBtn = document.getElementById('shareBtn');
	if (shareBtn) {
		shareBtn.addEventListener('click', shareResults);
	}

	const printBtn = document.getElementById('print');
	if (printBtn) {
		printBtn.addEventListener('click', () => window.print());
	}

	const clearBtn = document.getElementById('clearHistoryBtn');
	if (clearBtn) {
		clearBtn.addEventListener('click', () => clearAllHistory());
	}

	setupAbout();
	navigateTo('calculator');
});

// PWA Install

function getInitialLanguage() {
	const settingsLang = localStorage.getItem('settings_language');
	if (settingsLang && settingsLang !== 'auto' && SUPPORTED_LANGUAGES.includes(settingsLang)) {
		return settingsLang;
	}
	const urlParams = new URLSearchParams(window.location.search);
	const urlLang = urlParams.get("lang");
	if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang)) return urlLang;
	const preferred = navigator.language?.substring(0, 2) || "en";
	if (preferred === "sk") return "cs";
	if (SUPPORTED_LANGUAGES.includes(preferred)) return preferred;
	return "en";
}

function isRunningAsPWA() {
	// 1. Detection for Chrome/Edge/Firefox/Android
	const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

	// 2. Detection for iOS (old version)
	const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
	const isIOSPWA = isIOS && ('standalone' in navigator) && navigator.standalone;

	return isStandalone || isIOSPWA;
}


// Detection of installation support (Chrome/Edge/Firefox + iOS 16.4+)
function isInstallSupported() {
	// Standard PWA installation (Chrome/Edge/Firefox)
	const isStandardPWA = 'onbeforeinstallprompt' in window;
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
		const closeBtn = document.getElementById('close-pwa-banner');
		if (!banner || !installBtn || !closeBtn) return;

		banner.style.display = 'flex';

		// Automatic hide after 12 seconds
		setTimeout(() => {
			banner.style.animation = 'fadeOut 0.3s forwards';
			setTimeout(() => banner.style.display = 'none', 300);
		}, 12000);

		// Actions of the "Install" button
		installBtn.addEventListener('click', async () => {
			if (window.deferredPrompt) {
				window.deferredPrompt.prompt();
				const { outcome } = await window.deferredPrompt.userChoice;
				window.deferredPrompt = null;
				if (outcome === 'accepted') banner.style.display = 'none';
			} else if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
				// For iOS 16.4+
				try {
					await navigator.share({ title: translations["title"] || 'Compound Interest Calculator', url: window.location.href });
				} catch (err) {
					// User cancelled installation
				}
			}
		});

		// Close button
		closeBtn.addEventListener('click', () => {
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

// ===== DRAWER =====
function openDrawer() {
	const drawer = document.getElementById('drawer');
	const overlay = document.getElementById('drawerOverlay');
	const menuToggle = document.getElementById('menuToggle');
	if (drawer) drawer.classList.add('open');
	if (overlay) overlay.classList.add('visible');
	document.body.style.overflow = 'hidden';
	if (menuToggle) {
		menuToggle.innerHTML = '\u2715';
	}
}

function closeDrawer() {
	const drawer = document.getElementById('drawer');
	const overlay = document.getElementById('drawerOverlay');
	const menuToggle = document.getElementById('menuToggle');
	if (drawer) drawer.classList.remove('open');
	if (overlay) overlay.classList.remove('visible');
	document.body.style.overflow = '';
	if (menuToggle) {
		menuToggle.innerHTML = '\u2630';
	}
}

function navigateTo(viewId) {
	document.querySelectorAll('.main-view').forEach(v => v.classList.remove('main-view-active'));
	const target = document.getElementById('view' + viewId.charAt(0).toUpperCase() + viewId.slice(1));
	if (target) target.classList.add('main-view-active');

	document.querySelectorAll('.drawer-nav-item').forEach(item => {
		item.classList.remove('drawer-nav-active');
		if (item.getAttribute('data-view') === viewId) {
			item.classList.add('drawer-nav-active');
		}
	});

	document.querySelectorAll('.view-title-group').forEach(g => g.classList.remove('active'));
	const group = document.querySelector('.view-title-group[data-view="' + viewId + '"]');
	if (group) group.classList.add('active');

	const shareBtn = document.getElementById('shareBtn');
	const printBtn = document.getElementById('print');
	const clearBtn = document.getElementById('clearHistoryBtn');
	if (shareBtn) shareBtn.style.display = viewId === 'calculator' && totalData.length > 0 ? '' : 'none';
	if (printBtn) printBtn.style.display = viewId === 'calculator' ? '' : 'none';
	if (clearBtn) clearBtn.style.display = viewId === 'history' ? '' : 'none';

	const overlay = document.getElementById('drawerOverlay');
	if (overlay && overlay.classList.contains('visible')) {
		closeDrawer();
	}
}

function populateLanguageList() {
	const container = document.getElementById('settingsLangList');
	if (!container) return;

	const currentLang = localStorage.getItem('settings_language') || 'auto';

	if (isFileProtocol) {
		container.innerHTML = '';
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'settings-item selected disabled';
		btn.setAttribute('data-value', 'en');
		btn.innerHTML = '<span>' + LANGUAGE_NAMES['en'] + '</span><span class="settings-checkmark">\u2713</span>';
		container.appendChild(btn);
		container.classList.add('disabled');
		return;
	}

	const items = [
		{ value: 'auto', label: translations["languageAuto"] || "Automatic" },
		...SUPPORTED_LANGUAGES.map(code => ({ value: code, label: LANGUAGE_NAMES[code] }))
	];

	container.innerHTML = '';
	items.forEach(item => {
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'settings-item';
		if (item.value === currentLang) btn.classList.add('selected');
		btn.setAttribute('data-value', item.value);
		btn.innerHTML = '<span>' + item.label + '</span><span class="settings-checkmark">' + (item.value === currentLang ? '\u2713' : '') + '</span>';
		container.appendChild(btn);
	});
}

// ===== THEME =====
function applyTheme(setting) {
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const theme = setting === 'auto' ? (prefersDark ? 'dark' : 'light') : setting;
	document.documentElement.setAttribute('data-theme', theme);
}

if (window.matchMedia) {
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
		const setting = localStorage.getItem('settings_theme') || 'auto';
		if (setting === 'auto') applyTheme('auto');
	});
}

// ===== HISTORY =====
function saveHistory() {
	const initial = document.getElementById('initialamount');
	const monthly = document.getElementById('monthlyDeposit');
	const period = document.getElementById('years');
	const rate = document.getElementById('rates');
	if (!initial || !monthly || !period || !rate) return;

	const entry = {
		id: Date.now(),
		initialAmount: initial.value,
		monthlyDeposit: monthly.value,
		years: period.value,
		rates: rate.value,
		date: new Date().toISOString()
	};

	let history = [];
	try {
		const raw = localStorage.getItem('compoundHistory');
		if (raw) history = JSON.parse(raw);
	} catch (e) {}

	const existingIdx = history.findIndex(e =>
		e.initialAmount === entry.initialAmount &&
		e.monthlyDeposit === entry.monthlyDeposit &&
		e.years === entry.years &&
		e.rates === entry.rates
	);
	if (existingIdx !== -1) history.splice(existingIdx, 1);

	history.unshift(entry);
	if (history.length > 20) history = history.slice(0, 20);

	try {
		localStorage.setItem('compoundHistory', JSON.stringify(history));
	} catch (e) {}

	renderHistory();
}

function renderHistory() {
	const list = document.getElementById('historyList');
	if (!list) return;

	let history = [];
	try {
		const raw = localStorage.getItem('compoundHistory');
		if (raw) history = JSON.parse(raw);
	} catch (e) {}

	if (history.length === 0) {
		list.innerHTML = '<p class="history-empty">' + (translations["noHistory"] || "No saved calculations yet") + '</p>';
		return;
	}

	list.innerHTML = '<div class="history-items-grouped"></div>';
	const group = list.firstElementChild;
	const currency = translations["currency"] || '$';
	const yearsLabel = translations["years"] || 'years';

	history.forEach(entry => {
		const row = document.createElement('div');
		row.className = 'history-row';
		row.setAttribute('data-id', entry.id);

		const date = new Date(entry.date);
		const dateStr = date.toLocaleDateString(lang, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

		const info = document.createElement('div');
		info.className = 'history-row-info';
		info.innerHTML =
			'<span class="history-row-field">' + Number(entry.initialAmount).toLocaleString(lang) + ' ' + currency + '</span>' +
			'<span class="history-row-field">' + Number(entry.monthlyDeposit).toLocaleString(lang) + ' ' + currency + '/mo</span>' +
			'<span class="history-row-field">' + entry.years + ' ' + yearsLabel + '</span>' +
			'<span class="history-row-field">' + entry.rates + '%</span>' +
			'<span class="history-row-date">' + dateStr + '</span>';

		const delBtn = document.createElement('button');
		delBtn.type = 'button';
		delBtn.className = 'history-row-delete';
		delBtn.textContent = '🗑️';
		delBtn.setAttribute('aria-label', translations["historyDelete"] || "Delete");
		delBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			deleteHistory(entry.id);
		});

		row.appendChild(info);
		row.appendChild(delBtn);
		row.addEventListener('click', () => restoreHistory(entry.id));
		group.appendChild(row);
	});
}

function restoreHistory(id) {
	let history = [];
	try {
		const raw = localStorage.getItem('compoundHistory');
		if (raw) history = JSON.parse(raw);
	} catch (e) {}

	const entry = history.find(e => e.id === id);
	if (!entry) return;

	document.getElementById('initialamount').value = entry.initialAmount;
	document.getElementById('monthlyDeposit').value = entry.monthlyDeposit;
	document.getElementById('years').value = entry.years;
	document.getElementById('rates').value = entry.rates;

	saveFormToStorage('compound-form', 'LastCompoundFormData');
	calculateGrowth(new Event('click'));
	navigateTo('calculator');
}

function deleteHistory(id) {
	let history = [];
	try {
		const raw = localStorage.getItem('compoundHistory');
		if (raw) history = JSON.parse(raw);
	} catch (e) {}

	history = history.filter(e => e.id !== id);
	try {
		localStorage.setItem('compoundHistory', JSON.stringify(history));
	} catch (e) {}

	renderHistory();
}

function clearAllHistory() {
	const confirmMsg = translations["historyClearConfirm"] || "Delete all history? This cannot be undone.";
	if (!confirm(confirmMsg)) return;
	localStorage.removeItem('compoundHistory');
	renderHistory();
}

// ===== ABOUT =====
function setupAbout() {
	const versionEl = document.getElementById('version');
	if (versionEl && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
		navigator.serviceWorker.controller.postMessage({ type: 'GET_VERSION' });
	}
}

// ===== SHARE =====
function copyToClipboard(text) {
	function showCheckmark() {
		const btn = document.getElementById('shareBtn');
		if (!btn) return;
		const orig = btn.textContent;
		btn.textContent = '\u2713';
		setTimeout(() => { btn.textContent = orig; }, 2000);
	}

	function fallbackPrompt() {
		const ta = document.createElement('textarea');
		ta.value = text;
		ta.style.position = 'fixed';
		ta.style.left = '-9999px';
		document.body.appendChild(ta);
		ta.select();
		try {
			if (document.execCommand('copy')) {
				document.body.removeChild(ta);
				showCheckmark();
				return;
			}
		} catch {}
		document.body.removeChild(ta);
		prompt('Press Cmd+C to copy:', text);
	}

	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard.writeText(text).then(showCheckmark).catch(() => fallbackPrompt());
	} else {
		fallbackPrompt();
	}
}

async function shareResults() {
	const initial = parseFloat(document.getElementById('initialamount')?.value) || 0;
	const monthly = parseFloat(document.getElementById('monthlyDeposit')?.value) || 0;
	const period = parseInt(document.getElementById('years')?.value) || 0;
	const rate = parseFloat(document.getElementById('rates')?.value) || 0;
	const growth = totalData.length > 0 ? totalData[totalData.length - 1] : null;

	if (!growth) return;

	const currency = translations["currency"] || '$';
	const growthFormatted = growth.toLocaleString(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	const text =
		translations["title"] + '\n\n' +
		(translations["initialDeposit"] || 'Initial Deposit') + ': ' + currency + ' ' + Number(initial).toLocaleString(lang) + '\n' +
		(translations["monthlyDeposit"] || 'Monthly Deposit') + ': ' + currency + ' ' + Number(monthly).toLocaleString(lang) + '/mo\n' +
		(translations["investmentPeriod"] || 'Investment Period') + ': ' + Number(period).toLocaleString(lang) + ' ' + (translations["years"] || 'years') + '\n' +
		(translations["annualInterestRate"] || 'Annual Interest Rate') + ': ' + rate + '%\n\n' +
		(translations["message"] || 'After {period} years you will have {amount}')
			.replace('{period}', Number(period).toLocaleString(lang))
			.replace('{amount}', growthFormatted);

	if (navigator.share && window.isSecureContext) {
		try {
			await navigator.share({ title: translations["title"] || 'Compound Interest Calculator', text: text, url: window.location.href });
		} catch (err) {
			if (err.name !== 'AbortError') copyToClipboard(text);
		}
		return;
	}

	copyToClipboard(text);
}

let swRegistration = null;

function registerServiceWorker() {
	if (!('serviceWorker' in navigator)) return;
	navigator.serviceWorker.register('service-worker.js').then(registration => {
		swRegistration = registration;

		if (registration.waiting) {
			const btn = document.getElementById('forceUpdateButton');
			if (btn) btn.style.display = '';
		}

		registration.addEventListener('updatefound', () => {
			const newSW = registration.installing;
			if (!newSW) return;
			newSW.addEventListener('statechange', () => {
				if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
					const btn = document.getElementById('forceUpdateButton');
					if (btn) btn.style.display = '';
				}
			});
		});
	}).catch(error => {
		console.log('ServiceWorker registration failed:', error);
	});
}

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.addEventListener('message', event => {
		if (event.data.type === 'SW_VERSION') {
			const versionEl = document.getElementById('version');
			if (versionEl) versionEl.textContent = event.data.version;
		}
	});
}

window.addEventListener('load', registerServiceWorker);

document.getElementById('forceUpdateButton')?.addEventListener('click', () => {
	if (swRegistration && swRegistration.waiting) {
		swRegistration.waiting.postMessage({ action: 'SKIP_WAITING' });
		window.location.reload();
	}
});

