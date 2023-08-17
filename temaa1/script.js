const completedTasksContainer = document.getElementById('completedTasks');
const uncompletedTasksContainer = document.getElementById('uncompletedTasks');
const openDialogButton = document.getElementById('openDialogButton');
const taskDialog = document.getElementById('taskDialog');
const taskForm = document.getElementById('taskForm');
const closeDialogButton = document.getElementById('closeDialogButton');

openDialogButton.addEventListener('click', () => {
    resetTaskForm();
    taskDialog.showModal();
});

closeDialogButton.addEventListener('click', () => {
    taskDialog.close();
});

// Attach the event listener for form submission
taskForm.addEventListener('submit', submitAddTask);

function resetTaskForm() {
    taskForm.title.value = '';
    taskForm.description.value = '';
    taskForm.assignee.value = '';
    taskForm.querySelector('button[type="submit"]').textContent = 'Add Task';
}

function validateFormInputs(title, description, assignee) {
    return title.length > 0 && title.length <= 50 &&
           description.length <= 250 &&
           assignee.match(/^\S+@\S+\.\S+$/);
}

function addTask(title, description, assignee) {
    const task = {
        title,
        description,
        assignee,
        completed: false
    };
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    refreshTasks();
}

function refreshTasks() {
    completedTasksContainer.innerHTML = '';
    uncompletedTasksContainer.innerHTML = '';
    
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        
        taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Assignee: ${task.assignee}</p>
            <button class="completeButton" data-index="${index}">${task.completed ? 'Uncomplete' : 'Complete'}</button>
            <button class="editButton" data-index="${index}">Edit</button>
            <button class="deleteButton" data-index="${index}">Delete</button>
        `;
        
        if (task.completed) {
            taskElement.classList.add('completed');
            completedTasksContainer.appendChild(taskElement);
        } else {
            uncompletedTasksContainer.appendChild(taskElement);
        }
        
        taskElement.querySelector('.completeButton').addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            refreshTasks();
        });

        taskElement.querySelector('.editButton').addEventListener('click', () => {
            editTask(index);
        });
        
        taskElement.querySelector('.deleteButton').addEventListener('click', () => {
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            refreshTasks();
        });
    });
}

function editTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks[index];

    taskForm.title.value = task.title;
    taskForm.description.value = task.description;
    taskForm.assignee.value = task.assignee;
    taskForm.querySelector('button[type="submit"]').textContent = 'Save Changes';

    taskDialog.showModal();

    taskForm.removeEventListener('submit', submitAddTask);
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const newTitle = event.target.title.value;
        const newDescription = event.target.description.value;
        const newAssignee = event.target.assignee.value;

        if (validateFormInputs(newTitle, newDescription, newAssignee)) {
            tasks[index].title = newTitle;
            tasks[index].description = newDescription;
            tasks[index].assignee = newAssignee;

            localStorage.setItem('tasks', JSON.stringify(tasks));
            refreshTasks();
            taskDialog.close();
        } else {
            alert('Please fill in the form correctly.');
        }
    });
}

function submitAddTask(event) {
    event.preventDefault();

    const title = event.target.title.value;
    const description = event.target.description.value;
    const assignee = event.target.assignee.value;

    if (validateFormInputs(title, description, assignee)) {
        addTask(title, description, assignee);
        taskDialog.close();
    } else {
        alert('Please fill in the form correctly.');
    }
}

refreshTasks();
