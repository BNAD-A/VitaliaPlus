// Variables globales
let currentPatientData = { name: '', age: '', avatar: '' };
let selectedAnalyses = [];

// Pour l'aperçu
let pendingOrdonnanceData = null;
let previewScale = 1;

// Profil médecin (tu peux le rendre dynamique plus tard)
const doctorProfile = {
  name: "DR. KARIM ALAMI",
  specialty: "Médecine Générale",
  inpe: "IN. 123456789",
  city: "Casablanca"
};

// Liste des médicaments
const medicamentsDatabase = [
  "Metformine 500mg", "Metformine 850mg", "Metformine 1000mg",
  "Gliclazide 30mg", "Gliclazide 60mg", "Insuline Lantus",
  "Amlodipine 5mg", "Amlodipine 10mg", "Enalapril 5mg",
  "Enalapril 10mg", "Enalapril 20mg", "Losartan 50mg",
  "Aspirine 100mg", "Atorvastatine 10mg", "Atorvastatine 20mg",
  "Atorvastatine 40mg", "Levothyrox 50µg", "Levothyrox 75µg",
  "Levothyrox 100µg", "Oméprazole 20mg", "Pantoprazole 40mg"
];

// Données des rendez-vous
const appointmentsData = {
  upcoming: [
    {
      name: "Ahmed Benjelloun",
      age: "52 ans",
      condition: "Diabète Type 2",
      time: "14:30 - 15:00",
      daysOffset: 0,
      motif: "Suivi diabète + renouvellement traitement",
      metrics: [
        { label: "Glycémie", value: "142 mg/dL" },
        { label: "HbA1c", value: "7.2%" },
        { label: "Tension", value: "135/85" },
        { label: "Poids", value: "82 kg" }
      ]
    },
    {
      name: "Fatima El Amrani",
      age: "45 ans",
      condition: "Hypertension",
      time: "15:30 - 16:00",
      daysOffset: 0,
      motif: "Contrôle tension artérielle",
      metrics: [
        { label: "Tension", value: "148/92" },
        { label: "FC", value: "78 bpm" },
        { label: "Poids", value: "68 kg" },
        { label: "IMC", value: "25.1" }
      ]
    },
    {
      name: "Mohamed Tazi",
      age: "38 ans",
      condition: "Hypothyroïdie",
      time: "09:00 - 09:30",
      daysOffset: 1,
      motif: "Résultats analyses thyroïde",
      metrics: [
        { label: "TSH", value: "4.2 mUI/L" },
        { label: "T4", value: "12 pmol/L" },
        { label: "Poids", value: "75 kg" },
        { label: "Tension", value: "120/78" }
      ]
    }
  ],
  past: [
    { name: "Sara Alaoui", age: "29 ans", condition: "Asthme", daysOffset: -4, motif: "Suivi asthme - Renouvellement" },
    { name: "Youssef Bennani", age: "56 ans", condition: "Diabète Type 2", daysOffset: -7, motif: "Contrôle glycémie" }
  ]
};

// ==========================================
// INITIALISATION
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
  renderAppointments();
  updateCounts();
  setupEventListeners();
});

