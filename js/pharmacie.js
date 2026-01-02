// =====================================
// VITALIA+ - PHARMACIE (localStorage)
// =====================================

const STORAGE_KEY = "vitalia_pharmacy_orders";
const AUTH_KEY = "vitalia_auth"; // optionnel si tu gères l'auth (sinon ignore)
let orders = [];
let currentFilter = "ALL";
let searchQuery = "";

// Statuts autorisés
const STATUSES = ["Reçue", "En préparation", "Prête", "En livraison"];

// -------------------------
// Utils
// -------------------------
function uid() {
  return Math.random().toString(16).slice(2, 10).toUpperCase();
}

function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

function getBadgeClass(status) {
  if (status === "Reçue") return "received";
  if (status === "En préparation") return "prep";
  if (status === "Prête") return "ready";
  if (status === "En livraison") return "delivery";
  if (status === "Refusée") return "refused";
  return "received";
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    orders = raw ? JSON.parse(raw) : [];
  } catch (e) {
    orders = [];
  }
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// -------------------------
// Seed demo
// -------------------------
function seedIfEmpty() {
  if (orders.length) return;

  const now = new Date();
  orders = [
    {
      id: uid(),
      createdAt: new Date(now.getTime() - 1000 * 60 * 12).toISOString(),
      patientName: "Ahmed K.",
      doctorName: "Dr. Hassan Tazi",
      status: "Reçue",
      accepted: null,
      deliveryRequested: false,
      meds: ["Atorvastatine 20mg — 1/j", "Oméprazole 20mg — 1/j"],
    },
    {
      id: uid(),
      createdAt: new Date(now.getTime() - 1000 * 60 * 55).toISOString(),
      patientName: "Sara B.",
      doctorName: "Dr. Amina Fassi",
      status: "En préparation",
      accepted: true,
      deliveryRequested: false,
      meds: ["Ventoline — si besoin", "Corticoïde inhalé — 2/j"],
    },
    {
      id: uid(),
      createdAt: new Date(now.getTime() - 1000 * 60 * 120).toISOString(),
      patientName: "Karim A.",
      doctorName: "Dr. Karim Alami",
      status: "Prête",
      accepted: true,
      deliveryRequested: false,
      meds: ["Aspirine 75mg — 1/j", "Bêtabloquant — 1/j"],
    },
  ];

  save();
}

// -------------------------
// Render
// -------------------------
function applyFilters(list) {
  let out = [...list];

  if (currentFilter !== "ALL") {
    out = out.filter((o) => o.status === currentFilter);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    out = out.filter((o) => {
      const blob = `${o.id} ${o.patientName} ${o.doctorName} ${o.status}`.toLowerCase();
      return blob.includes(q);
    });
  }

  out.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return out;
}

function updateStats() {
  const recues = orders.filter(o => o.status === "Reçue").length;
  const prep = orders.filter(o => o.status === "En préparation").length;
  const pretes = orders.filter(o => o.status === "Prête").length;
  const livraison = orders.filter(o => o.status === "En livraison").length;

  document.getElementById("statRecues").textContent = recues;
  document.getElementById("statPrep").textContent = prep;
  document.getElementById("statPretes").textContent = pretes;
  document.getElementById("statLivraison").textContent = livraison;

  // Notifications = ordonnances "Reçue" non traitées
  const pendingNotifs = orders.filter(o => o.status === "Reçue" && o.accepted === null).length;
  document.getElementById("notifCount").textContent = pendingNotifs;
}

