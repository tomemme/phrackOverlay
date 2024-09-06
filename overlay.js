// ==UserScript==
// @name         Phrack Overlay with Grouped Categories and Issues
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Groups issues and categories by sets of 10 with toggle buttons to expand/collapse them
// @author       You
// @match        http://www.phrack.org/issues/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    // Log to the console so we can track progress
    console.log('Phrack Overlay Script Running with Grouped Categories and Issues');

    // Create the overlay div
    let overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '10px';
    overlay.style.left = '10px';
    overlay.style.width = '250px';
    overlay.style.height = 'auto';
    overlay.style.maxHeight = '80vh'// Set max height to 80% of the viewport height
    overlay.style.overflowY = 'auto';  // Enable vertical scrolling
    overlay.style.backgroundColor = '#333';
    overlay.style.color = '#fff';
    overlay.style.padding = '10px';
    overlay.style.zIndex = '1000';

    // Generate HTML for the overlay with grouped issue and category lists
    overlay.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h2 style="text-align: center;">Phrack Navigator</h2>
            <input type="text" id="globalSearchInput" placeholder="Search issues..." style="width: calc(100% - 10px); padding: 5px; box-sizing: border-box; margin-top: 10px;">
            <button id="searchButton" style="width: 50%; padding: 5px; margin-top: 5px;">Search</button>
        </div>

        <div style="margin-bottom: 15px;">
            <h3 style="display: inline;">Issues Index</h3>
            <button id="toggleIssues" style="float: right; background-color: green; color: white;">Toggle</button>
        </div>
        <div id="issueList" style="display:none; margin-bottom: 15px;">
            ${generateGroupedIssueLinks(1, 71, 10)}
        </div>

        <div style="margin-bottom: 15px;">
            <h3 style="display: inline;">Prophile</h3>
            <button id="toggleProphile" style="float: right; background-color: green; color: white;">Toggle</button>
        </div>
        <div id="prophileList" style="display:none; margin-bottom: 15px;">
            ${generateGroupedCategoryLinks('Prophile', 80, 10)}
        </div>

        <div style="margin-bottom: 15px;">
            <h3 style="display: inline;">Loopback</h3>
            <button id="toggleLoopback" style="float: right; background-color: green; color: white;">Toggle</button>
        </div>
        <div id="loopbackList" style="display:none; margin-bottom: 15px;">
            ${generateGroupedCategoryLinks('Loopback', 80, 10)}
        </div>

        <div style="margin-bottom: 15px;">
            <h3 style="display: inline;">Linenoise</h3>
            <button id="toggleLinenoise" style="float: right; background-color: green; color: white;">Toggle</button>
        </div>
        <div id="linenoiseList" style="display:none; margin-bottom: 15px;">
            ${generateGroupedCategoryLinks('Linenoise', 80, 10)}
        </div>

        <div style="margin-bottom: 15px;">
            <h3 style="display: inline;">Phrack World News</h3>
            <button id="toggleWorldNews" style="float: right; background-color: green; color: white;">Toggle</button>
        </div>
        <div id="worldNewsList" style="display:none; margin-bottom: 15px;">
            ${generateGroupedCategoryLinks('Phrack World News', 80, 10)}
        </div>

        <div id="resultsArea" style="margin-top: 15px;"></div> <!-- Dedicated results area -->
    `;

    // Append the overlay to the body
    document.body.appendChild(overlay);

    // Attach toggle event listeners after the DOM elements are rendered
    window.addEventListener('load', function() {

        // Toggle functionality for Issues section
        document.getElementById('toggleIssues').addEventListener('click', function() {
            let issueList = document.getElementById('issueList');
            issueList.style.display = issueList.style.display === 'none' ? 'block' : 'none';
            console.log('Toggle Issues clicked');// Debug log
        });

        // Toggle functionality for Prophile section
        const prophileButton = document.getElementById('toggleProphile');
        if (prophileButton) {
            prophileButton.addEventListener('click', function() {
                let prophileList = document.getElementById('prophileList');
                prophileList.style.display = prophileList.style.display === 'none' ? 'block' : 'none';
                console.log('Toggle Prophile clicked');// Debug log
            });
        } else {
            console.log('Prophile button not found');// Debug log
        }

        // Toggle functionality for Loopback section
        const loopbackButton = document.getElementById('toggleLoopback');
        if (loopbackButton) {
            loopbackButton.addEventListener('click', function() {
                let loopbackList = document.getElementById('loopbackList');
                loopbackList.style.display = loopbackList.style.display === 'none' ? 'block' : 'none';
                console.log('Toggle Loopback clicked');// Debug log
            });
        } else {
            console.log('Loopback button not found');// Debug log
        }

        // Toggle functionality for Linenoise section
        const linenoiseButton = document.getElementById('toggleLinenoise');
        if (linenoiseButton) {
            linenoiseButton.addEventListener('click', function() {
                let linenoiseList = document.getElementById('linenoiseList');
                linenoiseList.style.display = linenoiseList.style.display === 'none' ? 'block' : 'none';
                console.log('Toggle Linenoise clicked');// Debug log
            });
        } else {
            console.log('Linenoise button not found');// Debug log
        }

        // Toggle functionality for Phrack World News section
        const worldNewsButton = document.getElementById('toggleWorldNews');
        if (worldNewsButton) {
            worldNewsButton.addEventListener('click', function() {
                let worldNewsList = document.getElementById('worldNewsList');
                worldNewsList.style.display = worldNewsList.style.display === 'none' ? 'block' : 'none';
                console.log('Toggle Phrack World News clicked');// Debug log
            });
        } else {
            console.log('Phrack World News button not found');// Debug log
        }

        // Add toggle functionality for each group of issues
        for (let i = 1; i <= 71; i += 10) {
            const toggleGroupButton = document.getElementById(`toggleGroup${i}`);
            if (toggleGroupButton) {
                toggleGroupButton.addEventListener('click', function() {
                    let groupList = document.getElementById(`groupList${i}`);
                    groupList.style.display = groupList.style.display === 'none' ? 'block' : 'none';
                    console.log(`Toggle Issues Group ${i}-${i+9} clicked`);// Debug log
                });
            } else {
                console.log(`Toggle Issues Group ${i}-${i+9} button not found`);// Debug log
            }
        }

        // Add toggle functionality for each group of categories (Prophile, Loopback, etc.)
        const categories = ['Prophile', 'Loopback', 'Linenoise', 'Phrack World News'];
        for (let category of categories) {
            for (let i = 1; i <= 71; i += 10) {
                const toggleCategoryButton = document.getElementById(`toggle${category}Group${i}`);
                if (toggleCategoryButton) {
                    toggleCategoryButton.addEventListener('click', function() {
                        let groupList = document.getElementById(`groupList${category}${i}`);
                        groupList.style.display = groupList.style.display === 'none' ? 'block' : 'none';
                        console.log(`Toggle ${category} Group ${i}-${i+9} clicked`);// Debug log
                    });
                } else {
                    console.log(`Toggle ${category} Group ${i}-${i+9} button not found`);// Debug log
                }
            }
        }
    });

    // Handle search button click event
    document.getElementById('searchButton').addEventListener('click', function() {
        const keyword = document.getElementById('globalSearchInput').value;
        if (keyword) {
            displayLoadingIndicator(); // Show the loading indicator
            searchAcrossTextFiles(keyword); // Call the search function with the inputted keyword
        }
    });

    // Function to display a loading spinner directly in the overlay
    function displayLoadingIndicator() {
        let existingLoader = document.getElementById('loadingMessage');

        // If a loader doesn't already exist, create one
        if (!existingLoader) {
            const loadingMessage = document.createElement('div');
            loadingMessage.id = 'loadingMessage';
            loadingMessage.innerHTML = `<p>Searching... <img src="https://i.gifer.com/ZZ5H.gif" alt="Loading..." style="width: 20px; height: 20px;"/></p>`;
            loadingMessage.style.color = 'yellow';
            loadingMessage.style.textAlign = 'center';
            loadingMessage.style.marginTop = '10px';
            
            console.log('Loading spinner added to overlay.');
            overlay.appendChild(loadingMessage); // Append the loading spinner directly to the overlay
        } else {
            console.log('Loading spinner already exists.');
        }
    }

    // Function to remove the loading message once the search is complete
    function removeLoadingIndicator() {
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            loadingMessage.remove(); // Remove the loading message from the DOM
            console.log('Loading spinner removed.');
        } else {
            console.log('No loading spinner found to remove.');
        }
    }

    // Updated search function to search only valid .txt files
    async function searchAcrossTextFiles(keyword) {
        let searchResults = [];
        keyword = keyword.toLowerCase(); // Normalize the keyword for case-insensitive search

        // Clear previous search results before starting a new search
        clearSearchResults();

        // Iterate over all issues
        for (let issueNumber = 1; issueNumber <= 71; issueNumber++) {
            try {
                const numFiles = await fetchIssueIndex(issueNumber); // Get the number of .txt files in the issue
                console.log(`Found ${numFiles} files in issue ${issueNumber}`);

                if (numFiles > 0) {
                    // Search only within the valid number of .txt files
                    for (let fileNumber = 1; fileNumber <= numFiles; fileNumber++) {
                        const textContent = await fetchIssueText(issueNumber, fileNumber);
                        if (textContent && textContent.toLowerCase().includes(keyword)) {
                            console.log(`Keyword found in Issue ${issueNumber}, File ${fileNumber}`);
                            searchResults.push({
                                issue: issueNumber,
                                file: fileNumber,
                                link: `http://www.phrack.org/archives/issues/${issueNumber}/${fileNumber}.txt`
                            });
                        }
                    }
                }
            } catch (error) {
                console.error(`Error processing issue ${issueNumber}:`, error);
            }
        }

        // Display search results and remove loading indicator
        displaySearchResults(searchResults);
        removeLoadingIndicator(); // Hide the loading message once the search is done
    }

    // Function to fetch the index page of an issue to determine the number of .txt files
    async function fetchIssueIndex(issueNumber) {
        const indexUrl = `http://www.phrack.org/archives/issues/${issueNumber}/`;
        try {
            const response = await fetch(indexUrl);
            if (response.ok) {
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const txtLinks = Array.from(doc.querySelectorAll('a')).filter(link => link.href.endsWith('.txt'));
                return txtLinks.length; // Return the number of .txt files
            }
            throw new Error(`Failed to load index page for issue ${issueNumber}`);
        } catch (error) {
            console.error(`Error fetching index for issue ${issueNumber}:`, error);
            return 0; // Return 0 if the fetch fails
        }
    }

    // Function to fetch the content of a single issue's .txt file
    async function fetchIssueText(issueNumber, fileNumber) {
        const url = `http://www.phrack.org/archives/issues/${issueNumber}/${fileNumber}.txt`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                return await response.text(); // Return the text content of the issue
            }
            throw new Error(`Failed to fetch Issue ${issueNumber}, File ${fileNumber}`);
        } catch (error) {
            console.error(`Error fetching Issue ${issueNumber}, File ${fileNumber}:`, error);
            return null; // Return null if the fetch fails
        }
    }

    // Function to display search results
    function displaySearchResults(results) {
        const resultsArea = document.getElementById('resultsArea');
        const resultsDiv = document.createElement('div');
        resultsDiv.innerHTML = `<h3>Search Results: <button id="clearResultsButton" style="float:right;">Clear</button></h3>`;

        if (results.length > 0) {
            results.forEach(result => {
                resultsDiv.innerHTML += `<div><a href="${result.link}" target="_blank">Issue ${result.issue}, File ${result.file}</a></div>`;
            });
        } else {
            resultsDiv.innerHTML += '<p>No results found.</p>';
        }

        resultsArea.appendChild(resultsDiv); // Append results to the dedicated results area

        // Attach event listener to the clear button
        document.getElementById('clearResultsButton').addEventListener('click', clearSearchResults);
    }

    // Function to clear search results
    function clearSearchResults() {
        const resultsArea = document.getElementById('resultsArea');
        resultsArea.innerHTML = ''; // Clear only the results area content
    }

    // Helper function to generate grouped issue links
    function generateGroupedIssueLinks(start, end, groupSize) {
        let groupsHtml = '';
        for (let i = start; i <= end; i += groupSize) {
            let groupEnd = Math.min(i + groupSize - 1, end);
            groupsHtml += `
                <div style="margin-bottom: 10px;">
                    <h4 style="display: inline;">Issues ${i}-${groupEnd}</h4>
                    <button style="float: right;" id="toggleGroup${i}">Toggle</button>
                </div>
                <div id="groupList${i}" style="display: none;">
                    <ul style="padding-left: 20px;">
                        ${generateIssueLinks(i, groupEnd)}
                    </ul>
                </div>
            `;
        }
        return groupsHtml;
    }

    // Helper function to generate grouped category links (Prophile, Loopback, etc.)
    function generateGroupedCategoryLinks(category, end, groupSize) {
        let groupsHtml = '';
        for (let i = 1; i <= end; i += groupSize) {
            let groupEnd = Math.min(i + groupSize - 1, end);
            const links = addCategoryLinks(category, i, groupEnd);// Get the links for the category

            if (links) {// Only display the section if there are actual links
                groupsHtml += `
                    <div style="margin-bottom: 10px;">
                        <h4 style="display: inline;">${category} ${i}-${groupEnd}</h4>
                        <button style="float: right;" id="toggle${category}Group${i}">Toggle</button>
                    </div>
                    <div id="groupList${category}${i}" style="display: none;">
                        <ul style="padding-left: 20px;">
                            ${links}
                        </ul>
                    </div>
                `;
            }
        }
        return groupsHtml;
    }

    function addCategoryLinks(category, start, end) {
        let links = '';

        // Example for Prophile category
        if (category === 'Prophile') {
            if (start === 1 && end === 10) {
                links += `<li><a href="http://www.phrack.org/issues/4/1.html" style="color: #fff;">Issue 4: Crimson Death</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/5/2.html" style="color: #fff;">Issue 5: Broadway Hacker</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/6/2.html" style="color: #fff;">Issue 6: Groups</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/7/2.html" style="color: #fff;">Issue 7: Scan Man</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/8/2.html" style="color: #fff;">Issue 8: TUC</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/9/2.html" style="color: #fff;">Issue 9: The Nightstalker</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/10/2.html" style="color: #fff;">Issue 10: Dave Starr</a></li>`;  
            }
            else if (start === 11 && end === 20) {
                links += `<li><a href="http://www.phrack.org/issues/11/2.html" style="color: #fff;">Issue 11: Wizard of Arpanet</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/12/2.html" style="color: #fff;">Issue 12: Agrajag The Prolonged</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/14/2.html" style="color: #fff;">Issue 14: Terminus</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/18/2.html" style="color: #fff;">Issue 18: Ax Murderer</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/20/2.html" style="color: #fff;">Issue 20: Taran King</a></li>`;
            }
            else if (start === 21 && end === 30) {
                links += `<li><a href="http://www.phrack.org/issues/21/2.html" style="color: #fff;">Issue 21: Napoleon Solo</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/22/2.html" style="color: #fff;">Issue 22: Karl Marx</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/23/2.html" style="color: #fff;">Issue 23: The Mentor</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/24/2.html" style="color: #fff;">Issue 24: Chanda Leir</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/28/2.html" style="color: #fff;">Issue 28: Erik Bloodaxe</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/29/2.html" style="color: #fff;">Issue 29: Emmanuel Goldstein</a></li>`;
            }
            else if (start === 31 && end === 40) {
                links += `<li><a href="http://www.phrack.org/issues/31/2.html" style="color: #fff;">Issue 31: Markus Hess</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/32/2.html" style="color: #fff;">Issue 32: Knight Lightning</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/33/2.html" style="color: #fff;">Issue 33: Shooting Shark</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/34/3.html" style="color: #fff;">Issue 34: The Disk Jockey</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/35/3.html" style="color: #fff;">Issue 35: Chris Goggans</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/38/3.html" style="color: #fff;">Issue 38: Aristotle</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/39/3.html" style="color: #fff;">Issue 39: (_>Shadow Hawk 1<_)</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/40/3.html" style="color: #fff;">Issue 40: Lex Luthor</a></li>`;
            }
            else if (start === 41 && end === 50) {
                links += `<li><a href="http://www.phrack.org/issues/41/3.html" style="color: #fff;">Issue 41: Supernigger</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/42/3.html" style="color: #fff;">Issue 42: Lord Digital</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/43/6.html" style="color: #fff;">Issue 43: Doctor Who</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/44/5.html" style="color: #fff;">Issue 44: Computer Cop</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/45/7.html" style="color: #fff;">Issue 45: Control C</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/46/5.html" style="color: #fff;">Issue 46: Minor Threat</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/48/5.html" style="color: #fff;">Issue 48: New Editors</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/49/4.html" style="color: #fff;">Issue 49: Mudge</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/50/4.html" style="color: #fff;">Issue 50: Aleph One</a></li>`;
            }
            else if (start === 51 && end === 60) {
                links += `<li><a href="http://www.phrack.org/issues/51/4.html" style="color: #fff;">Issue 51: Swamp Ratte</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/52/4.html" style="color: #fff;">Issue 52: O0</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/53/4.html" style="color: #fff;">Issue 53: Glyph</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/54/4.html" style="color: #fff;">Issue 54: ParMaster</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/55/4.html" style="color: #fff;">Issue 55: RIP Richard Stevens</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/56/4.html" style="color: #fff;">Issue 56: Shockwave Rider</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/60/5.html" style="color: #fff;">Issue 60: horizon</a></li>`;  
            }
            else if (start === 61 && end === 70) {
                links += `<li><a href="http://www.phrack.org/issues/61/5.html" style="color: #fff;">Issue 61: DiGiT</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/62/4.html" style="color: #fff;">Issue 62: scut</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/63/4.html" style="color: #fff;">Issue 63: tiago</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/64/2.html" style="color: #fff;">Issue 64: New New editors</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/65/2.html" style="color: #fff;">Issue 65: The UNIX Terrorist</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/66/2.html" style="color: #fff;">Issue 66: PaX Team</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/67/2.html" style="color: #fff;">Issue 67: punk</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/68/2.html" style="color: #fff;">Issue 68: FX of Phenoelit</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/69/2.html" style="color: #fff;">Issue 69: Solar Designer</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/70/2.html" style="color: #fff;">Issue 70: XERUB</a></li>`;
            }
            else if (start === 71 && end === 80) {
                links += `<li><a href="http://www.phrack.org/issues/71/2.html" style="color: #fff;">Issue 71: BSDaemon</a></li>`;
        
            }
        }
        // Example for Loopback category
        if (category === 'Loopback') {
            if (start === 31 && end === 40) {
                links += `<li><a href="http://www.phrack.org/issues/34/2.html" style="color: #fff;">Issue 34</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/35/2.html" style="color: #fff;">Issue 35</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/36/2.html" style="color: #fff;">Issue 36</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/37/2.html" style="color: #fff;">Issue 37</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/38/2.html" style="color: #fff;">Issue 38</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/39/2.html" style="color: #fff;">Issue 39</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/40/2.html" style="color: #fff;">Issue 40</a></li>`;
            }
            else if (start === 41 && end === 50) {
                links += `<li><a href="http://www.phrack.org/issues/41/2.html" style="color: #fff;">Issue 41</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/42/2.html" style="color: #fff;">Issue 42</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/43/2.html" style="color: #fff;">Issue 43 part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/43/3.html" style="color: #fff;">Issue 43 part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/44/2.html" style="color: #fff;">Issue 44</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/45/2.html" style="color: #fff;">Issue 45 part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/45/3.html" style="color: #fff;">Issue 45 part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/46/2.html" style="color: #fff;">Issue 46</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/47/2.html" style="color: #fff;">Issue 47</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/48/2.html" style="color: #fff;">Issue 48</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/49/2.html" style="color: #fff;">Issue 49</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/50/2.html" style="color: #fff;">Issue 50</a></li>`;
            }
            else if (start === 51 && end === 60) {
                links += `<li><a href="http://www.phrack.org/issues/51/2.html" style="color: #fff;">Issue 51</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/52/2.html" style="color: #fff;">Issue 52</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/53/2.html" style="color: #fff;">Issue 53</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/54/2.html" style="color: #fff;">Issue 54</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/55/2.html" style="color: #fff;">Issue 55</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/56/2.html" style="color: #fff;">Issue 56</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/57/2.html" style="color: #fff;">Issue 57</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/58/2.html" style="color: #fff;">Issue 58</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/59/2.html" style="color: #fff;">Issue 59</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/60/2.html" style="color: #fff;">Issue 60</a></li>`;
            }
            else if (start === 61 && end === 70) {
                links += `<li><a href="http://www.phrack.org/issues/61/2.html" style="color: #fff;">Issue 61</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/62/2.html" style="color: #fff;">Issue 62</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/63/2.html" style="color: #fff;">Issue 63</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/67/4.html" style="color: #fff;">Issue 67</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/68/5.html" style="color: #fff;">Issue 68</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/69/5.html" style="color: #fff;">Issue 69</a></li>`;
            }
            else if (start === 71 && end === 80) {
                links += `<li><a href="http://www.phrack.org/issues/71/4.html" style="color: #fff;">Issue 71</a></li>`;
            }
        }

        // Example for Linenoise category
        if (category === 'Linenoise') {
            if (start === 41 && end === 50) {
                links += `<li><a href="http://www.phrack.org/issues/42/2.html" style="color: #fff;">Issue 42</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/43/4.html" style="color: #fff;">Issue 43 part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/43/5.html" style="color: #fff;">Issue 43 part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/44/3.html" style="color: #fff;">Issue 44 part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/44/4.html" style="color: #fff;">Issue 44 part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/45/4.html" style="color: #fff;">Issue 45 part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/45/5.html" style="color: #fff;">Issue 45 part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/45/6.html" style="color: #fff;">Issue 45 part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/46/3.html" style="color: #fff;">Issue 46 part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/46/4.html" style="color: #fff;">Issue 46 part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/47/3.html" style="color: #fff;">Issue 47 part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/47/4.html" style="color: #fff;">Issue 47 part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/48/3.html" style="color: #fff;">Issue 48 part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/48/4.html" style="color: #fff;">Issue 48 part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/49/3.html" style="color: #fff;">Issue 49</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/50/3.html" style="color: #fff;">Issue 50</a></li>`;
            }
            else if (start === 51 && end === 60) {
                links += `<li><a href="http://www.phrack.org/issues/51/3.html" style="color: #fff;">Issue 51</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/52/3.html" style="color: #fff;">Issue 52</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/53/3.html" style="color: #fff;">Issue 53</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/54/3.html" style="color: #fff;">Issue 54</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/55/3.html" style="color: #fff;">Issue 55</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/56/3.html" style="color: #fff;">Issue 56</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/57/3.html" style="color: #fff;">Issue 57</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/58/3.html" style="color: #fff;">Issue 58</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/59/3.html" style="color: #fff;">Issue 59</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/60/3.html" style="color: #fff;">Issue 60</a></li>`;
            }
            else if (start === 61 && end === 70) {
                links += `<li><a href="http://www.phrack.org/issues/61/3.html" style="color: #fff;">Issue 61</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/62/3.html" style="color: #fff;">Issue 62</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/63/3.html" style="color: #fff;">Issue 63</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/68/4.html" style="color: #fff;">Issue 68</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/69/4.html" style="color: #fff;">Issue 69</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/70/3.html" style="color: #fff;">Issue 70</a></li>`;
            }
            else if (start === 71 && end === 80) {
                links += `<li><a href="http://www.phrack.org/issues/71/3.html" style="color: #fff;">Issue 71</a></li>`;
            }

        }

        // Example for Phrack World News category
        if (category === 'Phrack World News') {
            if (start === 1 && end === 10) {
                links += `<li><a href="http://www.phrack.org/issues/2/9.html" style="color: #fff;">Issue 2:</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/3/10.html" style="color: #fff;">Issue 3:</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/4/9.html" style="color: #fff;">Issue 4: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/4/10.html" style="color: #fff;">Issue 4: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/4/11.html" style="color: #fff;">Issue 4: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/5/10.html" style="color: #fff;">Issue 5: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/5/11.html" style="color: #fff;">Issue 5: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/5/12.html" style="color: #fff;">Issue 5: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/6/9.html" style="color: #fff;">Issue 6: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/6/10.html" style="color: #fff;">Issue 6: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/6/11.html" style="color: #fff;">Issue 6: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/6/12.html" style="color: #fff;">Issue 6: part IV</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/6/13.html" style="color: #fff;">Issue 6: part V</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/7/8.html" style="color: #fff;">Issue 7: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/7/9.html" style="color: #fff;">Issue 7: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/7/10.html" style="color: #fff;">Issue 7: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/8/8.html" style="color: #fff;">Issue 8: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/8/9.html" style="color: #fff;">Issue 8: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/9/10.html" style="color: #fff;">Issue 9: </a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/10/8.html" style="color: #fff;">Issue 10: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/10/9.html" style="color: #fff;">Issue 10: part II</a></li>`;
            }
            else if (start === 11 && end === 20) {
                links += `<li><a href="http://www.phrack.org/issues/11/11.html" style="color: #fff;">Issue 11: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/11/12.html" style="color: #fff;">Issue 11: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/12/10.html" style="color: #fff;">Issue 12: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/12/11.html" style="color: #fff;">Issue 12: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/13/10.html" style="color: #fff;">Issue 13:</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/14/7.html" style="color: #fff;">Issue 14: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/14/8.html" style="color: #fff;">Issue 14: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/14/9.html" style="color: #fff;">Issue 14: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/15/6.html" style="color: #fff;">Issue 15: DL on Dan the Operator</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/15/7.html" style="color: #fff;">Issue 15: The July Busts 87</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/15/8.html" style="color: #fff;">Issue 15: The Affidavit</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/16/8.html" style="color: #fff;">Issue 16: West German Hackers</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/16/9.html" style="color: #fff;">Issue 16: The Mad Phone-Man and the Gestapo</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/16/10.html" style="color: #fff;">Issue 16: Flight of the Mad Phone-Man</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/16/11.html" style="color: #fff;">Issue 16: Shadow Hawk Busted Again</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/16/12.html" style="color: #fff;">Issue 16: Coin Box Thief Wanted</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/17/10.html" style="color: #fff;">Issue 17: Bust Update</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/17/11.html" style="color: #fff;">Issue 17: "Illegal" Hacker Crackdown</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/17/12.html" style="color: #fff;">Issue 17: Crackers are Cheating Bell</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/18/10.html" style="color: #fff;">Issue 18: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/18/11.html" style="color: #fff;">Issue 18: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/19/7.html" style="color: #fff;">Issue 19: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/19/8.html" style="color: #fff;">Issue 19: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/20/12.html" style="color: #fff;">Issue 20: SummerCon '88</a></li>`;
            }
            else if (start === 21 && end === 30) {
                links += `<li><a href="http://www.phrack.org/issues/21/9.html" style="color: #fff;">Issue 21: Special Edition II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/21/10.html" style="color: #fff;">Issue 21: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/21/11.html" style="color: #fff;">Issue 21: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/22/9.html" style="color: #fff;">Issue 22: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/22/10.html" style="color: #fff;">Issue 22: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/22/11.html" style="color: #fff;">Issue 22: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/22/12.html" style="color: #fff;">Issue 22: part IV</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/23/11.html" style="color: #fff;">Issue 23: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/23/12.html" style="color: #fff;">Issue 23: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/24/11.html" style="color: #fff;">Issue 24: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/24/12.html" style="color: #fff;">Issue 24: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/24/13.html" style="color: #fff;">Issue 24: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/25/9.html" style="color: #fff;">Issue 25: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/25/10.html" style="color: #fff;">Issue 25: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/25/11.html" style="color: #fff;">Issue 25: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/26/9.html" style="color: #fff;">Issue 26: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/26/10.html" style="color: #fff;">Issue 26: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/26/11.html" style="color: #fff;">Issue 26: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/27/10.html" style="color: #fff;">Issue 27: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/27/11.html" style="color: #fff;">Issue 27: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/27/12.html" style="color: #fff;">Issue 27: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/28/9.html" style="color: #fff;">Issue 28: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/28/10.html" style="color: #fff;">Issue 28: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/28/11.html" style="color: #fff;">Issue 28: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/28/12.html" style="color: #fff;">Issue 28: part IV</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/29/10.html" style="color: #fff;">Issue 28: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/29/11.html" style="color: #fff;">Issue 29: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/29/12.html" style="color: #fff;">Issue 29: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/30/11.html" style="color: #fff;">Issue 30: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/30/12.html" style="color: #fff;">Issue 30: part II</a></li>`;
            }
            else if (start === 31 && end === 40) {
                links += `<li><a href="http://www.phrack.org/issues/31/8.html" style="color: #fff;">Issue 31: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/31/9.html" style="color: #fff;">Issue 31: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/31/10.html" style="color: #fff;">Issue 31: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/32/10.html" style="color: #fff;">Issue 32: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/32/11.html" style="color: #fff;">Issue 32: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/32/12.html" style="color: #fff;">Issue 32: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/33/11.html" style="color: #fff;">Issue 33: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/33/12.html" style="color: #fff;">Issue 33: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/33/13.html" style="color: #fff;">Issue 33: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/34/10.html" style="color: #fff;">Issue 34: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/34/11.html" style="color: #fff;">Issue 34: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/35/10.html" style="color: #fff;">Issue 35: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/35/11.html" style="color: #fff;">Issue 35: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/35/12.html" style="color: #fff;">Issue 35: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/35/13.html" style="color: #fff;">Issue 35: part IV</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/36/10.html" style="color: #fff;">Issue 36: *Elite* World News</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/36/11.html" style="color: #fff;">Issue 36: *Elite* World News</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/37/11.html" style="color: #fff;">Issue 37: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/37/12.html" style="color: #fff;">Issue 37: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/37/13.html" style="color: #fff;">Issue 37: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/37/14.html" style="color: #fff;">Issue 37: part IV</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/38/13.html" style="color: #fff;">Issue 38: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/38/14.html" style="color: #fff;">Issue 38: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/38/15.html" style="color: #fff;">Issue 38: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/39/10.html" style="color: #fff;">Issue 39: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/39/11.html" style="color: #fff;">Issue 39: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/39/12.html" style="color: #fff;">Issue 39: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/39/13.html" style="color: #fff;">Issue 39: part IV</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/40/12.html" style="color: #fff;">Issue 40: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/40/13.html" style="color: #fff;">Issue 40: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/40/14.html" style="color: #fff;">Issue 40: part III</a></li>`;
            }
            else if (start === 41 && end === 50) {
                links += `<li><a href="http://www.phrack.org/issues/41/11.html#article" style="color: #fff;">Issue 41: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/41/12.html#article" style="color: #fff;">Issue 41: part II</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/41/13.html#article" style="color: #fff;">Issue 41: part III</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/42/14.html#article" style="color: #fff;">Issue 42: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/43/27.html#article" style="color: #fff;">Issue 43: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/44/27.html#article" style="color: #fff;">Issue 44: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/45/28.html#article" style="color: #fff;">Issue 45: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/46/28.html#article" style="color: #fff;">Issue 46: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/47/22.html#article" style="color: #fff;">Issue 47: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/48/18.html#article" style="color: #fff;">Issue 48: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/49/16.html#article" style="color: #fff;">Issue 49: part I</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/50/15.html#article" style="color: #fff;">Issue 50: part I</a></li>`;
            }
            else if (start === 51 && end === 60) {
                links += `<li><a href="http://www.phrack.org/issues/51/16.html#article" style="color: #fff;">Issue 51</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/52/19.html#article" style="color: #fff;">Issue 52</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/53/14.html#article" style="color: #fff;">Issue 53</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/54/11.html#article" style="color: #fff;">Issue 54</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/55/18.html#article" style="color: #fff;">Issue 55</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/57/17.html#article" style="color: #fff;">Issue 57</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/58/13.html#article" style="color: #fff;">Issue 58</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/59/17.html#article" style="color: #fff;">Issue 59</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/60/15.html#article" style="color: #fff;">Issue 60</a></li>`;
            }
            else if (start === 61 && end === 70) {
                links += `<li><a href="http://www.phrack.org/issues/61/15.html#article" style="color: #fff;">Issue 61</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/62/16.html#article" style="color: #fff;">Issue 62</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/63/20.html#article" style="color: #fff;">Issue 63</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/64/3.html#article" style="color: #fff;">Issue 64</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/65/3.html#article" style="color: #fff;">Issue 65</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/66/3.html#article" style="color: #fff;">Issue 66</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/67/3.html#article" style="color: #fff;">Issue 67</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/68/3.html#article" style="color: #fff;">Issue 68</a></li>`;
                links += `<li><a href="http://www.phrack.org/issues/69/3.html#article" style="color: #fff;">Issue 69</a></li>`;
            }
            else if (start === 71 && end === 80) {
                links += `<li><a href="" style="color: #fff;">Issue 71 coming soon...</a></li>`;
            }
        }

        return links;// Returns empty string if no links are found
    }

    // Helper function to dynamically generate issue links
    function generateIssueLinks(start, end) {
        let links = '';
        for (let i = start; i <= end; i++) {
            links += `<li><a href="http://www.phrack.org/issues/${i}/1.html" style="color: #fff;">Issue ${i}</a></li>`;
        }
        return links;
    }
})();
