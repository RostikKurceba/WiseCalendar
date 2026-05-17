alert("script.js працює");

const userId =
    localStorage.getItem("userId");

if(!userId) {

    window.location.href =
        "login.html";
}

const API = "http://localhost:8080/events";

let currentDate = new Date();

let events = [];

async function loadEvents() {

    try {

        const response = await fetch(API);

        events = await response.json();

    } catch (error) {

        console.log("Події не завантажились");
    }

    renderCalendar();
}

function renderCalendar() {

    const calendar =
        document.getElementById("calendar");

    const monthYear =
        document.getElementById("monthYear");

    calendar.innerHTML = "";

    const year = currentDate.getFullYear();

    const month = currentDate.getMonth();

    const firstDay =
        new Date(year, month, 1);

    const lastDay =
        new Date(year, month + 1, 0);

    let startDay = firstDay.getDay();

    if(startDay === 0) {
        startDay = 7;
    }

    startDay--;

    const totalDays = lastDay.getDate();

    const monthNames = [
        "Січень",
        "Лютий",
        "Березень",
        "Квітень",
        "Травень",
        "Червень",
        "Липень",
        "Серпень",
        "Вересень",
        "Жовтень",
        "Листопад",
        "Грудень"
    ];

    monthYear.innerText =
        `${monthNames[month]} ${year}`;

    // Порожні клітинки перед початком місяця

    for(let i = 0; i < startDay; i++) {

        const emptyDay =
            document.createElement("div");

        emptyDay.classList.add("day", "empty");

        calendar.appendChild(emptyDay);
    }

    // Дні місяця

    for(let day = 1; day <= totalDays; day++) {

        const dayElement =
            document.createElement("div");

        dayElement.classList.add("day");

        const formattedDay =
            String(day).padStart(2, "0");

        const formattedMonth =
            String(month + 1).padStart(2, "0");

        const dateString =
            `${formattedDay}.${formattedMonth}.${year}`;

        dayElement.innerHTML = `
            <div class="day-number">${day}</div>
        `;

        // Події для конкретного дня

        const dayEvents =
            events.filter(event =>
                event.date === dateString
            );

        dayEvents.forEach(event => {

            const eventDiv =
                document.createElement("div");

            eventDiv.classList.add("event");

            eventDiv.innerHTML = `
                <strong>${event.time}</strong><br>
                ${event.title}

                <button
                    class="delete-btn"
                    onclick="deleteEvent(${event.id})"
                >
                    Видалити
                </button>
            `;

            dayElement.appendChild(eventDiv);
        });

        calendar.appendChild(dayElement);
    }
}

function previousMonth() {

    currentDate.setMonth(
        currentDate.getMonth() - 1
    );

    renderCalendar();
}

function nextMonth() {

    currentDate.setMonth(
        currentDate.getMonth() + 1
    );

    renderCalendar();
}

async function addEvent() {

    const input =
        document.getElementById("eventInput");

    if(input.value.trim() === "") {
        return;
    }

    await fetch(API, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(input.value)
    });

    input.value = "";

    loadEvents();
}

async function deleteEvent(id) {

    await fetch(`${API}/${id}`, {

        method: "DELETE"
    });

    loadEvents();
}

window.onload = () => {

    loadEvents();
};

function logout() {

    localStorage.removeItem("userId");

    window.location.href = "login.html";
}