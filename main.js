const colors = {
  "us-east-1": {
    country: "united-states",
    background: "linear-gradient(to right, #0000aa, #ee2244)",
    emoji: "🇺🇸",
  },
  "us-east-2": {
    country: "united-states",
    background: "linear-gradient(to right, #0000aa, #44aa44)",
    emoji: "🇺🇸",
  },
  "us-west-1": {
    country: "united-states",
    background: "linear-gradient(to right, #0000aa, #dd9900)",
    emoji: "🇺🇸",
  },
  "us-west-2": {
    country: "united-states",
    background: "linear-gradient(to right, #0000aa, #4466ee)",
    emoji: "🇺🇸",
  },
  "af-south-1": {
    country: "south-africa",
    background: "linear-gradient(to right, #aa6600, #dd0000, #008866, #334488)",
    emoji: "🇿🇦",
  },
  "ap-east-1": {
    country: "hong-kong",
    background: "linear-gradient(to right, #cc0022, #ffaabb, #cc0022)",
    emoji: "🇭🇰",
  },
  "ap-southeast-3": {
    country: "indonesia",
    background: "linear-gradient(to right, #ee0000, #dddddd)",
    emoji: "🇮🇩",
  },
  "ap-south-1": {
    country: "india",
    background: "linear-gradient(to right, #f98000, #bbbbee, #009900)",
    emoji: "🇮🇳",
  },
  "ap-northeast-3": {
    country: "japan",
    background: "linear-gradient(to right, #dddddd, #cc0044, #bb7700)",
    emoji: "🇯🇵",
  },
  "ap-northeast-2": {
    country: "south-korea",
    background: "linear-gradient(to right, #dd0022, #0000aa)",
    emoji: "🇰🇷",
  },
  "ap-southeast-1": {
    country: "singapore",
    background: "linear-gradient(to right, #eebbbb, #ff3344, #ccccaa)",
    emoji: "🇸🇬",
  },
  "ap-southeast-2": {
    country: "australia",
    background: "linear-gradient(to right, #002255, #ee3344, #000088)",
    emoji: "🇦🇺",
  },
  "ap-northeast-1": {
    country: "japan",
    background: "linear-gradient(to right, #dddddd, #dd0044, #dddddd)",
    emoji: "🇯🇵",
  },
  "ca-central-1": {
    country: "canada",
    background: "linear-gradient(to right, #ee0000, #dddddd, #ee0000)",
    emoji: "🇨🇦",
  },
  "eu-central-1": {
    country: "germany",
    background: "linear-gradient(to right, #222222, #ee4400, #dd9900)",
    emoji: "🇩🇪",
  },
  "eu-west-1": {
    country: "ireland",
    background: "linear-gradient(to right, #009955, #aaaaaa, #ee7700)",
    emoji: "🇮🇪",
  },
  "eu-west-2": {
    country: "united-kingdom",
    background: "linear-gradient(to right, #224477, #ee3344, #1166aa)",
    emoji: "🇬🇧",
  },
  "eu-south-1": {
    country: "italy",
    background: "linear-gradient(to right, #008844, #aaaaaa, #cc1133)",
    emoji: "🇮🇹",
  },
  "eu-west-3": {
    country: "france",
    background: "linear-gradient(to right, #005599, #aaaaaa, #ee2222)",
    emoji: "🇫🇷",
  },
  "eu-south-2": {
    country: "spain",
    background: "linear-gradient(to right, #cc1122, #ffbb00, #cc1122)",
    emoji: "🇪🇸",
  },
  "eu-north-1": {
    country: "sweden",
    background: "linear-gradient(to right, #0055aa, #ffcc00, #0044aa)",
    emoji: "🇸🇪",
  },
  "eu-central-2": {
    country: "switzerland",
    background: "linear-gradient(to right, #dd0033, #eeeeee, #dd0022)",
    emoji: "🇨🇭",
  },
  "me-south-1": {
    country: "bahrain",
    background: "linear-gradient(to right, #aa9999, #ee1144, #aa1133)",
    emoji: "🇧🇭",
  },
  "me-central-1": {
    country: "uae",
    background: "linear-gradient(to right, #ee0000, #009955, #aaaaaa)",
    emoji: "🇦🇪",
  },
  "sa-east-1": {
    country: "brazil",
    background: "linear-gradient(to right, #00aa55, #ffee00, #008844)",
    emoji: "🇧🇷",
  },
  global: {
    country: "global",
    background: "linear-gradient(to right, #0077dd, #119955)",
    emoji: "🌍",
  },
};

const langs = {
  ko: {
    글로벌: "Global",
  },
  jp: {
    グローバル: "Global",
  },
};

const isDebug = false;

function waitForSelector(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

// load
chrome.storage.local.get("config", (c) => {
  const config = c.config !== undefined ? c.config : {};
  if (isDebug) console.log(`config: ${JSON.stringify(config, null, 2)}`);

  waitForSelector(
    '[data-testid="more-menu__awsc-nav-regions-menu-button"]>span',
  ).then((element) => {
    // city
    let city = document.querySelector(
      '[data-testid="more-menu__awsc-nav-regions-menu-button"]>span',
    ).innerText;

    // lang
    const lang = document.documentElement.lang;
    if (langs.hasOwnProperty(lang) && langs[lang].hasOwnProperty(city)) {
      city = langs[lang][city];
      if (isDebug) console.log(`city: ${city}`);
    }

    // aws service
    let region = undefined;
    let svc = undefined;
    const re =
      /^https:\/\/([a-z0-9-]+)?(?:\.)?console\.aws\.amazon\.com\/([a-z0-9-]+)\/([a-z0-9]+(?=\/))?.*/;
    const m = re.exec(window.location.href);
    if (m !== undefined && m.length > 2) {
      if (city === "Global") {
        region = "global";
      } else {
        region = m[1];
      }
      svc = m[2];
      if (svc === "codesuite" && m.length > 3) {
        svc = m[3];
      }
    }

    if (isDebug) console.log(`region: ${region}`);
    if (isDebug) console.log(`service: ${svc}`);

    if (colors.hasOwnProperty(region)) {
      // region header background
      if (config["background"] !== "disabled") {
        document.querySelector(
          "#awsc-navigation-container>div>header>nav",
        ).style.background = colors[region]["background"];
      }

      // region flag
      if (config["flag"] !== "disabled") {
        const flag = chrome.runtime.getURL(
          `flags/${colors[region]["country"]}.png`,
        );

        const region_info = document.querySelector(
          '[data-testid="more-menu__awsc-nav-regions-menu-button"]',
        );

        region_info.children[0].insertAdjacentHTML(
          "beforeBegin",
          `<span style="font-size:1.4em;margin-right:0.6em;">${colors[region]["emoji"]}</span>`,
        );
      }
    }
  });

  waitForSelector("div[data-testid=account-detail-menu]>div>div").then(
    (element) => {
      // account_id
      const account_menu = document.querySelector(
        "div[data-testid=account-detail-menu]>div>div",
      );

      const account_id = account_menu.children[1].innerText.replaceAll("-", "");
      if (isDebug) console.log(`account_id: ${account_id}`);

      // account info
      if (
        config["info"] !== undefined &&
        config["info"][account_id] !== undefined
      ) {
        document
          .querySelector('[data-testid="awsc-nav-account-menu-button"]')
          .insertAdjacentHTML(
            "beforeBegin",
            `<span style="font-size:1.4em;margin-right:0.6em;">${config["info"][account_id]}</span>`,
          );
      }
    },
  );
});
