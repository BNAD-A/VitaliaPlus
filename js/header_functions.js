// ==========================================
// VITALIA+ - Fonctionnalités du Header (CORRIGÉ)
// ==========================================

// 🔧 CORRECTION : Fonction pour récupérer le plan utilisateur
function getUserPlan() {
    try {
        const planData = localStorage.getItem("userPlan");
        if (planData) {
            const plan = JSON.parse(planData);
            console.log("📋 Plan utilisateur (header):", plan);
            return plan;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du plan:", error);
    }
    return null;
}

// 🔧 CORRECTION : Fonction pour obtenir le texte du plan
function getPlanText(userPlan) {
    if (!userPlan) return 'Plan Essai';
    
    switch(userPlan.name) {
        case 'Essai':
            return 'Plan Essai';
        case 'Standard':
            return 'Plan Standard';
        case 'Premium':
            return 'Plan Premium';
        default:
            return `Plan ${userPlan.name}`;
    }
}

// Fonction pour gérer le clic sur le logo - retour à l'accueil
function goToHome() {
    // Si on est déjà connecté, aller au dashboard
    const userPlan = localStorage.getItem('userPlan');
    if (userPlan) {
        window.location.href = 'dashboard_patient.html';
    } else {
        // Sinon, aller à la page d'accueil publique
        window.location.href = 'index.html';
    }
}

// Fonction pour ouvrir la recherche
function openSearch() {
    // Créer une modal de recherche
    const searchModal = document.createElement('div');
    searchModal.className = 'search-modal';
    searchModal.innerHTML = `
        <div class="search-overlay" onclick="closeSearch()"></div>
        <div class="search-container">
            <div class="search-header">
                <input type="text" id="searchInput" placeholder="Rechercher un médecin, un service, une ordonnance..." autofocus>
                <button class="close-search" onclick="closeSearch()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="search-results">
                <div class="search-category">
                    <h4>Recherches récentes</h4>
                    <ul class="recent-searches">
                        <li onclick="selectSearch('Dr. Karim Alami')">Dr. Karim Alami - Cardiologue</li>
                        <li onclick="selectSearch('Ordonnance du 10 Dec')">Ordonnance du 10 Décembre</li>
                        <li onclick="selectSearch('Analyses biologiques')">Mes analyses biologiques</li>
                    </ul>
                </div>
                <div class="search-category">
                    <h4>Suggestions</h4>
                    <ul class="search-suggestions">
                        <li onclick="selectSearch('Renouveler mon traitement')">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            Renouveler mon traitement
                        </li>
                        <li onclick="selectSearch('Prendre rendez-vous')">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            Prendre rendez-vous
                        </li>
                        <li onclick="selectSearch('Mes résultats d\'analyses')">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 11l3 3L22 4"></path>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                            </svg>
                            Mes résultats d'analyses
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(searchModal);
    
    // Focus sur l'input de recherche
    setTimeout(() => {
        document.getElementById('searchInput').focus();
    }, 100);
    
    // Ajouter la fonctionnalité de recherche en temps réel
    document.getElementById('searchInput').addEventListener('input', function(e) {
        performSearch(e.target.value);
    });
    
    // Fermer avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSearch();
        }
    });
}

// Fonction pour fermer la recherche
function closeSearch() {
    const searchModal = document.querySelector('.search-modal');
    if (searchModal) {
        searchModal.remove();
    }
}

// Fonction pour effectuer la recherche
function performSearch(query) {
    if (query.length < 2) return;
    
    console.log('🔍 Recherche:', query);
    
    // Simuler une recherche (à remplacer par une vraie recherche backend)
    const results = [
        { type: 'doctor', name: 'Dr. Karim Alami', specialty: 'Cardiologue' },
        { type: 'service', name: 'Téléconsultation' },
        { type: 'prescription', name: 'Ordonnance du 10 Décembre' }
    ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
    
    // Afficher les résultats (à implémenter)
}

// Fonction pour sélectionner un résultat de recherche
function selectSearch(searchTerm) {
    console.log('✅ Recherche sélectionnée:', searchTerm);
    closeSearch();
    
    // Rediriger selon le type de recherche
    if (searchTerm.includes('Dr.')) {
        alert('🩺 Redirection vers le profil du médecin...');
        // window.location.href = 'doctor_profile.html';
    } else if (searchTerm.includes('Ordonnance')) {
        window.location.href = 'ordonnances.html';
    } else if (searchTerm.includes('analyses')) {
        window.location.href = 'analyses.html';
    } else if (searchTerm.includes('rendez-vous')) {
        window.location.href = 'mes_consultations.html';
    } else if (searchTerm.includes('Renouveler')) {
        window.location.href = 'services.html';
    }
}

// Fonction pour ouvrir les notifications
function openNotifications() {
    // Créer une modal de notifications
    const notifModal = document.createElement('div');
    notifModal.className = 'notification-modal';
    notifModal.innerHTML = `
        <div class="notification-overlay" onclick="closeNotifications()"></div>
        <div class="notification-container">
            <div class="notification-header">
                <h3>Notifications</h3>
                <button class="close-notif" onclick="closeNotifications()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="notification-list">
                <div class="notification-item unread" onclick="markAsRead(this)">
                    <div class="notif-icon consultation">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    </div>
                    <div class="notif-content">
                        <h4>Consultation confirmée</h4>
                        <p>Votre rendez-vous avec Dr. Alami est confirmé pour demain à 14h30</p>
                        <span class="notif-time">Il y a 2 heures</span>
                    </div>
                </div>
                
                <div class="notification-item unread" onclick="markAsRead(this)">
                    <div class="notif-icon prescription">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                    </div>
                    <div class="notif-content">
                        <h4>Nouvelle ordonnance disponible</h4>
                        <p>Votre ordonnance est prête. Cliquez pour la voir.</p>
                        <span class="notif-time">Il y a 5 heures</span>
                    </div>
                </div>
                
                <div class="notification-item unread" onclick="markAsRead(this)">
                    <div class="notif-icon reminder">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div class="notif-content">
                        <h4>Rappel médicament</h4>
                        <p>N'oubliez pas de prendre votre médicament à 18h</p>
                        <span class="notif-time">Il y a 1 jour</span>
                    </div>
                </div>
                
                <div class="notification-item" onclick="markAsRead(this)">
                    <div class="notif-icon delivery">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="1" y="3" width="15" height="13"></rect>
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                    </div>
                    <div class="notif-content">
                        <h4>Commande livrée</h4>
                        <p>Votre commande de médicaments a été livrée avec succès</p>
                        <span class="notif-time">Il y a 2 jours</span>
                    </div>
                </div>
            </div>
            <div class="notification-footer">
                <button class="btn-mark-all-read" onclick="markAllAsRead()">Tout marquer comme lu</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(notifModal);
}

// Fonction pour fermer les notifications
function closeNotifications() {
    const notifModal = document.querySelector('.notification-modal');
    if (notifModal) {
        notifModal.remove();
    }
}

// Fonction pour marquer une notification comme lue
function markAsRead(element) {
    element.classList.remove('unread');
    
    // Mettre à jour le badge de notification
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        const currentCount = parseInt(badge.textContent);
        if (currentCount > 0) {
            badge.textContent = currentCount - 1;
            if (currentCount - 1 === 0) {
                badge.style.display = 'none';
            }
        }
    }
}

