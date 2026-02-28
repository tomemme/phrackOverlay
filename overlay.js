// ==UserScript==
// @name         Phrack Nav v5
// @namespace    http://tampermonkey.net/
// @version      2024-12-29
// @description  try to take over the world!
// @author       You
// @match        https://phrack.org/issues/*
// @run-at       document-idle
// @connect      archives.phrack.org
// @icon         https://www.google.com/s2/favicons?sz=64&domain=phrack.org
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
  "use strict";

  const ISSUE_START = 1;
  const ISSUE_END = 71;
  const GROUP_SIZE = 10;
  const CATEGORY_END = 80;
  const SECTION_CONFIG = [
    {
      id: "Issues",
      label: "Issues Index",
      targetId: "issueList",
      isIssueList: true,
    },
    { id: "Prophile", label: "Prophile", targetId: "prophileList" },
    { id: "Loopback", label: "Loopback", targetId: "loopbackList" },
    { id: "Linenoise", label: "Linenoise", targetId: "linenoiseList" },
    {
      id: "WorldNews",
      label: "Phrack World News",
      targetId: "worldNewsList",
      category: "Phrack World News",
    },
  ];
  const CATEGORY_GROUPS = SECTION_CONFIG.filter(
    (section) => section.category || !section.isIssueList
  ).map((section) => section.category || section.label);
  const CATEGORY_LINKS = {
    Prophile: {
      "1-10": [
        ["https://phrack.org/issues/4/1.html", "Issue 4: Crimson Death"],
        ["https://phrack.org/issues/5/2.html", "Issue 5: Broadway Hacker"],
        ["https://phrack.org/issues/6/2.html", "Issue 6: Groups"],
        ["https://phrack.org/issues/7/2.html", "Issue 7: Scan Man"],
        ["https://phrack.org/issues/8/2.html", "Issue 8: TUC"],
        ["https://phrack.org/issues/9/2.html", "Issue 9: The Nightstalker"],
        ["https://phrack.org/issues/10/2.html", "Issue 10: Dave Starr"],
      ],
      "11-20": [
        ["https://phrack.org/issues/11/2.html", "Issue 11: Wizard of Arpanet"],
        [
          "https://phrack.org/issues/12/2.html",
          "Issue 12: Agrajag The Prolonged",
        ],
        ["https://phrack.org/issues/14/2.html", "Issue 14: Terminus"],
        ["https://phrack.org/issues/18/2.html", "Issue 18: Ax Murderer"],
        ["https://phrack.org/issues/20/2.html", "Issue 20: Taran King"],
      ],
      "21-30": [
        ["https://phrack.org/issues/21/2.html", "Issue 21: Napoleon Solo"],
        ["https://phrack.org/issues/22/2.html", "Issue 22: Karl Marx"],
        ["https://phrack.org/issues/23/2.html", "Issue 23: The Mentor"],
        ["https://phrack.org/issues/24/2.html", "Issue 24: Chanda Leir"],
        ["https://phrack.org/issues/28/2.html", "Issue 28: Erik Bloodaxe"],
        [
          "https://phrack.org/issues/29/2.html",
          "Issue 29: Emmanuel Goldstein",
        ],
      ],
      "31-40": [
        ["https://phrack.org/issues/31/2.html", "Issue 31: Markus Hess"],
        [
          "https://phrack.org/issues/32/2.html",
          "Issue 32: Knight Lightning",
        ],
        ["https://phrack.org/issues/33/2.html", "Issue 33: Shooting Shark"],
        ["https://phrack.org/issues/34/3.html", "Issue 34: The Disk Jockey"],
        ["https://phrack.org/issues/35/3.html", "Issue 35: Chris Goggans"],
        ["https://phrack.org/issues/38/3.html", "Issue 38: Aristotle"],
        [
          "https://phrack.org/issues/39/3.html",
          "Issue 39: (_>Shadow Hawk 1<_)",
        ],
        ["https://phrack.org/issues/40/3.html", "Issue 40: Lex Luthor"],
      ],
      "41-50": [
        ["https://phrack.org/issues/41/3.html", "Issue 41: Supernigger"],
        ["https://phrack.org/issues/42/3.html", "Issue 42: Lord Digital"],
        ["https://phrack.org/issues/43/6.html", "Issue 43: Doctor Who"],
        ["https://phrack.org/issues/44/5.html", "Issue 44: Computer Cop"],
        ["https://phrack.org/issues/45/7.html", "Issue 45: Control C"],
        ["https://phrack.org/issues/46/5.html", "Issue 46: Minor Threat"],
        ["https://phrack.org/issues/48/5.html", "Issue 48: New Editors"],
        ["https://phrack.org/issues/49/4.html", "Issue 49: Mudge"],
        ["https://phrack.org/issues/50/4.html", "Issue 50: Aleph One"],
      ],
      "51-60": [
        ["https://phrack.org/issues/51/4.html", "Issue 51: Swamp Ratte"],
        ["https://phrack.org/issues/52/4.html", "Issue 52: O0"],
        ["https://phrack.org/issues/53/4.html", "Issue 53: Glyph"],
        ["https://phrack.org/issues/54/4.html", "Issue 54: ParMaster"],
        [
          "https://phrack.org/issues/55/4.html",
          "Issue 55: RIP Richard Stevens",
        ],
        [
          "https://phrack.org/issues/56/4.html",
          "Issue 56: Shockwave Rider",
        ],
        ["https://phrack.org/issues/60/5.html", "Issue 60: horizon"],
      ],
      "61-70": [
        ["https://phrack.org/issues/61/5.html", "Issue 61: DiGiT"],
        ["https://phrack.org/issues/62/4.html", "Issue 62: scut"],
        ["https://phrack.org/issues/63/4.html", "Issue 63: tiago"],
        [
          "https://phrack.org/issues/64/2.html",
          "Issue 64: New New editors",
        ],
        [
          "https://phrack.org/issues/65/2.html",
          "Issue 65: The UNIX Terrorist",
        ],
        ["https://phrack.org/issues/66/2.html", "Issue 66: PaX Team"],
        ["https://phrack.org/issues/67/2.html", "Issue 67: punk"],
        ["https://phrack.org/issues/68/2.html", "Issue 68: FX of Phenoelit"],
        ["https://phrack.org/issues/69/2.html", "Issue 69: Solar Designer"],
        ["https://phrack.org/issues/70/2.html", "Issue 70: XERUB"],
      ],
      "71-80": [["https://phrack.org/issues/71/2.html", "Issue 71: BSDaemon"]],
    },
    Loopback: {
      "31-40": [
        ["https://phrack.org/issues/34/2.html", "Issue 34"],
        ["https://phrack.org/issues/35/2.html", "Issue 35"],
        ["https://phrack.org/issues/36/2.html", "Issue 36"],
        ["https://phrack.org/issues/37/2.html", "Issue 37"],
        ["https://phrack.org/issues/38/2.html", "Issue 38"],
        ["https://phrack.org/issues/39/2.html", "Issue 39"],
        ["https://phrack.org/issues/40/2.html", "Issue 40"],
      ],
      "41-50": [
        ["https://phrack.org/issues/41/2.html", "Issue 41"],
        ["https://phrack.org/issues/42/2.html", "Issue 42"],
        ["https://phrack.org/issues/43/2.html", "Issue 43 part I"],
        ["https://phrack.org/issues/43/3.html", "Issue 43 part II"],
        ["https://phrack.org/issues/44/2.html", "Issue 44"],
        ["https://phrack.org/issues/45/2.html", "Issue 45 part I"],
        ["https://phrack.org/issues/45/3.html", "Issue 45 part II"],
        ["https://phrack.org/issues/46/2.html", "Issue 46"],
        ["https://phrack.org/issues/47/2.html", "Issue 47"],
        ["https://phrack.org/issues/48/2.html", "Issue 48"],
        ["https://phrack.org/issues/49/2.html", "Issue 49"],
        ["https://phrack.org/issues/50/2.html", "Issue 50"],
      ],
      "51-60": [
        ["https://phrack.org/issues/51/2.html", "Issue 51"],
        ["https://phrack.org/issues/52/2.html", "Issue 52"],
        ["https://phrack.org/issues/53/2.html", "Issue 53"],
        ["https://phrack.org/issues/54/2.html", "Issue 54"],
        ["https://phrack.org/issues/55/2.html", "Issue 55"],
        ["https://phrack.org/issues/56/2.html", "Issue 56"],
        ["https://phrack.org/issues/57/2.html", "Issue 57"],
        ["https://phrack.org/issues/58/2.html", "Issue 58"],
        ["https://phrack.org/issues/59/2.html", "Issue 59"],
        ["https://phrack.org/issues/60/2.html", "Issue 60"],
      ],
      "61-70": [
        ["https://phrack.org/issues/61/2.html", "Issue 61"],
        ["https://phrack.org/issues/62/2.html", "Issue 62"],
        ["https://phrack.org/issues/63/2.html", "Issue 63"],
        ["https://phrack.org/issues/67/4.html", "Issue 67"],
        ["https://phrack.org/issues/68/5.html", "Issue 68"],
        ["https://phrack.org/issues/69/5.html", "Issue 69"],
      ],
      "71-80": [["https://phrack.org/issues/71/4.html", "Issue 71"]],
    },
    Linenoise: {
      "41-50": [
        ["https://phrack.org/issues/42/2.html", "Issue 42"],
        ["https://phrack.org/issues/43/4.html", "Issue 43 part I"],
        ["https://phrack.org/issues/43/5.html", "Issue 43 part II"],
        ["https://phrack.org/issues/44/3.html", "Issue 44 part I"],
        ["https://phrack.org/issues/44/4.html", "Issue 44 part II"],
        ["https://phrack.org/issues/45/4.html", "Issue 45 part I"],
        ["https://phrack.org/issues/45/5.html", "Issue 45 part II"],
        ["https://phrack.org/issues/45/6.html", "Issue 45 part III"],
        ["https://phrack.org/issues/46/3.html", "Issue 46 part I"],
        ["https://phrack.org/issues/46/4.html", "Issue 46 part II"],
        ["https://phrack.org/issues/47/3.html", "Issue 47 part I"],
        ["https://phrack.org/issues/47/4.html", "Issue 47 part II"],
        ["https://phrack.org/issues/48/3.html", "Issue 48 part I"],
        ["https://phrack.org/issues/48/4.html", "Issue 48 part II"],
        ["https://phrack.org/issues/49/3.html", "Issue 49"],
        ["https://phrack.org/issues/50/3.html", "Issue 50"],
      ],
      "51-60": [
        ["https://phrack.org/issues/51/3.html", "Issue 51"],
        ["https://phrack.org/issues/52/3.html", "Issue 52"],
        ["https://phrack.org/issues/53/3.html", "Issue 53"],
        ["https://phrack.org/issues/54/3.html", "Issue 54"],
        ["https://phrack.org/issues/55/3.html", "Issue 55"],
        ["https://phrack.org/issues/56/3.html", "Issue 56"],
        ["https://phrack.org/issues/57/3.html", "Issue 57"],
        ["https://phrack.org/issues/58/3.html", "Issue 58"],
        ["https://phrack.org/issues/59/3.html", "Issue 59"],
        ["https://phrack.org/issues/60/3.html", "Issue 60"],
      ],
      "61-70": [
        ["https://phrack.org/issues/61/3.html", "Issue 61"],
        ["https://phrack.org/issues/62/3.html", "Issue 62"],
        ["https://phrack.org/issues/63/3.html", "Issue 63"],
        ["https://phrack.org/issues/68/4.html", "Issue 68"],
        ["https://phrack.org/issues/69/4.html", "Issue 69"],
        ["https://phrack.org/issues/70/3.html", "Issue 70"],
      ],
      "71-80": [["https://phrack.org/issues/71/3.html", "Issue 71"]],
    },
    "Phrack World News": {
      "1-10": [
        ["https://phrack.org/issues/2/9.html", "Issue 2:"],
        ["https://phrack.org/issues/3/10.html", "Issue 3:"],
        ["https://phrack.org/issues/4/9.html", "Issue 4: part I"],
        ["https://phrack.org/issues/4/10.html", "Issue 4: part II"],
        ["https://phrack.org/issues/4/11.html", "Issue 4: part III"],
        ["https://phrack.org/issues/5/10.html", "Issue 5: part I"],
        ["https://phrack.org/issues/5/11.html", "Issue 5: part II"],
        ["https://phrack.org/issues/5/12.html", "Issue 5: part III"],
        ["https://phrack.org/issues/6/9.html", "Issue 6: part I"],
        ["https://phrack.org/issues/6/10.html", "Issue 6: part II"],
        ["https://phrack.org/issues/6/11.html", "Issue 6: part III"],
        ["https://phrack.org/issues/6/12.html", "Issue 6: part IV"],
        ["https://phrack.org/issues/6/13.html", "Issue 6: part V"],
        ["https://phrack.org/issues/7/8.html", "Issue 7: part I"],
        ["https://phrack.org/issues/7/9.html", "Issue 7: part II"],
        ["https://phrack.org/issues/7/10.html", "Issue 7: part III"],
        ["https://phrack.org/issues/8/8.html", "Issue 8: part I"],
        ["https://phrack.org/issues/8/9.html", "Issue 8: part II"],
        ["https://phrack.org/issues/9/10.html", "Issue 9: "],
        ["https://phrack.org/issues/10/8.html", "Issue 10: part I"],
        ["https://phrack.org/issues/10/9.html", "Issue 10: part II"],
      ],
      "11-20": [
        ["https://phrack.org/issues/11/11.html", "Issue 11: part I"],
        ["https://phrack.org/issues/11/12.html", "Issue 11: part II"],
        ["https://phrack.org/issues/12/10.html", "Issue 12: part I"],
        ["https://phrack.org/issues/12/11.html", "Issue 12: part II"],
        ["https://phrack.org/issues/13/10.html", "Issue 13:"],
        ["https://phrack.org/issues/14/7.html", "Issue 14: part I"],
        ["https://phrack.org/issues/14/8.html", "Issue 14: part II"],
        ["https://phrack.org/issues/14/9.html", "Issue 14: part III"],
        [
          "https://phrack.org/issues/15/6.html",
          "Issue 15: DL on Dan the Operator",
        ],
        ["https://phrack.org/issues/15/7.html", "Issue 15: The July Busts 87"],
        ["https://phrack.org/issues/15/8.html", "Issue 15: The Affidavit"],
        ["https://phrack.org/issues/16/8.html", "Issue 16: West German Hackers"],
        [
          "https://phrack.org/issues/16/9.html",
          "Issue 16: The Mad Phone-Man and the Gestapo",
        ],
        [
          "https://phrack.org/issues/16/10.html",
          "Issue 16: Flight of the Mad Phone-Man",
        ],
        [
          "https://phrack.org/issues/16/11.html",
          "Issue 16: Shadow Hawk Busted Again",
        ],
        [
          "https://phrack.org/issues/16/12.html",
          "Issue 16: Coin Box Thief Wanted",
        ],
        ["https://phrack.org/issues/17/10.html", "Issue 17: Bust Update"],
        [
          "https://phrack.org/issues/17/11.html",
          'Issue 17: "Illegal" Hacker Crackdown',
        ],
        [
          "https://phrack.org/issues/17/12.html",
          "Issue 17: Crackers are Cheating Bell",
        ],
        ["https://phrack.org/issues/18/10.html", "Issue 18: part I"],
        ["https://phrack.org/issues/18/11.html", "Issue 18: part II"],
        ["https://phrack.org/issues/19/7.html", "Issue 19: part I"],
        ["https://phrack.org/issues/19/8.html", "Issue 19: part II"],
        ["https://phrack.org/issues/20/12.html", "Issue 20: SummerCon '88"],
      ],
      "21-30": [
        ["https://phrack.org/issues/21/9.html", "Issue 21: Special Edition II"],
        ["https://phrack.org/issues/21/10.html", "Issue 21: part I"],
        ["https://phrack.org/issues/21/11.html", "Issue 21: part II"],
        ["https://phrack.org/issues/22/9.html", "Issue 22: part I"],
        ["https://phrack.org/issues/22/10.html", "Issue 22: part II"],
        ["https://phrack.org/issues/22/11.html", "Issue 22: part III"],
        ["https://phrack.org/issues/22/12.html", "Issue 22: part IV"],
        ["https://phrack.org/issues/23/11.html", "Issue 23: part I"],
        ["https://phrack.org/issues/23/12.html", "Issue 23: part II"],
        ["https://phrack.org/issues/24/11.html", "Issue 24: part I"],
        ["https://phrack.org/issues/24/12.html", "Issue 24: part II"],
        ["https://phrack.org/issues/24/13.html", "Issue 24: part III"],
        ["https://phrack.org/issues/25/9.html", "Issue 25: part I"],
        ["https://phrack.org/issues/25/10.html", "Issue 25: part II"],
        ["https://phrack.org/issues/25/11.html", "Issue 25: part III"],
        ["https://phrack.org/issues/26/9.html", "Issue 26: part I"],
        ["https://phrack.org/issues/26/10.html", "Issue 26: part II"],
        ["https://phrack.org/issues/26/11.html", "Issue 26: part III"],
        ["https://phrack.org/issues/27/10.html", "Issue 27: part I"],
        ["https://phrack.org/issues/27/11.html", "Issue 27: part II"],
        ["https://phrack.org/issues/27/12.html", "Issue 27: part III"],
        ["https://phrack.org/issues/28/9.html", "Issue 28: part I"],
        ["https://phrack.org/issues/28/10.html", "Issue 28: part II"],
        ["https://phrack.org/issues/28/11.html", "Issue 28: part III"],
        ["https://phrack.org/issues/28/12.html", "Issue 28: part IV"],
        ["https://phrack.org/issues/29/10.html", "Issue 28: part I"],
        ["https://phrack.org/issues/29/11.html", "Issue 29: part II"],
        ["https://phrack.org/issues/29/12.html", "Issue 29: part III"],
        ["https://phrack.org/issues/30/11.html", "Issue 30: part I"],
        ["https://phrack.org/issues/30/12.html", "Issue 30: part II"],
      ],
      "31-40": [
        ["https://phrack.org/issues/31/8.html", "Issue 31: part I"],
        ["https://phrack.org/issues/31/9.html", "Issue 31: part II"],
        ["https://phrack.org/issues/31/10.html", "Issue 31: part III"],
        ["https://phrack.org/issues/32/10.html", "Issue 32: part I"],
        ["https://phrack.org/issues/32/11.html", "Issue 32: part II"],
        ["https://phrack.org/issues/32/12.html", "Issue 32: part III"],
        ["https://phrack.org/issues/33/11.html", "Issue 33: part I"],
        ["https://phrack.org/issues/33/12.html", "Issue 33: part II"],
        ["https://phrack.org/issues/33/13.html", "Issue 33: part III"],
        ["https://phrack.org/issues/34/10.html", "Issue 34: part I"],
        ["https://phrack.org/issues/34/11.html", "Issue 34: part II"],
        ["https://phrack.org/issues/35/10.html", "Issue 35: part I"],
        ["https://phrack.org/issues/35/11.html", "Issue 35: part II"],
        ["https://phrack.org/issues/35/12.html", "Issue 35: part III"],
        ["https://phrack.org/issues/35/13.html", "Issue 35: part IV"],
        ["https://phrack.org/issues/36/10.html", "Issue 36: *Elite* World News"],
        ["https://phrack.org/issues/36/11.html", "Issue 36: *Elite* World News"],
        ["https://phrack.org/issues/37/11.html", "Issue 37: part I"],
        ["https://phrack.org/issues/37/12.html", "Issue 37: part II"],
        ["https://phrack.org/issues/37/13.html", "Issue 37: part III"],
        ["https://phrack.org/issues/37/14.html", "Issue 37: part IV"],
        ["https://phrack.org/issues/38/13.html", "Issue 38: part I"],
        ["https://phrack.org/issues/38/14.html", "Issue 38: part II"],
        ["https://phrack.org/issues/38/15.html", "Issue 38: part III"],
        ["https://phrack.org/issues/39/10.html", "Issue 39: part I"],
        ["https://phrack.org/issues/39/11.html", "Issue 39: part II"],
        ["https://phrack.org/issues/39/12.html", "Issue 39: part III"],
        ["https://phrack.org/issues/39/13.html", "Issue 39: part IV"],
        ["https://phrack.org/issues/40/12.html", "Issue 40: part I"],
        ["https://phrack.org/issues/40/13.html", "Issue 40: part II"],
        ["https://phrack.org/issues/40/14.html", "Issue 40: part III"],
      ],
      "41-50": [
        ["https://phrack.org/issues/41/11.html#article", "Issue 41: part I"],
        ["https://phrack.org/issues/41/12.html#article", "Issue 41: part II"],
        ["https://phrack.org/issues/41/13.html#article", "Issue 41: part III"],
        ["https://phrack.org/issues/42/14.html#article", "Issue 42: part I"],
        ["https://phrack.org/issues/43/27.html#article", "Issue 43: part I"],
        ["https://phrack.org/issues/44/27.html#article", "Issue 44: part I"],
        ["https://phrack.org/issues/45/28.html#article", "Issue 45: part I"],
        ["https://phrack.org/issues/46/28.html#article", "Issue 46: part I"],
        ["https://phrack.org/issues/47/22.html#article", "Issue 47: part I"],
        ["https://phrack.org/issues/48/18.html#article", "Issue 48: part I"],
        ["https://phrack.org/issues/49/16.html#article", "Issue 49: part I"],
        ["https://phrack.org/issues/50/15.html#article", "Issue 50: part I"],
      ],
      "51-60": [
        ["https://phrack.org/issues/51/16.html#article", "Issue 51"],
        ["https://phrack.org/issues/52/19.html#article", "Issue 52"],
        ["https://phrack.org/issues/53/14.html#article", "Issue 53"],
        ["https://phrack.org/issues/54/11.html#article", "Issue 54"],
        ["https://phrack.org/issues/55/18.html#article", "Issue 55"],
        ["https://phrack.org/issues/57/17.html#article", "Issue 57"],
        ["https://phrack.org/issues/58/13.html#article", "Issue 58"],
        ["https://phrack.org/issues/59/17.html#article", "Issue 59"],
        ["https://phrack.org/issues/60/15.html#article", "Issue 60"],
      ],
      "61-70": [
        ["https://phrack.org/issues/61/15.html#article", "Issue 61"],
        ["https://phrack.org/issues/62/16.html#article", "Issue 62"],
        ["https://phrack.org/issues/63/20.html#article", "Issue 63"],
        ["https://phrack.org/issues/64/3.html#article", "Issue 64"],
        ["https://phrack.org/issues/65/3.html#article", "Issue 65"],
        ["https://phrack.org/issues/66/3.html#article", "Issue 66"],
        ["https://phrack.org/issues/67/3.html#article", "Issue 67"],
        ["https://phrack.org/issues/68/3.html#article", "Issue 68"],
        ["https://phrack.org/issues/69/3.html#article", "Issue 69"],
      ],
      "71-80": [["", "Issue 71 coming soon..."]],
    },
  };

  //used in search fx
  function gmFetch(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) resolve(res.responseText);
          else reject(new Error(`GM_fetch failed ${res.status} for ${url}`));
        },
        onerror: (e) =>
          reject(
            new Error(
              `GM_fetch network error for ${url}: ${e.error || "unknown"}`
            )
          ),
      });
    });
  }

  // Simple concurrency limiter
  function createLimiter(limit) {
    let active = 0;
    const queue = [];
    const run = (fn) =>
      new Promise((resolve, reject) => {
        const exec = () => {
          active++;
          fn()
            .then(resolve, reject)
            .finally(() => {
              active--;
              if (queue.length) queue.shift()();
            });
        };
        active < limit ? exec() : queue.push(exec);
      });
    return run;
  }

  // GM storage cache
  async function cacheGet(key, def = null) {
    try {
      const v = await GM_getValue(key);
      return v === undefined ? def : v;
    } catch {
      return def;
    }
  }
  async function cacheSet(key, val) {
    try {
      await GM_setValue(key, val);
    } catch {
      /* ignore */
    }
  }

  // Minimal progress UI
  function ensureProgressUI() {
    if (document.getElementById("phrackProgress")) return;
    const barWrap = document.createElement("div");
    barWrap.id = "phrackProgress";
    barWrap.style.cssText =
      "margin-top:10px;background:#222;border:1px solid #555;height:10px;position:relative;";
    const bar = document.createElement("div");
    bar.id = "phrackProgressBar";
    bar.style.cssText = "height:100%;width:0%;background:#4caf50;";
    const label = document.createElement("div");
    label.id = "phrackProgressLabel";
    label.style.cssText =
      "font-size:11px;margin-top:4px;text-align:center;color:#ccc;";
    barWrap.appendChild(bar);
    overlay.appendChild(barWrap);
    overlay.appendChild(label);
  }
  function updateProgress(done, total, phase = "") {
    const bar = document.getElementById("phrackProgressBar");
    const label = document.getElementById("phrackProgressLabel");
    if (!bar || !label) return;
    const pct = total ? Math.round((done / total) * 100) : 0;
    bar.style.width = pct + "%";
    label.textContent = `${phase} ${done}/${total} (${pct}%)`;
  }

  // Create the overlay div
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "10px";
  overlay.style.left = "10px";
  overlay.style.width = "250px";
  overlay.style.height = "auto";
  overlay.style.maxHeight = "80vh"; // Set max height to 80% of the viewport height
  overlay.style.overflowY = "auto"; // Enable vertical scrolling
  overlay.style.backgroundColor = "#333";
  overlay.style.color = "#fff";
  overlay.style.padding = "10px";
  overlay.style.zIndex = "1000";

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
            ${generateGroupedIssueLinks(ISSUE_START, ISSUE_END, GROUP_SIZE)}
        </div>

        <div style="margin-bottom: 15px;">
            <h3 style="display: inline;">Prophile</h3>
            <button id="toggleProphile" style="float: right; background-color: green; color: white;">Toggle</button>
        </div>
        <div id="prophileList" style="display:none; margin-bottom: 15px;">
            ${generateGroupedCategoryLinks("Prophile", CATEGORY_END, GROUP_SIZE)}
        </div>

        <div style="margin-bottom: 15px;">
            <h3 style="display: inline;">Loopback</h3>
            <button id="toggleLoopback" style="float: right; background-color: green; color: white;">Toggle</button>
        </div>
        <div id="loopbackList" style="display:none; margin-bottom: 15px;">
            ${generateGroupedCategoryLinks("Loopback", CATEGORY_END, GROUP_SIZE)}
        </div>

        <div style="margin-bottom: 15px;">
            <h3 style="display: inline;">Linenoise</h3>
            <button id="toggleLinenoise" style="float: right; background-color: green; color: white;">Toggle</button>
        </div>
        <div id="linenoiseList" style="display:none; margin-bottom: 15px;">
            ${generateGroupedCategoryLinks("Linenoise", CATEGORY_END, GROUP_SIZE)}
        </div>

        <div style="margin-bottom: 15px;">
            <h3 style="display: inline;">Phrack World News</h3>
            <button id="toggleWorldNews" style="float: right; background-color: green; color: white;">Toggle</button>
        </div>
        <div id="worldNewsList" style="display:none; margin-bottom: 15px;">
            ${generateGroupedCategoryLinks("Phrack World News", CATEGORY_END, GROUP_SIZE)}
        </div>

        <div id="resultsArea" style="margin-top: 15px;"></div> <!-- Dedicated results area -->
    `;

  // Append the overlay to the body
  document.body.appendChild(overlay);

  function toggleDisplay(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    target.style.display = target.style.display === "none" ? "block" : "none";
  }

  function bindToggle(buttonId, targetId) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    button.addEventListener("click", function () {
      toggleDisplay(targetId);
    });
  }

  // Attach toggle event listeners after the DOM elements are rendered
  window.addEventListener("load", function () {
    SECTION_CONFIG.forEach((section) => {
      bindToggle(`toggle${section.id}`, section.targetId);
    });

    // Add toggle functionality for each group of issues
    for (let i = ISSUE_START; i <= ISSUE_END; i += GROUP_SIZE) {
      bindToggle(`toggleGroup${i}`, `groupList${i}`);
    }

    // Add toggle functionality for each group of categories (Prophile, Loopback, etc.)
    for (const category of CATEGORY_GROUPS) {
      for (let i = ISSUE_START; i <= ISSUE_END; i += GROUP_SIZE) {
        bindToggle(`toggle${category}Group${i}`, `groupList${category}${i}`);
      }
    }
  });

  // Handle search button click event
  document
    .getElementById("searchButton")
    .addEventListener("click", function () {
      const keyword = document.getElementById("globalSearchInput").value;
      if (keyword) {
        displayLoadingIndicator(); // Show the loading indicator
        searchAcrossTextFiles(keyword); // Call the search function with the inputted keyword
      }
    });

  // Function to display a loading spinner directly in the overlay
  function displayLoadingIndicator() {
    let existingLoader = document.getElementById("loadingMessage");

    // If a loader doesn't already exist, create one
    if (!existingLoader) {
      const loadingMessage = document.createElement("div");
      loadingMessage.id = "loadingMessage";
      loadingMessage.innerHTML = `<p>Searching... <img src="https://i.gifer.com/ZZ5H.gif" alt="Loading..." style="width: 20px; height: 20px;"/></p>`;
      loadingMessage.style.color = "yellow";
      loadingMessage.style.textAlign = "center";
      loadingMessage.style.marginTop = "10px";
      overlay.appendChild(loadingMessage); // Append the loading spinner directly to the overlay
    }
  }

  // Function to remove the loading message once the search is complete
  function removeLoadingIndicator() {
    const loadingMessage = document.getElementById("loadingMessage");
    if (loadingMessage) {
      loadingMessage.remove(); // Remove the loading message from the DOM
    }
  }

  // Token to cancel/ignore older searches if user clicks Search again
  let currentSearchId = 0;

  async function searchAcrossTextFiles(keyword) {
    currentSearchId++;
    const mySearchId = currentSearchId;

    ensureProgressUI();
    clearSearchResults();

    keyword = (keyword || "").toLowerCase();
    if (!keyword) {
      removeLoadingIndicator();
      return;
    }

    // 1) Fetch ALL index counts in parallel (limited concurrency)
    const issues = Array.from(
      { length: ISSUE_END - ISSUE_START + 1 },
      (_, i) => i + ISSUE_START
    );
    const idxLimiter = createLimiter(8); // tune 6–12
    let idxDone = 0;

    const indexCounts = await Promise.all(
      issues.map((issueNumber) =>
        idxLimiter(async () => {
          if (mySearchId !== currentSearchId) return 0; // aborted
          const cacheKey = `idx_count_${issueNumber}`;
          let count = await cacheGet(cacheKey, null);
          if (count === null) {
            count = await fetchIssueIndex(issueNumber);
            await cacheSet(cacheKey, count);
          }
          idxDone++;
          updateProgress(idxDone, issues.length, "Indexing");
          return count;
        })
      )
    );

    if (mySearchId !== currentSearchId) {
      removeLoadingIndicator();
      return;
    }

    // 2) Build a list of all (issue, file) we need to check
    const fileJobs = [];
    issues.forEach((issueNumber, idx) => {
      const numFiles = indexCounts[idx] || 0;
      for (let fileNumber = 1; fileNumber <= numFiles; fileNumber++) {
        fileJobs.push({ issueNumber, fileNumber });
      }
    });

    // 3) Search files in parallel with a limit
    const fileLimiter = createLimiter(8); // tune separately if you like
    let fileDone = 0;
    const results = [];

    await Promise.all(
      fileJobs.map((job) =>
        fileLimiter(async () => {
          if (mySearchId !== currentSearchId) return;
          const text = await fetchIssueText(job.issueNumber, job.fileNumber);
          fileDone++;
          // Update progress across file scans
          updateProgress(fileDone, fileJobs.length, "Searching");

          if (text && text.toLowerCase().includes(keyword)) {
            results.push({
              issue: job.issueNumber,
              file: job.fileNumber,
              link: `https://archives.phrack.org/issues/${job.issueNumber}/${job.fileNumber}.txt`,
            });
          }
        })
      )
    );

    if (mySearchId !== currentSearchId) {
      removeLoadingIndicator();
      return;
    }

    displaySearchResults(results);
    removeLoadingIndicator();
  }

  // Count .txt files listed in an issue’s index page on the archives site
  async function fetchIssueIndex(issueNumber) {
    const indexUrl = `https://archives.phrack.org/issues/${issueNumber}/`;
    try {
      const html = await gmFetch(indexUrl); // gmFetch returns HTML string
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Robust count: accept absolute or relative hrefs
      const txtCount = Array.from(doc.querySelectorAll("a"))
        .map((a) => a.getAttribute("href") || "")
        .filter((href) => /\.txt$/i.test(href)).length;

      return txtCount;
    } catch (error) {
      console.error(`Error fetching index for issue ${issueNumber}:`, error);
      return 0;
    }
  }

  // Get the text content of a specific file
  async function fetchIssueText(issueNumber, fileNumber) {
    const url = `https://archives.phrack.org/issues/${issueNumber}/${fileNumber}.txt`;
    try {
      return await gmFetch(url); // returns text content directly
    } catch (error) {
      console.error(
        `Error fetching Issue ${issueNumber}, File ${fileNumber}:`,
        error
      );
      return null;
    }
  }

  // Function to display search results
  function displaySearchResults(results) {
    const resultsArea = document.getElementById("resultsArea");
    const resultsDiv = document.createElement("div");
    resultsDiv.innerHTML = `<h3>Search Results: <button id="clearResultsButton" style="float:right;">Clear</button></h3>`;

    if (results.length > 0) {
      results.forEach((result) => {
        resultsDiv.innerHTML += `<div><a href="${result.link}" target="_blank">Issue ${result.issue}, File ${result.file}</a></div>`;
      });
    } else {
      resultsDiv.innerHTML += "<p>No results found.</p>";
    }

    resultsArea.appendChild(resultsDiv); // Append results to the dedicated results area

    // Attach event listener to the clear button
    document
      .getElementById("clearResultsButton")
      .addEventListener("click", clearSearchResults);
  }

  // Function to clear search results
  function clearSearchResults() {
    const resultsArea = document.getElementById("resultsArea");
    resultsArea.innerHTML = ""; // Clear only the results area content
  }

  // Helper function to generate grouped issue links
  function generateGroupedIssueLinks(start, end, groupSize) {
    let groupsHtml = "";
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
    let groupsHtml = "";
    for (let i = 1; i <= end; i += groupSize) {
      let groupEnd = Math.min(i + groupSize - 1, end);
      const links = addCategoryLinks(category, i, groupEnd); // Get the links for the category

      if (links) {
        // Only display the section if there are actual links
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

  function getGroupKey(start, end) {
    return `${start}-${end}`;
  }

  function renderCategoryLinks(entries) {
    return entries
      .map(
        ([href, label]) =>
          `<li><a href="${href}" style="color: #fff;">${label}</a></li>`
      )
      .join("");
  }

  function addCategoryLinks(category, start, end) {
    const categoryGroups = CATEGORY_LINKS[category];
    if (!categoryGroups) return "";
    return renderCategoryLinks(categoryGroups[getGroupKey(start, end)] || []);
  }

  // Helper function to dynamically generate issue links
  function generateIssueLinks(start, end) {
    let links = "";
    for (let i = start; i <= end; i++) {
      links += `<li><a href="https://phrack.org/issues/${i}/1.html" style="color: #fff;">Issue ${i}</a></li>`;
    }
    return links;
  }
})();
