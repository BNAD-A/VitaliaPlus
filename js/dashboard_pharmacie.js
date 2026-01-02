// ============================
// DASHBOARD PHARMACIE - ORDonnances
// ============================

const STORAGE_KEY = "pharmacyPrescriptions";

const STATUSES = ["Reçue", "En préparation", "Prête", "En livraison"];

// Sécurité: accès réservé pharmacie
function guardPharmacyAccess() {
  const role =
    sessionStorage.getItem("userRole") ||
    localStorage.getItem("userRole") ||
    "";

  // si tu veux autoriser en dev, commente le if
  if (role !== "pharmacie") {
    console.warn("Accès pharmacie refusé: role =", role);
    window.location.href = "login.html";
  }
}

function getUserEmail() {
  return (
    sessionStorage.getItem("userEmail") ||
    localStorage.getItem("userEmail") ||
    "pharmacie@pharmacie"
  );
}

function loadPrescriptions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Erreur load:", e);
    return [];
  }
}

function savePrescriptions(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function formatDate(dt) {
  const d = new Date(dt);
  return d.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

function statusClass(status) {
  if (status === "Reçue") return "received";
  if (status === "En préparation") return "preparing";
  if (status === "Prête") return "ready";
  if (status === "En livraison") return "delivery";
  if (status === "Refusée") return "refused";
  return "received";
}

function computeStats(list) {
  const stats = { "Reçue": 0, "En préparation": 0, "Prête": 0, "En livraison": 0 };
  list.forEach((p) => {
    if (stats[p.status] !== undefined) stats[p.status]++;
  });
  return stats;
}

function updateStatsUI(list) {
  const stats = computeStats(list);
  document.getElementById("statReceived").textContent = stats["Reçue"];
  document.getElementById("statPreparing").textContent = stats["En préparation"];
  document.getElementById("statReady").textContent = stats["Prête"];
  document.getElementById("statDelivery").textContent = stats["En livraison"];

  // notif = ordonnances "Reçue"
  const notif = stats["Reçue"];
  document.getElementById("notifCount").textContent = notif;
}

function applyFilters(list) {
  const filter = document.getElementById("statusFilter").value;
  const q = document.getElementById("searchInput").value.trim().toLowerCase();

  return list.filter((p) => {
    const okStatus = filter === "ALL" ? true : p.status === filter;
    const hay = `${p.id} ${p.patientName} ${p.patientPhone} ${p.notes}`.toLowerCase();
    const okSearch = !q ? true : hay.includes(q);
    return okStatus && okSearch;
  });
}

function render() {
  const list = loadPrescriptions().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  updateStatsUI(list);

  const filtered = applyFilters(list);
  const container = document.getElementById("prescriptionsList");
  const empty = document.getElementById("emptyState");

  container.innerHTML = "";

  if (filtered.length === 0) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  filtered.forEach((p) => {
    const card = document.createElement("div");
    card.className = "rx-card";

    card.innerHTML = `
      <div class="rx-top">
        <div>
          <div class="rx-title">${p.patientName}</div>
          <div class="rx-sub">
            <span class="rx-id">#${p.id}</span>
            <span class="dot">•</span>
            <span>${formatDate(p.createdAt)}</span>
          </div>
        </div>

        <span class="badge ${statusClass(p.status)}">${p.status}</span>
      </div>

      <div class="rx-body">
        <div class="rx-grid">
          <div class="rx-item">
            <div class="rx-label">Téléphone</div>
            <div class="rx-value">${p.patientPhone || "—"}</div>
          </div>
          <div class="rx-item">
            <div class="rx-label">Médecin</div>
            <div class="rx-value">${p.doctorName || "—"}</div>
          </div>
          <div class="rx-item">
            <div class="rx-label">Contenu</div>
            <div class="rx-value">${(p.meds || []).join(", ") || "Ordonnance (détails à venir)"}</div>
          </div>
          <div class="rx-item">
            <div class="rx-label">Note</div>
            <div class="rx-value">${p.notes || "—"}</div>
          </div>
        </div>

        <div class="rx-actions">
          ${
            p.status === "Reçue"
              ? `
                <button class="btn-ok" type="button" onclick="acceptRx('${p.id}')">Accepter</button>
                <button class="btn-no" type="button" onclick="refuseRx('${p.id}')">Refuser</button>
              `
              : `
                <div class="inline">
                  <label class="small">Statut:</label>
                  <select class="select" onchange="changeStatus('${p.id}', this.value)">
                    ${["Reçue","En préparation","Prête","En livraison","Refusée"].map(s => `
                      <option value="${s}" ${p.status===s?'selected':''}>${s}</option>
                    `).join("")}
                  </select>
                </div>
              `
          }

          <button class="btn-outline" type="button" onclick="requestDelivery('${p.id}')" ${
            p.status !== "Prête" ? "disabled" : ""
          }>
            Demander livraison
          </button>
        </div>

        ${
          p.deliveryRequested
            ? `<div class="delivery-box">
                 ✅ Livraison demandée (partenaire externe) — <strong>${p.deliveryPartner || "Vitalia Partner"}</strong>
               </div>`
            : ""
        }
      </div>
    `;

    container.appendChild(card);
  });
}

// Actions
function acceptRx(id) {
  const list = loadPrescriptions();
  const p = list.find((x) => x.id === id);
  if (!p) return;

  // Après acceptation -> En préparation
  p.status = "En préparation";
  savePrescriptions(list);
  render();
}

function refuseRx(id) {
  const list = loadPrescriptions();
  const p = list.find((x) => x.id === id);
  if (!p) return;

  p.status = "Refusée";
  savePrescriptions(list);
  render();
}

function changeStatus(id, status) {
  const list = loadPrescriptions();
  const p = list.find((x) => x.id === id);
  if (!p) return;

  p.status = status;
  // si on repasse à autre chose que "Prête", on enlève la livraison demandée
  if (status !== "En livraison" && status !== "Prête") {
    p.deliveryRequested = false;
  }
  savePrescriptions(list);
  render();
}

function requestDelivery(id) {
  const list = loadPrescriptions();
  const p = list.find((x) => x.id === id);
  if (!p) return;

  if (p.status !== "Prête") {
    alert("La livraison est disponible uniquement quand l’ordonnance est 'Prête'.");
    return;
  }

  p.deliveryRequested = true;
  p.deliveryPartner = "Partenaire externe";
  p.status = "En livraison";
  savePrescriptions(list);
  render();
}

// Simuler réception automatique
function simulateIncomingPrescription() {
  const list = loadPrescriptions();

  const newRx = {
    id: `RX${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString(),
    status: "Reçue",
    patientName: ["Ahmed K.", "Sara B.", "Youssef A.", "Amina F."][Math.floor(Math.random() * 4)],
    patientPhone: `06${Math.floor(10000000 + Math.random() * 89999999)}`,
    doctorName: ["Dr. Karim Alami", "Dr. Sara Bennani", "Dr. Hassan Tazi"][Math.floor(Math.random() * 3)],
    meds: ["Paracétamol", "Ibuprofène", "Amoxicilline", "Vitamine D"].sort(() => 0.5 - Math.random()).slice(0, 2),
    notes: "Ordonnance reçue depuis Vitalia+",
    deliveryRequested: false,
    deliveryPartner: "",
  };

  list.push(newRx);
  savePrescriptions(list);
  render();
}

// Utilitaires UI
function clearAll() {
  localStorage.removeItem(STORAGE_KEY);
  render();
}

function logout() {
  sessionStorage.removeItem("userRole");
  sessionStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
  window.location.href = "login.html";
}

// Events
document.addEventListener("DOMContentLoaded", () => {
  guardPharmacyAccess();

  document.getElementById("pharmacyName").textContent = getUserEmail();

  // Init data si vide
  const list = loadPrescriptions();
  if (list.length === 0) {
    // 2 exemples
    savePrescriptions([
      {
        id: "RX120045",
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        status: "Reçue",
        patientName: "Ahmed K.",
        patientPhone: "0612345678",
        doctorName: "Dr. Karim Alami",
        meds: ["Paracétamol", "Vitamine D"],
        notes: "Douleurs + fatigue",
        deliveryRequested: false,
        deliveryPartner: "",
      },
      {
        id: "RX120046",
        createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        status: "En préparation",
        patientName: "Sara B.",
        patientPhone: "0677777777",
        doctorName: "Dr. Sara Bennani",
        meds: ["Amoxicilline"],
        notes: "Traitement 7 jours",
        deliveryRequested: false,
        deliveryPartner: "",
      },
    ]);
  }

  document.getElementById("statusFilter").addEventListener("change", render);
  document.getElementById("searchInput").addEventListener("input", render);

  render();
});
