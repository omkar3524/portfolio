let totalClocks = 0;
let clocksTime = {};
let allIntervals = [];
let labels = {};
let storage = {};

const clockContainer = document.getElementById("clock-container");
const addTaskBtn = document.getElementById("add-task-btn");

addTaskBtn.addEventListener("click", () => {
    const label = document.querySelector("input").value;
    if (!label) {
    alert("Please enter label");
    return;
    }
    //create unique data-clock id
    const clockId = `clock-${totalClocks}`;
    const time = 0;//new Date(0 * 1000).toISOString().slice(11, 19);

    const card = document.createElement("div");
    card.classList.add("col-sm-12", "col-md-6", "col-lg-4", "col-xl-3", "mb-2", "clock");
    card.innerHTML = `
        <div class="card" style="height: 150px; font-size: 40px;" data-clock="${clockId}">
        <div class="card-body d-flex justify-content-center align-items-center ">
            <span class="font-weight-bold">00:00:00</span>
            <label for="">${label}</label>
        </div>
        </div>
    `;

    clockContainer.appendChild(card);
    document.querySelector("input").value = "";

    //add clock to clocksTime object
    clocksTime[clockId] = time;
    totalClocks += 1;
    labels[clockId] = label;

    //add clock to storage
    storage[clockId] = {
    time: time,
    label: label,
    };
    addEventListeners();
    console.log(clocksTime)
});

function addEventListeners() {
    const clocks = document.querySelectorAll(".clock");
    clocks.forEach((clock) => {
    clock.addEventListener("click", () => {
        startClock(clock);
    });
    });
}


function startClock(clock) {
    removeActiveClass()
    const card = clock.querySelector('.card')
    card.classList.add("active");
    const clockId = card.dataset.clock;
    console.log(clockId);

    //clear all intervals
    allIntervals.forEach((interval) => {
    clearInterval(interval);
    });

    //start clock
    const interval = setInterval(() => {
    clocksTime[clockId] += 1;
    const result = new Date(clocksTime[clockId] * 1000)
        .toISOString()
        .slice(11, 19);
        card.querySelector("span").innerHTML = result;
        //update storage
        storage[clockId].time = clocksTime[clockId];

    }, 1000);

    allIntervals.push(interval);
    
}

function pauseAll() {
    allIntervals.forEach((interval) => {
    clearInterval(interval);

    //remove active class
    removeActiveClass()
    });
}

function removeActiveClass() {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
    card.classList.remove("active");
    });
}


function removeAllClocks() {
    clockContainer.innerHTML = "";
    clocksTime = {};
    totalClocks = 0;
    allIntervals = [];
    storage = {};
    //remove stroage
    localStorage.removeItem("omkar-time-tracking");
}

function startRecording() {
    setInterval(() => {
    localStorage.setItem("omkar-time-tracking", JSON.stringify(storage));
    console.log(storage);
    }, 1000);
}

//plot clocks from local storage
const clocks = JSON.parse(localStorage.getItem("omkar-time-tracking"));
if (clocks) {
    console.log(clocks);
    for (const clock in clocks) {
    const label = clocks[clock].label;
    const time = clocks[clock].time;
    const card = document.createElement("div");
    card.classList.add("col-sm-12", "col-md-6", "col-lg-4", "col-xl-3", "mb-2", "clock");
    card.innerHTML = `
        <div class="card" style="height: 150px; font-size: 40px;" data-clock="${clock}">
        <div class="card-body d-flex justify-content-center align-items-center ">
            <span class="font-weight-bold">${new Date(time * 1000).toISOString().slice(11, 19)}</span>
            <label for="">${label}</label>
        </div>
        </div>
    `;

    clockContainer.appendChild(card);
    clocksTime[clock] = time;
    totalClocks += 1;

    //add clock to storage
    storage[clock] = {
        time: time,
        label: label,
    };
    }

    addEventListeners();
}

startRecording();

