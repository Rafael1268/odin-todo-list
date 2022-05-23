import { removeTask, taskDoneToggle, changeFilterBy, expandTask } from './taskManagement';

const taskFieldBtn = document.querySelector('#addTaskBtn');
const taskField = document.querySelector('.newTask');
const newProjectBtn = document.querySelector('#newProject');
const projectField = document.querySelector('.newProjectForm');
const taskExpandClose = document.querySelector('#taskExpandClose');
const taskExpandPopup = document.querySelector('.taskExpandContainer');

taskFieldBtn.addEventListener('click', () => taskField.classList.toggle('hideTaskField'));
newProjectBtn.addEventListener('click', () => projectField.classList.toggle('hideProjectField'));
taskExpandClose.addEventListener('click', () => taskExpandPopup.classList.add('hideTaskExpand'));

// Renders a single task
function renderTask(task) {
  const taskItem = document.createElement('div');
  taskItem.className = 'taskItem';
  taskItem.id = task.taskId;
  const taskItemL = document.createElement('div');
  taskItemL.className = 'taskItemL';
  taskItem.appendChild(taskItemL);
  const taskItemR = document.createElement('div');
  taskItemR.className = 'taskItemR';
  taskItem.appendChild(taskItemR);
  const taskDoneBtn = document.createElement('button');
  taskDoneBtn.classList.add('taskDoneBtn');
  switch (task.priority) {
    case '1':
      taskDoneBtn.classList.add('prior1');
      break;
    case '2':
      taskDoneBtn.classList.add('prior2');
      break;
    case '3':
      taskDoneBtn.classList.add('prior3');
      break;
  };
  taskItemL.appendChild(taskDoneBtn);
  taskDoneBtn.addEventListener('click', () => taskDoneToggle(event));
  const taskText = document.createElement('p');
  taskText.innerText = task.task;
  taskItemL.appendChild(taskText);
  if (task.taskDone === true) {
    taskDoneBtn.classList.add('taskDone');
    taskText.classList.add('taskComplete');
  };
  const taskDate = document.createElement('h6');
  taskDate.innerText = task.date;
  taskItemR.appendChild(taskDate);
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'deleteBtn';
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  taskItemR.appendChild(deleteBtn);
  deleteBtn.addEventListener('click', () => removeTask(event));
  taskDisplay.appendChild(taskItem);
  taskItem.addEventListener('click', () => expandTask(event));
};

// Renders the popup that shows more info about a task
function renderTaskExpand(name, desc, date, prior, project) {
  const expandName = document.querySelector('#expandName');
  expandName.innerText = name;
  const expandDesc = document.querySelector('#expandDesc');
  if (desc === '') {
    expandDesc.innerText = 'No Description Set';
  } else {
    expandDesc.innerText = desc;
  };
  const expandDate = document.querySelector('#expandDate');
  if (date === '') {
    expandDate.innerText = 'No Date Set';
  } else {
    expandDate.innerText = date;
  };
  const expandPrior = document.querySelector('#expandPrior');
  expandPrior.innerText = prior;
  const expandProject = document.querySelector('#expandProject');
  if (project === '') {
    expandProject.innerText = 'No Project Set'
  } else {
    expandProject.innerText = project;
  };
};

// Renders a single project
function renderProject(project) {
  const projectDisplay = document.querySelector('#projectsDisplay');
  const projectBtn = document.createElement('button');
  projectBtn.className = 'sidebarBtn'
  projectBtn.innerHTML = `<i class="fa-solid fa-folder fa-fw"></i> ${project.project}`
  projectDisplay.appendChild(projectBtn);
  projectBtn.addEventListener('click', () => changeFilterBy(event));
  const newTaskProjectList = document.querySelector('#newTaskProject');
  const newOption = document.createElement('option');
  newOption.value = project.project;
  newOption.innerText = project.project;
  newTaskProjectList.appendChild(newOption);
};

export { renderTask, renderTaskExpand, renderProject };