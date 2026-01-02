function buildPlanObject(planName) {
  if (planName === 'Essai') {
    return {
      name: 'Essai',
      features: {
        livraison: true,
        teleconsultation: true, // ✅ 1 gratuite disponible
        ordonnances: true,
        analyses: false, // ❌ NON disponible pour Essai
        conseilsSante: false,
        braceletConnecte: false, // ❌ NON disponible pour Essai
        prix: 'Gratuit'
      },
      dateActivation: new Date().toISOString()
    };
  }

  if (planName === 'Standard') {
    return {
      name: 'Standard',
      features: {
        livraison: '15 MAD/commande',
        teleconsultation: '99 MAD/consultation',
        ordonnances: true,
        analyses: true, // ✅ Disponible pour Standard
        conseilsSante: false,
        braceletConnecte: false, // ❌ NON disponible pour Standard
        prix: '199 DH / Trimestre'
      },
      dateActivation: new Date().toISOString()
    };
  }

  // Premium - TOUT est disponible
  return {
    name: 'Premium',
    features: {
      livraison: true,
      teleconsultation: '1 gratuite + 79 DH/suivante',
      ordonnances: true,
      analyses: true, // ✅ Disponible
      conseilsSante: true, // ✅ Disponible
      braceletConnecte: true, // ✅ Disponible pour Premium
      prix: '499 DH / Trimestre'
    },
    dateActivation: new Date().toISOString()
  };
}

function choosePlan(planName) {
  // Sauvegarde plan
  const plan = buildPlanObject(planName);
  localStorage.setItem('userPlan', JSON.stringify(plan));

  // UI: surligner le plan choisi
  document.querySelectorAll('.plan-card').forEach(card => {
    card.classList.remove('selected');
  });
  const selected = document.querySelector(`.plan-card[data-plan="${planName}"]`);
  if (selected) selected.classList.add('selected');

  // Redirection immédiate sans alert ni confirmation
  setTimeout(() => {
    window.location.href = 'dashboard_patient.html';
  }, 100);
}

function goToDashboard() {
  // Si aucun plan choisi -> on garde Essai par défaut
  const existing = localStorage.getItem('userPlan');
  if (!existing) {
    localStorage.setItem('userPlan', JSON.stringify(buildPlanObject('Essai')));
  }
  window.location.href = 'dashboard_patient.html';
}

// Au chargement : si plan déjà existant, on le surligne
document.addEventListener('DOMContentLoaded', () => {
  const p = localStorage.getItem('userPlan');
  if (!p) return;

  try {
    const plan = JSON.parse(p);
    const selected = document.querySelector(`.plan-card[data-plan="${plan.name}"]`);
    if (selected) selected.classList.add('selected');
  } catch (e) {
    console.error("Erreur lors du chargement du plan:", e);
  }
});