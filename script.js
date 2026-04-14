/* ═══════════════════════════════════════════
   Portfolio – Interactive JavaScript
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Typing Effect ── */
  const typedEl = document.getElementById('typed-name');
  const words   = ['Haggla Mensah Agyei', 'a Developer', 'a Designer', 'a Creator'];
  let wordIdx   = 0;
  let charIdx   = 0;
  let deleting   = false;
  const typeSpeed   = 100;
  const deleteSpeed = 55;
  const pauseEnd    = 2000;
  const pauseStart  = 400;

  function type() {
    const current = words[wordIdx];
    if (!deleting) {
      typedEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        setTimeout(() => { deleting = true; type(); }, pauseEnd);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(type, pauseStart);
        return;
      }
    }
    setTimeout(type, deleting ? deleteSpeed : typeSpeed);
  }
  type();


  /* ── Navbar scroll effect ── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });


  /* ── Active nav-link highlight ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
      const top    = sec.offsetTop;
      const height = sec.offsetHeight;
      const id     = sec.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(l => l.classList.remove('active'));
        document.querySelector(`.nav-link[href="#${id}"]`)?.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });


  /* ── Mobile hamburger ── */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });

  navLinksEl.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });


  /* ── Scroll Reveal (Intersection Observer) ── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        const idx = Array.from(siblings).indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.1}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ── Animated Counters ── */
  const counters = document.querySelectorAll('[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = +el.dataset.target;
        const dur    = 1800;
        const start  = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / dur, 1);
          // ease-out cubic
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * ease);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));


  /* ── Skill Bars ── */
  const skillBars = document.querySelectorAll('.skill-bar__fill');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.width + '%';
        barObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(b => barObserver.observe(b));


  /* ── Contact Form ── */
  // Initialize EmailJS
  emailjs.init('pHUAALjhwOC22olfg'); // Replace with your actual public key

  const form     = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      feedback.textContent = 'Please fill in all fields.';
      feedback.className   = 'form-feedback error';
      return;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      feedback.textContent = 'Please enter a valid email address.';
      feedback.className   = 'form-feedback error';
      return;
    }

    // Send email
    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending…';

    emailjs.send('service_i02a0vm', 'template_2y2s5th', {
      from_name: name,
      from_email: email,
      message: message,
      to_email: 'hagglaagyei@gmail.com'
    }).then(() => {
      feedback.textContent = 'Message sent successfully! I\'ll get back to you soon. ✨';
      feedback.className = 'form-feedback success';
      form.reset();
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Send Message';
    }, (error) => {
      console.error('EmailJS error:', error);
      feedback.textContent = 'Failed to send message. Please try again.';
      feedback.className = 'form-feedback error';
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Send Message';
    });
  });


  /* ── Smooth scroll for anchors (fallback) ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
