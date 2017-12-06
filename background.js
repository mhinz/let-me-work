function recompilePattern() {
  chrome.storage.sync.get('blacklist', items => {
    if (typeof items.blacklist === 'undefined' || items.blacklist.length === 0) {
      pattern = undefined;
    } else {
      pattern = new RegExp(items.blacklist.join('|'));
    }
  });
}

recompilePattern();

chrome.runtime.onMessage.addListener((req, sender, sendReponse) => {
  if (req === 'recompile') {
    recompilePattern();
  }
});

chrome.webNavigation.onBeforeNavigate.addListener(details => {
  let validURL = typeof details.url !== 'undefined';
  let validPattern = typeof pattern !== 'undefined';
  if (validURL && validPattern && pattern.test(details.url)) {
    chrome.tabs.update(details.tabId, {url: 'focus.html'});
  }
});
