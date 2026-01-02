// Gestion des onglets
document.addEventListener('DOMContentLoaded', function() {
    console.log('Vitalia+ - Page Mes Consultations chargée');
    
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Retirer la classe active de tous les tabs et panels
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            // Ajouter la classe active au tab et panel sélectionnés
            this.classList.add('active');
            document.querySelector(`[data-panel="${targetTab}"]`).classList.add('active');
        });
    });
    
    // Animation des cartes
    const cards = document.querySelectorAll('.consultation-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Fonction pour déconnexion
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        sessionStorage.removeItem('userPlan');
        console.log('🚪 Déconnexion réussie');
        window.location.href = 'login.html';
    }
}

// Fonction pour nouvelle consultation
function newConsultation() {
    console.log('📅 Nouvelle consultation demandée');
    alert('🩺 Vous allez être redirigé vers la page de sélection de médecin.\n\nChoisissez votre spécialité et votre médecin préféré.');
    // window.location.href = 'select_doctor.html';
}

// Fonction pour rejoindre une consultation
function joinConsultation(id) {
    console.log(`🎥 Rejoindre la consultation ${id}`);
    
    // Vérifier si c'est le bon moment
    const now = new Date();
    const consultationTime = new Date('2024-12-16T14:30:00'); // Exemple
    
    const timeDiff = consultationTime - now;
    const minutesUntil = Math.floor(timeDiff / 1000 / 60);
    
    if (minutesUntil > 5) {
        alert(`⏰ Votre consultation commence dans ${minutesUntil} minutes.\n\nVous pourrez rejoindre la salle d'attente 5 minutes avant l'heure prévue.`);
    } else {
        alert('🎥 Connexion à la salle de consultation...\n\nAssurez-vous que votre caméra et microphone sont activés.');
        // window.location.href = 'video_consultation.html?id=' + id;
    }
}

// Fonction pour reprogrammer
function reschedule(id) {
    console.log(`📅 Reprogrammer la consultation ${id}`);
    
    if (confirm('Voulez-vous reprogrammer cette consultation ?\n\nVous pourrez choisir un nouveau créneau horaire.')) {
        alert('📆 Vous allez être redirigé vers la page de reprogrammation.');
        // window.location.href = 'reschedule.html?id=' + id;
    }
}

// Fonction pour annuler une consultation
function cancelConsultation(id) {
    console.log(`❌ Annuler la consultation ${id}`);
    
    const reason = prompt('Pourquoi souhaitez-vous annuler cette consultation ?\n\n(Cette information est facultative mais nous aide à améliorer nos services)');
    
    if (reason !== null) {
        if (confirm('Êtes-vous sûr de vouloir annuler cette consultation ?')) {
            alert('✅ Votre consultation a été annulée.\n\nUn email de confirmation vous a été envoyé.');
            
            // Simuler l'annulation
            setTimeout(() => {
                location.reload();
            }, 1500);
        }
    }
}

// Fonction pour voir le compte-rendu
function viewReport(id) {
    console.log(`📄 Voir le compte-rendu ${id}`);
    alert('📋 Ouverture du compte-rendu de consultation...\n\nVous pourrez le télécharger en PDF si nécessaire.');
    // window.location.href = 'consultation_report.html?id=' + id;
}

// Fonction pour voir l'ordonnance
function viewPrescription(id) {
    console.log(`💊 Voir l'ordonnance ${id}`);
    window.location.href = 'ordonnances.html?highlight=' + id;
}

// Fonction pour reprendre rendez-vous
function rebookConsultation(id) {
    console.log(`🔄 Reprendre rendez-vous ${id}`);
    alert('📅 Vous allez être redirigé vers la page de prise de rendez-vous.\n\nVous pourrez choisir un nouveau créneau avec le même médecin.');
    // window.location.href = 'select_doctor.html?doctor_id=' + id;
}

// Gestion des notifications
const notificationBtn = document.querySelector('.notification');
if (notificationBtn) {
    notificationBtn.addEventListener('click', function() {
        alert('🔔 Notifications:\n\n• Votre consultation de demain à 14h30 est confirmée\n• Nouveau compte-rendu disponible\n• Rappel: Prise de médicament à 18h');
    });
}

// Fonction pour filtrer les consultations (future feature)
function filterConsultations(filter) {
    console.log('🔍 Filtre appliqué:', filter);
    // À implémenter: filtrer par médecin, date, statut, etc.
}

// Fonction pour exporter l'historique (future feature)
function exportHistory() {
    console.log('📥 Export de l\'historique demandé');
    alert('📄 Export de votre historique de consultations en cours...\n\nVous recevrez un PDF par email dans quelques instants.');
}
