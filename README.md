# PhrackOverlay

A Tampermonkey script to enhance navigation on the Phrack website by adding an overlay with grouped categories and toggleable sections. The overlay improves usability by organizing issues, prophile articles, loopback, linenoise, and Phrack World News into expandable sections, making it easier to navigate the site.

## Features

- **Overlay Navigation**: Adds a fixed overlay with grouped categories on the Phrack website.
- **Toggleable Sections**: Toggle buttons for each section (Issues, Prophile, Loopback, Linenoise, and Phrack World News) allow you to expand or collapse the list of links.
- **Grouped by Issues**: Issues are grouped in sets of 10 to make the list more manageable.
- **Search all issues for text string**: Search bar searches all the issues for a match.
- **Customizable Styling**: Easy-to-identify green toggle button for Issues.

![GUI](https://github.com/tomemme/phrackOverlay/blob/main/guiDemo.gif)

## Installation

To use the script, follow these steps:

1. Install the [Tampermonkey](https://www.tampermonkey.net/) extension for your browser.
2. Create a new userscript in Tampermonkey and copy the contents of the `phrackOverlay.js` file into the script editor.
3. Save the script, and it will automatically run when visiting any page under `http://www.phrack.org/issues/*`.

## Usage

Once installed, the overlay will appear on the Phrack website, offering the following functionality:

- **Toggle the Issues List**: Click the green "Toggle" button next to "Issues Index" to expand or collapse the list of issues.
- **Toggle Category Lists**: Expand or collapse other sections like "Prophile," "Loopback," "Linenoise," and "Phrack World News" using their respective toggle buttons.
- **Grouped Lists**: The issues are grouped into sets of 10 for easier navigation. Expand any group to see the issues within that range.

## Development

The script is written in JavaScript and utilizes the following features:
- **Fixed Overlay**: The navigation box is fixed on the page for easy access.
- **Scroll Support**: When the content exceeds the size of the overlay, a scrollbar is automatically added to keep the interface manageable.
- **Dynamic Content Loading**: Links are dynamically generated based on the issue range and specific categories.

## Contributing

If you'd like to contribute to this project:
1. Fork the repository.
2. Make your changes in a separate branch.
3. Submit a pull request with a clear description of the changes made.

Feel free to suggest improvements or report bugs through the Issues section.

## License

This project is licensed under the MIT License.
