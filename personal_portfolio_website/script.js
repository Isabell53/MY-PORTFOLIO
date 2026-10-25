// ===== Portfolio interactions and contact form =====
const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");
const navItems = document.querySelectorAll(".nav-link");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

// Close the mobile menu after a navigation link is selected.
navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

// Highlight the navigation link for the section currently in view.
const sections = document.querySelectorAll("main section[id]");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navItems.forEach((link) => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach((section) => observer.observe(section));

// Automatically keep the footer year current.
document.querySelector("#year").textContent = new Date().getFullYear();

// Validate the contact form and prepare an email in the visitor's default email app.
// A server is required if you want messages submitted directly to a database or inbox.
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setError(fieldName, message) {
  const field = document.querySelector(`#${fieldName}`);
  const error = document.querySelector(`#${fieldName}-error`);
  field.classList.toggle("invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
  error.textContent = message;
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const subject = document.querySelector("#subject").value.trim();
  const message = document.querySelector("#message").value.trim();

  setError("name", name.length < 2 ? "Please enter your name (at least 2 characters)." : "");
  setError("email", !emailPattern.test(email) ? "Please enter a valid email address." : "");
  setError("message", message.length < 10 ? "Please write a message of at least 10 characters." : "");

  const invalidField = contactForm.querySelector('[aria-invalid="true"]');
  if (invalidField) {
    invalidField.focus();
    formStatus.textContent = "Please correct the highlighted fields.";
    return;
  }

  // Replace this address in index.html with your real portfolio email address.
  const portfolioEmail = "wanjikuisabel09@gmail.com";
  if (portfolioEmail === "wanjikuisabel09@gmail.com") {
    formStatus.textContent = "Your form is valid. Update the portfolio email address in script.js before using this form.";
    return;
  }

  const mailSubject = subject || `Portfolio message from ${name}`;
  const mailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
  const mailto = `mailto:${portfolioEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
  formStatus.textContent = "Opening your email application...";
  window.location.href = mailto;
});
