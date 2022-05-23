// Saves data to localStorage
function saveData(a) {
  try {
    localStorage.setItem('storageArray', JSON.stringify(a));
    return true;
  }
  catch(e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (storage && storage.length !== 0);
  };
};

// Checks if user has any data saved, if they do loads the data
function loadData() {
  if(!localStorage.getItem('storageArray')) {
    return [];
  } else {
    return JSON.parse(localStorage.getItem('storageArray'));
  };
};

export { saveData, loadData };
