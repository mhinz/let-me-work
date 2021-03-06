function addToStorage(pattern) {
  chrome.storage.sync.get('blacklist', items => {
    if (typeof items.blacklist === 'undefined') {
      chrome.storage.sync.set({blacklist: [pattern]});
    } else {
      items.blacklist.splice(0, 0, pattern);
      items.blacklist.sort();
      chrome.storage.sync.set({blacklist: items.blacklist});
    }
  });
  chrome.runtime.sendMessage('recompile');
}

function removeFromStorage(pattern) {
  chrome.storage.sync.get('blacklist', items => {
    chrome.storage.sync.set({
      blacklist: items.blacklist.filter(e => e !== pattern)
    });
  });
  chrome.runtime.sendMessage('recompile');
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

function setupInput() {
  let input = document.getElementsByTagName('input')[0];
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    input.value = tabs[0].url;
  });

  input.addEventListener('keydown', event => {
    if (event.keyCode === 13) {
      addToStorage(input.value);
      addToPopup(input.value);
      input.value = '';
    }
  });
}

function setupBlacklist() {
  let table = document.getElementsByTagName('table')[0];

  chrome.storage.sync.get('blacklist', items => {
    if (typeof items.blacklist !== 'undefined') {
      for (const pattern of items.blacklist) {
        table.appendChild(addRow(pattern));
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupInput();
  setupBlacklist();
});
