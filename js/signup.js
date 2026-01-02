// Configuration des plans
const plansConfig = {
    'Essai': {
        livraison: true,
        teleconsultation: 1,
        ordonnances: true,
        analyses: false,
        conseilsSante: false,
        braceletConnecte: false,
        prix: 'Gratuit'
    },
    'Standard': {
        livraison: true,
        teleconsultation: 'payant',
        ordonnances: true,
        analyses: true,
        conseilsSante: false,
        braceletConnecte: false,
        prix: '199 DH/Trimestre'
    },
    'Premium': {
        livraison: true,
        teleconsultation: 'illimite',
        ordonnances: true,
        analyses: true,
        conseilsSante: true,
        braceletConnecte: true,
        prix: '499 DH/Trimestre'
    }
};

// Variables globales
let currentStep = 1;
let selectedPlan = null;

// Éléments du DOM
const nomInput = document.getElementById('nom');
const prenomInput = document.getElementById('prenom');
const emailInput = document.getElementById('email');
const telephoneInput = document.getElementById('telephone');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const adresseInput = document.getElementById('adresse');
const villeInput = document.getElementById('ville');
const codePostalInput = document.getElementById('codePostal');
const termsCheckbox = document.getElementById('terms');
const submitBtn = document.getElementById('submitBtn');
const progressFill = document.getElementById('progressFill');

// Fonction de validation de l'email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Fonction de validation du téléphone marocain
function validatePhone(phone) {
    const phoneRegex = /^(\+212|0)[5-7][0-9]{8}$/;
    const cleanPhone = phone.replace(/\s/g, '');
    return phoneRegex.test(cleanPhone);
}

// Fonction de validation du mot de passe
function validatePassword(password) {
    return password.length >= 6;
}

// Fonction de validation du code postal
function validatePostalCode(code) {
    const postalRegex = /^[0-9]{5}$/;
    return postalRegex.test(code);
}

// Fonction de validation de l'étape 1
function validateStep1() {
    const nom = nomInput.value.trim();
    const prenom = prenomInput.value.trim();
    const email = emailInput.value.trim();
    const telephone = telephoneInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const adresse = adresseInput.value.trim();
    const ville = villeInput.value.trim();
    const codePostal = codePostalInput.value.trim();

    if (!nom || nom.length < 2) {
        alert('Veuillez entrer un nom valide (minimum 2 caractères)');
        nomInput.focus();
        return false;
    }

    if (!prenom || prenom.length < 2) {
        alert('Veuillez entrer un prénom valide (minimum 2 caractères)');
        prenomInput.focus();
        return false;
    }

    if (!email) {
        alert('Veuillez entrer votre email');
        emailInput.focus();
        return false;
    }

    if (!validateEmail(email)) {
        alert('Veuillez entrer un email valide');
        emailInput.focus();
        return false;
    }

    if (!telephone) {
        alert('Veuillez entrer votre numéro de téléphone');
        telephoneInput.focus();
        return false;
    }

    if (!validatePhone(telephone)) {
        alert('Veuillez entrer un numéro de téléphone marocain valide (ex: +212 6XX XXX XXX)');
        telephoneInput.focus();
        return false;
    }

    if (!password) {
        alert('Veuillez entrer un mot de passe');
        passwordInput.focus();
        return false;
    }

    if (!validatePassword(password)) {
        alert('Le mot de passe doit contenir au moins 6 caractères');
        passwordInput.focus();
        return false;
    }

    if (password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas');
        confirmPasswordInput.focus();
        return false;
    }

    if (!adresse || adresse.length < 5) {
        alert('Veuillez entrer une adresse valide');
        adresseInput.focus();
        return false;
    }

    if (!ville || ville.length < 2) {
        alert('Veuillez entrer une ville valide');
        villeInput.focus();
        return false;
    }

    if (!codePostal) {
        alert('Veuillez entrer un code postal');
        codePostalInput.focus();
        return false;
    }

    if (!validatePostalCode(codePostal)) {
        alert('Veuillez entrer un code postal valide (5 chiffres)');
        codePostalInput.focus();
        return false;
    }

    return true;
}

// Fonction pour passer à l'étape 2
function goToStep2() {
    if (!validateStep1()) {
        return;
    }

    // Cacher l'étape 1, afficher l'étape 2
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    
    // Mettre à jour la progression
    progressFill.style.width = '100%';
    
    // Mettre à jour le titre
    document.getElementById('mainTitle').textContent = 'Choisissez votre plan';
    document.getElementById('subtitle').textContent = 'Sélectionnez l\'abonnement qui correspond le mieux à vos besoins';
    
    currentStep = 2;
    console.log('✅ Passage à l\'étape 2 - Choix du plan');
}

