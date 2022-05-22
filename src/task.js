const newTaskBtn = document.querySelector('#newTaskBtn');
newTaskBtn.addEventListener('click', () => addTask());
let tasks = [];

const createTask = (task, date, priority, project) => {
    const getTask = () => task;
    const getDate = () => date;
    const getPriority = () => priority;
    const getProject = () => project;
    return {getTask, getDate, getPriority, getProject};
};

function addTask() {
  const newTaskTxt = document.querySelector('#newTaskTxt');
  const newTaskDate = document.querySelector('#newTaskDate');
  const newTaskPriority = document.querySelector('#newTaskPriority');
  const newTaskProject = document.querySelector('#newTaskProject');
  const newTask = createTask(newTaskTxt.value, newTaskDate.value, newTaskPriority.value, newTaskProject.value);
  tasks.push(newTask);
  renderTasks();
};

function renderTasks() {
  const taskDisplay = document.querySelector('#taskDisplay');
  taskDisplay.innerHTML = '';
  let id = 0;
  tasks.forEach(task => {
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
    console.log(task.getPriority());
    switch (task.getPriority()) {
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
  const taskText = document.createElement('p');
  taskText.innerText = task.getTask();
  taskItemL.appendChild(taskText);
  const taskDate = document.createElement('h6');
  taskDate.innerText = task.getDate();
  taskItemR.appendChild(taskDate);
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'deleteBtn';
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  taskItemR.appendChild(deleteBtn);
  taskDisplay.appendChild(taskItem);
  id++;
  });
};

export { renderTasks };