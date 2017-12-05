let pattern = undefined;

function recompilePattern() {
  chrome.storage.sync.get('blacklist', items => {
    if (typeof items.blacklist !== 'undefined') {
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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  let validURL = typeof changeInfo.url !== 'undefined';
  let validPattern = typeof pattern !== 'undefined';
  if (validURL && validPattern && pattern.test(changeInfo.url)) {
    chrome.tabs.update(tabId, {url: 'focus.html'});
  }
});
