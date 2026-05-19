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

// СТРОГА ПЕРЕВІРКА ЧАСУ HH:MM

const strictTimeRegex =
    /\b(2[0-3]|1[0-9]|0?[0-9]):([0-5][0-9])\b/;

// шукаємо будь-які конструкції типу 8?00
const suspiciousTimePattern =
    /\b\d{1,2}\s*[^0-9\s]\s*\d{2}\b/g;

const suspiciousMatches =
    text.match(suspiciousTimePattern);

if(suspiciousMatches) {

    for(const match of suspiciousMatches) {

        // якщо це НЕ нормальний формат HH:MM
        if(!strictTimeRegex.test(match.replace(/\s+/g, ""))) {

            alert("не коректний ввід даних");

            return;
        }
    }
}

// перевірка неправильного часу типу 8000, 1234

const invalidCompactTime =
    /\b\d{3,4}\b/g;

const compactMatches =
    text.match(invalidCompactTime);

if(compactMatches) {

    for(const match of compactMatches) {

        // якщо це НЕ нормальний формат часу HH:MM
        // і число схоже на спробу написати час
        if(!/\b\d{1,2}:\d{2}\b/.test(match)) {

            alert("не коректний ввід даних");

            return;
        }
    }
}

// додатково: якщо є ":" але формат неправильний
const brokenTime =
    /\d+\s*[:.,\-]\s*\d+/.test(text);

if(brokenTime && !/\b\d{1,2}:\d{2}\b/.test(text)) {

    alert("не коректний ввід даних");

    return;
}

// порожній ввід

if(text === "") {

    alert("не коректний ввід даних");

    return;
}

// допустимі конструкції часу

const validTimeUnits =
    "(хв|хвилина|хвилини|хвилин|год|година|години|годин|день|дні|днів|тиждень|тижні|тижнів|місяць|місяці|місяців|рік|роки|років)";

// допустимі конструкції дат

const validDateWords =
    "(сьогодні|завтра|післязавтра|понеділок|вівторок|середу|четвер|п'ятницю|суботу|неділю|січня|лютого|березня|квітня|травня|червня|липня|серпня|вересня|жовтня|листопада|грудня)";

// перевірка часу HH:MM

const timeRegex = /\b(\d{1,2}):(\d{2})\b/g;

let timeMatch;

while((timeMatch = timeRegex.exec(text)) !== null) {

    const hours =
        parseInt(timeMatch[1]);

    const minutes =
        parseInt(timeMatch[2]);

    if(
        hours < 0
        ||
        hours > 23
        ||
        minutes < 0
        ||
        minutes > 59
    ) {

        alert("не коректний ввід даних");

        return;
    }
}

// перевірка "через n ..."

const throughPattern =
    new RegExp(`через\\s+(\\d+)\\s+${validTimeUnits}`);

if(text.includes("через")) {

    if(!throughPattern.test(text)) {

        alert("не коректний ввід даних");

        return;
    }

    const throughMatch =
        text.match(/через\s+(\d+)/);

    if(
        throughMatch
        &&
        parseInt(throughMatch[1]) <= 0
    ) {

        alert("не коректний ввід даних");

        return;
    }
}

// заборона типу:
// "6 годин"
// "лекція 6 днів"

const invalidWithoutThrough =
    new RegExp(`\\b\\d+\\s+${validTimeUnits}`);

if(
    invalidWithoutThrough.test(text)
    &&
    !text.includes("через")
) {

    alert("не коректний ввід даних");

    return;
}

// має бути або:
// - час
// - дата
// - через n ...
// - конкретна дата

const hasTime =
    /\b\d{1,2}:\d{2}\b/.test(text);

const hasRelativeTime =
    throughPattern.test(text);

const hasDateWord =
    new RegExp(validDateWords).test(text);

const hasFullDate =
    /\b\d{1,2}\s+(січня|лютого|березня|квітня|травня|червня|липня|серпня|вересня|жовтня|листопада|грудня)(\s+\d{4}\s+року)?\b/.test(text);

// якщо просто "лекція"

if(
    !hasTime
    &&
    !hasRelativeTime
    &&
    !hasDateWord
    &&
    !hasFullDate
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