
 fetch("https://davids-productivity-server.herokuapp.com/image")
 .then(response=>response.json())
 .then(data=>{
  console.log(data)
    document.body.style.backgroundImage =`url(${data.urls.full})`;
    
    document.getElementById('image-location').innerText=
       `${data.location.country!=null?data.location.country:''}`;
        
  })
.catch(err=> {
    //default background image
    document.body.style.backgroundImage =`url("/kalen-emsley-Bkci_8qcdvQ-unsplash.jpg")`;

})

//clock script

const currTime=()=> {
    let date= new Date();
    let hh=date.getHours();
    let mm=date.getMinutes();
    hh = (hh<10)? "0" + hh : hh;
    mm = (mm < 10) ? "0" + mm : mm;
    let time = hh+":"+mm ;
    document.getElementById('curr-time').innerText=time;
    
    setTimeout(()=> {
        currTime()
    },1000)
    
}

currTime();

//countdown timer

const start=document.getElementById('focus-button-start');
const reset = document.getElementById('focus-button-reset');
let intervalId=undefined;
let timeMins;
let alreadyStarted=false;
let endDateTime;
const timeRemainingDisplay = document.getElementById('time-remaining');
let endDate;
let sessionCount=0;
let timeSet=document.getElementById('time-mins')

start.addEventListener('click',function startCountDown(){
    let timeInput= document.getElementById('time-mins').value;

    if(timeInput ===""||timeInput ===0 || timeInput<15 || timeInput>60){
        alert('please enter a time between 15 and 60 mins')
    }
    else if(intervalId===undefined) {
        
        intervalId = setInterval(countDown,1000);
        timeSet.disabled="true";
    }
    else {
        alert('Timer is already running')
    }   

}
);

reset.addEventListener('click',function resetCountDown() {
  clearInterval(intervalId);
  alreadyStarted = false;
  timeSet.value="";
  timeRemainingDisplay.innerText="";
  intervalId=undefined;
  timeSet.disabled="";
});

function countDown(){
    if(!alreadyStarted) {
        timeMins = document.getElementById('time-mins').value;
        let mlSecToAdd = timeMins * 60 * 1000; 
        let currentTime = new Date().getTime();
        endDate = new Date(currentTime+mlSecToAdd);
        endDateTime = new Date(endDate).getTime();
    }
   
    const currDateMlSeconds = new Date().getTime();
    let difference = endDateTime-currDateMlSeconds;
    const second = 1000;
    const minute = 60*1000;
   
    if(difference>0) {
        let minutes = Math.floor(difference/minute);
        let seconds = Math.floor((difference%minute)/second);
        minutes = (minutes < 10)?"0" + minutes:minutes;
        seconds =(seconds < 10)?"0" + seconds:seconds;
        timeRemainingDisplay.innerText = `${minutes}:${seconds}`;
        alreadyStarted=true;
    }
    else {
        clearInterval(intervalId);
        sessionCount+=1;
        intervalId=undefined;
        alreadyStarted=false;
        timeRemainingDisplay.innerText="";
        timeSet.value='';
        timeSet.disabled="";
    }

    document.getElementById('focus-sessions').innerText=` ${sessionCount}`;
   
      
    
}



// current weather call api 


//return the current location longitude and latitude  pass these value fetch request to my server for
//current weather 


const hourToMlSecs = 60*60*1000;
function currentWeather() {
navigator.geolocation.getCurrentPosition(position => {
    fetch(`https://davids-productivity-server.herokuapp.com/weather/${position.coords.latitude}/${position.coords.longitude}`)
    .then(res => {
        if (!res.ok) {
            throw Error("Weather data not available")
        }
        return res.json()
    })
    .then(data => {
        const {icon}=data.weather[0]
        const temp = data.main.temp;
        const description = data.weather[0].description;
        const cityName = data.name;
        const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        
        const img = document.getElementById('weather-img');
        img.src=`${iconUrl}`;
        document.getElementById('weather-temp').innerText= `${Math.round(temp)}°`;
        document.getElementById('weather-description').innerText = `${description}`
        document.getElementById('weather-city').innerText= `${cityName}`;

    })
    .catch(err=>console.log(err));
});
 
}

currentWeather();

setInterval(currentWeather, hourToMlSecs);




//todays tasks manager 
const taskForm = document.querySelector('.task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.querySelector('.task-items');
let tasks = [];

taskForm.addEventListener('submit', function(event) {
  event.preventDefault();
  addTask(taskInput.value); 
  
});

function addTask(item) {
  if (item !== '') {
    const task = {
      id: Date.now(),
      name: item,
      completed: false
    };
    tasks.push(task);
    addToLocalStorage(tasks); 
    console.log(tasks)
    taskInput.value = '';
  }
}

function renderTasks(tasks) {
  taskList.innerHTML= '';
  tasks.forEach(function(item) {
    const checked = item.completed ? 'checked': null;
    const li = document.createElement('li');
    li.setAttribute('class', 'item');
    li.setAttribute('data-key', item.id);
    if (item.completed === true) {
      li.classList.add('checked');
    }
    li.innerHTML = `<input type="checkbox" class="checkbox" ${checked}>
    ${item.name}
    <button class="delete-button">X</button>`
  ;
    taskList.append(li);
  });}


function addToLocalStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks(tasks);
}


function getFromLocalStorage() {
  const reference = localStorage.getItem('tasks');
  if (reference) {
    tasks = JSON.parse(reference);
    renderTasks(tasks);
  }
}


function toggle(id) {
  tasks.forEach(function(item) {
    if (item.id == id) {
      item.completed = !item.completed;
    }
  });
  
  addToLocalStorage(tasks);
}


function deleteTask(id) {
  tasks = tasks.filter(function(item) {
    return item.id != id;
  });
  addToLocalStorage(tasks);
}

getFromLocalStorage();

taskList.addEventListener('click', function(event) {
  if (event.target.type === 'checkbox') {
    toggle(event.target.parentElement.getAttribute('data-key'));
  }
  if (event.target.classList.contains('delete-button')) {
    deleteTask(event.target.parentElement.getAttribute('data-key'));
  }
});