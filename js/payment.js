// Configuration des plans
const plansConfig = {
    'Essai': {
        price: 0,
        name: 'Plan Essai',
        badge: 'Gratuit',
        description: 'Découvrez nos services gratuitement',
        features: [
            '✓ 1 téléconsultation gratuite',
            '✓ Livraison offerte',
            '✓ Accès application',
            '✗ Analyses biologiques',
            '✗ Bracelet connecté'
        ]
    },
    'Standard': {
        price: 199,
        name: 'Plan Standard',
        badge: 'Populaire',
        description: 'Pour un suivi régulier de votre santé',
        features: [
            '✓ Téléconsultations (99 DH)',
            '✓ Livraison (15 DH/commande)',
            '✓ Accès application',
            '✓ Analyses biologiques',
            '✗ Bracelet connecté'
        ]
    },
    'Premium': {
        price: 499,
        name: 'Plan Premium',
        badge: 'Le plus populaire',
        description: 'Accès complet à tous les services + Bracelet connecté',
        features: [
            '✓ Téléconsultations illimitées',
            '✓ Livraison gratuite',
            '✓ Accès application',
            '✓ Analyses biologiques',
            '✓ Bracelet connecté inclus',
            '✓ Conseils santé personnalisés'
        ]
    }
};

// Variables globales
let selectedPlan = null;
let totalAmount = 0;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    console.log('💳 Page de paiement Vitalia+ chargée');
    
    // Récupérer le plan depuis sessionStorage
    const planData = sessionStorage.getItem('userPlan');
    if (planData) {
        const plan = JSON.parse(planData);
        selectedPlan = plan.name;
        loadPlanInfo(selectedPlan);
    } else {
        // Plan par défaut si aucun n'est sélectionné
        selectedPlan = 'Premium';
        loadPlanInfo(selectedPlan);
    }
    
    // Initialiser les événements
    initPaymentMethods();
    initCardForm();
    initMobilePaymentForm();
});

// Charger les informations du plan
function loadPlanInfo(planName) {
    const plan = plansConfig[planName];
    if (!plan) return;
    
    // Mettre à jour les informations du plan
    document.getElementById('planName').textContent = plan.name;
    document.getElementById('planBadge').textContent = plan.badge;
    document.getElementById('planDescription').textContent = plan.description;
    
    // Mettre à jour la liste des fonctionnalités
    const featuresList = document.getElementById('featuresList');
    featuresList.innerHTML = plan.features.map(feature => `<li>${feature}</li>`).join('');
    
    // Calculer les prix
    const basePrice = plan.price;
    const tax = basePrice * 0.20; // TVA 20%
    const discount = basePrice > 0 ? 50 : 0; // Réduction de 50 DH pour les plans payants
    totalAmount = basePrice + tax - discount;
    
    // Mettre à jour l'affichage des prix
    document.getElementById('basePriceDisplay').textContent = `${basePrice.toFixed(2)} DH`;
    document.getElementById('taxDisplay').textContent = `${tax.toFixed(2)} DH`;
    document.getElementById('totalPriceDisplay').textContent = `${totalAmount.toFixed(2)} DH`;
    document.getElementById('payButtonAmount').textContent = `${totalAmount.toFixed(2)} DH`;
    
    if (document.getElementById('payButtonAmountMobile')) {
        document.getElementById('payButtonAmountMobile').textContent = `${totalAmount.toFixed(2)} DH`;
    }
    
    // Afficher/masquer la réduction
    const discountRow = document.getElementById('discountRow');
    if (discount > 0) {
        discountRow.style.display = 'flex';
        document.getElementById('discountDisplay').textContent = `-${discount.toFixed(2)} DH`;
    } else {
        discountRow.style.display = 'none';
    }
    
    // Générer une référence de paiement
    const reference = `VIT-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    if (document.getElementById('paymentReference')) {
        document.getElementById('paymentReference').textContent = reference;
    }
    
    console.log(`✅ Plan chargé: ${planName} - Total: ${totalAmount.toFixed(2)} DH`);
}

// Gestion des méthodes de paiement
function initPaymentMethods() {
    const paymentMethodCards = document.querySelectorAll('.payment-method-card');
    const cardForm = document.getElementById('cardPaymentForm');
    const mobileForm = document.getElementById('mobilePaymentForm');
    const virementInfo = document.getElementById('virementInfo');
    
    paymentMethodCards.forEach(card => {
        card.addEventListener('click', function() {
            // Retirer l'active de tous les cards
            paymentMethodCards.forEach(c => c.classList.remove('active'));
            
            // Ajouter active au card cliqué
            this.classList.add('active');
            
            // Cocher le radio button
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Afficher le formulaire correspondant
            const method = this.dataset.method;
            
            cardForm.style.display = 'none';
            mobileForm.style.display = 'none';
            virementInfo.style.display = 'none';
            
            switch(method) {
                case 'card':
                    cardForm.style.display = 'block';
                    break;
                case 'mobile':
                    mobileForm.style.display = 'block';
                    break;
                case 'virement':
                    virementInfo.style.display = 'block';
                    break;
            }
        });
    });
}

// Gestion du formulaire carte bancaire
function initCardForm() {
    const cardForm = document.getElementById('cardPaymentForm');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    const cardTypeIcon = document.getElementById('cardTypeIcon');
    
    // Formatage du numéro de carte
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
            
            // Détecter le type de carte
            detectCardType(value);
        });
    }
    
    // Formatage de la date d'expiration
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // Restriction CVV (chiffres uniquement)
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
    
    // Soumission du formulaire
    if (cardForm) {
        cardForm.addEventListener('submit', handleCardPayment);
    }
}

// Détecter le type de carte
function detectCardType(cardNumber) {
    const cardTypeIcon = document.getElementById('cardTypeIcon');
    if (!cardTypeIcon) return;
    
    // Patterns pour différents types de cartes
    const patterns = {
        visa: /^4/,
        mastercard: /^5[1-5]/,
        cmi: /^9/  // CMI commence généralement par 9 au Maroc
    };
    
    let cardType = 'generic';
    for (const [type, pattern] of Object.entries(patterns)) {
        if (pattern.test(cardNumber)) {
            cardType = type;
            break;
        }
    }
    
    // Mettre à jour l'icône (vous pouvez remplacer par de vraies icônes)
    console.log(`💳 Type de carte détecté: ${cardType}`);
}

// Gestion du paiement par carte
function handleCardPayment(e) {
    e.preventDefault();
    
    const cardNumber = document.getElementById('cardNumber').value;
    const cardName = document.getElementById('cardName').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;
    
    // Validation
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
        alert('Veuillez remplir tous les champs de la carte');
        return;
    }
    
    if (!acceptTerms) {
        alert('Veuillez accepter les conditions générales');
        return;
    }
    
    // Validation du numéro de carte (algorithme de Luhn simplifié)
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
        alert('Numéro de carte invalide');
        return;
    }
    
    // Validation de la date d'expiration
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        alert('Votre carte est expirée');
        return;
    }
    
    // Simulation du paiement
    processPayment('card', {
        cardNumber: maskCardNumber(cleanCardNumber),
        cardName,
        amount: totalAmount
    });
}

// Gestion du paiement mobile
function initMobilePaymentForm() {
    const mobileForm = document.getElementById('mobilePaymentForm');
    if (mobileForm) {
        mobileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const service = document.getElementById('mobileService').value;
            const mobileNumber = document.getElementById('mobileNumber').value;
            
            if (!mobileNumber) {
                alert('Veuillez entrer votre numéro de téléphone');
                return;
            }
            
            processPayment('mobile', {
                service,
                mobileNumber,
                amount: totalAmount
            });
        });
    }
}

// Traiter le paiement
function processPayment(method, data) {
    const payButton = document.querySelector('.btn-pay');
    const originalText = payButton.innerHTML;
    
    // Animation du bouton
    payButton.disabled = true;
    payButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
        </svg>
        Traitement en cours...
    `;
    
    // Ajouter l'animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Simulation du traitement (remplacer par l'appel API réel)
    setTimeout(() => {
        console.log('💳 Paiement traité:', { method, data });
        
        // Sauvegarder les informations de paiement
        const paymentInfo = {
            method,
            amount: totalAmount,
            plan: selectedPlan,
            date: new Date().toISOString(),
            status: 'completed'
        };
        
        sessionStorage.setItem('lastPayment', JSON.stringify(paymentInfo));
        
        // Afficher le succès
        showPaymentSuccess();
        
    }, 3000);
}

