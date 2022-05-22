const newTaskBtn = document.querySelector('#newTaskBtn');
newTaskBtn.addEventListener('click', () => addTask());
const addTaskBtn = document.querySelector('#addTaskBtn');
addTaskBtn.addEventListener('click', () => addTaskField());
const sortBy = document.querySelector('#sortBy');
sortBy.addEventListener('change', () => renderTasks());
const searchBar = document.querySelector('#searchbar');
searchBar.addEventListener('change', () => renderTasks());
let tasks = [];

function CreateTask(task, date, priority, project) {
  this.task = task
  this.date = date
  this.priority = priority
  this.project = project
  this.taskDone = false
  this.toggleDone = () => {
    if(this.taskDone === false) {
      this.taskDone = true;
    } else {
      this.taskDone = false;
    };
  };
};

function addTask() {
  const newTaskField = document.querySelector('.newTask');
  const newTaskTxt = document.querySelector('#newTaskTxt');
  const newTaskDate = document.querySelector('#newTaskDate');
  const newTaskPriority = document.querySelector('#newTaskPriority');
  const newTaskProject = document.querySelector('#newTaskProject');
  const newTask = new CreateTask(newTaskTxt.value, newTaskDate.value, newTaskPriority.value, newTaskProject.value);
  tasks.push(newTask);
  renderTasks();
  newTaskField.id = 'hideNewTaskField';
};

function addTaskField() {
  const newTaskField = document.querySelector('.newTask');
  if (newTaskField.id === 'hideNewTaskField') {
    newTaskField.removeAttribute('id');
  } else {
    newTaskField.id = 'hideNewTaskField';
  };
};

function renderTasks() {
  if (tasks.length === 0) return;
  const taskDisplay = document.querySelector('#taskDisplay');
  taskDisplay.innerHTML = '';
  let id = 0;
  const searchedTasks = checkSearch();
  const sortedTasks = checkSortBy(searchedTasks);
  sortedTasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = 'taskItem';
    taskItem.id = id;
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
  taskDoneBtn.addEventListener('click', () => taskDone(event));
  const taskText = document.createElement('p');
  taskText.innerText = task.task;
  taskItemL.appendChild(taskText);
  const taskDate = document.createElement('h6');
  taskDate.innerText = task.date;
  taskItemR.appendChild(taskDate);
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'deleteBtn';
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  taskItemR.appendChild(deleteBtn);
  deleteBtn.addEventListener('click', () => deleteTask(event));
  taskDisplay.appendChild(taskItem);
  id++;
  });
};

function checkSortBy(a) {
  switch (sortBy.value) {
    case 'dateDown':
      return a;
    case 'dateUp':
      return a.slice().reverse();
    case 'priorDown':
      const sortPriorDown = a.slice().sort((a, b) => {
        return a.priority - b.priority;
      });
      return sortPriorDown;
    case 'priorUp':
      const sortPriorUp = a.slice().sort((a, b) => {
        return b.priority - a.priority;
      });
      return sortPriorUp;
  };
};

function checkSearch() {
  if (searchBar.value === '') {
    return tasks;
  };
  return tasks.filter(task => task.task.includes(searchBar.value));
};

function deleteTask(e) {
  const id = e.srcElement.parentElement.parentElement.id;
  tasks.splice(id, 1);
  renderTasks();
};

function taskDone(e) {
  const id = e.srcElement.parentElement.parentElement.id;
  console.log(tasks[id].taskDone);
  if (tasks[id].taskDone === false) {
    tasks[id].toggleDone();
    e.target.classList.add('taskDone');
    e.srcElement.nextElementSibling.classList.add('taskComplete');
  } else {
    tasks[id].toggleDone();
    e.target.classList.remove('taskDone');
    e.srcElement.nextElementSibling.classList.remove('taskComplete');
  };
};

export { renderTasks };