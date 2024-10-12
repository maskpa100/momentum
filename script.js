// Блок времени и даты
function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  document.getElementById('time').textContent = `${hours}:${minutes}:${seconds}`;

  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  document.getElementById('date').textContent = now.toLocaleDateString('ru-RU', options);
}
setInterval(updateTime, 1000);

function updateBackground() {
  const hour = new Date().getHours();
  let backgroundUrl;
  
  if (hour >= 0 && hour < 6) {
     backgroundUrl = '01.jpg';
  } else if (hour >= 6 && hour < 12) {
     backgroundUrl = '02.jpg';
  } else if (hour >= 12 && hour < 18) {
     backgroundUrl = '03.jpg';
  } else {
     backgroundUrl = '04.jpg';
  }
  document.body.style.backgroundImage = `url(images/${backgroundUrl})`;
}
updateBackground();

//Блок погоды

const API_KEY = '09f8876f2a9a473f889e7a32f777ba2f'; 

async function getWeather(city = "Краснодар") {
    try {
        const response = await fetch(`https://api.weatherbit.io/v2.0/current?city=${city}&key=${API_KEY}&lang=ru&units=metric`);
        if (!response.ok) {
            throw new Error('Сеть ошиблась');
        }
        const data = await response.json();
        if (data.data.length > 0) {
            const weatherData = data.data[0];
            document.getElementById('city').textContent = weatherData.city_name;
            document.getElementById('temp').textContent = `${Math.round(weatherData.temp)}°C`;
            document.getElementById('weather').textContent = weatherData.weather.description;
        } else {
            document.getElementById('city').textContent = 'Город не найден';
        }
    } catch (error) {
        console.error('Ошибка получения данных:', error);
    }
}

document.getElementById('city-input').addEventListener('change', function () {
    const city = this.value.trim();
    if (city) {
        getWeather(city);
    }
});

getWeather(); 

//  Блок задач
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const deleteCompletedButton = document.getElementById('deleteCompleted');

// Функция для загрузки задач из локального хранилища
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        createTaskElement(task.text, task.completed);
    });
}

// создания задачи
function createTaskElement(taskText, completed = false) {
    const li = document.createElement('li');
    li.innerHTML = `
        <input type="checkbox" ${completed ? 'checked' : ''} />
        <span>${taskText}</span>
        <button class="delete-button">Удалить</button>
    `;
    
    //  удаления задачи
    li.querySelector('.delete-button').addEventListener('click', () => {
        taskList.removeChild(li);
        saveTasks(); 
    });

    li.querySelector('input[type="checkbox"]').addEventListener('change', () => {
        saveTasks(); 
    });

    taskList.appendChild(li);
}

//  сохранения задач в локальном хранилище
function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(task => {
        const taskText = task.querySelector('span').textContent;
        const completed = task.querySelector('input[type="checkbox"]').checked;
        tasks.push({ text: taskText, completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//  add task
addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Введите задачу!');
        return;
    }

    createTaskElement(taskText); 
    taskInput.value = ''; 
    saveTasks(); 
});

// delete
deleteCompletedButton.addEventListener('click', () => {
    const completedTasks = taskList.querySelectorAll('li input[type="checkbox"]:checked');
    completedTasks.forEach(task => {
        task.parentElement.remove();
    });
    saveTasks(); 
});

// start
loadTasks();
