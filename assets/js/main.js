(function () {
  "use strict";

  let activeCategory = "all";
  let activeArea = "all";

  /* ---------- WhatsApp links ---------- */
  function setupWhatsapp() {
    if (typeof CONTACT === "undefined") return;

    const postLink = document.getElementById("whatsapp-post-link");
    if (postLink) {
      const msg = encodeURIComponent(CONTACT.whatsappDefaultMessage || "");
      postLink.href = `https://wa.me/${CONTACT.whatsapp}?text=${msg}`;
    }

    const workerLink = document.getElementById("whatsapp-worker-link");
    if (workerLink) {
      const msg = encodeURIComponent(CONTACT.whatsappWorkerMessage || "");
      workerLink.href = `https://wa.me/${CONTACT.whatsapp}?text=${msg}`;
    }

    const ownerLink = document.getElementById("whatsapp-owner-link");
    if (ownerLink) {
      const msg = encodeURIComponent(CONTACT.whatsappOwnerMessage || "");
      ownerLink.href = `https://wa.me/${CONTACT.whatsapp}?text=${msg}`;
    }
  }

  /* ---------- Category grid ---------- */
  function renderCategories() {
    const grid = document.getElementById("category-grid");
    if (!grid || typeof CATEGORIES === "undefined") return;

    CATEGORIES.forEach((cat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "category-btn";
      if (cat.id === "all") btn.classList.add("active");
      btn.dataset.category = cat.id;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", cat.id === "all" ? "true" : "false");
      btn.innerHTML = `
        <span class="category-icon" aria-hidden="true">${cat.icon}</span>
        <span class="category-label">${cat.label}</span>
      `;
      btn.addEventListener("click", () => {
        activeCategory = cat.id;
        document.querySelectorAll(".category-btn").forEach((b) => {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-selected", b === btn ? "true" : "false");
        });
        applyFilters();
        document.getElementById("listings-heading").scrollIntoView({ behavior: "smooth", block: "start" });
      });
      grid.appendChild(btn);
    });
  }

  /* ---------- Area dropdown ---------- */
  function renderAreas() {
    const select = document.getElementById("area-select");
    if (!select || typeof AREAS === "undefined") return;

    AREAS.forEach((area) => {
      const opt = document.createElement("option");
      opt.value = area;
      opt.textContent = area;
      select.appendChild(opt);
    });

    select.addEventListener("change", () => {
      activeArea = select.value;
      applyFilters();
    });
  }

  /* ---------- Job cards ---------- */
  function renderJobs() {
    const grid = document.getElementById("job-grid");
    if (!grid || typeof JOBS === "undefined") return;
    grid.innerHTML = "";

    const filtered = JOBS.filter((job) => {
      const categoryMatch = activeCategory === "all" || job.category === activeCategory;
      const areaMatch = activeArea === "all" || job.area === activeArea;
      return categoryMatch && areaMatch;
    });

    const countEl = document.getElementById("listings-count");
    const emptyEl = document.getElementById("empty-state");
    if (countEl) countEl.textContent = `${filtered.length} টি কাজ পাওয়া গেছে`;
    if (emptyEl) emptyEl.hidden = filtered.length !== 0;

    filtered.forEach((job) => {
      const cat = (typeof CATEGORIES !== "undefined" && CATEGORIES.find((c) => c.id === job.category)) || {};
      const card = document.createElement("article");
      card.className = "job-card";
      card.innerHTML = `
        <div class="job-card-top">
          <span class="job-icon" aria-hidden="true">${cat.icon || "🧰"}</span>
          <span class="job-wage">৳${job.wage}<span class="job-wage-unit">/দিন</span></span>
        </div>
        <h3 class="job-title">${job.title}</h3>
        <ul class="job-meta">
          <li><span aria-hidden="true">📍</span> ${job.area}</li>
          <li><span aria-hidden="true">🗓️</span> ${job.date}</li>
          <li><span aria-hidden="true">👥</span> ${job.people} জন লোক লাগবে</li>
        </ul>
        <p class="job-contact-name">${job.contactName}</p>
        <a class="btn btn-call job-call-btn" href="tel:${job.phone}">
          <span aria-hidden="true">📞</span> কল করুন
        </a>
      `;
      grid.appendChild(card);
    });
  }

  function applyFilters() {
    renderJobs();
    const clearBtn = document.getElementById("clear-filter");
    if (clearBtn) clearBtn.hidden = activeCategory === "all" && activeArea === "all";
  }

  /* ---------- Worker profiles ---------- */
  function renderWorkers() {
    const grid = document.getElementById("worker-grid");
    if (!grid || typeof WORKERS === "undefined") return;

    WORKERS.forEach((w) => {
      const cat = (typeof CATEGORIES !== "undefined" && CATEGORIES.find((c) => c.id === w.skill)) || {};
      const card = document.createElement("article");
      card.className = "profile-card";
      card.innerHTML = `
        <div class="profile-card-top">
          <span class="profile-icon" aria-hidden="true">${cat.icon || "👷"}</span>
          <div>
            <h3 class="profile-name">${w.name}</h3>
            <p class="profile-skill">${cat.label || ""}</p>
          </div>
        </div>
        <ul class="profile-meta">
          <li><span aria-hidden="true">📍</span> ${w.area}</li>
          <li><span aria-hidden="true">🛠️</span> ${w.experience}</li>
          <li><span aria-hidden="true">🕒</span> ${w.availability}</li>
        </ul>
        <a class="btn btn-call profile-call-btn" href="tel:${w.phone}">
          <span aria-hidden="true">📞</span> কল করুন
        </a>
      `;
      grid.appendChild(card);
    });
  }

  /* ---------- Owner profiles ---------- */
  function renderOwners() {
    const grid = document.getElementById("owner-grid");
    if (!grid || typeof OWNERS === "undefined") return;

    OWNERS.forEach((o) => {
      const card = document.createElement("article");
      card.className = "profile-card";
      card.innerHTML = `
        <div class="profile-card-top">
          <span class="profile-icon" aria-hidden="true">🧑‍💼</span>
          <div>
            <h3 class="profile-name">${o.name}</h3>
            <p class="profile-skill">${o.business}</p>
          </div>
        </div>
        <ul class="profile-meta">
          <li><span aria-hidden="true">📍</span> ${o.area}</li>
          <li><span aria-hidden="true">🧰</span> ${o.needs}</li>
        </ul>
        <a class="btn btn-call profile-call-btn" href="tel:${o.phone}">
          <span aria-hidden="true">📞</span> কল করুন
        </a>
      `;
      grid.appendChild(card);
    });
  }

  /* ---------- Clear filter ---------- */
  function setupClearFilter() {
    const clearBtn = document.getElementById("clear-filter");
    const areaSelect = document.getElementById("area-select");
    if (!clearBtn) return;
    clearBtn.addEventListener("click", () => {
      activeCategory = "all";
      activeArea = "all";
      if (areaSelect) areaSelect.value = "all";
      document.querySelectorAll(".category-btn").forEach((b) => {
        const isAll = b.dataset.category === "all";
        b.classList.toggle("active", isAll);
        b.setAttribute("aria-selected", isAll ? "true" : "false");
      });
      applyFilters();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupWhatsapp();
    renderCategories();
    renderAreas();
    renderJobs();
    renderWorkers();
    renderOwners();
    setupClearFilter();
  });
})();
