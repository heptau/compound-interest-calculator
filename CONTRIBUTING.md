# Contributing to Compound Interest Calculator

Thank you for your interest in contributing! This project is a Progressive Web App (PWA) for calculating compound interest, built with vanilla HTML, CSS, and JavaScript.

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/heptau/compound-interest-calculator.git
   ```

2. Serve the project locally using any HTTP server (required for service worker and fetch to work):
   ```bash
   # Using Python
   python3 -m http.server 8080

   # Using Node.js
   npx serve .
   ```

3. Open `http://localhost:8080` in your browser.

No build tools or package managers are required.

## Pull Request Process

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and test them locally.
4. Commit your changes:
   ```bash
   git commit -m "Description of your changes"
   ```
5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a Pull Request against the `main` branch.

## Code Style Guidelines

- Use tabs for indentation (matching `.editorconfig`).
- Use single quotes for strings in JavaScript.
- Use camelCase for JavaScript variables and functions.
- Keep the code self-documenting — avoid unnecessary comments.
- Maintain the existing structure: HTML structure in `.html`, styles in `main.css`, logic in `app.js`.

## Adding or Modifying Translations

All translations are in the `locales/` directory as JSON files:

1. Edit an existing locale file (e.g., `locales/fr.json`).
2. Add a new language by creating `locales/{code}.json` using `locales/en.json` as a template.
3. Each key in the JSON corresponds to a `data-i18n` attribute in the HTML.
4. The `{period}` and `{amount}` placeholders in the `message` key are replaced dynamically — preserve them.

After adding a new language:
- Add the language code to the `supported` array in `getInitialLanguage()` in `app.js`.
- Add a `<option>` to the language selector in both `index.html` and `about.html`.
- Add locale entries to `manifest.json` if desired.

## Reporting Issues

Open an issue on GitHub with:
- A clear description of the problem.
- Steps to reproduce it.
- Browser and device information.

## Translation Status

| Language   | Code | Status |
|------------|------|--------|
| English    | en   | ✅     |
| Czech      | cs   | ✅     |
| German     | de   | ✅     |
| Spanish    | es   | ✅     |
| French     | fr   | ✅     |
| Italian    | it   | ✅     |
| Polish     | pl   | ✅     |
| Portuguese | pt   | ✅     |
| Ukrainian  | uk   | ✅     |
