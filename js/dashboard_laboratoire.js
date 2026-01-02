// Données fictives des demandes d'analyses
const analysisRequests = [
    {
        id: 'AN-2024-001',
        patient: 'Ahmed Khalil',
        type: 'Bilan lipidique complet',
        doctor: 'Dr. Karim Alami',
        date: '2024-12-24',
        status: 'pending'
    },
    {
        id: 'AN-2024-002',
        patient: 'Fatima Zahra',
        type: 'Glycémie à jeun',
        doctor: 'Dr. Sara Bennani',
        date: '2024-12-24',
        status: 'progress'
    },
    {
        id: 'AN-2024-003',
        patient: 'Mohammed Tazi',
        type: 'NFS (Numération Formule Sanguine)',
        doctor: 'Dr. Hassan Tazi',
        date: '2024-12-23',
        status: 'progress'
    },
    {
        id: 'AN-2024-004',
        patient: 'Amina Fassi',
        type: 'Fonction rénale',
        doctor: 'Dr. Amina Fassi',
        date: '2024-12-23',
        status: 'completed'
    },
    {
        id: 'AN-2024-005',
        patient: 'Youssef Alaoui',
        type: 'Bilan hépatique',
        doctor: 'Dr. Karim Alami',
        date: '2024-12-22',
        status: 'completed'
    }
];

// Variable globale pour stocker la demande sélectionnée
let selectedRequest = null;

// Afficher les demandes dans le tableau
function displayRequests(filter = 'all') {
    const tbody = document.getElementById('requestsTable');
    tbody.innerHTML = '';
    
    let filteredRequests = analysisRequests;
    
    if (filter !== 'all') {
        filteredRequests = analysisRequests.filter(req => req.status === filter);
    }
    
    filteredRequests.forEach(request => {
        const row = document.createElement('tr');
        
        const statusText = {
            'pending': 'En attente',
            'progress': 'En cours',
            'completed': 'Terminée'
        };
        
        const statusClass = `status-${request.status}`;
        
        row.innerHTML = `
            <td><strong>${request.id}</strong></td>
            <td>${request.patient}</td>
            <td>${request.type}</td>
            <td>${request.doctor}</td>
            <td>${request.date}</td>
            <td><span class="status-badge ${statusClass}">${statusText[request.status]}</span></td>
            <td>
                ${request.status === 'pending' ? 
                    `<button class="btn-action btn-update" onclick="updateStatus('${request.id}', 'progress')">Commencer</button>` : ''}
                ${request.status === 'progress' ? 
                    `<button class="btn-action btn-upload-result" onclick="openUploadModal('${request.id}')">Upload résultats</button>` : ''}
                ${request.status === 'completed' ? 
                    `<button class="btn-action btn-view" onclick="viewResults('${request.id}')">Voir résultats</button>` : ''}
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Filtrer les demandes
function filterRequests(status) {
    // Mettre à jour les boutons de filtre
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    displayRequests(status);
}

// Mettre à jour le statut d'une analyse
function updateStatus(requestId, newStatus) {
    const request = analysisRequests.find(r => r.id === requestId);
    if (request) {
        request.status = newStatus;
        displayRequests();
        
        const statusText = {
            'progress': 'en cours',
            'completed': 'terminée'
        };
        
        alert(`✅ Analyse ${requestId} passée à "${statusText[newStatus]}"`);
    }
}

// Ouvrir le modal d'upload
function openUploadModal(requestId) {
    const request = analysisRequests.find(r => r.id === requestId);
    if (request) {
        selectedRequest = request;
        
        document.getElementById('modalPatient').textContent = request.patient;
        document.getElementById('modalAnalysis').textContent = request.type;
        document.getElementById('modalRequestId').textContent = request.id;
        
        document.getElementById('uploadModal').style.display = 'block';
    }
}

// Fermer le modal d'upload
function closeUploadModal() {
    document.getElementById('uploadModal').style.display = 'none';
    document.getElementById('filePreview').style.display = 'none';
    document.getElementById('uploadZone').style.display = 'block';
    document.getElementById('btnUpload').disabled = true;
    selectedRequest = null;
}

// Gérer la sélection de fichier
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type === 'application/pdf') {
                document.getElementById('fileName').textContent = file.name;
                document.getElementById('filePreview').style.display = 'flex';
                document.getElementById('uploadZone').style.display = 'none';
                document.getElementById('btnUpload').disabled = false;
            } else {
                alert('❌ Veuillez sélectionner un fichier PDF');
                fileInput.value = '';
            }
        });
    }
});

// Supprimer le fichier sélectionné
function removeFile() {
    document.getElementById('fileInput').value = '';
    document.getElementById('filePreview').style.display = 'none';
    document.getElementById('uploadZone').style.display = 'block';
    document.getElementById('btnUpload').disabled = true;
}

// Upload des résultats
function uploadResults() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file || !selectedRequest) {
        alert('❌ Erreur lors de l\'upload');
        return;
    }
    
    // Simulation d'upload
    document.getElementById('btnUpload').textContent = 'Upload en cours...';
    document.getElementById('btnUpload').disabled = true;
    
    setTimeout(() => {
        // Mettre à jour le statut
        updateStatus(selectedRequest.id, 'completed');
        
        alert(`✅ Résultats uploadés avec succès !\n\nAnalyse: ${selectedRequest.id}\nPatient: ${selectedRequest.patient}\nFichier: ${file.name}\n\nLe patient sera notifié automatiquement.`);
        
        closeUploadModal();
        document.getElementById('btnUpload').textContent = 'Envoyer les résultats';
    }, 2000);
}

// Voir les résultats
function viewResults(requestId) {
    const request = analysisRequests.find(r => r.id === requestId);
    if (request) {
        alert(`📄 Consultation des résultats\n\nID: ${request.id}\nPatient: ${request.patient}\nAnalyse: ${request.type}\n\nLes résultats sont disponibles en PDF.`);
    }
}

// Actions rapides
function showNewRequests() {
    filterRequests('pending');
    document.querySelector('.requests-section').scrollIntoView({ behavior: 'smooth' });
}

function showInProgress() {
    filterRequests('progress');
    document.querySelector('.requests-section').scrollIntoView({ behavior: 'smooth' });
}

function showUploadResults() {
    const inProgress = analysisRequests.filter(r => r.status === 'progress');
    if (inProgress.length > 0) {
        openUploadModal(inProgress[0].id);
    } else {
        alert('ℹ️ Aucune analyse en cours nécessitant un upload de résultats.');
    }
}

// Fonction de déconnexion
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        console.log('🚪 Déconnexion du laboratoire');
        window.location.href = 'login.html';
    }
}

// Fermer le modal en cliquant en dehors
window.onclick = function(event) {
    const modal = document.getElementById('uploadModal');
    if (event.target === modal) {
        closeUploadModal();
    }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
    console.log('Vitalia+ - Dashboard Laboratoire chargé');
    
    // Afficher toutes les demandes
    displayRequests();
    
    // Animation des cartes
    const cards = document.querySelectorAll('.service-card');
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