// Get canvas context
const canvasEl = document.getElementById("data-set");
const context = canvasEl ? canvasEl.getContext("2d") : null;

let lang = "en";
const locales = {
	en: {
		"title": "Compound Interest Calculator",
		"shortTitle": "Compound Interest",
		"description": "Your money growth over time using compound interest...",
		"initialDeposit": "Initial Deposit",
		"monthlyDeposit": "Monthly Deposit",
		"investmentPeriod": "Investment Period",
		"annualInterestRate": "Annual Interest Rate",
		"calculate": "Calculate",
		"years": "years",
		"currency": "$",
		"pwaInstall": "Install this app for a better experience!",
		"install": "Install",
		"message": "After {period} years you will have {amount}",
		"year": "Year",
		"balance": "Balance",
		"deposits": "Deposits",
		"updateApplication": "Update Application",
		"version": "Version:",
		"validationError": "Please enter a valid positive number.",
		"feature1": "Calculate compound interest based on initial deposit, monthly contributions, interest rate, and time period.",
		"feature2": "Visualize growth with interactive charts.",
		"feature3": "Print results with a QR code for easy sharing.",
		"feature4": "Support for multiple languages.",
		"feature5": "Progressive Web App (PWA) for offline use and easy installation.",
		"aboutTitle": "About the Application",
		"aboutDescription": "The Compound Interest Calculator is a user-friendly tool designed to help individuals and investors understand how their savings or investments can grow over time with compound interest. Whether you're planning for retirement, saving for a big purchase, or learning about financial growth, this app provides clear calculations and visualizations.",
		"featuresTitle": "Key Features",
		"developmentTitle": "Development",
		"developmentDescription": "You can find the source code and contribute on our GitHub repository:",
		"versionTitle": "Version Information",
		"backToCalculator": "Back to Calculator",
		"chartLabel": "Compound interest growth chart showing balance and total deposits over time.",
		"close": "Close",
		"calculator": "Calculator",
		"print": "Print"
	},
	cs: {
		"title": "Kalkulačka složeného úročení",
		"shortTitle": "Složené úročení",
		"description": "Růst vašich peněz v čase pomocí složeného úročení...",
		"initialDeposit": "Počáteční vklad",
		"monthlyDeposit": "Měsíční vklad",
		"investmentPeriod": "Investiční období",
		"annualInterestRate": "Roční úroková sazba",
		"calculate": "Spočítat",
		"years": "let",
		"currency": "Kč",
		"pwaInstall": "Nainstalujte si tuto aplikaci pro lepší zážitek!",
		"install": "Instalovat",
		"message": "Za {period} let budete mít {amount} Kč",
		"year": "Rok",
		"balance": "Zůstatek",
		"deposits": "Vklady",
		"updateApplication": "Zaktualizovat aplikaci",
		"version": "Verze:",
		"validationError": "Zadejte platné kladné číslo.",
		"feature1": "Spočítejte složené úročení na základě počátečního vkladu, měsíčních příspěvků, úrokové sazby a časového období.",
		"feature2": "Vizualizujte růst pomocí interaktivních grafů.",
		"feature3": "Vytiskněte výsledky s QR kódem pro snadné sdílení.",
		"feature4": "Podpora pro více jazyků.",
		"feature5": "Progresivní webová aplikace (PWA) pro offline použití a snadnou instalaci.",
		"aboutTitle": "O aplikaci",
		"aboutDescription": "Kalkulačka složeného úročení je uživatelsky přívětivý nástroj navržený tak, aby pomohl jednotlivcům a investorům pochopit, jak mohou jejich úspory nebo investice v průběhu času růst díky složenému úročení. Ať už plánujete důchod, spoříte na velký nákup nebo se učíte o finančním růstu, tato aplikace poskytuje jasné výpočty a vizualizace.",
		"featuresTitle": "Klíčové funkce",
		"developmentTitle": "Vývoj",
		"developmentDescription": "Zdrojový kód můžete najít a přispívat na našem GitHub repozitáři:",
		"versionTitle": "Informace o verzi",
		"backToCalculator": "Zpět na kalkulačku",
		"chartLabel": "Graf růstu složeného úročení zobrazující zůstatek a celkové vklady v čase.",
		"close": "Zavřít",
		"calculator": "Kalkulačka",
		"print": "Tisk"
	},
	es: {
		"title": "Calculadora de interés compuesto",
		"shortTitle": "Interés compuesto",
		"description": "Tu dinero crece con el tiempo gracias al interés compuesto...",
		"initialDeposit": "Depósito inicial",
		"monthlyDeposit": "Depósito mensual",
		"investmentPeriod": "Período de inversión",
		"annualInterestRate": "Tipo de interés anual",
		"calculate": "Calcular",
		"years": "años",
		"currency": "€",
		"pwaInstall": "¡Instala esta aplicación para una mejor experiencia!",
		"install": "Instalar",
		"message": "Después de {period} años tendrás {amount} €",
		"year": "Año",
		"balance": "Saldo",
		"deposits": "Depósitos",
		"updateApplication": "Actualizar aplicación",
		"version": "Versión:",
		"validationError": "Por favor, introduzca un número positivo válido.",
		"feature1": "Calcule el interés compuesto según el depósito inicial, los aportes mensuales, la tasa de interés y el período de tiempo.",
		"feature2": "Visualice el crecimiento con gráficos interactivos.",
		"feature3": "Imprima los resultados con un código QR para compartir fácilmente.",
		"feature4": "Compatibilidad con varios idiomas.",
		"feature5": "Aplicación web progresiva (PWA) para uso sin conexión e instalación sencilla.",
		"aboutTitle": "Acerca de la aplicación",
		"aboutDescription": "La Calculadora de Interés Compuesto es una herramienta fácil de usar diseñada para ayudar a individuos e inversores a comprender cómo sus ahorros o inversiones pueden crecer con el tiempo gracias al interés compuesto. Ya sea que esté planeando su jubilación, ahorrando para una gran compra o aprendiendo sobre el crecimiento financiero, esta aplicación proporciona cálculos claros y visualizaciones.",
		"featuresTitle": "Características principales",
		"developmentTitle": "Desarrollo",
		"developmentDescription": "Puede encontrar el código fuente y contribuir en nuestro repositorio de GitHub:",
		"versionTitle": "Información de versión",
		"backToCalculator": "Volver a la calculadora",
		"chartLabel": "Gráfico de crecimiento del interés compuesto que muestra el saldo y los depósitos totales a lo largo del tiempo.",
		"close": "Cerrar",
		"calculator": "Calculadora",
		"print": "Imprimir"
	},
	fr: {
		"title": "Calculateur d'intérêts composés",
		"shortTitle": "Intérêts composés",
		"description": "Votre argent fructifie au fil du temps grâce aux intérêts composés...",
		"initialDeposit": "Dépôt initial",
		"monthlyDeposit": "Dépôt mensuel",
		"investmentPeriod": "Période d'investissement",
		"annualInterestRate": "Taux d'intérêt annuel",
		"calculate": "Calculer",
		"years": "ans",
		"currency": "€",
		"pwaInstall": "Installez cette application pour une meilleure expérience!",
		"install": "Installer",
		"message": "Au bout de {period} ans, vous disposerez de {amount} €",
		"year": "Année",
		"balance": "Solde",
		"deposits": "Dépôts",
		"updateApplication": "Mettre à jour l'application",
		"version": "Version:",
		"validationError": "Veuillez saisir un nombre positif valide.",
		"feature1": "Calculez les intérêts composés en fonction du dépôt initial, des cotisations mensuelles, du taux d'intérêt et de la période.",
		"feature2": "Visualisez la croissance avec des graphiques interactifs.",
		"feature3": "Imprimez les résultats avec un code QR pour un partage facile.",
		"feature4": "Prise en charge de plusieurs langues.",
		"feature5": "Application web progressive (PWA) pour une utilisation hors ligne et une installation facile.",
		"aboutTitle": "À propos de l'application",
		"aboutDescription": "Le Calculateur d'Intérêts Composés est un outil convivial conçu pour aider les particuliers et les investisseurs à comprendre comment leurs économies ou investissements peuvent croître au fil du temps grâce aux intérêts composés. Que vous planifiiez votre retraite, épargniez pour un gros achat ou appreniez la croissance financière, cette application fournit des calculs clairs et des visualisations.",
		"featuresTitle": "Fonctionnalités clés",
		"developmentTitle": "Développement",
		"developmentDescription": "Vous pouvez trouver le code source et contribuer sur notre dépôt GitHub :",
		"versionTitle": "Informations sur la version",
		"backToCalculator": "Retour à la calculatrice",
		"chartLabel": "Graphique de croissance des intérêts composés montrant le solde et les dépôts totaux au fil du temps.",
		"close": "Fermer",
		"calculator": "Calculateur",
		"print": "Imprimer"
	},
	de: {
		"title": "Zinseszins-Rechner",
		"shortTitle": "Zinseszins-Rechner",
		"description": "Ihr Geld wächst im Laufe der Zeit mit Zinseszins...",
		"initialDeposit": "Erste Einzahlung",
		"monthlyDeposit": "Monatliche Einzahlung",
		"investmentPeriod": "Investitionszeitraum",
		"annualInterestRate": "Jährlicher Zinssatz",
		"calculate": "Berechnen Sie",
		"years": "Jahre",
		"currency": "€",
		"pwaInstall": "Installieren Sie diese App für ein besseres Erlebnis!",
		"install": "Installieren",
		"message": "Nach {period} Jahren werden Sie {amount} € haben",
		"year": "Jahr",
		"balance": "Saldo",
		"deposits": "Einlagen",
		"updateApplication": "Aktualisierung der Anwendung",
		"version": "Version:",
		"validationError": "Bitte geben Sie eine gültige positive Zahl ein.",
		"feature1": "Berechnen Sie Zinseszinsen basierend auf Ersteinzahlung, monatlichen Beiträgen, Zinssatz und Laufzeit.",
		"feature2": "Visualisieren Sie das Wachstum mit interaktiven Diagrammen.",
		"feature3": "Drucken Sie die Ergebnisse mit einem QR-Code zum einfachen Teilen.",
		"feature4": "Unterstützung für mehrere Sprachen.",
		"feature5": "Progressive Web App (PWA) für Offline-Nutzung und einfache Installation.",
		"aboutTitle": "Über die Anwendung",
		"aboutDescription": "Der Zinseszins-Rechner ist ein benutzerfreundliches Tool, das Einzelpersonen und Investoren dabei hilft zu verstehen, wie ihre Ersparnisse oder Investitionen im Laufe der Zeit durch Zinseszins wachsen können. Egal, ob Sie für den Ruhestand planen, für einen großen Einkauf sparen oder etwas über finanzielles Wachstum lernen möchten, diese App bietet klare Berechnungen und Visualisierungen.",
		"featuresTitle": "Hauptfunktionen",
		"developmentTitle": "Entwicklung",
		"developmentDescription": "Sie finden den Quellcode und können auf unserem GitHub-Repository mitwirken:",
		"versionTitle": "Versionsinformationen",
		"backToCalculator": "Zurück zum Rechner",
		"chartLabel": "Zinseszins-Wachstumsdiagramm mit Saldo und Gesamteinlagen im Zeitverlauf.",
		"close": "Schließen",
		"calculator": "Rechner",
		"print": "Drucken"
	},
	it: {
		"title": "Calcolatore dell'interesse composto",
		"shortTitle": "Interesse composto",
		"description": "Il vostro denaro cresce nel tempo grazie all'interesse composto...",
		"initialDeposit": "Deposito iniziale",
		"monthlyDeposit": "Deposito mensile",
		"investmentPeriod": "Periodo di investimento",
		"annualInterestRate": "Tasso di interesse annuo",
		"calculate": "Calcolare",
		"years": "anni",
		"currency": "€",
		"pwaInstall": "Installa questa app per un'esperienza migliore!",
		"install": "Installa",
		"message": "Dopo {period} anni avrete {amount} €",
		"year": "Anno",
		"balance": "Saldo",
		"deposits": "Depositi",
		"updateApplication": "Aggiorna applicazione",
		"version": "Versione:",
		"validationError": "Inserisci un numero positivo valido.",
		"feature1": "Calcola l'interesse composto in base al deposito iniziale, ai contributi mensili, al tasso di interesse e al periodo di tempo.",
		"feature2": "Visualizza la crescita con grafici interattivi.",
		"feature3": "Stampa i risultati con un codice QR per una facile condivisione.",
		"feature4": "Supporto per più lingue.",
		"feature5": "App web progressiva (PWA) per l'uso offline e l'installazione semplice.",
		"aboutTitle": "Informazioni sull'applicazione",
		"aboutDescription": "Il Calcolatore di Interessi Composti è uno strumento facile da usare progettato per aiutare privati e investitori a capire come i loro risparmi o investimenti possono crescere nel tempo con l'interesse composto. Che tu stia pianificando la pensione, risparmiando per un grande acquisto o imparando la crescita finanziaria, questa app fornisce calcoli chiari e visualizzazioni.",
		"featuresTitle": "Caratteristiche principali",
		"developmentTitle": "Sviluppo",
		"developmentDescription": "Puoi trovare il codice sorgente e contribuire sul nostro repository GitHub:",
		"versionTitle": "Informazioni sulla versione",
		"backToCalculator": "Torna alla calcolatrice",
		"chartLabel": "Grafico della crescita dell'interesse composto che mostra il saldo e i depositi totali nel tempo.",
		"close": "Chiudi",
		"calculator": "Calcolatrice",
		"print": "Stampa"
	},
	pt: {
		"title": "Calculadora de juros compostos",
		"shortTitle": "Juros compostos",
		"description": "O seu dinheiro cresce ao longo do tempo através de juros compostos...",
		"initialDeposit": "Depósito inicial",
		"monthlyDeposit": "Depósito mensal",
		"investmentPeriod": "Período de investimento",
		"annualInterestRate": "Taxa de juro anual",
		"calculate": "Calcular",
		"years": "anos",
		"currency": "€",
		"pwaInstall": "Instale este aplicativo para uma melhor experiência!",
		"install": "Instalar",
		"message": "Após {period} anos, terá {amount} €",
		"year": "Ano",
		"balance": "Saldo",
		"deposits": "Depósitos",
		"updateApplication": "Atualizar aplicação",
		"version": "Versão:",
		"validationError": "Por favor, insira um número positivo válido.",
		"feature1": "Calcule os juros compostos com base no depósito inicial, contribuições mensais, taxa de juros e período de tempo.",
		"feature2": "Visualize o crescimento com gráficos interativos.",
		"feature3": "Imprima os resultados com um código QR para fácil compartilhamento.",
		"feature4": "Suporte para vários idiomas.",
		"feature5": "Aplicativo web progressivo (PWA) para uso offline e instalação fácil.",
		"aboutTitle": "Sobre a aplicação",
		"aboutDescription": "A Calculadora de Juros Compostos é uma ferramenta fácil de usar projetada para ajudar indivíduos e investidores a entender como suas economias ou investimentos podem crescer ao longo do tempo com juros compostos. Quer esteja a planear a reforma, a poupar para uma grande compra ou a aprender sobre crescimento financeiro, esta aplicação fornece cálculos claros e visualizações.",
		"featuresTitle": "Principais recursos",
		"developmentTitle": "Desenvolvimento",
		"developmentDescription": "Pode encontrar o código-fonte e contribuir no nosso repositório GitHub:",
		"versionTitle": "Informações da versão",
		"backToCalculator": "Voltar à calculadora",
		"chartLabel": "Gráfico de crescimento de juros compostos mostrando saldo e depósitos totais ao longo do tempo.",
		"close": "Fechar",
		"calculator": "Calculadora",
		"print": "Imprimir"
	},
	pl: {
		"title": "Kalkulator odsetek składanych",
		"shortTitle": "Odsetki składane",
		"description": "Twoje pieniądze rosną w czasie dzięki procentowi składanemu...",
		"initialDeposit": "Depozyt początkowy",
		"monthlyDeposit": "Depozyt miesięczny",
		"investmentPeriod": "Okres inwestycji",
		"annualInterestRate": "Roczna stopa procentowa",
		"calculate": "Obliczyć",
		"years": "lata",
		"currency": "zł",
		"pwaInstall": "Zainstaluj tę aplikację, aby uzyskać lepsze wrażenia!",
		"install": "Zainstaluj",
		"message": "Po {period} lat będziesz mieć {amount} zł",
		"year": "Rok",
		"balance": "Saldo",
		"deposits": "Depozyty",
		"updateApplication": "Aktualizuj aplikację",
		"version": "Wersja:",
		"validationError": "Proszę wprowadzić prawidłową liczbę dodatnią.",
		"feature1": "Oblicz procent składany na podstawie depozytu początkowego, miesięcznych składek, stopy procentowej i okresu inwestycji.",
		"feature2": "Wizualizuj wzrost za pomocą interaktywnych wykresów.",
		"feature3": "Wydrukuj wyniki z kodem QR dla łatwego udostępniania.",
		"feature4": "Wsparcie dla wielu języków.",
		"feature5": "Progresywna aplikacja webowa (PWA) do użytku offline i łatwej instalacji.",
		"aboutTitle": "O aplikacji",
		"aboutDescription": "Kalkulator odsetek składanych to przyjazne dla użytkownika narzędzie zaprojektowane, aby pomóc osobom fizycznym i inwestorom zrozumieć, jak ich oszczędności lub inwestycje mogą rosnąć w czasie dzięki procentowi składanemu. Niezależnie od tego, czy planujesz emeryturę, oszczędzasz na duży zakup, czy uczysz się o wzroście finansowym, ta aplikacja zapewnia jasne obliczenia i wizualizacje.",
		"featuresTitle": "Kluczowe funkcje",
		"developmentTitle": "Rozwój",
		"developmentDescription": "Kod źródłowy można znaleźć i wnosić wkład w naszym repozytorium GitHub:",
		"versionTitle": "Informacje o wersji",
		"backToCalculator": "Powrót do kalkulatora",
		"chartLabel": "Wykres wzrostu odsetek składanych pokazujący saldo i całkowite depozyty w czasie.",
		"close": "Zamknij",
		"calculator": "Kalkulator",
		"print": "Drukuj"
	},
	uk: {
		"title": "Калькулятор складних відсотків",
		"shortTitle": "Складні відсотки",
		"description": "Зростання ваших грошей з часом за допомогою складних відсотків...",
		"initialDeposit": "Початковий депозит",
		"monthlyDeposit": "Щомісячний депозит",
		"investmentPeriod": "Період інвестування",
		"annualInterestRate": "Річна процентна ставка",
		"calculate": "Розрахувати",
		"years": "роки",
		"currency": "₴",
		"pwaInstall": "Встановіть цей додаток для кращого досвіду!",
		"install": "Встановити",
		"message": "Через {period} років ви матимете {amount} ₴",
		"year": "Рік",
		"balance": "Баланс",
		"deposits": "Депозити",
		"updateApplication": "Оновити додаток",
		"version": "Версія:",
		"validationError": "Будь ласка, введіть дійсне додатне число.",
		"feature1": "Розрахуйте складні відсотки на основі початкового депозиту, щомісячних внесків, відсоткової ставки та періоду часу.",
		"feature2": "Візуалізуйте зростання за допомогою інтерактивних графіків.",
		"feature3": "Роздрукуйте результати з QR-кодом для легкого обміну.",
		"feature4": "Підтримка кількох мов.",
		"feature5": "Прогресивний веб-додаток (PWA) для офлайн-використання та простої установки.",
		"aboutTitle": "Про додаток",
		"aboutDescription": "Калькулятор складних відсотків — це зручний інструмент, призначений для допомоги окремим особам та інвесторам зрозуміти, як їхні заощадження або інвестиції можуть зростати з часом завдяки складним відсоткам. Незалежно від того, чи плануєте ви вихід на пенсію, заощаджуєте на велику покупку або вивчаєте фінансове зростання, цей додаток надає чіткі розрахунки та візуалізації.",
		"featuresTitle": "Основні функції",
		"developmentTitle": "Розробка",
		"developmentDescription": "Ви можете знайти вихідний код та зробити внесок у нашому репозиторії GitHub:",
		"versionTitle": "Інформація про версію",
		"backToCalculator": "Повернутися до калькулятора",
		"chartLabel": "Графік зростання складних відсотків, що показує баланс та загальні депозити з часом.",
		"close": "Закрити",
		"calculator": "Калькулятор",
		"print": "Друк"
	}
};
let translations = { ...locales.en };
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
	return {
		type: 'line',
		data: {
			labels: labels,
			datasets: [
				{
					label: translations["balance"] || 'Balance',
					data: totalData,
					fill: true,
					backgroundColor: 'rgba(12, 141, 0, 0.7)',
					borderWidth: 3,
					order: 1
				},
				{
					label: translations["deposits"] || 'Deposits',
					data: depositData,
					fill: true,
					backgroundColor: 'rgba(0, 123, 255, 0.7)',
					borderWidth: 3,
					order: 0
				}
			]
		},
		options: {
			maintainAspectRatio: true,
			aspectRatio: getAspectRatio(), // Dynamic aspect ratio
			scales: {
				y: {
					beginAtZero: true,
					ticks: {
						font: {
							size: 12 // Fixed font size for y-axis labels
						}
					}
				},
				x: {
					ticks: {
						font: {
							size: 12 // Fixed font size for x-axis labels
						},
						maxTicksLimit: 6 // Limit number of x-axis labels
					}
				}
			},
			plugins: {
				legend: {
					labels: {
						font: {
							size: 14 // Fixed font size for legend
						}
					}
				}
			},
			responsive: true,
			devicePixelRatio: window.devicePixelRatio || 1 // Ensure sharp rendering
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

function loadTranslations(languageCode) {
	const data = locales[languageCode];
	if (data) {
		translations = { ...locales.en, ...data };
		switchLanguage(languageCode);
	} else {
		console.error("Unknown language:", languageCode);
		translations = { ...locales.en };
		const langSelect = document.getElementById("langSelect");
		if (langSelect) langSelect.value = "en";
		switchLanguage("en");
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

	const canvas = document.getElementById('data-set');
	if (canvas && translations["chartLabel"]) {
		canvas.setAttribute('aria-label', translations["chartLabel"]);
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
}

document.addEventListener("DOMContentLoaded", () => {
	// Load values from localStorage (only once)
	loadFormFromStorage('compound-form', 'LastCompoundFormData');
	// Set up automatic saving
	setupAutoSave('compound-form', 'LastCompoundFormData');

	const langSelect = document.getElementById("langSelect");
	langSelect.value = getInitialLanguage();
	loadTranslations(langSelect.value);
	langSelect.addEventListener("change", (e) => loadTranslations(e.target.value));

	// Print button
	const printBtn = document.getElementById('print');
	if (printBtn) {
		printBtn.addEventListener('click', () => window.print());
	}
});

// PWA Install

function getInitialLanguage() {
	const urlParams = new URLSearchParams(window.location.search);
	const urlLang = urlParams.get("lang");
	const select = document.getElementById('langSelect');
	const supported = select ? Array.from(select.options).map(o => o.value) : [];
	if (urlLang && supported.includes(urlLang)) return urlLang;
	const preferred = navigator.language?.substring(0, 2) || "en";
	if (preferred === "sk") return "cs";
	if (supported.includes(preferred)) return preferred;
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

		// Automatic hide after 5 seconds
		setTimeout(() => {
			banner.style.animation = 'fadeOut 0.3s forwards';
			setTimeout(() => banner.style.display = 'none', 300);
		}, 5000);

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

