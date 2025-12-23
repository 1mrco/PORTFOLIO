function initCertificateCards(): void {
  const cards = document.querySelectorAll<HTMLElement>(".certificate-card");
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.boxShadow = "0 20px 45px rgba(15,23,42,0.9)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.boxShadow = "";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initCertificateCards();
});


