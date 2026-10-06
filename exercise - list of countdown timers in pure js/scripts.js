"use strict";

const items = [
  { id: 1, label: "Tea break", seconds: 300 },
  { id: 2, label: "Cig", seconds: 10 },
];

let nextId = 3;

const timerById = new Map();
const rowById = new Map();

const header = document.createElement("header");
const title = document.createElement("h2");
const form = document.createElement("form");
const labelInput = document.createElement("input");
const secondsInput = document.createElement("input");
const submitButton = document.createElement("button");
const errorMessage = document.createElement("p");
const list = document.createElement("ul");

Object.assign(form.style, {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "8px",
  padding: "12px",
});

Object.assign(labelInput.style, {
  width: "128px",
  padding: "8px 8px",
  boxSizing: "border-box",
});

Object.assign(secondsInput.style, {
  width: "128px",
  padding: "8px 8px",
  boxSizing: "border-box",
});

Object.assign(submitButton.style, {
  padding: "8px 10px",
});

Object.assign(list.style, {
  listStyle: "none",
  padding: "0 12px",
  margin: "0",
  maxWidth: "322px",
});

title.textContent = "Countdown Timers";

labelInput.type = "text";
labelInput.placeholder = "Pasta boiling";
labelInput.required = true;

secondsInput.type = "text";
secondsInput.inputMode = "numeric";
secondsInput.placeholder = "665 or 11:05";
secondsInput.required = true;

submitButton.type = "submit";
submitButton.textContent = "Add";

errorMessage.hidden = true;
errorMessage.style.flexBasis = "70%";
errorMessage.style.color = "red";

header.appendChild(title);
form.append(labelInput, secondsInput, submitButton, errorMessage);

document.body.append(header, form, list);

function formatDuration(time) {
  const m = Math.floor(time / 60);
  const s = time % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function updateRowTimer(item) {
  const row = rowById.get(item.id);

  if (!row) {
    return;
  }

  row.time.textContent =
    item.seconds === 0 ? "Ended" : formatDuration(item.seconds);
}

function stopTimer(itemId) {
  const timer = timerById.get(itemId);

  if (!timer) {
    return;
  }

  clearInterval(timer);
  timerById.delete(itemId);
}

function startTimer(item) {
  if (item.seconds <= 0 || timerById.has(item.id)) {
    return;
  }

  const timer = setInterval(() => {
    if (item.seconds <= 0) {
      stopTimer(item.id);
      updateRowTimer(item);
      return;
    }

    item.seconds -= 1;
    updateRowTimer(item);
  }, 1000);

  timerById.set(item.id, timer);
}

function deleteItem(itemId) {
  stopTimer(itemId);

  const itemIndex = items.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) {
    return;
  }

  items.splice(itemIndex, 1);

  const row = rowById.get(itemId);

  if (row) {
    row.element.remove();
    rowById.delete(itemId);
  }
}

function renderItems() {
  const visibleIds = new Set();

  items.forEach((item) => {
    visibleIds.add(item.id);

    let row = rowById.get(item.id);

    if (!row) {
      const element = document.createElement("li");
      const label = document.createElement("span");
      const time = document.createElement("span");
      const deleteButton = document.createElement("button");

      Object.assign(element.style, {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 0",
      });

      Object.assign(label.style, {
        flex: "1",
      });

      Object.assign(time.style, {
        minWidth: "48px",
        fontFamily: "monospace",
        textAlign: "right",
      });

      Object.assign(deleteButton.style, {
        padding: "6px 8px",
      });

      label.textContent = item.label;
      deleteButton.type = "button";
      deleteButton.textContent = "Remove";

      deleteButton.addEventListener("click", () => {
        deleteItem(item.id);
      });

      element.append(label, time, "   ", deleteButton);

      row = {
        element,
        time,
      };

      rowById.set(item.id, row);
      list.appendChild(element);
    }

    updateRowTimer(item);
    startTimer(item);
  });

  for (const [itemId, row] of rowById) {
    if (!visibleIds.has(itemId)) {
      stopTimer(itemId);
      row.element.remove();
      rowById.delete(itemId);
    }
  }
}

function parseDuration(value) {
  const input = value.trim();

  if (/^\d+$/.test(input)) {
    const seconds = Number(input);

    if (Number.isSafeInteger(seconds) && seconds > 0) {
      return seconds;
    }

    return null;
  }

  const match = input.match(/^(\d+):([0-5]\d)$/);

  if (!match) {
    return null;
  }

  const minutes = Number(match[1]);
  const seconds = Number(match[2]);
  const totalSeconds = minutes * 60 + seconds;

  if (totalSeconds <= 0 || !Number.isSafeInteger(totalSeconds)) {
    return null;
  }

  return totalSeconds;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const label = labelInput.value.trim();
  const totalSeconds = parseDuration(secondsInput.value);

  if (label === "") {
    errorMessage.textContent = "Name your timer";
    errorMessage.hidden = false;
    return;
  }

  if (totalSeconds === null) {
    errorMessage.textContent =
      "Enter a positive number of seconds or a time in m:ss format such as 6:30";
    errorMessage.hidden = false;
    return;
  }

  items.push({
    id: nextId,
    label,
    seconds: totalSeconds,
  });

  nextId += 1;

  errorMessage.textContent = "";
  errorMessage.hidden = true;

  form.reset();
  renderItems();
});

renderItems();
