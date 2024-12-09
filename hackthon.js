document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");
    const form = document.getElementById("event-form");
    const clearButton = document.getElementById("clear-events");
    const eventBox = document.getElementById("event-box");
    let events = JSON.parse(localStorage.getItem("events")) || [];
  
    // Initialize Calendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      events: events,
      eventContent: function (arg) {
        let icon = "";
        if (arg.event.extendedProps.type === "birthday") {
          icon = "🎂";
        } else if (arg.event.extendedProps.type === "anniversary") {
          icon = "❤";
        } else if (arg.event.extendedProps.type === "special") {
          icon = "⭐";
        }
        const countdownHTML = `<div class="countdown" id="countdown-${arg.event.id}"></div>`;
        return { html: `${icon} ${arg.event.title} ${countdownHTML}` };
      },
    });
    calendar.render();
  
    // Add Event
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const date = document.getElementById("date").value;
      const type = document.getElementById("type").value;
      const description = document.getElementById("description").value;
  
      if (date && type && description) {
        const newEvent = {
          id: Date.now().toString(), // Unique ID for each event
          title: description,
          start: date,
          type: type,
        };
        events.push(newEvent);
        localStorage.setItem("events", JSON.stringify(events));
        calendar.addEvent(newEvent);
        form.reset();
        updateEventList();
        updateCountdowns();
      }
    });
  
    // Clear Events
    clearButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all events?")) {
        localStorage.removeItem("events");
        events = [];
        calendar.removeAllEvents();
        eventBox.innerHTML = ""; // Clear event list
      }
    });
  
    // Update the event list display
    function updateEventList() {
      eventBox.innerHTML = ""; // Clear the current list before adding new
      events.forEach(event => {
        const countdown = getCountdown(event.id);
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event-item");
        eventDiv.innerHTML = `
          <h3>${event.title}</h3>
          <div class="countdown" id="countdown-${event.id}">${countdown}</div>
        `;
        eventBox.appendChild(eventDiv);
      });
    }
  
    // Countdown Functionality
    function updateCountdowns() {
      const now = new Date();
      events.forEach(event => {
        const countdownElement = document.getElementById(`countdown-${event.id}`);
        if (countdownElement) {
          const eventDate = new Date(event.start);
          const diff = eventDate - now;
  
          if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            countdownElement.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
          } else {
            countdownElement.innerText = "Event has passed";
          }
        }
      });
    }
  
    // Get Countdown for an event
    function getCountdown(eventId) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        const eventDate = new Date(event.start);
        const now = new Date();
        const diff = eventDate - now;
  
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
          return "Event has passed";
        }
      }
      return "";
    }
  
    // Update countdowns every second
    setInterval(updateCountdowns, 1000);
  
    // Initial countdown update
    updateCountdowns();
    updateEventList();
  });