import { removeTask, taskDoneToggle } from './taskManagement';

const taskFieldBtn = document.querySelector('#addTaskBtn');
const taskField = document.querySelector('.newTask');

taskFieldBtn.addEventListener('click', () => taskField.classList.toggle('hideTaskField'));

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
};

export { renderTask };