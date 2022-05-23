import { renderTask, renderTaskExpand, renderProject } from './render';
import { saveTasks, loadTasks, saveProjects, loadProjects } from './storeData';
import { isThisWeek, isToday, parseISO } from 'date-fns';

const taskFieldSubmit = document.querySelector('#newTaskBtn');
const sortByField = document.querySelector('#sortBy');
const searchBarField = document.querySelector('#searchbar');
const sidebarButtons = document.querySelectorAll('button.sidebarBtn')
const newProjectDone = document.querySelector('#newProjectDone');

taskFieldSubmit.addEventListener('click', () => addTask());
sortByField.addEventListener('change', () => renderTasks());
searchBarField.addEventListener('change', () => renderTasks());
sidebarButtons.forEach(button => button.addEventListener('click', () => changeFilterBy(event)));
newProjectDone.addEventListener('click', () => addProject());

let taskArray = [];
let filteredArray = [];
let sortedArray = [];
let filterBy = 'all'
let projectArray = [];

// Loads saved data, then renders the data
const loadedTasks = loadTasks();
taskArray = loadedTasks;
renderTasks();
const loadedProjects = loadProjects();
projectArray = loadedProjects;
renderProjects();

function CreateTask(task, description, date, priority, project, taskId) {
  this.task = task
  this.description = description
  this.date = date
  this.priority = priority
  this.project = project
  this.taskId = taskId
  this.taskDone = false;
};

function CreateProject(project, projectId) {
  this.project = project
  this.projectId = projectId
};

// Add a new task to the taskArray
function addTask() {
  const newTaskTxt = document.querySelector('#newTaskTxt');
  const newTaskDesc = document.querySelector('#newTaskDesc');
  const newTaskDate = document.querySelector('#newTaskDate');
  const newTaskPriority = document.querySelector('#newTaskPriority');
  const newTaskProject = document.querySelector('#newTaskProject');
  const taskField = document.querySelector('.newTask');
  const newTask = new CreateTask(newTaskTxt.value, newTaskDesc.value, newTaskDate.value, newTaskPriority.value, newTaskProject.value, taskArray.length);
  taskArray.push(newTask);
  console.log(newTask.taskId);
  saveTasks(taskArray);
  taskField.classList.toggle('hideTaskField');
  renderTasks();
};

// Add a new project to the projectArray
function addProject() {
  const newProjectTxt = document.querySelector('#newProjectTxt');
  const projectField = document.querySelector('.newProjectForm');
  if (projectArray.find(project => project.project === newProjectTxt.value) !== undefined) return;
  const newProject = new CreateProject(newProjectTxt.value, projectArray.length);
  projectArray.push(newProject);
  saveProjects(projectArray);
  projectField.classList.toggle('hideProjectField')
  renderProjects();
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
  saveTasks(taskArray);
  renderTasks();
};

// Shows a popup which gives more info about the task
function expandTask(e) {
  if (e.target.tagName === 'BUTTON' || e.target.tagName === 'I') return;
  let targetId;
  if (e.target.tagName !== 'DIV') {
    targetId = e.target.parentElement.parentElement.id;
  } else {
    targetId = e.target.id;
  };
  const index = taskArray.findIndex(task => task.taskId === Number(targetId));
  if (index === -1) return;
  const t = taskArray[index];
  renderTaskExpand(t.task, t.description, t.date, t.priority, t.project);
  const taskExpandPopup = document.querySelector('.taskExpandContainer');
  taskExpandPopup.classList.remove('hideTaskExpand');
};

// Toggles if the task is done or not
function taskDoneToggle(e) {
  const targetId = Number(e.target.parentElement.parentElement.id);
  const matchesId = (task) => task.taskId === targetId;
  const taskIndex = taskArray.findIndex(matchesId);
  if (taskIndex === -1) return;
  if (taskArray[taskIndex].taskDone === false) {
    taskArray[taskIndex].taskDone = true;
  } else {
    taskArray[taskIndex].taskDone = false;
  };
  saveTasks(taskArray);
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
  const taskDisplay = document.querySelector('#taskDisplay');
  checkSortBy();
  checkFilterBy();
  searchTasks();
  taskDisplay.innerHTML = '';
  sortedArray.forEach(task => {
    renderTask(task);
  });
};

// Renders all the projects
function renderProjects() {
  const projectDisplay = document.querySelector('#projectsDisplay');
  const newTaskProjectList = document.querySelector('#newTaskProject');
  projectDisplay.innerHTML = '';
  newTaskProjectList.innerHTML = '';
  projectArray.forEach(project => renderProject(project));
};

// Checks if user has anything typed in the search bar and if they do, filters the tasks correctly.
function searchTasks() {
  if (searchBarField.value === '') {
    sortedArray = filteredArray;
  };
  const searched = filteredArray.filter(task => task.task.toLowerCase().includes(searchBarField.value.toLowerCase()));
  sortedArray = searched;
}

// Changes what the tasks are filtered by
function changeFilterBy(e) {
  switch (e.target.textContent) {
    case ' All Tasks':
      filterBy = 'all';
      break;
    case ' Today':
      filterBy = 'today';
      break;
    case ' This Week':
      filterBy = 'week';
      break;
    default:
      filterBy = e.target.textContent;
      break;
  };
  renderTasks();
 };

 // Checks what tasks should be filtered by and calls the correct function
function checkFilterBy() {
  const filterTxt = document.querySelector('#currentFilter');
  switch (filterBy) {
    case 'all':
      filterTxt.innerText = 'All Tasks';
      filterByAll();
      break;
    case 'today':
      filterTxt.innerText = 'Due Today';
      filterByToday();
      break;
    case 'week':
      filterTxt.innerText = 'Due This Week';
      filterByWeek();
      break;
    default:
      filterTxt.innerText = filterBy;
      filterByProject();
      break;
  };
};

// Shows all tasks
function filterByAll() {
  filteredArray = taskArray;
};

// Shows tasks with a due date of today
function filterByToday() {
  const filterToday = taskArray.filter(task => {
    const parsedDate = parseISO(task.date);
    return isToday(parsedDate);
  });
  filteredArray = filterToday;
};

// Shows tasks with a due date that is this week
function filterByWeek() {
  const filterWeek = taskArray.filter(task => {
    const parsedDate = parseISO(task.date);
    return isThisWeek(parsedDate);
  });
  filteredArray = filterWeek;
};

// Shows tasks that are in a certain project
function filterByProject() {
  const filterProject = taskArray.filter(task => {
    const slicedStr = filterBy.slice(1);
    return task.project === slicedStr;
  });
  filteredArray = filterProject;
};

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

export { renderTasks, removeTask, taskDoneToggle, changeFilterBy, expandTask };