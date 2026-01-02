// Récupérer le plan de l'utilisateur
let userPlan = null;

try {
    const planData = sessionStorage.getItem('userPlan');
    if (planData) {
        userPlan = JSON.parse(planData);
        console.log('📋 Plan actif:', userPlan);
    }
} catch (error) {
    console.error('Erreur lors de la récupération du plan:', error);
}

// Fonction pour vérifier si une fonctionnalité est disponible
function isFeatureAvailable(featureName) {
    if (!userPlan || !userPlan.features) return true; // Par défaut, tout est disponible
    return userPlan.features[featureName] === true || 
           userPlan.features[featureName] === 'payant' || 
           userPlan.features[featureName] === 'illimite' ||
           userPlan.features[featureName] > 0;
}

// Fonction pour déconnexion
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        sessionStorage.removeItem('userPlan');
        console.log('🚪 Déconnexion réussie');
        window.location.href = 'login.html';
    }
}

// Fonction pour renouveler le traitement
function renewTreatment() {
    if (!isFeatureAvailable('teleconsultation')) {
        alert('❌ Le renouvellement de traitement n\'est pas disponible avec votre plan.\n\nPassez à un plan supérieur pour accéder à cette fonctionnalité.');
        return;
    }
    
    // Redirection vers la page de choix de médecin
    console.log('🔄 Redirection vers renouvellement de traitement');
    alert('📋 Vous allez être redirigé vers la page de sélection de médecin pour renouveler votre traitement.');
    // window.location.href = 'select_doctor.html';
}

// Appliquer les restrictions selon le plan
function applyPlanRestrictions() {
    if (!userPlan) return;
    
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const title = card.querySelector('.service-title').textContent;
        let isAvailable = true;
        let feature = '';
        
        // Déterminer la fonctionnalité correspondante
        if (title.includes('Téléconsultation')) {
            feature = 'teleconsultation';
        } else if (title.includes('Renouveler')) {
            feature = 'teleconsultation';
        } else if (title.includes('Livraison')) {
            feature = 'livraison';
        } else if (title.includes('Analyses')) {
            feature = 'analyses';
        } else if (title.includes('constantes')) {
            feature = 'braceletConnecte';
        } else if (title.includes('Conseils')) {
            feature = 'conseilsSante';
        }
        
        if (feature) {
            isAvailable = isFeatureAvailable(feature);
            
            if (!isAvailable) {
                card.style.opacity = '0.6';
                card.style.cursor = 'not-allowed';
                card.style.filter = 'grayscale(50%)';
                
                // Ajouter un badge "Non disponible"
                const badge = document.createElement('div');
                badge.className = 'service-badge unavailable';
                badge.textContent = '🔒 Non disponible';
                badge.style.cssText = `
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: #e74c3c;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: bold;
                `;
                card.style.position = 'relative';
                card.appendChild(badge);
                
                // Désactiver les boutons
                const buttons = card.querySelectorAll('button');
                buttons.forEach(btn => {
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                    btn.style.cursor = 'not-allowed';
                    btn.onclick = function(e) {
                        e.stopPropagation();
                        alert(`Cette fonctionnalité n'est pas disponible avec votre plan ${userPlan.name}.\n\nPassez à un plan supérieur pour y accéder.`);
                    };
                });
                
                // Désactiver le clic sur la carte
                card.onclick = function(e) {
                    e.stopPropagation();
                    alert(`Cette fonctionnalité n'est pas disponible avec votre plan ${userPlan.name}.\n\nPassez à un plan supérieur pour y accéder.`);
                };
            }
        }
    });
}

// Animation au chargement
document.addEventListener('DOMContentLoaded', function() {
    console.log('Vitalia+ - Page Services chargée');
    
    // Appliquer les restrictions du plan
    applyPlanRestrictions();
    
    // Animation des cartes
    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Gestion des notifications
    const notificationBtn = document.querySelector('.notification');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            alert('🔔 Notifications:\n\n• Votre prochaine consultation est dans 2 jours\n• Nouvelle ordonnance disponible\n• Rappel: Prise de médicament à 14h');
        });
    }
});
