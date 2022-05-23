// Saves tasks to localStorage
function saveTasks(a) {
  try {
    localStorage.setItem('tasksArray', JSON.stringify(a));
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

// Checks if user has any tasks saved, if they do loads the tasks
function loadTasks() {
  if(!localStorage.getItem('tasksArray')) {
    return [];
  } else {
    return JSON.parse(localStorage.getItem('tasksArray'));
  };
};

// Saves projects to localStorage
function saveProjects(a) {
  try {
    localStorage.setItem('projectsArray', JSON.stringify(a));
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

// Checks if user has any projects saved, if they do loads projects
function loadProjects() {
  if(!localStorage.getItem('projectsArray')) {
    return [];
  } else {
    return JSON.parse(localStorage.getItem('projectsArray'));
  };
};

// Clears storage
function clearStorage() {
  localStorage.clear();
};

export { saveTasks, loadTasks, saveProjects, loadProjects, clearStorage };
