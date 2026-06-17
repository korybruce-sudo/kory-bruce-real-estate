const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  const icon = question.querySelector("span");

  question.addEventListener("click", () => {
    const isOpen = item.classList.toggle("active");

    question.setAttribute("aria-expanded", isOpen);

    if (icon) {
      icon.textContent = isOpen ? "−" : "+";
    }
  });
});