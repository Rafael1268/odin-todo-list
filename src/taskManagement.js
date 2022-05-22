import { renderTask } from './render';

const taskFieldSubmit = document.querySelector('#newTaskBtn');
const sortByField = document.querySelector('#sortBy');
const searchBarField = document.querySelector('#searchbar');

taskFieldSubmit.addEventListener('click', () => addTask());
sortByField.addEventListener('change', () => renderTasks());
searchBarField.addEventListener('change', () => renderTasks());

let taskArray = [];
let sortedArray = [];

function CreateTask(task, date, priority, project, taskId) {
  this.task = task
  this.date = date
  this.priority = priority
  this.project = project
  this.taskId = taskId
};

// Add a new task to the taskArray
function addTask() {
  const newTaskTxt = document.querySelector('#newTaskTxt');
  const newTaskDate = document.querySelector('#newTaskDate');
  const newTaskPriority = document.querySelector('#newTaskPriority');
  const newTaskProject = document.querySelector('#newTaskProject');
  const newTask = new CreateTask(newTaskTxt.value, newTaskDate.value, newTaskPriority.value, newTaskProject.value, taskArray.length);
  taskArray.push(newTask);
  renderTasks();
};

// Removes task 
function removeTask(e) {
  const targetId = Number(e.target.parentElement.parentElement.parentElement.id);
  const matchesId = (task) => task.taskId === targetId;
  const taskIndex = taskArray.findIndex(matchesId);
  if (taskIndex === -1) return;
  taskArray.splice(taskIndex, 1);
  downArrayIds(targetId);
  downElementIds(targetId);
  renderTasks();
};

// Lower each task id by 1 if it's higher than the id of the task deleted
function downArrayIds(num) {
  taskArray.forEach(task => {
    if(num < task.taskId) {
      task.taskId = task.taskId - 1;
      return;
    } else return;
  });
};

// Lower each element id by 1 if it'd higher than the id of the element deleted
function downElementIds(num) {
  const allElements = document.querySelectorAll('div.taskItem');
  allElements.forEach(element => {
    if(num < element.id) {
      element.id = element.id - 1;
      return;
    } else return;
  });
};

// Renders all the tasks
function renderTasks() {
  console.log(taskArray)
  const taskDisplay = document.querySelector('#taskDisplay');
  checkSortBy();
  searchTasks();
  taskDisplay.innerHTML = '';
  sortedArray.forEach(task => {
    renderTask(task);
  });
};

// Checks if user has anything typed in the search bar and if they do, filters the tasks correctly.
function searchTasks() {
  if (searchBarField.value === '') {
    sortedArray = taskArray;
  };
  const searched = taskArray.filter(task => task.task.toLowerCase().includes(searchBarField.value.toLowerCase()));
  sortedArray = searched;
}

// Checks what is should sort by and calls the correct function
function checkSortBy() {
  const sortByValue = document.querySelector('#sortBy').value;
  switch (sortByValue) {
    case 'dateDown':
      sortDateDown();
      break;
    case 'dateUp':
      sortDateUp();
      break;
    case 'priorDown':
      sortPriorDown();
      break;
    case 'priorUp':
      sortPriorUp();
      break;
  };
};

// Sorts by date going from most recent to last
function sortDateDown() {
  taskArray.sort((a, b) => {
    return a.taskId - b.taskId
  });
};

// Sorts by date doing from last to most recent
function sortDateUp() {
  taskArray.sort((a, b) => {
    return b.taskId - a.taskId
  });
};

// Sorts by priority from highest to lowest
function sortPriorDown() {
  taskArray.sort((a, b) => {
    return a.priority - b.priority;
  });
};

// Sorts by priority from lowest to highest
function sortPriorUp() {
  taskArray.sort((a, b) => {
    return b.priority - a.priority;
  });
};

export { renderTasks, removeTask };