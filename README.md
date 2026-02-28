# PhrackOverlay

A Tampermonkey userscript that adds a navigation overlay to the Phrack website. The overlay groups issues and recurring sections into collapsible lists and includes a full-archive text search to make the site easier to browse.

## Features

- Fixed overlay navigation on `phrack.org/issues/*`
- Grouped issue index in batches of 10
- Collapsible sections for Prophile, Loopback, Linenoise, and Phrack World News
- Cross-issue text search across the archive
- Progress feedback while search is running

![GUI](https://github.com/tomemme/phrackOverlay/blob/main/guiDemo.gif)

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/).
2. Create a new userscript.
3. Paste in the contents of [`overlay.js`](./overlay.js).
4. Save the script and visit `https://phrack.org/issues/*`.

## Usage

- Use the section toggle buttons to expand or collapse grouped navigation.
- Browse issues in grouped ranges instead of a single long list.
- Search for a keyword to scan archived `.txt` issues and open matching results.

## Development

The project is currently a single JavaScript userscript. Near-term work is tracked in [`TODO.md`](./TODO.md), including cleanup, search improvements, UX updates, and better development tooling.

## Contributing

1. Fork the repository.
2. Create a branch for your changes.
3. Submit a pull request with a clear description of the update.

## License

This project is licensed under the MIT License.
