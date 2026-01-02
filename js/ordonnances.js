// Fonction de déconnexion
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        sessionStorage.removeItem('userPlan');
        console.log('🚪 Déconnexion réussie');
        window.location.href = 'login.html';
    }
}

// Fonction pour suivre la livraison
function trackDelivery(id) {
    console.log(`📍 Suivi de livraison pour ordonnance ${id}`);
    alert('🚚 Suivi de livraison\n\nVotre commande est en cours de livraison.\nLivreur: Ahmed M.\nArrivée estimée: Demain 14h-16h\n\nVous recevrez une notification lors de la livraison.');
}

// Fonction pour télécharger l'ordonnance
function downloadPrescription(id) {
    console.log(`📥 Téléchargement de l'ordonnance ${id}`);
    alert('📄 Téléchargement en cours...\n\nL\'ordonnance sera téléchargée au format PDF.');
}

// Fonction pour renouveler une commande
function reorder(id) {
    console.log(`🔄 Renouvellement de l'ordonnance ${id}`);
    if (confirm('Voulez-vous renouveler cette commande ?\n\nLes mêmes médicaments seront commandés à votre pharmacie habituelle.')) {
        alert('✅ Commande renouvelée!\n\nVous recevrez une confirmation par email.');
    }
}

// Fonction pour voir les détails d'une ordonnance
function viewPrescription(id) {
    console.log(`👁️ Voir détails ordonnance ${id}`);
    alert('📋 Affichage des détails de l\'ordonnance...');
}

// Animation au chargement
document.addEventListener('DOMContentLoaded', function() {
    console.log('Vitalia+ - Page Ordonnances chargée');
    
    // Animation des cartes
    const cards = document.querySelectorAll('.ordonnance-card, .ordonnance-item');
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
            alert('🔔 Notifications:\n\n• Votre ordonnance est en livraison\n• Nouvelle ordonnance disponible\n• Rappel: Renouveler votre traitement');
        });
    }
});