function render() {
  const grid = document.getElementById("ordersGrid");
  const empty = document.getElementById("emptyState");

  updateStats();

  const filtered = applyFilters(orders);
  grid.innerHTML = "";

  if (!filtered.length) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  filtered.forEach((o) => {
    const refused = o.accepted === false || o.status === "Refusée";
    const badgeClass = getBadgeClass(refused ? "Refusée" : o.status);

    const card = document.createElement("div");
    card.className = `rx-card ${refused ? "disabled" : ""}`;

    const medsList = (o.meds || []).map(m => `<li>${escapeHtml(m)}</li>`).join("");

    card.innerHTML = `
      ${refused ? `<div class="lock-pill">Refusée</div>` : ""}

      <div class="rx-header">
        <div class="rx-title">
          <h3>Ordonnance #${escapeHtml(o.id)}</h3>
          <div class="rx-meta">
            <span>🧑‍🦱 Patient: ${escapeHtml(o.patientName)}</span>
            <span>🩺 Médecin: ${escapeHtml(o.doctorName)}</span>
            <span>🕒 ${escapeHtml(formatDateTime(o.createdAt))}</span>
          </div>
        </div>

        <span class="badge ${badgeClass}">
          ${escapeHtml(refused ? "Refusée" : o.status)}
        </span>
      </div>

      <div class="rx-body">
        <div class="rx-box">
          <h4>Médicaments</h4>
          <ul class="rx-list">${medsList}</ul>
        </div>

        <div class="rx-box">
          <h4>Actions</h4>

          <div class="rx-actions">
            <button class="btn-small btn-accept" data-action="accept" data-id="${o.id}" ${refused || o.accepted === true ? "disabled" : ""}>
              Accepter
            </button>
            <button class="btn-small btn-refuse" data-action="refuse" data-id="${o.id}" ${refused ? "disabled" : ""}>
              Refuser
            </button>
            <button class="btn-small btn-outline" data-action="delivery" data-id="${o.id}" ${refused ? "disabled" : ""}>
              Demander livraison
            </button>
          </div>

          <div class="status-row">
            <label for="status_${o.id}">Statut</label>
            <select id="status_${o.id}" data-action="status" data-id="${o.id}" ${refused ? "disabled" : ""}>
              ${STATUSES.map(s => `<option value="${s}" ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}
            </select>
          </div>

          <div style="margin-top:.75rem; color:#6b7280; font-weight:700;">
            Livraison partenaire :
            <strong style="color:${o.deliveryRequested ? "#047857" : "#b45309"}">
              ${o.deliveryRequested ? "Demandée ✅" : "Non demandée"}
            </strong>
          </div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// -------------------------
// Actions
// -------------------------
function acceptOrder(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;

  o.accepted = true;
  if (o.status === "Reçue") o.status = "En préparation";

  save();
  render();
}

function refuseOrder(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;

  o.accepted = false;
  o.status = "Refusée";

  save();
  render();
}

function updateStatus(id, status) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  if (o.accepted === false) return;

  o.status = status;
  if (status === "En livraison") o.deliveryRequested = true;

  save();
  render();
}

function requestDelivery(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  if (o.accepted === false) return;

  if (o.status !== "Prête" && o.status !== "En livraison") {
    alert("⚠️ La livraison peut être demandée uniquement quand l'ordonnance est 'Prête'.");
    return;
  }

  o.deliveryRequested = true;
  o.status = "En livraison";

  save();
  render();

  alert("✅ Demande envoyée au partenaire externe.\n\nStatut mis à jour : En livraison");
}

// -------------------------
// Simulations
// -------------------------
function simulateIncomingOrder() {
  const now = new Date();

  const newOrder = {
    id: uid(),
    createdAt: now.toISOString(),
    patientName: ["Yassine M.", "Khadija L.", "Omar S.", "Imane R."][Math.floor(Math.random() * 4)],
    doctorName: ["Dr. Bennani", "Dr. Tazi", "Dr. Fassi", "Dr. Alami"][Math.floor(Math.random() * 4)],
    status: "Reçue",
    accepted: null,
    deliveryRequested: false,
    meds: ["Paracétamol 1g — si besoin", "Amoxicilline — 3/j (7 jours)", "Ibuprofène — après repas"]
      .slice(0, 2 + Math.floor(Math.random() * 2)),
  };

  orders.unshift(newOrder);
  save();
  render();
}

function resetDemo() {
  if (!confirm("Réinitialiser la démo ? (supprime les ordonnances pharmacie locales)")) return;
  localStorage.removeItem(STORAGE_KEY);
  load();
  seedIfEmpty();
  render();
}

// -------------------------
// Logout
// -------------------------
function logout() {
  // si tu utilises une auth localStorage, tu peux la supprimer ici :
  // localStorage.removeItem(AUTH_KEY);
  window.location.href = "login.html";
}

// -------------------------
// Init + events
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
  // (Optionnel) nom pharmacie (si stocké)
  const auth = localStorage.getItem(AUTH_KEY);
  if (auth) {
    try {
      const u = JSON.parse(auth);
      if (u?.role === "pharmacie" && u?.name) {
        document.getElementById("pharmacyName").textContent = u.name;
      }
    } catch {}
  }

  load();
  seedIfEmpty();
  render();

  document.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter") || "ALL";
      render();
    });
  });

  const search = document.getElementById("searchInput");
  search.addEventListener("input", (e) => {
    searchQuery = e.target.value || "";
    render();
  });

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;

    const action = el.getAttribute("data-action");
    const id = el.getAttribute("data-id");

    if (action === "accept") acceptOrder(id);
    if (action === "refuse") {
      if (confirm("Refuser cette ordonnance ?")) refuseOrder(id);
    }
    if (action === "delivery") requestDelivery(id);
  });

  document.addEventListener("change", (e) => {
    const sel = e.target.closest('select[data-action="status"]');
    if (!sel) return;
    const id = sel.getAttribute("data-id");
    updateStatus(id, sel.value);
  });

  document.getElementById("btnSimulate").addEventListener("click", simulateIncomingOrder);
  document.getElementById("btnReset").addEventListener("click", resetDemo);

  document.getElementById("notifBtn").addEventListener("click", () => {
    const pending = orders.filter(o => o.status === "Reçue" && o.accepted === null);
    if (!pending.length) return alert("🔔 Aucune nouvelle ordonnance.");
    alert(`🔔 Nouvelles ordonnances reçues : ${pending.length}\n\nTraite-les depuis la liste.`);
  });

  document.getElementById("logoutBtn").addEventListener("click", logout);
});
