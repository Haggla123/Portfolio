document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");

  const updateNavbar = () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 40);
  };

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar nav a");

  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });

    sections.forEach((section) => navObserver.observe(section));

    const revealElements = document.querySelectorAll(
      ".research-card, .project-card, .skill-group"
    );

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
  }

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.setAttribute("rel", "noopener noreferrer");
  });

  const form = document.getElementById("contact-form");

  if (form && typeof emailjs !== "undefined") {
    emailjs.init({ publicKey: "pHUAALjhwOC22olfg" });

    const feedback = document.getElementById("form-feedback");
    const submitButton = document.getElementById("submit-btn");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = form.elements["name"]?.value.trim();
      const email = form.elements["email"]?.value.trim();
      const message = form.elements["message"]?.value.trim();

      if (!name || !email || !message) {
        if (feedback) {
          feedback.textContent = "Please fill in all fields.";
          feedback.className = "form-feedback error";
        }
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (feedback) {
          feedback.textContent = "Please enter a valid email address.";
          feedback.className = "form-feedback error";
        }
        return;
      }

      if (submitButton) submitButton.disabled = true;

      try {
        await emailjs.send("service_i02a0vm", "template_2y2s5th", {
          from_name: name,
          from_email: email,
          message,
          to_email: "hagglaagyei@gmail.com"
        });

        if (feedback) {
          feedback.textContent = "Message sent successfully. I'll get back to you soon.";
          feedback.className = "form-feedback success";
        }

        form.reset();
      } catch (error) {
        console.error("EmailJS error:", error);

        if (feedback) {
          feedback.textContent = "Unable to send the message. Please try again or contact me by email.";
          feedback.className = "form-feedback error";
        }
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
});
