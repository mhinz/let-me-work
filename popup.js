function addToStorage(pattern) {
  chrome.storage.sync.get('blacklist', items => {
    if (typeof items.blacklist === 'undefined') {
      chrome.storage.sync.set({blacklist: [pattern]});
    } else {
      items.blacklist.splice(0, 0, pattern);
      items.blacklist.sort;
      chrome.storage.sync.set({blacklist: items.blacklist});
    }
  });
}

function removeFromStorage(pattern) {
  chrome.storage.sync.get('blacklist', items => {
    chrome.storage.sync.set({
      blacklist: items.blacklist.filter(e => e !== pattern)
    });
  });
}

function addToPopup(pattern) {
  let table = document.getElementsByTagName('table')[0];
  table.appendChild(addRow(pattern));
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

function addRow(pattern) {
  let row = document.createElement('tr');
  // let row = table.insertRow(i);
  let cell = row.insertCell(0);
  cell.width = '100%';
  cell.innerHTML = pattern;
  let button = document.createElement('button');
  button.innerHTML = 'dump';
  button.addEventListener('click', () => {
    removeFromPopup(pattern);
    removeFromStorage(pattern);
  });
  row.insertCell(1).appendChild(button);

  return row;
}

function createBlacklist() {
  let table = document.createElement('table');
  chrome.storage.sync.get('blacklist', items => {
    if (typeof items.blacklist !== 'undefined') {
      for (let i = 0; i < items.blacklist.length; i++) {
        table.appendChild(addRow(items.blacklist[i]));
      }
    }
  });
  return table;
}

document.addEventListener('DOMContentLoaded', () => {
  let input = document.createElement('input');
  input.addEventListener('keydown', event => {
    if (event.keyCode === 13) {
      addToStorage(input.value);
      addToPopup(input.value);
      input.value = '';
    }
  });
  document.body.appendChild(input);
  document.body.appendChild(createBlacklist());
});
