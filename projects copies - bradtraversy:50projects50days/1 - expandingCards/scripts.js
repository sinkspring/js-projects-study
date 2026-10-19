"use strict";

const slides = document.querySelectorAll(".slide");

for (let slide of slides) {
  slide.addEventListener("click", () => {
    for (let active of slides) {
      active.classList.remove("active");
    }

    slide.classList.add("active");
  });
}