// Fonction pour marquer toutes les notifications comme lues
function markAllAsRead() {
    document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
    });
    
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = '0';
        badge.style.display = 'none';
    }
}

// 🔧 CORRECTION : Fonction pour ouvrir le menu utilisateur avec le bon plan
function openUserMenu() {
    // Créer un menu déroulant
    const existingMenu = document.querySelector('.user-dropdown-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    // ✅ Récupérer le plan utilisateur
    const userPlan = getUserPlan();
    const planText = getPlanText(userPlan);
    
    const userProfile = document.querySelector('.user-profile');
    const menu = document.createElement('div');
    menu.className = 'user-dropdown-menu';
    menu.innerHTML = `
        <div class="user-menu-header">
            <img src="https://via.placeholder.com/60" alt="Profile">
            <div>
                <h4>Ahmed K.</h4>
                <p>${planText}</p>
            </div>
        </div>
        <div class="user-menu-items">
            <a href="dashboard_patient.html" class="menu-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Mon Dashboard
            </a>
            <a href="#" class="menu-item" onclick="alert('Fonctionnalité à venir')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Mon Profil
            </a>
            <a href="choose_plan.html" class="menu-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                Mon Abonnement
            </a>
            <a href="#" class="menu-item" onclick="alert('Fonctionnalité à venir')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6m5.196-14.196l-4.243 4.243m0 5.656l4.243 4.243M1 12h6m6 0h6m-14.196 5.196l4.243-4.243m5.656 0l4.243 4.243"></path>
                </svg>
                Paramètres
            </a>
            <hr>
            <a href="#" class="menu-item danger" onclick="logout()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Se déconnecter
            </a>
        </div>
    `;
    
    userProfile.appendChild(menu);
    
    // Fermer le menu en cliquant ailleurs
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!userProfile.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

// Initialiser les événements au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Header functions initialisé');
    
    // ✅ Afficher le plan dans la console
    const userPlan = getUserPlan();
    if (userPlan) {
        console.log('✅ Plan actif dans header:', getPlanText(userPlan));
    }
    
    // Logo cliquable
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', goToHome);
    }
    
    // Bouton de recherche
    const searchBtn = document.querySelector('.btn-icon:not(.notification)');
    if (searchBtn) {
        searchBtn.addEventListener('click', openSearch);
    }
    
    // Bouton de notifications
    const notifBtn = document.querySelector('.btn-icon.notification');
    if (notifBtn) {
        notifBtn.addEventListener('click', openNotifications);
    }
    
    // Profil utilisateur
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.style.cursor = 'pointer';
        userProfile.addEventListener('click', openUserMenu);
    }
});