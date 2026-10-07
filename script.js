/* =========================================================
   YEAR
   ========================================================= */
document.getElementById("year").textContent = new Date().getFullYear();

/* =========================================================
   NAVBAR: scroll state + mobile toggle
   ========================================================= */
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const navOverlay = document.getElementById("navOverlay");

function setNavScrolled() {
  navbar.classList.toggle("scrolled", window.scrollY > 30);
}
setNavScrolled();
window.addEventListener("scroll", setNavScrolled, { passive: true });

function closeMobileNav() {
  navLinks.classList.remove("open");
  navOverlay.classList.remove("show");
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}

function toggleMobileNav() {
  const isOpen = navLinks.classList.toggle("open");
  navOverlay.classList.toggle("show", isOpen);
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
}

navToggle.addEventListener("click", toggleMobileNav);
navOverlay.addEventListener("click", closeMobileNav);

document.querySelectorAll("[data-nav]").forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

/* =========================================================
   SMOOTH SCROLL for in-page links (with fixed-nav offset)
   ========================================================= */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = window.innerWidth <= 860 ? 64 : 76;
    const top = target.getBoundingClientRect().top + window.scrollY - offset + 1;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* =========================================================
   SCROLLSPY: highlight active nav link
   ========================================================= */
const sections = document.querySelectorAll(".section");
const navItemMap = new Map();
document.querySelectorAll(".nav-link[data-nav]").forEach((link) => {
  navItemMap.set(link.getAttribute("href").slice(1), link);
});

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItemMap.forEach((link) => link.classList.remove("active"));
        const activeLink = navItemMap.get(entry.target.id);
        if (activeLink) activeLink.classList.add("active");
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
);
sections.forEach((sec) => spyObserver.observe(sec));

/* =========================================================
   SCROLL REVEAL
   ========================================================= */
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add("is-visible"), Number(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => revealObserver.observe(el));

/* =========================================================
   SKILL BARS: animate width on view
   ========================================================= */
const skillBars = document.querySelectorAll(".skill-bar-fill");
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const level = bar.dataset.level || 0;
        requestAnimationFrame(() => {
          bar.style.width = level + "%";
        });
        skillObserver.unobserve(bar);
      }
    });
  },
  { threshold: 0.4 }
);
skillBars.forEach((bar) => skillObserver.observe(bar));

/* =========================================================
   BACK TO TOP
   ========================================================= */
const backToTop = document.getElementById("backToTop");
window.addEventListener(
  "scroll",
  () => {
    backToTop.classList.toggle("show", window.scrollY > window.innerHeight * 0.8);
  },
  { passive: true }
);
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* =========================================================
   HERO TERMINAL: typewriter effect
   ========================================================= */
const terminalBody = document.getElementById("terminalBody");

// Each line as an array of {text, cls} tokens to render with simple syntax coloring
const terminalLines = [
  [{ t: "// initializing profile...", c: "tk-punct" }],
  [{ t: "", c: "" }],
  [{ t: "const ", c: "tk-kw" }, { t: "developer ", c: "" }, { t: "= {", c: "tk-punct" }],
  [{ t: "  name: ", c: "tk-key" }, { t: '"Syed Hannan Ahmed"', c: "tk-string" }, { t: ",", c: "tk-punct" }],
  [{ t: "  role: ", c: "tk-key" }, { t: '"ISE Engineering Student"', c: "tk-string" }, { t: ",", c: "tk-punct" }],
  [{ t: "  learning: ", c: "tk-key" }, { t: '"C++"', c: "tk-string" }, { t: ",", c: "tk-punct" }],
  [{ t: "  passion: ", c: "tk-key" }, { t: '"Software Development"', c: "tk-string" }, { t: ",", c: "tk-punct" }],
  [{ t: "  status: ", c: "tk-key" }, { t: '"Open to internships"', c: "tk-string" }],
  [{ t: "};", c: "tk-punct" }],
];

function renderTokenSpan(token) {
  const span = document.createElement("span");
  if (token.c) span.className = token.c;
  span.textContent = token.t;
  return span;
}

async function typeTerminal() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  terminalBody.innerHTML = "";

  if (reducedMotion) {
    terminalLines.forEach((line) => {
      const lineEl = document.createElement("div");
      line.forEach((tok) => lineEl.appendChild(renderTokenSpan(tok)));
      terminalBody.appendChild(lineEl);
    });
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    terminalBody.lastChild.appendChild(cursor);
    return;
  }

  for (let i = 0; i < terminalLines.length; i++) {
    const line = terminalLines[i];
    const lineEl = document.createElement("div");
    terminalBody.appendChild(lineEl);

    for (const token of line) {
      const span = document.createElement("span");
      if (token.c) span.className = token.c;
      lineEl.appendChild(span);

      for (let ci = 0; ci < token.t.length; ci++) {
        span.textContent += token.t[ci];
        await sleep(8 + Math.random() * 14);
      }
    }
    await sleep(60);
  }

  const cursor = document.createElement("span");
  cursor.className = "cursor";
  terminalBody.lastChild.appendChild(cursor);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Start typing once the hero terminal is in view (it's above the fold, so start shortly after load)
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(typeTerminal, 400);
});

/* =========================================================
   CONTACT FORM: validation + mailto submission
   ========================================================= */
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

function setFieldError(inputEl, errorEl, message) {
  if (message) {
    inputEl.classList.add("invalid");
    errorEl.textContent = message;
  } else {
    inputEl.classList.remove("invalid");
    errorEl.textContent = "";
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");

  let valid = true;

  if (!nameInput.value.trim()) {
    setFieldError(nameInput, nameError, "Please enter your name.");
    valid = false;
  } else {
    setFieldError(nameInput, nameError, "");
  }

  if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
    setFieldError(emailInput, emailError, "Please enter a valid email address.");
    valid = false;
  } else {
    setFieldError(emailInput, emailError, "");
  }

  if (!messageInput.value.trim()) {
    setFieldError(messageInput, messageError, "Please add a short message.");
    valid = false;
  } else {
    setFieldError(messageInput, messageError, "");
  }

  if (!valid) {
    formStatus.textContent = "Please fix the highlighted fields.";
    formStatus.classList.add("error");
    return;
  }

  formStatus.classList.remove("error");

  const subject = subjectInput.value.trim() || `Portfolio contact from ${nameInput.value.trim()}`;
  const body = `Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\n${messageInput.value.trim()}`;

  const mailtoUrl = `mailto:syedhannanahmed8bp@gmail.com?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  formStatus.textContent = "Opening your email app with this message ready to send...";
  window.location.href = mailtoUrl;

  setTimeout(() => {
    contactForm.reset();
  }, 600);
});