// Fonction pour revenir à l'étape 1
function backToStep1() {
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step1').style.display = 'block';
    
    // Mettre à jour la progression
    progressFill.style.width = '50%';
    
    // Mettre à jour le titre
    document.getElementById('mainTitle').textContent = 'Créez votre compte patient';
    document.getElementById('subtitle').textContent = 'Remplissez vos informations pour commencer votre parcours santé';
    
    currentStep = 1;
    console.log('⬅️ Retour à l\'étape 1');
}

// Fonction de sélection du plan
function selectPlan(planName) {
    // Retirer la sélection précédente
    document.querySelectorAll('.plan-card-signup').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Ajouter la classe selected à la carte choisie
    const selectedCard = document.querySelector(`.plan-card-signup[data-plan="${planName}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Mettre à jour le plan sélectionné
    selectedPlan = planName;
    
    // Activer le bouton de soumission si les conditions sont acceptées
    if (termsCheckbox && termsCheckbox.checked) {
        submitBtn.disabled = false;
    }
    
    console.log(`📋 Plan sélectionné: ${planName}`);
}

// Événement sur la checkbox des conditions
if (termsCheckbox) {
    termsCheckbox.addEventListener('change', function() {
        if (selectedPlan && this.checked) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    });
}

// Fonction de soumission finale
function handleSubmit() {
    // Vérifier qu'un plan est sélectionné
    if (!selectedPlan) {
        alert('Veuillez sélectionner un plan d\'abonnement');
        return;
    }

    // Vérifier les conditions
    if (!termsCheckbox.checked) {
        alert('Veuillez accepter les conditions d\'utilisation');
        termsCheckbox.focus();
        return;
    }

    // Récupération des données
    const userData = {
        nom: nomInput.value.trim(),
        prenom: prenomInput.value.trim(),
        email: emailInput.value.trim(),
        telephone: telephoneInput.value.trim(),
        password: passwordInput.value,
        adresse: adresseInput.value.trim(),
        ville: villeInput.value.trim(),
        codePostal: codePostalInput.value.trim(),
        plan: selectedPlan
    };

    // Animation du bouton
    submitBtn.innerHTML = '<span>Création en cours...</span>';
    submitBtn.disabled = true;

    // Simulation de l'envoi (à remplacer par un appel API réel)
    setTimeout(() => {
        console.log('✅ Données du patient:', userData);

        // Sauvegarder le plan dans sessionStorage
        const planData = {
            name: selectedPlan,
            features: plansConfig[selectedPlan],
            dateActivation: new Date().toISOString()
        };
        
        sessionStorage.setItem('userPlan', JSON.stringify(planData));
        console.log('💾 Plan sauvegardé:', planData);

        // Succès
        alert(`Compte créé avec succès !\n\nVous avez choisi le plan ${selectedPlan}.\nUn code OTP va être envoyé à votre téléphone.`);

        // Redirection selon le plan
        if (selectedPlan === 'Essai') {
            // Plan gratuit : aller directement au dashboard
            window.location.href = 'dashboard_patient.html';
        } else {
            // Plan payant : aller à la page de paiement
            window.location.href = 'payment.html';
        }
    }, 2000);
}

// Formatage automatique du téléphone
if (telephoneInput) {
    telephoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        
        // Si commence par 0, ajouter +212
        if (value.startsWith('0') && value.length > 1) {
            value = '+212' + value.substring(1);
        }
        
        // Formatage: +212 6XX XXX XXX
        if (value.startsWith('+212') && value.length > 4) {
            const formatted = value.substring(0, 4) + ' ' + 
                             value.substring(4, 7) + 
                             (value.length > 7 ? ' ' + value.substring(7, 10) : '') +
                             (value.length > 10 ? ' ' + value.substring(10, 13) : '');
            e.target.value = formatted.trim();
        }
    });
}

// Gestion de la touche Entrée
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentStep === 1) {
                goToStep2();
            } else if (currentStep === 2 && selectedPlan && termsCheckbox.checked) {
                handleSubmit();
            }
        }
    });
});

// Animation au chargement
document.addEventListener('DOMContentLoaded', () => {
    console.log('Vitalia+ - Page d\'inscription avec choix de plan chargée');
    if (progressFill) {
        progressFill.style.width = '50%';
    }
    if (nomInput) {
        nomInput.focus();
    }
});