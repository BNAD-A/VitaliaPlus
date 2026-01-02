// ============================
// DASHBOARD PATIENT - PLAN LOGIC (UPDATED)
// ============================

let userPlan = null;

try {
  const planData = localStorage.getItem("userPlan");
  if (planData) {
    userPlan = JSON.parse(planData);
    console.log("📋 Plan actif:", userPlan);
  } else {
    console.warn("⚠️ Aucun plan sélectionné, redirection...");
    window.location.href = "choose_plan.html";
  }
} catch (error) {
  console.error("Erreur lors de la récupération du plan:", error);
}

// ✅ Normaliser les features selon le plan
function normalizePlanFeatures() {
  if (!userPlan) return;

  if (!userPlan.features) userPlan.features = {};

  // Prix par défaut
  if (!userPlan.features.prix) {
    if (userPlan.name === "Essai") userPlan.features.prix = "Gratuit";
    if (userPlan.name === "Standard") userPlan.features.prix = "199 DH / Trimestre";
    if (userPlan.name === "Premium") userPlan.features.prix = "499 DH / Trimestre";
  }

  // Plan Essai
  if (userPlan.name === "Essai") {
    userPlan.features.teleconsultation = true;
    userPlan.features.ordonnances = true;
    userPlan.features.livraison = true;
    userPlan.features.analyses = false;          // ❌ pas d'analyses
    userPlan.features.conseilsSante = false;
    userPlan.features.braceletConnecte = false;
  }

  // Plan Standard
  if (userPlan.name === "Standard") {
    userPlan.features.teleconsultation = true;
    userPlan.features.ordonnances = true;
    userPlan.features.analyses = true;           // ✅ analyses ok
    userPlan.features.livraison = true;
    userPlan.features.conseilsSante = false;
    userPlan.features.braceletConnecte = false;
  }

  // Plan Premium
  if (userPlan.name === "Premium") {
    userPlan.features.teleconsultation = true;
    userPlan.features.ordonnances = true;
    userPlan.features.analyses = true;
    userPlan.features.livraison = true;
    userPlan.features.conseilsSante = true;
    userPlan.features.braceletConnecte = true;
  }
}

// Vérifier si une fonctionnalité est disponible
function isFeatureAvailable(featureName) {
  if (!userPlan || !userPlan.features) return false;
  return userPlan.features[featureName] === true;
}

// Adapter les stats selon plan
function applyPlanStats() {
  if (!userPlan) return;

  const consultationsEl = document.getElementById("statConsultations");
  const ordonnancesEl = document.getElementById("statOrdonnances");
  const suiviEl = document.getElementById("statSuivi");

  let consultations = 0;
  let ordonnances = 0;
  let suivi = 0;

  if (userPlan.name === "Essai") {
    consultations = 1;
    ordonnances = 1;
    suivi = 30;
  } else if (userPlan.name === "Standard") {
    consultations = 6;
    ordonnances = 3;
    suivi = 75;
  } else if (userPlan.name === "Premium") {
    consultations = 12;
    ordonnances = 5;
    suivi = 98;
  }

  if (consultationsEl) consultationsEl.textContent = consultations;
  if (ordonnancesEl) ordonnancesEl.textContent = ordonnances;
  if (suiviEl) suiviEl.textContent = `${suivi}%`;
}