// ==========================================
// HELPERS
// ==========================================
function escapeHTML(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttr(str) {
  return escapeHTML(str).replaceAll('\n', ' ');
}

function generateOrdonnanceNumber() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${y}${m}${d}-${random}`;
}

// ==========================================
// RENDEZ-VOUS
// ==========================================
function renderAppointments() {
  const upcomingGrid = document.getElementById('upcomingGrid');
  const pastGrid = document.getElementById('pastGrid');

  upcomingGrid.innerHTML = '';
  pastGrid.innerHTML = '';

  appointmentsData.upcoming.forEach((apt, index) => {
    upcomingGrid.appendChild(createAppointmentCard(apt, index + 1, false));
  });

  appointmentsData.past.forEach((apt, index) => {
    pastGrid.appendChild(createAppointmentCard(apt, index + 1, true));
  });
}

function createAppointmentCard(apt, id, isPast) {
  const card = document.createElement('div');
  card.className = 'appointment-card';
  card.setAttribute('data-name', apt.name);

  const today = new Date();
  const cardDate = new Date(today);
  cardDate.setDate(cardDate.getDate() + apt.daysOffset);
  const dateStr = cardDate.toISOString().split('T')[0];
  card.setAttribute('data-date', dateStr);

  if (isPast) card.style.borderLeftColor = '#6b7280';

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let dateLabel = cardDate.toLocaleDateString('fr-FR', options);
  if (apt.daysOffset === 0) dateLabel = "Aujourd'hui, " + dateLabel;
  else if (apt.daysOffset === 1) dateLabel = "Demain, " + dateLabel;
  dateLabel = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1);

  const metricsHTML = apt.metrics ? `
    <div class="patient-health">
      <h5>📊 Dernières constantes</h5>
      <div class="health-metrics">
        ${apt.metrics.map(m => `
          <div class="metric">
            <span class="metric-label">${escapeHTML(m.label)}</span>
            <span class="metric-value">${escapeHTML(m.value)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  const actionsHTML = isPast ? `
    <div class="appointment-actions">
      <button class="btn-secondary" onclick='viewDossier("${escapeAttr(apt.name)}","${escapeAttr(apt.age)}","${escapeAttr(apt.condition)}","https://via.placeholder.com/80")'>
        📋 Voir dossier
      </button>
    </div>
  ` : `
    <div class="appointment-actions">
      <button class="btn-primary" onclick="joinVisio('${id}')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="23 7 16 12 23 17 23 7"></polygon>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
        </svg>
        Rejoindre visio
      </button>

      <button class="btn-secondary" onclick='viewDossier("${escapeAttr(apt.name)}","${escapeAttr(apt.age)}","${escapeAttr(apt.condition)}","https://via.placeholder.com/80")'>
        📋 Dossier
      </button>

      <button class="btn-ordonnance" onclick='openOrdonnance("${escapeAttr(apt.name)}","${escapeAttr(apt.age)}","https://via.placeholder.com/80")'>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Ordonnance
      </button>
    </div>
  `;

  card.innerHTML = `
    <div class="appointment-header">
      <div class="patient-info">
        <img src="https://via.placeholder.com/80" alt="Patient" class="patient-avatar">
        <div>
          <h3 class="patient-name">${escapeHTML(apt.name)}</h3>
          <p class="patient-meta">👤 ${escapeHTML(apt.age)} • ${escapeHTML(apt.condition)}</p>
        </div>
      </div>

      <div class="time-badge" ${isPast ? 'style="background: rgba(107, 114, 128, 0.1); color:#6b7280;"' : ''}>
        ${isPast ? '✓ Terminée' : escapeHTML(apt.time)}
      </div>
    </div>

    <div class="appointment-details">
      <div class="detail-row">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>${escapeHTML(dateLabel)}</span>
      </div>

      <div class="detail-row">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <span><strong>Motif:</strong> ${escapeHTML(apt.motif)}</span>
      </div>
    </div>

    ${metricsHTML}
    ${actionsHTML}
  `;

  return card;
}

function updateCounts() {
  const upcomingCards = document.querySelectorAll('#upcomingGrid .appointment-card');
  const pastCards = document.querySelectorAll('#pastGrid .appointment-card');

  const upcomingVisible = Array.from(upcomingCards).filter(c => c.style.display !== 'none').length;
  const pastVisible = Array.from(pastCards).filter(c => c.style.display !== 'none').length;

  document.getElementById('upcomingCount').textContent = upcomingVisible;
  document.getElementById('pastCount').textContent = pastVisible;

  const today = new Date().toISOString().split('T')[0];
  const todayCount = Array.from(upcomingCards).filter(card =>
    card.getAttribute('data-date') === today && card.style.display !== 'none'
  ).length;

  const plural = todayCount > 1 ? 's' : '';
  document.getElementById('appointmentCount').textContent =
    `Vous avez ${todayCount} consultation${plural} aujourd'hui`;
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
  document.getElementById('searchInput').addEventListener('input', (e) => {
    filterAppointments('upcoming', e.target.value, document.getElementById('dateFilter').value);
  });

  document.getElementById('dateFilter').addEventListener('change', (e) => {
    filterAppointments('upcoming', document.getElementById('searchInput').value, e.target.value);
  });

  document.getElementById('searchPastInput').addEventListener('input', (e) => {
    filterAppointments('past', e.target.value, document.getElementById('dateFilterPast').value);
  });

  document.getElementById('dateFilterPast').addEventListener('change', (e) => {
    filterAppointments('past', document.getElementById('searchPastInput').value, e.target.value);
  });

  document.getElementById('demandeAnalyse').addEventListener('change', function () {
    document.getElementById('analysesSection').style.display = this.checked ? 'block' : 'none';
  });

  document.getElementById('ordonnanceModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('ordonnanceModal')) closeOrdonnance();
  });

  document.getElementById('dossierModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('dossierModal')) closeDossier();
  });

  document.getElementById('previewModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('previewModal')) closePreview();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const previewModal = document.getElementById('previewModal');
      const ordoModal = document.getElementById('ordonnanceModal');
      const dossierModal = document.getElementById('dossierModal');

      if (previewModal.classList.contains('active')) closePreview();
      else if (ordoModal.classList.contains('active')) closeOrdonnance();
      else if (dossierModal.classList.contains('active')) closeDossier();
    }
  });
}

