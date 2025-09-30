// LocalStorage data
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// DOM elements
const daysContainer = document.querySelector(".days");
const monthElement = document.querySelector(".date");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const todayBtn = document.querySelector(".today-btn");
const gotoBtn = document.querySelector(".goto-btn");
const dateInput = document.querySelector(".date-input");
const eventDay = document.querySelector(".event-day");
const eventDate = document.querySelector(".event-date");
const eventsContainer = document.querySelector(".events");

const addEventBtn = document.querySelector(".add-event");
const addEventWrapper = document.querySelector(".add-event-wrapper");
const closeBtn = document.querySelector(".close");
const submitEventBtn = document.querySelector(".submit-event");
const eventName = document.querySelector(".event-name");
const eventTimeFrom = document.querySelector(".event-time-from");
const eventTimeTo = document.querySelector(".event-time-to");
const eventCategory = document.querySelector(".event-category");

// Calendar vars
let today = new Date();
let month = today.getMonth();
let year = today.getFullYear();
let activeDay = today.getDate();

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

// 🔹 Render calendar
function initCalendar() {
  daysContainer.innerHTML = "";

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const day = firstDay.getDay();

  // prev month blanks
  for (let i = 0; i < day; i++) {
    daysContainer.innerHTML += `<div class="inactive"></div>`;
  }

  // current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const selDateStr = `${year}-${String(month + 1).padStart(2,"0")}-${String(i).padStart(2,"0")}`;

    let dayTasks = tasks.filter(t => {
      let d = new Date(t.date);
      return (
        d.getDate() === i &&
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    });

    let hasTask = "";
    if (dayTasks.length > 0) {
      let category = dayTasks[0].category.toLowerCase();
      hasTask = `has-task ${category}`;
    }

    const isToday =
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
        ? "active"
        : "";

    daysContainer.innerHTML += `<div class="day ${isToday} ${hasTask}" data-day="${i}">${i}</div>`;
  }

  monthElement.innerText = `${months[month]} ${year}`;
  addDayListeners();
  updateEvents();
}

// 🔹 Day click listener
function addDayListeners() {
  document.querySelectorAll(".day").forEach(dayEl => {
    dayEl.addEventListener("click", e => {
      if (dayEl.classList.contains("inactive")) return;
      document.querySelectorAll(".day").forEach(d => d.classList.remove("active"));
      dayEl.classList.add("active");
      activeDay = Number(dayEl.getAttribute("data-day"));
      updateEvents();
    });
  });
}

// 🔹 Update right panel events
function updateEvents() {
  const selDate = new Date(year, month, activeDay);
  eventDay.innerText = selDate.toLocaleDateString(undefined, { weekday: "long" });
  eventDate.innerText = selDate.toLocaleDateString();

  const dayEvents = tasks.filter(t => {
    const d = new Date(t.date);
    return d.getDate() === activeDay && d.getMonth() === month && d.getFullYear() === year;
  });

  if (dayEvents.length === 0) {
    eventsContainer.innerHTML = "<p>No events yet</p>";
    return;
  }

  eventsContainer.innerHTML = dayEvents.map(t => `
    <div class="event-item ${t.category.toLowerCase()}">
      <b>${t.name}</b>
      <p>${t.from || "All day"} - ${t.to || ""} • ${t.category}</p>
    </div>
  `).join("");
}

// 🔹 Navigation
nextBtn.addEventListener("click", () => {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
});
prevBtn.addEventListener("click", () => {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
});
todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  activeDay = today.getDate();
  initCalendar();
});
gotoBtn.addEventListener("click", () => {
  let arr = dateInput.value.split("/");
  if (arr.length === 2) {
    let m = parseInt(arr[0]) - 1;
    let y = parseInt(arr[1]);
    if (m >= 0 && m < 12 && y > 0) {
      month = m;
      year = y;
      initCalendar();
    }
  }
});

// 🔹 Add event popup
addEventBtn.addEventListener("click", () => addEventWrapper.classList.add("active"));
closeBtn.addEventListener("click", () => addEventWrapper.classList.remove("active"));

submitEventBtn.addEventListener("click", () => {
  if (eventName.value.trim() === "") return alert("Please enter event name");

  const selDate = new Date(year, month, activeDay);
  const newEvent = {
    id: Date.now(),
    name: eventName.value.trim(),
    date: selDate.toISOString(),
    from: eventTimeFrom.value,
    to: eventTimeTo.value,
    category: eventCategory.value
  };

  tasks.push(newEvent);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  addEventWrapper.classList.remove("active");

  eventName.value = "";
  eventTimeFrom.value = "";
  eventTimeTo.value = "";
  eventCategory.value = "Inbox";

  initCalendar();
  updateEvents();
});

// Init
initCalendar();
updateEvents();