// Appliquer restrictions plan
function applyPlanRestrictions() {
  if (!userPlan) return;

  // Mettre à jour le nom du plan
  const planName = document.getElementById("planName");
  if (planName) planName.textContent = `Plan ${userPlan.name}`;

  const planBadge = document.getElementById("planBadge");
  if (planBadge && userPlan.features?.prix) {
    planBadge.textContent = `Mon abonnement - ${userPlan.features.prix}`;
  }

  const heroTitle = document.getElementById("heroTitle");
  if (heroTitle) heroTitle.textContent = `Bienvenue sur votre plan ${userPlan.name}`;

  // ✅ Accès limité/illimité selon plan
  const planDesc = document.getElementById("planDesc");
  if (planDesc) {
    planDesc.textContent = (userPlan.name === "Premium") ? "Accès illimité" : "Accès limité";
  }

  // ✅ Cacher le bouton "Passer au forfait supérieur" si Premium
  const upgradeBtn = document.querySelector(".btn-change-plan");
  if (upgradeBtn) {
    upgradeBtn.style.display = (userPlan.name === "Premium") ? "none" : "inline-flex";
  }

  // Stats
  applyPlanStats();

  // Services rapides (cards)
  const serviceCards = document.querySelectorAll(".service-card");

  serviceCards.forEach((card) => {
    // Reset style
    card.style.opacity = "";
    card.style.cursor = "";
    card.style.filter = "";
    card.style.position = "";

    const oldBadge = card.querySelector(".disabled-badge");
    if (oldBadge) oldBadge.remove();

    const title = card.querySelector("h3")?.textContent || "";
    let isAvailable = true;

    if (title.includes("Téléconsultation")) {
      isAvailable = isFeatureAvailable("teleconsultation");
    } else if (title.toLowerCase().includes("ordonnances")) {
      isAvailable = isFeatureAvailable("ordonnances");
    } else if (title.includes("Analyses")) {
      isAvailable = isFeatureAvailable("analyses");
    } else if (title.includes("Livraison")) {
      isAvailable = isFeatureAvailable("livraison");
    } else if (title.includes("Conseils Santé")) {
      isAvailable = isFeatureAvailable("conseilsSante");
    }

    if (!isAvailable) {
      card.style.opacity = "0.5";
      card.style.cursor = "not-allowed";
      card.style.filter = "grayscale(100%)";
      card.style.position = "relative";

      const badge = document.createElement("div");
      badge.className = "disabled-badge";
      badge.textContent = "🔒 Non disponible";
      badge.style.cssText = `
        position:absolute;
        top:10px;
        right:10px;
        background:#e74c3c;
        color:white;
        padding:0.5rem 1rem;
        border-radius:20px;
        font-size:0.75rem;
        font-weight:bold;
        z-index:10;
      `;
      card.appendChild(badge);

      card.onclick = function (e) {
        e.stopPropagation();
        window.location.href = "choose_plan.html";
      };
    }
  });

  // Bracelet Connecté (Premium uniquement)
  if (!isFeatureAvailable("braceletConnecte")) {
    const healthSection = document.querySelector(".health-data-section");
    if (healthSection) {
      healthSection.style.opacity = "0.5";
      healthSection.style.filter = "grayscale(100%)";

      if (!healthSection.querySelector(".upgrade-message")) {
        const message = document.createElement("div");
        message.className = "upgrade-message";
        message.innerHTML = `
          <div style="background: linear-gradient(135deg, #892D3F 0%, #6e2432 100%); color: white; padding: 2rem; border-radius: 16px; text-align: center; margin-top: 1rem;">
              <h3 style="margin-bottom: 1rem;">🔒 Bracelet Connecté requis</h3>
              <p style="margin-bottom: 1.5rem;">Disponible uniquement avec le plan Premium (bracelet inclus).</p>
              <button onclick="upgradePlan()" style="background: white; color: #892D3F; padding: 1rem 2rem; border: none; border-radius: 50px; font-weight: bold; cursor: pointer;">
                  Passer au Premium
              </button>
          </div>
        `;
        healthSection.appendChild(message);
      }
    }
  }
}

// Upgrade plan
function upgradePlan() {
  window.location.href = "choose_plan.html";
}

// Déconnexion
function logout() {
  localStorage.removeItem("userPlan");
  window.location.href = "login.html";
}

// Téléconsultation
function openConsultation() {
  if (!isFeatureAvailable("teleconsultation")) {
    window.location.href = "choose_plan.html";
    return;
  }
  window.location.href = "teleconsultation.html";
}

// Conseils Santé
function openConseilsSante() {
  if (!isFeatureAvailable("conseilsSante")) {
    window.location.href = "choose_plan.html";
    return;
  }
  toggleChatWidget();
}

// Update health data (Premium only)
function updateHealthData() {
  if (!isFeatureAvailable("braceletConnecte")) return;

  const heartRate = Math.floor(Math.random() * (85 - 60 + 1)) + 60;
  const bloodPressure = `${Math.floor(Math.random() * (130 - 110 + 1)) + 110}/${Math.floor(Math.random() * (85 - 70 + 1)) + 70}`;
  const glucose = Math.floor(Math.random() * (110 - 80 + 1)) + 80;
  const oxygen = Math.floor(Math.random() * (100 - 95 + 1)) + 95;

  const healthValues = document.querySelectorAll(".health-value");
  if (healthValues.length >= 4) {
    healthValues[0].innerHTML = `${heartRate} <span>bpm</span>`;
    healthValues[1].innerHTML = `${bloodPressure} <span>mmHg</span>`;
    healthValues[2].innerHTML = `${glucose} <span>mg/dL</span>`;
    healthValues[3].innerHTML = `${oxygen} <span>%</span>`;
  }
}

// Notifications
const notificationBtn = document.querySelector(".notification");
if (notificationBtn) {
  notificationBtn.addEventListener("click", function () {
    if (typeof openNotifications === "function") {
      openNotifications();
    }
  });
}

// Chargement page
document.addEventListener("DOMContentLoaded", function () {
  console.log("Vitalia+ - Dashboard Patient chargé");

  normalizePlanFeatures();
  applyPlanRestrictions();

  if (isFeatureAvailable("braceletConnecte")) {
    setInterval(updateHealthData, 10000);
  }
});
