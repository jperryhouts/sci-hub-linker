
const SCIHUB_DEBUG = false;

const SciHubLinker = {
  // Default fallback URL
  URL: "https://sci-hub.se/",

  async proxyFetch (url, cors_proxy) {
    // cors_proxy = "https://cors-anywhere.herokuapp.com/";
    cors_proxy = (cors_proxy||"");
    const options = {
      method: 'GET', cache: 'no-cache', credentials: 'omit',
      redirect: 'follow', referrerPolicy: 'no-referrer',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    };
    const content = await fetch(
      cors_proxy + url,
      options
    ).then(response => response.text());

    return content||"";
  },

  init() {
    this.proxyFetch(
      "https://en.wikipedia.org/wiki/Sci-Hub"
    ).then(content => {
      const matches = content.match(/sci-hub\.[a-zA-Z]*/g);
      const uniqMatches = matches.filter((v, i, a) => a.indexOf(v) === i);
      const validMatches = uniqMatches.filter(v => !/sci-hub.org/.test(v))
      const URLS = validMatches.map(v => `https://${v}/`);

      if (URLS.length > 0) {
        console.log(`SciHub: Found URL options: [${URLS.join(", ")}].`);
        this.URL = URLS[0];
      } else {
        console.warn("Unable to find active Sci-Hub URL. Falling back to unverified default.");
      }
      console.info(`Using Sci-Hub URL: ${this.URL}`);
    }).catch(err => {
      console.error("Unable to find active Sci-Hub URL.", err);
    });
  }
}

browser.browserAction.onClicked.addListener(async () => {
  // Get current path
  const tabs = await browser.tabs.query({currentWindow: true, active: true})

  if(tabs.length > 0) {
    const current_active_url = tabs[0].url;

    browser.tabs.create({
      url: `${SciHubLinker.URL}/${current_active_url}`
    });
  } else {
    console.error("Unable to get current URL.")
  }
});

browser.runtime.onMessage.addListener((request, message, sendResponse) => {
  if (request.content === "get_url") {
    if (SCIHUB_DEBUG) console.debug(`Sending SciHub url from background.js ${SciHubLinker.URL}`);
    sendResponse(SciHubLinker.URL);
  } else {}
});

SciHubLinker.init();
