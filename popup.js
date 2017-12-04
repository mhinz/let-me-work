let arr = ['foo', 'bar', 'quux'];
chrome.storage.sync.set({"blacklist": arr});

function createTable() {
  chrome.storage.sync.get('blacklist', (items) => {
    window.console.log(items);
    let table = document.getElementsByTagName('table')[0];

    for (i = 0; i < items.blacklist.length; i++) {
      let row = table.insertRow(i);
      let cell = row.insertCell(0);
      cell.width = '100%';
      cell.innerHTML = items.blacklist[i];
      row.insertCell(1).innerHTML = '<button type="button">dump</button>'
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  createTable();
});
