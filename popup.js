let arr = ['foo', 'bar', 'quux'];
chrome.storage.sync.set({"blacklist": arr});

function removeFromStorage(blacklist, pattern) {
  chrome.storage.sync.set({'blacklist': blacklist.filter(e => e !== pattern)});
}

function removeFromPopup(pattern) {
  let table = document.getElementsByTagName('table')[0];
  for (let i = 0; i < table.rows.length; i++) {
    if (table.rows[i].cells[0].innerHTML === pattern) {
      table.deleteRow(i);
      return;
    }
  }
}

function createTable() {
  chrome.storage.sync.get('blacklist', (items) => {
    let table = document.getElementsByTagName('table')[0];

    for (let i = 0; i < items.blacklist.length; i++) {
      let row = table.insertRow(i);
      let cell = row.insertCell(0);
      cell.width = '100%';
      cell.innerHTML = items.blacklist[i];
      let button = document.createElement('button');
      button.innerHTML = 'dump';
      button.addEventListener('click', () => {
        removeFromPopup(items.blacklist[i]);
        removeFromStorage(items.blacklist, items.blacklist[i]);
      });
      row.insertCell(1).appendChild(button);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  createTable();
});
