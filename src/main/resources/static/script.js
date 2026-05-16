const API = "http://localhost:8080/events";

async function loadEvents() {

    const response = await fetch(API);

    const events = await response.json();

    const container = document.getElementById("events");

    container.innerHTML = "";

    events.forEach(event => {

        container.innerHTML += `
            <div class="event">
                <h3>${event.title}</h3>
                <p>Дата: ${event.date}</p>
                <p>Час: ${event.time}</p>

                <button onclick="deleteEvent(${event.id})">
                    Видалити
                </button>
            </div>
        `;
    });
}

async function addEvent() {

    const input = document.getElementById("eventInput");

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

loadEvents();