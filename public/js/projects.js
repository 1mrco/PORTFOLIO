"use strict";
function initProjectHover() {
    const cards = document.querySelectorAll(".project-card");
    cards.forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });
}
document.addEventListener("DOMContentLoaded", () => {
    initProjectHover();
});