// Afficher le succès du paiement
function showPaymentSuccess() {
    // Créer une overlay de succès
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;
    
    const successCard = document.createElement('div');
    successCard.style.cssText = `
        background: white;
        padding: 3rem;
        border-radius: 24px;
        text-align: center;
        max-width: 500px;
        animation: slideUp 0.5s ease;
    `;
    
    successCard.innerHTML = `
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>
        <h2 style="color: #892D3F; font-size: 2rem; margin-bottom: 1rem;">Paiement réussi !</h2>
        <p style="color: #6b7280; margin-bottom: 2rem; font-size: 1.125rem;">
            Votre abonnement <strong>${selectedPlan}</strong> a été activé avec succès.<br>
            Montant payé : <strong>${totalAmount.toFixed(2)} DH</strong>
        </p>
        <button onclick="window.location.href='dashboard_patient.html'" style="
            padding: 1rem 2rem;
            background: linear-gradient(135deg, #892D3F 0%, #6e2432 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1.125rem;
            cursor: pointer;
        ">
            Accéder à mon dashboard
        </button>
    `;
    
    // Ajouter les animations CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    overlay.appendChild(successCard);
    document.body.appendChild(overlay);
}

// Masquer le numéro de carte
function maskCardNumber(cardNumber) {
    return '**** **** **** ' + cardNumber.slice(-4);
}

// Formatage du numéro de téléphone
const mobileNumberInput = document.getElementById('mobileNumber');
if (mobileNumberInput) {
    mobileNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        
        if (value.startsWith('0') && value.length > 1) {
            value = '+212' + value.substring(1);
        }
        
        if (value.startsWith('+212') && value.length > 4) {
            const formatted = value.substring(0, 4) + ' ' + 
                             value.substring(4, 7) + 
                             (value.length > 7 ? ' ' + value.substring(7, 10) : '') +
                             (value.length > 10 ? ' ' + value.substring(10, 13) : '');
            e.target.value = formatted.trim();
        }
    });
}

console.log('💳 Module de paiement initialisé');