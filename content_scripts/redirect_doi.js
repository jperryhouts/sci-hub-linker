
const SCIHUB_DEBUG = false;

function shouldReplace(href) {
  if (!(/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+)\b/g).test(href) &&
      !(new RegExp("sciencedirect.com/science/article/pii/",'i')).test(href)) {
    if (SCIHUB_DEBUG) console.debug("Is not a recognized format", href);
    return false;
  } else if (/sci-hub/.test(href)) {
    if (SCIHUB_DEBUG) console.debug("Already a Sci-Hub URL", href);
    return false;
  } else if (href.indexOf("#") !== -1) {
    if (SCIHUB_DEBUG) console.debug("Includes a #", href);
    return false;
  }

  return true;
}

function replaceDOILinks() {
  let urlPromise = browser.runtime.sendMessage(
    { content: "get_url" }
  );

  urlPromise.then(sciHubURL => {
    const links = document.getElementsByTagName("A");
    const replaceable = [...links].filter(l => shouldReplace(l.href));
    for (let link of replaceable) {
      if (SCIHUB_DEBUG) console.debug(`Replacing link ${link.href}`);
      link.href = `${sciHubURL}/${link.href}`;

      const ravenIcon = document.createElement("img");
      ravenIcon.setAttribute(
        "src",
        browser.extension.getURL("icons/raven16.png")
      );
      ravenIcon.style.height = "0.8em";
      ravenIcon.style.display = "inline";
      ravenIcon.style.margin = "0 0.25em"
      ravenIcon.style.padding = "0";
      ravenIcon.style.verticalAlign = "baseline";
      link.appendChild(ravenIcon);
    }
  });
}

console.info("Sci-Hub: Replacing DOI links");
replaceDOILinks();
