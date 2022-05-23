import { renderTask, renderTaskExpand, renderTaskEdit, renderProject } from './render';
import { saveTasks, loadTasks, saveProjects, loadProjects } from './storeData';
import { formatISO, isPast, isThisWeek, isToday, lightFormat, parseISO } from 'date-fns';

const taskFieldSubmit = document.querySelector('#newTaskBtn');
const sortByField = document.querySelector('#sortBy');
const searchBarField = document.querySelector('#searchbar');
const sidebarButtons = document.querySelectorAll('button.sidebarBtn')
const newProjectDone = document.querySelector('#newProjectDone');
const deleteProject = document.querySelector('.deleteProject');

taskFieldSubmit.addEventListener('click', () => addTask());
sortByField.addEventListener('change', () => renderTasks());
searchBarField.addEventListener('change', () => renderTasks());
sidebarButtons.forEach(button => button.addEventListener('click', () => changeFilterBy(event)));
newProjectDone.addEventListener('click', () => addProject());
deleteProject.addEventListener('click', () => removeProject(event));

let taskArray = [];
let filteredArray = [];
let sortedArray = [];
let filterBy = 'all'
let projectArray = [];
let currentEdit = '';

const scaleUpAnimation = [
  { transform: 'scale(0)' },
  { transform: 'scale(1)' }
];

const scaleDownAnimation = [
  { transform: 'scale(1)' },
  { transform: 'scale(0)' }
];

// Loads saved data, then renders the data
const loadedTasks = loadTasks();
taskArray = loadedTasks;
renderTasks();
const loadedProjects = loadProjects();
projectArray = loadedProjects;
if (!loadedProjects[0]) {
  const defaultProjectSelection = new CreateProject('None');
  projectArray.unshift(defaultProjectSelection);
};
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

function CreateProject(project) {
  this.project = project
};

// Add a new task to the taskArray
function addTask() {
  const newTaskTxt = document.querySelector('#newTaskTxt');
  const newTaskDesc = document.querySelector('#newTaskDesc');
  const newTaskDate = document.querySelector('#newTaskDate');
  const newTaskPriority = document.querySelector('#newTaskPriority');
  const newTaskProject = document.querySelector('#newTaskProject');
  const taskField = document.querySelector('.newTask');
  if (newTaskTxt.value === '') return alert('Please fill in the "Task Name" field');
  const newTask = new CreateTask(newTaskTxt.value, newTaskDesc.value, newTaskDate.value, newTaskPriority.value, newTaskProject.value, taskArray.length);
  taskArray.push(newTask);
  saveTasks(taskArray);
  taskField.classList.toggle('hideTaskField');
  renderTasks();
};

// Add a new project to the projectArray
function addProject() {
  const newProjectTxt = document.querySelector('#newProjectTxt');
  const projectField = document.querySelector('.newProjectForm');
  if (newProjectTxt.value === '') return alert('Please fill in the "Project Name" field');
  if (projectArray.find(project => project.project === newProjectTxt.value) !== undefined) return alert('That project already exists');
  const newProject = new CreateProject(newProjectTxt.value);
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

// Removes project
function removeProject(e) {
  const text = e.target.parentElement.parentElement.firstElementChild.textContent;
  const projectText = text.slice(1);
  const projectIndex = projectArray.findIndex(project => project.project === projectText);
  if (projectIndex === -1) return;
  projectArray.splice(projectIndex, 1);
  taskArray.forEach(task => {
    if (task.project === projectText) {
      task.project = '';
    } else return;
  });
  filterBy = 'all';
  saveProjects(projectArray);
  saveTasks(taskArray);
  renderTasks();
  renderProjects();
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
  const taskExpand = document.querySelector('.taskExpand');
  taskExpand.animate(scaleUpAnimation, 250);
};

// Shows a popup which lets you edit the task
function editTaskPopup(e) {
  const targetId = e.target.parentElement.parentElement.parentElement.id;
  const index = taskArray.findIndex(task => task.taskId === Number(targetId));
  if (index === -1) return;
  const t = taskArray[index];
  currentEdit = taskArray[index];
  renderTaskEdit(t.task, t.description, t.date, t.priority, t.project, projectArray);
  const taskEdit = document.querySelector('.taskEditContainer');
  taskEdit.classList.remove('hideTaskExpand');
  const taskEditField = document.querySelector('.taskEditField');
  taskEditField.animate(scaleUpAnimation, 250);
};

// Edits a task
function editTask() {
  const editName = document.querySelector('#editName');
  const editDesc = document.querySelector('#editDesc');
  const editDate = document.querySelector('#editDate');
  const editPrior = document.querySelector('#editPrior');
  const editProject = document.querySelector('#editProject');
  currentEdit.task = editName.value;
  currentEdit.description = editDesc.value;
  currentEdit.date = editDate.value;
  currentEdit.priority = editPrior.value;
  currentEdit.project = editProject.value;
  saveTasks(taskArray);
  renderTasks();
  const taskEdit = document.querySelector('.taskEditContainer');
  const taskEditField = document.querySelector('.taskEditField');
  taskEditField.animate(scaleDownAnimation, 150);
  setTimeout(function(){
    taskEdit.classList.add('hideTaskExpand')
  }, 150);
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
    case ' Past Due':
      filterBy = 'past';
      break;
    case ' None':
      filterBy = ' None';
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
      deleteProject.classList.add('hideDeleteProject');
      filterByAll();
      break;
    case 'today':
      filterTxt.innerText = 'Due Today';
      deleteProject.classList.add('hideDeleteProject');
      filterByToday();
      break;
    case 'week':
      filterTxt.innerText = 'Due This Week';
      deleteProject.classList.add('hideDeleteProject');
      filterByWeek();
      break;
    case 'past':
      filterTxt.innerText = 'Past Due';
      deleteProject.classList.add('hideDeleteProject');
      filterByPast();
      break;
    case ' None':
      filterTxt.innerText = 'Tasks Without A Project';
      deleteProject.classList.add('hideDeleteProject');
      filterByProject();
      break;
    default:
      filterTxt.innerText = filterBy;
      deleteProject.classList.remove('hideDeleteProject');
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

// Shows tasks with a due date that has passed
function filterByPast() {
  const filterPast = taskArray.filter(task => {
    const parsedDate = parseISO(task.date);
    return isPast(parsedDate);
  });
  filteredArray = filterPast;
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

export { renderTasks, removeTask, taskDoneToggle, changeFilterBy, expandTask, editTask, editTaskPopup };