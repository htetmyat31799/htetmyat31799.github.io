"use strict";

/* ====== EDIT YOUR CONTENT HERE ====== */
const CONFIG = {
  linkedin: "",                         // paste your LinkedIn URL
  email: "htetmyat31799@gmail.com",
};

const SKILLS = [
  { name: "Python", note: "pandas, NumPy, scripting", level: 80 },
  { name: "SQL", note: "Queries, joins, aggregations", level: 70 },
  { name: "Data Visualization", note: "Matplotlib, Seaborn, Plotly", level: 75 },
  { name: "Machine Learning", note: "scikit-learn, model validation", level: 65 },
  { name: "Statistics", note: "Hypothesis testing, EDA", level: 65 },
  { name: "Git & GitHub", note: "Version control, collaboration", level: 70 },
];

// Add real projects here. Remove the "soon" placeholders as you go.
// category: "Analytics" | "Machine Learning"
const PROJECTS = [
  {
    title: "Analytics Project (coming soon)",
    category: "Analytics",
    description: "Exploratory analysis and dashboard on a real-world dataset.",
    tags: ["Python", "SQL", "Pandas"],
    soon: true,
  },
  {
    title: "Machine Learning Project (coming soon)",
    category: "Machine Learning",
    description: "End-to-end predictive model with validation and evaluation.",
    tags: ["scikit-learn", "Python"],
    soon: true,
  },
  // {
  //   title: "Customer Churn Prediction",
  //   category: "Machine Learning",
  //   description: "Random forest model reaching 0.87 AUC.",
  //   tags: ["Python", "scikit-learn"],
  //   github: "https://github.com/htetmyat31799/churn-prediction",
  //   demo: "",
  // },
];
/* ===================================== */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const safeUrl = (u) => (/^https?:\/\//i.test(u) ? u : "");

/* Theme */
const root = document.documentElement;
function setTheme(t) {
  root.setAttribute("data-theme", t);
  try { localStorage.setItem("theme", t); } catch {}
}
let saved = null;
try { saved = localStorage.getItem("theme"); } catch {}
setTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
$("#theme-toggle").addEventListener("click", () =>
  setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"));

/* Mobile menu */
const menu = $("#menu"), menuBtn = $("#menu-toggle");
menuBtn.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
$$("#menu a").forEach((a) => a.addEventListener("click", () => {
  menu.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}));

/* Nav shadow + active link */
const nav = $("#nav");
const links = $$("#menu a");
const sections = links.map((a) => $(a.getAttribute("href")));
function onScroll() {
  nav.classList.toggle("scrolled", scrollY > 10);
  const pos = scrollY + 120;
  let current = null;
  sections.forEach((s, i) => { if (s && s.offsetTop <= pos) current = i; });
  links.forEach((a, i) => a.classList.toggle("active", i === current));
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* Skills */
$("#skills-grid").innerHTML = SKILLS.map((s) => `
  <article class="card reveal">
    <h3>${esc(s.name)}</h3>
    <p>${esc(s.note)}</p>
    <div class="skill-bar" role="img" aria-label="${esc(s.name)} proficiency ${s.level}%"><i data-level="${s.level}"></i></div>
  </article>`).join("");

/* Projects + filters */
const categories = ["All", ...new Set(PROJECTS.map((p) => p.category))];
const filters = $("#filters");
filters.innerHTML = categories.map((c, i) =>
  `<button class="filter${i === 0 ? " active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");

function renderProjects(cat = "All") {
  const list = PROJECTS.filter((p) => cat === "All" || p.category === cat);
  $("#projects-grid").innerHTML = list.map((p) => {
    const gh = safeUrl(p.github || ""), demo = safeUrl(p.demo || "");
    return `
    <article class="card project reveal visible${p.soon ? " soon" : ""}">
      <span class="badge">${esc(p.category)}${p.soon ? " · Coming soon" : ""}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.description)}</p>
      <div class="tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      ${gh || demo ? `<div class="links">
        ${gh ? `<a href="${gh}" target="_blank" rel="noopener">GitHub →</a>` : ""}
        ${demo ? `<a href="${demo}" target="_blank" rel="noopener">Live demo →</a>` : ""}
      </div>` : ""}
    </article>`;
  }).join("");
}
filters.addEventListener("click", (e) => {
  const b = e.target.closest(".filter");
  if (!b) return;
  $$(".filter", filters).forEach((f) => f.classList.toggle("active", f === b));
  renderProjects(b.dataset.cat);
});
renderProjects();

/* Scroll reveal + skill bars + counters */
function animateCount(el) {
  const target = +el.dataset.count; let n = 0;
  const step = () => { n += Math.max(1, target / 30); el.textContent = Math.min(target, Math.round(n)); if (n < target) requestAnimationFrame(step); };
  step();
}
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target;
    el.classList.add("visible");
    $$(".skill-bar i", el).forEach((b) => (b.style.width = b.dataset.level + "%"));
    $$("[data-count]", el).forEach(animateCount);
    io.unobserve(el);
  });
}, { threshold: 0.15 });
$$(".reveal").forEach((el) => io.observe(el));

/* Social links */
const li = $("#linkedin");
if (safeUrl(CONFIG.linkedin)) li.href = CONFIG.linkedin; else li.parentElement.remove();

/* Contact form: opens the visitor's email app with a prefilled message */
const form = $("#contact-form"), note = $("#form-note");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  let ok = true;
  ["name", "email", "message"].forEach((k) => {
    const f = form.elements[k];
    const valid = d[k].trim() && (k !== "email" || /^\S+@\S+\.\S+$/.test(d[k]));
    f.classList.toggle("invalid", !valid);
    if (!valid) ok = false;
  });
  if (!ok) { note.textContent = "Please fill in all fields with a valid email."; return; }
  const subject = encodeURIComponent(`Portfolio message from ${d.name}`);
  const body = encodeURIComponent(`${d.message}\n\n— ${d.name} (${d.email})`);
  location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
  note.textContent = "Opening your email app…";
  form.reset();
});

$("#year").textContent = new Date().getFullYear();
