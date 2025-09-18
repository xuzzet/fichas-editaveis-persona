# Copilot Instructions for AI Coding Agents

## Project Overview
This is a browser-based character sheet app for Persona tabletop RPGs. The app is single-page, built with vanilla JavaScript (`app.js`), HTML (`index.html`), and CSS (`styles.css`). It does not use frameworks or a build system.

## Architecture & Data Flow
- **Tabs and Views:** UI is organized into tabs (Geral, Persona, Equipamentos, Magias, Vínculos, Anotações). Each tab toggles a corresponding `.view` div.
- **Character Data:** Main character and persona fields are mapped to HTML inputs/selects. Data is managed in-memory via DOM manipulation.
- **Arcana & Affinities:** Arcana and elemental affinities are dynamically populated in select elements. See `app.js` for arrays and table-building logic.
- **PDF/Canvas Export:** Uses `pdf-lib` and `html2canvas` (loaded via CDN in `index.html`) for exporting sheets. Integration is via direct DOM calls, not modules.

## Developer Workflows
- **No Build Step:** All code runs directly in the browser. No npm, bundler, or test runner is present.
- **Debugging:** Use browser DevTools for JS debugging and CSS inspection. No source maps or transpilation.
- **Live Editing:** Changes to `app.js`, `index.html`, or `styles.css` are reflected on page reload.

## Project-Specific Patterns
- **DOM Query Shortcuts:** `$` and `$$` are used for `querySelector` and `querySelectorAll`.
- **ID Naming:** Input/select IDs match character sheet fields (e.g., `CharName`, `PerArcana`).
- **Dynamic Selects:** Arcana and affinity selects are built at runtime; do not hardcode options in HTML.
- **Localization:** UI and code are in Brazilian Portuguese. Maintain language consistency in new UI elements.

## External Dependencies
- **pdf-lib** and **html2canvas** are loaded via CDN. Do not add new dependencies unless absolutely necessary.

## Example Patterns
- To add a new tab, update both the `<nav class="tabs">` and add a corresponding `.view` div in `index.html`. Handle tab logic in `app.js`.
- To add a new character field, add the input/select in `index.html` and update the `ids` object in `app.js`.

## Key Files
- `index.html`: Main HTML structure, tabs, and views.
- `app.js`: All app logic, DOM manipulation, and event handling.
- `styles.css`: Visual theme and layout.

---
If any section is unclear or missing, please specify what needs improvement or additional detail.