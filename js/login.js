// ============================
// LOGIN - ROUTING (Patient / Médecin / Pharmacie / Laboratoire)
// ============================

// Plan Essai par défaut (patient)
const defaultPlan = {
  name: "Essai",
  features: {
    livraison: true,
    teleconsultation: 1, // 1 gratuite (si tu veux boolean, mets true)
    ordonnances: true,
    analyses: false,
    conseilsSante: false,
    braceletConnecte: false,
    prix: "Gratuit",
  },
  dateActivation: new Date().toISOString(),
};

// DOM
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberMe = document.getElementById("rememberMe");
const submitBtn = document.getElementById("submitBtn");
const toggleBtn = document.getElementById("toggleBtn");

// Helpers
function getStore() {
  // si "se souvenir de moi" -> localStorage sinon sessionStorage
  return rememberMe?.checked ? localStorage : sessionStorage;
}

function setStorage(key, value) {
  getStore().setItem(key, value);
}

function setSessionBasics({ email, role, displayName }) {
  setStorage("userEmail", email);
  setStorage("userRole", role);
  setStorage("displayName", displayName || role);
}

function handleLogin() {
  const email = (emailInput?.value || "").trim().toLowerCase();
  const password = (passwordInput?.value || "").trim();

  if (!email || !password) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  submitBtn.textContent = "CONNEXION...";
  submitBtn.disabled = true;

  // ✅ Détection rôles (par email)
  const isLaboratoire =
    email.includes("@laboratoire") || email.includes("@labo") || email.includes("@lab");

  const isPharmacie =
    email.includes("@pharmacie") || email.includes("@pharma");

  const isMedecin =
    email.includes("@medecin") || email.includes("@doctor") || email.includes("@dr");

  // Simulation (remplace par API plus tard)
  setTimeout(() => {
    // LABO
    if (isLaboratoire) {
      setSessionBasics({
        email,
        role: "laboratoire",
        displayName: "Laboratoire",
      });
      console.log("✅ Connexion laboratoire détectée → dashboard laboratoire");
      window.location.href = "dashboard_laboratoire.html";
      return;
    }

    // PHARMACIE
    if (isPharmacie) {
      setSessionBasics({
        email,
        role: "pharmacie",
        displayName: "Pharmacie",
      });
      console.log("✅ Connexion pharmacie détectée → dashboard pharmacie");
      window.location.href = "pharmacie.html";
      return;
    }

    // MEDECIN
    if (isMedecin) {
      setSessionBasics({
        email,
        role: "medecin",
        displayName: "Médecin",
      });
      console.log("✅ Connexion médecin détectée → dashboard médecin");
      window.location.href = "dashboard_medecin.html";
      return;
    }

    // PATIENT
    setSessionBasics({
      email,
      role: "patient",
      displayName: "Patient",
    });
    console.log("✅ Connexion patient détectée");

    // Ton dashboard_patient.js lit localStorage ("userPlan")
    // donc on met le plan dans localStorage pour éviter les bugs.
    const existingPlan = localStorage.getItem("userPlan");
    if (!existingPlan) {
      localStorage.setItem("userPlan", JSON.stringify(defaultPlan));
      console.log("📋 Plan Essai attribué automatiquement (localStorage)");
    } else {
      console.log("📋 Plan existant trouvé:", JSON.parse(existingPlan));
    }

    window.location.href = "dashboard_patient.html";
  }, 350);
}

function goToSignup() {
  window.location.href = "signup.html";
}

function handleKeyPress(event) {
  if (event.key === "Enter") handleLogin();
}

// Events
submitBtn?.addEventListener("click", handleLogin);
toggleBtn?.addEventListener("click", goToSignup);
emailInput?.addEventListener("keypress", handleKeyPress);
passwordInput?.addEventListener("keypress", handleKeyPress);

document.addEventListener("DOMContentLoaded", () => {
  console.log("Vitalia+ - Login chargé");
  console.log("   📧 @laboratoire / @labo / @lab → Dashboard Laboratoire");
  console.log("   📧 @pharmacie / @pharma → Dashboard Pharmacie");
  console.log("   📧 @medecin / @doctor / @dr → Dashboard Médecin");
  console.log("   📧 autre → Dashboard Patient + Plan Essai auto");
});
