// Fonction de déconnexion
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        sessionStorage.removeItem('userPlan');
        console.log('🚪 Déconnexion réussie');
        window.location.href = 'login.html';
    }
}

// Fonction pour demander une nouvelle analyse
function requestAnalysis() {
    console.log('🔬 Demande de nouvelle analyse');
    alert('📋 Demande d\'analyse\n\nPour demander une analyse biologique, vous devez d\'abord consulter un médecin qui vous prescrira les analyses nécessaires.\n\nVoulez-vous prendre rendez-vous pour une téléconsultation ?');
    
    if (confirm('Rediriger vers la page de consultation ?')) {
        window.location.href = 'services.html';
    }
}

// Fonction pour contacter un laboratoire
function contactLab(id) {
    console.log(`📞 Contact laboratoire pour analyse ${id}`);
    alert('📞 Contact Laboratoire\n\nLe laboratoire vous contactera dans les prochaines heures pour confirmer votre rendez-vous.\n\nVous pouvez également les appeler directement au:\n📱 +212 5XX-XXX-XXX');
}

// Fonction pour voir le résultat complet
function viewFullResult(id) {
    console.log(`📊 Voir résultat complet ${id}`);
    alert('📊 Rapport d\'analyse complet\n\nAffichage du rapport détaillé avec tous les paramètres mesurés, les valeurs de référence et les commentaires du biologiste.');
    // window.location.href = 'analysis_report.html?id=' + id;
}

// Fonction pour télécharger un résultat
function downloadResult(id) {
    console.log(`📥 Téléchargement résultat ${id}`);
    alert('📄 Téléchargement en cours...\n\nLe résultat sera téléchargé au format PDF.');
}

// Animation au chargement
document.addEventListener('DOMContentLoaded', function() {
    console.log('Vitalia+ - Page Analyses chargée');
    
    // Animation des cartes
    const cards = document.querySelectorAll('.analyse-card, .result-card, .history-item');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Gestion des notifications
    const notificationBtn = document.querySelector('.notification');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            alert('🔔 Notifications:\n\n• Vos résultats d\'analyse seront disponibles demain\n• Rappel: Prise de sang programmée le 15/12\n• Nouveau compte-rendu disponible');
        });
    }
});
