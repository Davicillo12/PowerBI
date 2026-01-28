const eventForm = document.querySelector("#event-form");
const giftForm = document.querySelector("#gift-form");
const attachmentForm = document.querySelector("#attachment-form");
const eventsContainer = document.querySelector("#events");
const eventSelects = document.querySelectorAll("select[name='eventId']");

const formatDateTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short"
  });
};

const loadEvents = async () => {
  const response = await fetch("/api/events");
  const events = await response.json();

  eventSelects.forEach((select) => {
    select.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Selecciona un evento";
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);

    events.forEach((event) => {
      const option = document.createElement("option");
      option.value = event.id;
      option.textContent = event.title;
      select.appendChild(option);
    });
  });

  eventsContainer.innerHTML = "";
  events.forEach((event) => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
      <strong>${event.title}</strong>
      <div class="event-meta">
        <span>${formatDateTime(event.dateTime)}</span>
        <span>${event.location || "Sin ubicación"}</span>
        <span>${event.privacy}</span>
      </div>
      <p>${event.description || "Sin descripción"}</p>
    `;
    eventsContainer.appendChild(card);
  });
};

eventForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(eventForm);
  const payload = Object.fromEntries(formData.entries());

  const response = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    eventForm.reset();
    loadEvents();
  } else {
    const error = await response.json();
    alert(error.error || "No se pudo crear el evento.");
  }
});

giftForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(giftForm);
  const payload = Object.fromEntries(formData.entries());

  const response = await fetch(`/api/events/${payload.eventId}/gifts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    giftForm.reset();
    loadEvents();
  } else {
    const error = await response.json();
    alert(error.error || "No se pudo enviar el regalo.");
  }
});

attachmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(attachmentForm);
  const eventId = formData.get("eventId");

  const response = await fetch(`/api/events/${eventId}/attachments`, {
    method: "POST",
    body: formData
  });

  if (response.ok) {
    attachmentForm.reset();
  } else {
    const error = await response.json();
    alert(error.error || "No se pudo subir el archivo.");
  }
});

loadEvents();
