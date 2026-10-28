const body = document.body;
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const navLinks = [...document.querySelectorAll(".primary-nav a")];
const journalList = document.querySelector("#journal-list");
const filterButtons = [...document.querySelectorAll("[data-filter]")];

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const setMenu = (open) => {
  menuToggle.setAttribute("aria-expanded", String(open));
  primaryNav.classList.toggle("is-open", open);
  body.classList.toggle("nav-open", open);
};

menuToggle.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

const updateHeader = () => header.classList.toggle("is-fixed", window.scrollY > 90);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { rootMargin: "0px 0px -8% 0px", threshold: 0.02 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-35% 0px -55%", threshold: [0.05, 0.2, 0.5] }
);

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

let journalEntries = [];

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const renderJournal = (filter = "all") => {
  const entries = journalEntries.filter((entry) => filter === "all" || entry.status === filter);

  if (!entries.length) {
    journalList.innerHTML = '<p class="journal-error">No journal entries match this filter.</p>';
    return;
  }

  journalList.innerHTML = entries
    .map((entry) => {
      const tags = entry.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
      const machineDate = entry.date ? ` datetime="${escapeHtml(entry.date)}"` : "";
      return `
        <article class="journal-entry" data-status="${escapeHtml(entry.status)}">
          <div>
            <time class="journal-date"${machineDate}>${escapeHtml(entry.dateLabel)}</time>
            <span class="journal-status ${escapeHtml(entry.status)}">${escapeHtml(entry.status)}</span>
          </div>
          <div>
            <p class="journal-category">${escapeHtml(entry.eyebrow)}</p>
            <h3>${escapeHtml(entry.title)}</h3>
            <p>${escapeHtml(entry.summary)}</p>
          </div>
          <div class="journal-tags" aria-label="Tags">${tags}</div>
        </article>`;
    })
    .join("");
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderJournal(button.dataset.filter);
  });
});

fetch("content/news.json")
  .then((response) => {
    if (!response.ok) throw new Error(`Journal request failed: ${response.status}`);
    return response.json();
  })
  .then((entries) => {
    journalEntries = entries;
    renderJournal();
  })
  .catch((error) => {
    console.error(error);
    journalList.innerHTML =
      '<p class="journal-error">The journal could not be loaded. Please refresh or view <code>content/news.json</code> in the repository.</p>';
  });
