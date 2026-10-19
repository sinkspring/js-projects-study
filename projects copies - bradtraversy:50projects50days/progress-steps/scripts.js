"use strict";

const circles = document.querySelectorAll(".circle");
const lines = document.querySelectorAll(".line");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

let currentCircle = 1;

next.addEventListener("click", () => {
  currentCircle++;

  if (currentCircle > circles.length) {
    currentCircle = circles.length;
  }

  update();
});

prev.addEventListener("click", () => {
  currentCircle--;

  if (currentCircle < 1) {
    currentCircle = 1;
  }

  update();
});

function update() {
  circles.forEach((circle, number) => {
    if (number < currentCircle) {
      circle.classList.add("active");
    } else {
      circle.classList.remove("active");
    }
  });
  lines.forEach((line, number) => {
    if (number < currentCircle - 1) {
      line.classList.add("active");
    } else {
      line.classList.remove("active");
    }
  });
  if (currentCircle === 1) {
    prev.disabled = true;
  } else if (currentCircle === circles.length) {
    next.disabled = true;
  } else {
    prev.disabled = false;
    next.disabled = false;
  }
}
