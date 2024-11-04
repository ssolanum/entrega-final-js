document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromJSON(); 
    document.getElementById('addTaskButton').addEventListener('click', addTask);
});

const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// carga tareas desde un archivo JSON simulado
async function loadTasksFromJSON() {
    try {
        const response = await fetch('tasks.json'); // archivo JSON con tareas simuladas
        const tasks = await response.json();
        tasks.forEach(task => addTaskToDOM(task));
    } catch (error) {
        console.error("Error al cargar las tareas:", error);
    }
}

// agregar una tarea
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        Swal.fire('Por favor, ingresa una tarea.'); // SweetAlert2 para mostrar alertas
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    addTaskToDOM(task);
    saveTaskToLocalStorage(task);
    taskInput.value = '';
}

// agregar tarea al DOM
function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.textContent = task.text;
    li.setAttribute('data-id', task.id);
    li.classList.toggle('completed', task.completed);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(deleteButton);
    taskList.appendChild(li);
}

// guardar en LocalStorage
function saveTaskToLocalStorage(task) {
    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// obtiene tareas del LocalStorage
function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// eliminr tarea del DOM y LocalStorage
function deleteTask(taskId) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.querySelector(`[data-id="${taskId}"]`).remove();
}