// ==========================================
// FILTRAGE
// ==========================================
function filterAppointments(type, searchTerm, dateFilter) {
  const gridId = type === 'upcoming' ? 'upcomingGrid' : 'pastGrid';
  const cards = document.querySelectorAll(`#${gridId} .appointment-card`);
  let visibleCount = 0;

  cards.forEach(card => {
    const name = (card.getAttribute('data-name') || '').toLowerCase();
    const date = card.getAttribute('data-date');

    const matchSearch = !searchTerm || name.includes(searchTerm.toLowerCase());
    const matchDate = !dateFilter || date === dateFilter;

    if (matchSearch && matchDate) {
      card.style.display = 'block';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const grid = document.getElementById(gridId);
  let noResults = grid.querySelector('.no-results');

  if (visibleCount === 0) {
    if (!noResults) {
      noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.textContent = 'Aucun rendez-vous trouvé';
      grid.appendChild(noResults);
    }
  } else if (noResults) {
    noResults.remove();
  }

  updateCounts();
}

// ==========================================
// NAVIGATION
// ==========================================
function goToDashboard() {
  window.location.reload();
}

function logout() {
  if (confirm('👨‍⚕️ Êtes-vous sûr de vouloir vous déconnecter ?')) {
    window.location.href = 'login.html';
  }
}

function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');

  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
  document.getElementById(tabName + '-panel').classList.add('active');
}

// ==========================================
// VISIO
// ==========================================
function joinVisio(id) {
  const btn = event.target.closest('button');
  const originalHTML = btn.innerHTML;

  btn.innerHTML = '<span>Connexion...</span>';
  btn.disabled = true;

  setTimeout(() => {
    alert('🎥 Connexion à la visioconférence...\n\n✓ Vérification de la caméra\n✓ Vérification du micro\n✓ Connexion sécurisée établie\n\nRedirection vers la salle de consultation...');
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  }, 1200);
}

// ==========================================
// DOSSIER
// ==========================================
function viewDossier(name, age, pathologie, avatar) {
  document.getElementById('dossierPatientName').textContent = name;
  document.getElementById('dossierPatientInfo').textContent = age + ' • ' + pathologie;
  document.getElementById('dossierPatientAvatar').src = avatar;
  document.getElementById('dossierPathologie').textContent = pathologie;

  document.getElementById('dossierModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDossier() {
  document.getElementById('dossierModal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

// ==========================================
// ORDONNANCE FORM
// ==========================================
function openOrdonnance(name, age, avatar) {
  currentPatientData = { name, age, avatar };

  document.getElementById('modalPatientName').textContent = name;
  document.getElementById('modalPatientAge').textContent = age;
  document.getElementById('modalPatientAvatar').src = avatar;

  resetOrdonnanceForm();

  document.getElementById('ordonnanceModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeOrdonnance() {
  document.getElementById('ordonnanceModal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

function resetOrdonnanceForm() {
  const medicationsList = document.getElementById('medicationsList');
  medicationsList.innerHTML = '';
  medicationsList.appendChild(createMedicationItem());

  document.getElementById('renouvellement').checked = false;
  document.getElementById('demandeAnalyse').checked = false;
  document.getElementById('analysesSection').style.display = 'none';
  document.getElementById('analysesCustom').value = '';
  document.getElementById('notesComplementaires').value = '';
  document.getElementById('signatureElectronique').checked = false;

  selectedAnalyses = [];
  document.querySelectorAll('.analyse-preset').forEach(el => el.classList.remove('selected'));

  pendingOrdonnanceData = null;
  previewScale = 1;
}

// ==========================================
// MEDICAMENTS
// ==========================================
function createMedicationItem() {
  const div = document.createElement('div');
  div.className = 'medication-item';
  div.innerHTML = `
    <div style="flex: 1;">
      <div class="form-group">
        <label>Médicament</label>
        <select class="med-select">
          <option value="">Sélectionner...</option>
          ${medicamentsDatabase.map(med => `<option value="${escapeAttr(med)}">${escapeHTML(med)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Posologie</label>
        <textarea placeholder="Ex: 1 comprimé matin et soir pendant les repas"></textarea>
      </div>
    </div>
    <button onclick="removeMedicationItem(this)"
      style="color:#e74c3c; border:none; background:transparent; cursor:pointer; font-size:1.5rem; padding:.5rem;"
      title="Supprimer">×</button>
  `;
  return div;
}

function removeMedicationItem(btn) {
  btn.parentElement.remove();
}

function addMedication() {
  document.getElementById('medicationsList').appendChild(createMedicationItem());
}

// ==========================================
// ANALYSES
// ==========================================
function toggleAnalyse(element) {
  element.classList.toggle('selected');
  const value = element.getAttribute('data-value');

  if (element.classList.contains('selected')) {
    if (!selectedAnalyses.includes(value)) selectedAnalyses.push(value);
  } else {
    selectedAnalyses = selectedAnalyses.filter(a => a !== value);
  }
}

// ==========================================
// SUBMIT -> PREVIEW
// ==========================================
function submitOrdonnance() {
  try {
    const isSigned = document.getElementById('signatureElectronique').checked;
    if (!isSigned) {
      alert("⚠️ Veuillez signer électroniquement l'ordonnance");
      return;
    }

    const medicationSelects = document.querySelectorAll('.med-select');
    const posologyTextareas = document.querySelectorAll('.medication-item textarea');

    const medications = [];
    medicationSelects.forEach((select, index) => {
      if (select.value) {
        const medName = select.value;
        const posology = (posologyTextareas[index]?.value || '');

        if (!posology.trim()) {
          alert('⚠️ Veuillez renseigner la posologie pour: ' + medName);
          throw new Error('Missing posology');
        }

        medications.push({ name: medName, posology });
      }
    });

    if (medications.length === 0) {
      alert('⚠️ Veuillez ajouter au moins un médicament');
      return;
    }

    const isRenouvellement = document.getElementById('renouvellement').checked;
    const hasAnalysesCheck = document.getElementById('demandeAnalyse').checked;
    const customAnalyses = document.getElementById('analysesCustom').value;
    const notes = document.getElementById('notesComplementaires').value;

    let allAnalyses = [...selectedAnalyses];
    if (customAnalyses.trim()) {
      const customList = customAnalyses.split(/[,\n]+/).map(a => a.trim()).filter(Boolean);
      allAnalyses = allAnalyses.concat(customList);
    }

    pendingOrdonnanceData = {
      ordonnanceNumber: generateOrdonnanceNumber(),
      signedAt: new Date(),
      medications,
      isRenouvellement,
      hasAnalyses: hasAnalysesCheck && allAnalyses.length > 0,
      analyses: hasAnalysesCheck ? allAnalyses : [],
      notes: notes || ''
    };

    openPreview();
  } catch (err) {
    console.error(err);
  }
}

// ==========================================
// PREVIEW MODAL
// ==========================================
function openPreview() {
  if (!pendingOrdonnanceData) return;

  fillPreviewModal();
  previewScale = 1;
  applyPreviewScale();

  document.getElementById('ordonnanceModal').classList.remove('active');
  document.getElementById('previewModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePreview() {
  document.getElementById('previewModal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

function backToEdit() {
  document.getElementById('previewModal').classList.remove('active');
  document.getElementById('ordonnanceModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function confirmAndSend() {
  // Ici tu mettras plus tard : appel API / sauvegarde / envoi email etc.
  alert("✅ Ordonnance envoyée avec succès !\n\nN°: " + pendingOrdonnanceData.ordonnanceNumber);

  closePreview();
  closeOrdonnance();

  pendingOrdonnanceData = null;
}

// Générer la page d’ordonnance
function fillPreviewModal() {
  const paper = document.getElementById("ordonnancePaper");

  const today = new Date();
  const dateStr = `${doctorProfile.city}, le ${today.toLocaleDateString("fr-FR")}`;

  const ordNo = pendingOrdonnanceData.ordonnanceNumber;

  const renouvellementBadge = pendingOrdonnanceData.isRenouvellement
    ? `<div style="margin-top:10px; font-family:system-ui; font-size:12px; color:#b91c1c;"><b>🔄 RENOUVELLEMENT</b></div>`
    : "";

  const medsHtml = pendingOrdonnanceData.medications.map(m => `
    <div class="med-item">
      <div class="med-name">${escapeHTML(m.name)}</div>
      <div class="med-note">${escapeHTML(m.posology)}</div>
    </div>
  `).join("");

  const analysesHtml = (pendingOrdonnanceData.hasAnalyses && pendingOrdonnanceData.analyses.length)
    ? `
      <div class="ord-notes">
        <b>Analyses prescrites :</b><br/>
        ${pendingOrdonnanceData.analyses.map(a => `• ${escapeHTML(a)}`).join('<br/>')}
      </div>
    ` : "";

  const notesHtml = pendingOrdonnanceData.notes
    ? `
      <div class="ord-notes">
        <b>Notes / Recommandations :</b><br/>
        ${escapeHTML(pendingOrdonnanceData.notes).replace(/\n/g, "<br/>")}
      </div>
    ` : "";

  const signedDate = pendingOrdonnanceData.signedAt.toLocaleDateString("fr-FR");

  paper.innerHTML = `
    <div class="ord-header">
      <div class="doc-doctor">
        <div class="name">${escapeHTML(doctorProfile.name)}</div>
        <div class="meta">${escapeHTML(doctorProfile.specialty)}</div>
        <div class="meta">${escapeHTML(doctorProfile.inpe)}</div>
        <div style="margin-top:8px; font-size:12px; font-family:system-ui;">
          <b>N° Ordonnance :</b> ${escapeHTML(ordNo)}
        </div>
        ${renouvellementBadge}
      </div>
      <div class="doc-date">${escapeHTML(dateStr)}</div>
    </div>

    <div class="ord-divider"></div>

    <div class="patient-block">
      <div><b>Nom & Prénom :</b> ${escapeHTML(currentPatientData.name)}</div>
      <div><b>Age :</b> ${escapeHTML(currentPatientData.age)}</div>
    </div>

    <div class="rx-title">R/</div>

    <div class="meds">
      ${medsHtml}
    </div>

    ${analysesHtml}
    ${notesHtml}

    <div class="signature-zone">
      <div class="signature-box">
        <div><b>Signature électronique</b></div>
        <div style="margin-top:6px;">${escapeHTML(doctorProfile.name)}</div>
        <div style="font-size:12px; opacity:.8;">
          Signé électroniquement le ${escapeHTML(signedDate)}
        </div>
        <div class="signature-line"></div>
      </div>

      <div>
        <div style="font-family:system-ui; font-size:12px; color:#0b2a5a; margin-bottom:8px;">
          <b>QR Code</b>
        </div>
        <div id="qrCode"></div>
      </div>
    </div>
  `;

  // QR DATA (lisible + exploitable)
  const qrData = `Ordonnance:${ordNo}|Patient:${currentPatientData.name}|Date:${today.toISOString()}`;

  // Render QR
  setTimeout(() => {
    const qrContainer = document.getElementById("qrCode");
    if (!qrContainer) return;

    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
      text: qrData,
      width: 90,
      height: 90,
      correctLevel: QRCode.CorrectLevel.H
    });
  }, 0);
}

// Zoom
function previewZoom(delta) {
  previewScale = Math.min(1.5, Math.max(0.7, previewScale + delta));
  applyPreviewScale();
}

function applyPreviewScale() {
  const paper = document.getElementById("ordonnancePaper");
  if (paper) paper.style.transform = `scale(${previewScale})`;
}

console.log('✅ Dashboard médecin chargé (Ordonnance + Aperçu + QR + Signature).');
