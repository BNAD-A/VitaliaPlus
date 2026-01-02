// ==================================
// PLAN ACCESS GUARD (Analyses page)
// ==================================

function safePlanName(name) {
  return (name || "").toString().trim().toLowerCase();
}

function getUserPlan() {
  try {
    const data = localStorage.getItem("userPlan");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function ensureAnalysesAccess() {
  const plan = getUserPlan();
  if (!plan) {
    window.location.href = "choose_plan.html";
    return;
  }

  const planName = safePlanName(plan.name);

  // ✅ Essai => Analyses interdit
  if (planName === "essai") {
    // Griser toute la page Analyses
    const main = document.getElementById("analysesPage");
    if (main) {
      main.style.opacity = "0.5";
      main.style.filter = "grayscale(100%)";
      main.style.pointerEvents = "none";
      main.style.position = "relative";
    }

    // Désactiver le bouton "Demander une analyse"
    const btn = document.getElementById("btnRequestAnalysis");
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = "0.6";
      btn.style.cursor = "not-allowed";
    }

    // Overlay upgrade (cliquable)
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 24px;
    `;

    overlay.innerHTML = `
      <div style="max-width: 520px; width: 100%; background: white; border-radius: 16px; padding: 22px; text-align:center;">
        <h3 style="margin: 0 0 10px;">🔒 Analyses biologiques indisponibles</h3>
        <p style="margin: 0 0 18px; color:#555;">
          Cette fonctionnalité est disponible à partir du <strong>plan Standard</strong>.
        </p>
        <button id="goUpgradeBtn" style="background:#892D3F;color:white;border:none;border-radius:999px;padding:12px 18px;font-weight:700;cursor:pointer;">
          Passer au forfait supérieur
        </button>
        <div style="margin-top:10px;">
          <button id="backBtn" style="background:transparent;border:none;color:#892D3F;cursor:pointer;text-decoration:underline;">
            Retour au Dashboard
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("goUpgradeBtn")?.addEventListener("click", () => {
      window.location.href = "choose_plan.html";
    });

    document.getElementById("backBtn")?.addEventListener("click", () => {
      window.location.href = "dashboard_patient.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", ensureAnalysesAccess);
