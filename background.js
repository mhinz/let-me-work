let blacklist = [
  "https?://twitter.com/.*"
]

let pattern = new RegExp(blacklist.join('|'));

chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    if (typeof changeInfo.url !== 'undefined' && pattern.test(changeInfo.url)) {
      console.log('Oh noes.. Twitter.');
      chrome.tabs.update(tabId, {url: 'focus.html'});
    }
  }
);
