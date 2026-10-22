"use strict";

const buttons = document.querySelectorAll(".hide-panel");

for (let button of buttons) {
  button.addEventListener("click", () => {
    button.parentNode.classList.toggle("active");
  });
}
