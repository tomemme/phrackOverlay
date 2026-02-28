# TODO

## Cleanup and Reliability

- Remove the merge artifact and duplicated license section from `README.md`.
- Replace repeated inline event listener setup in `overlay.js` with a data-driven approach.
- Extract hardcoded category link data from rendering logic into a dedicated data structure.
- Reduce console noise and remove leftover debug logging.
- Centralize constants such as issue ranges and category names.

## Search Improvements

- Cache fetched issue text, not only issue index counts.
- Add cache invalidation and a way to clear cached search data.
- Render search results incrementally while long searches are still running.
- Add explicit cancel/reset behavior for in-flight searches.
- Add filters for issue range and category to reduce unnecessary fetches.
- Show richer results with titles or text snippets instead of only issue/file numbers.

## Overlay UX

- Move inline styles into a dedicated style block for maintainability.
- Remember expanded and collapsed section state with `GM_setValue`.
- Highlight the current issue or current article in the navigation.
- Add keyboard support for search and section toggles.
- Improve loading and progress states so they are readable without the external spinner image.
- Improve mobile and narrow-screen behavior.

## Data Sourcing

- Stop relying on hardcoded issue limits like `1..71`.
- Discover available issues dynamically from the archive or site index.
- Evaluate whether category sections can also be generated dynamically from source content.
- Add graceful handling when an expected issue or article is missing.

## Development Tooling

- Add a minimal `package.json` for linting and formatting.
- Add ESLint configuration appropriate for a Tampermonkey userscript.
- Add a lightweight test harness for pure helpers such as link generation and search result formatting.
- Document a local development workflow in `README.md`.

## Delivery

- Refactor the script in small reviewable commits.
- Prepare a PR description summarizing cleanup, search, UX, and tooling changes.
- Open the PR once GitHub auth and network access are available again.
