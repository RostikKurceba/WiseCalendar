//alert("script.js працює");
//
//const userId =
//    localStorage.getItem("userId");
//
//if(!userId) {
//
//    window.location.href =
//        "login.html";
//}

const API = "http://localhost:8080/events";

let currentDate = new Date();

let events = [];

async function loadEvents() {

    try {

        const userId =
            localStorage.getItem("userId");

        const response =
            await fetch(`${API}/${userId}`);

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

    const text =
        input.value.toLowerCase().trim();

// Перевірка часу формату HH:MM
const timeRegex = /(\d{1,2}):(\d{2})/g;

let timeMatch;

while ((timeMatch = timeRegex.exec(text)) !== null) {

    const hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);

    if (hours < 0 || hours > 24 || minutes < 0 || minutes > 59) {

        alert("не коректний ввід часу");

        return; // блокує додавання події
    }
}

// Перевірка конструкцій "через n ..."

const invalidTimePattern =
    /через\s+([^\s]+)\s+(хв|хвилин|хвилини|хвилину|год|годин|години|годину|день|дні|днів|тиждень|тижні|тижнів|місяць|місяці|місяців|рік|роки|років)/;

const invalidMatch =
    text.match(invalidTimePattern);

if(invalidMatch) {

    const value =
        invalidMatch[1];

    // якщо не число
    if(!/^\d+$/.test(value)) {

        alert("не коректний ввід часу");

        return;
    }

    // якщо число <= 0
    if(parseInt(value) <= 0) {

        alert("не коректний ввід часу");

        return;
    }
}

// Повна перевірка конструкцій "через n ..."

if(text.includes("через")) {

    // правильний формат
    const validPattern =
        /через\s+\d+\s+(хв|хвилину|хвилини|хвилин|год|годину|години|годин|день|дні|днів|тиждень|тижні|тижнів|місяць|місяці|місяців|рік|роки|років)/;

    // шукаємо будь-яку конструкцію "через ..."
    const throughPattern =
        /через\s+([^\s]+)\s+([^\s]+)/;

    const throughMatch =
        text.match(throughPattern);

    // якщо конструкція є
    if(throughMatch) {

        const value =
            throughMatch[1];

        const unit =
            throughMatch[2];

        // перевірка числа
        if(!/^\d+$/.test(value)) {

            alert("не коректний ввід даних");

            return;
        }

        // число <= 0
        if(parseInt(value) <= 0) {

            alert("не коректний ввід даних");

            return;
        }

        // перевірка одиниці часу
        const strictPattern =
            /^через\s+\d+\s+(хв|хвилину|хвилини|хвилин|год|годину|години|годин|день|дні|днів|тиждень|тижні|тижнів|місяць|місяці|місяців|рік|роки|років)$/;

        if(!strictPattern.test(throughMatch[0])) {

            alert("не коректний ввід даних");

            return;
        }
    }

    // якщо написано просто "через"
    else {

        alert("не коректний ввід даних");

        return;
    }
}

    if(text === "") {
        return;
    }

if(text.includes("через") && !text.match(/через\s+\d+\s+/)) {

    alert("не коректний ввід часу");

    return;
}

// Забороняємо конструкції типу:
// "лекція 6 годин"
// "арпопоо 5 днів"
// якщо перед числом немає слова "через"

const invalidTimeWithoutThrough =
     /(^|\s)(?!через\s)\S+\s+\d+\s+(хв|хвилина|хвилини|хвилин|год|година|години|годин|день|дні|днів|тиждень|тижні|тижнів|місяць|місяці|місяців|рік|роки|років)/;

 if(
     invalidTimeWithoutThrough.test(text)
     &&
     !/через\s+\d+\s+(хв|хвилина|хвилини|хвилин|год|година|години|годин|день|дні|днів|тиждень|тижні|тижнів|місяць|місяці|місяців|рік|роки|років)/.test(text)
 ) {

     alert("не коректний ввід даних");

     return;
 }

    await fetch(API, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            text: input.value,

            userId: localStorage.getItem("userId")
        })
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