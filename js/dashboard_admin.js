// =======================================================
// VITALIA+ - DASHBOARD ADMIN (Demo localStorage)
// Modules A -> G
// =======================================================

// --- Storage keys
const K_USERS = "vitalia_users";           // [{id,name,email,role,active,password}]
const K_SUBS  = "vitalia_subscriptions";   // [{userId, plan, status}] status: active|suspended
const K_RX    = "vitalia_prescriptions";   // [{id, patientId, doctorId, pharmacyId, status, flagged, createdAt}]
const K_CONS  = "vitalia_consultations";   // [{id, patientId, doctorId, dateISO, status}]
const K_LABS  = "vitalia_lab_requests";    // [{id, patientId, labId, analysis, status, resultAvailable, createdAt}]
const K_META  = "vitalia_admin_meta";      // {lastUpdateISO}

// --- Constants
const RX_STATUSES = ["Reçue","En préparation","Prête","En livraison"];
const RX_SPECIAL  = "Problème";

let state = {
  users: [],
  subs: [],
  rx: [],
  consults: [],
  labs: [],
  meta: { lastUpdateISO: null },

  // UI filters
  tab: "users",
  userRoleFilter: "ALL",
  userSearch: "",
  subPlanFilter: "ALL",
  subSearch: "",
  rxStatusFilter: "ALL",
  rxSearch: ""
};

// -------------------------
// Helpers
// -------------------------
function uid(prefix="V"){
  return `${prefix}${Math.random().toString(16).slice(2,10).toUpperCase()}`;
}
function nowISO(){ return new Date().toISOString(); }
function fmtDate(iso){
  try { return new Date(iso).toLocaleString("fr-FR",{dateStyle:"medium",timeStyle:"short"}); }
  catch { return iso; }
}
function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
function saveAll(){
  localStorage.setItem(K_USERS, JSON.stringify(state.users));
  localStorage.setItem(K_SUBS,  JSON.stringify(state.subs));
  localStorage.setItem(K_RX,    JSON.stringify(state.rx));
  localStorage.setItem(K_CONS,  JSON.stringify(state.consults));
  localStorage.setItem(K_LABS,  JSON.stringify(state.labs));
  state.meta.lastUpdateISO = nowISO();
  localStorage.setItem(K_META,  JSON.stringify(state.meta));
}
function loadAll(){
  state.users    = safeParse(localStorage.getItem(K_USERS), []);
  state.subs     = safeParse(localStorage.getItem(K_SUBS), []);
  state.rx       = safeParse(localStorage.getItem(K_RX), []);
  state.consults = safeParse(localStorage.getItem(K_CONS), []);
  state.labs     = safeParse(localStorage.getItem(K_LABS), []);
  state.meta     = safeParse(localStorage.getItem(K_META), { lastUpdateISO: null });
}
function safeParse(raw, fallback){
  try { return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
}
function findUser(id){ return state.users.find(u => u.id === id); }
function roleLabel(role){
  if (role === "patient") return "Patient";
  if (role === "medecin") return "Médecin";
  if (role === "pharmacie") return "Pharmacie";
  if (role === "laboratoire") return "Laboratoire";
  return role;
}
function badgeForActive(active){
  return active ? `<span class="badge ok">Actif</span>` : `<span class="badge off">Désactivé</span>`;
}
function badgeForSubStatus(status){
  return status === "active"
    ? `<span class="badge ok">Actif</span>`
    : `<span class="badge off">Suspendu</span>`;
}
function badgeForPlan(plan){
  if (plan === "Premium") return `<span class="badge purple">Premium</span>`;
  if (plan === "Standard") return `<span class="badge blue">Standard</span>`;
  return `<span class="badge warn">Essai</span>`;
}
function badgeForRxStatus(st, flagged){
  if (flagged) return `<span class="badge warn">Problème</span>`;
  if (st === "Reçue") return `<span class="badge blue">Reçue</span>`;
  if (st === "En préparation") return `<span class="badge warn">En préparation</span>`;
  if (st === "Prête") return `<span class="badge ok">Prête</span>`;
  if (st === "En livraison") return `<span class="badge purple">En livraison</span>`;
  return `<span class="badge blue">${escapeHtml(st)}</span>`;
}
function badgeForConsultStatus(st){
  if (st === "à venir") return `<span class="badge blue">À venir</span>`;
  if (st === "terminée") return `<span class="badge ok">Terminée</span>`;
  return `<span class="badge warn">${escapeHtml(st)}</span>`;
}
function todayKey(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}
function isToday(iso){
  try{
    const d = new Date(iso);
    const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    return k === todayKey();
  }catch{ return false; }
}

// -------------------------
// Seed demo data (si vide)
// -------------------------
function seedIfEmpty(){
  if (state.users.length) return;

  // Users
  const p1 = {id:uid("P"), name:"Ahmed K.", email:"ahmed@patient.vitalia", role:"patient", active:true, password:"1234"};
  const p2 = {id:uid("P"), name:"Fatima El Amrani", email:"fatima@patient.vitalia", role:"patient", active:true, password:"1234"};
  const d1 = {id:uid("D"), name:"Dr. Karim Alami", email:"karim@medecin.vitalia", role:"medecin", active:true, password:"1234"};
  const d2 = {id:uid("D"), name:"Dr. Hassan Tazi", email:"tazi@medecin.vitalia", role:"medecin", active:true, password:"1234"};
  const ph1= {id:uid("PH"), name:"Pharmacie Centrale", email:"centrale@pharmacie.vitalia", role:"pharmacie", active:true, password:"1234"};
  const lab1={id:uid("L"), name:"Labo Pasteur", email:"pasteur@laboratoire.vitalia", role:"laboratoire", active:true, password:"1234"};

  state.users = [p1,p2,d1,d2,ph1,lab1];

  // Subs
  state.subs = [
    {userId:p1.id, plan:"Essai", status:"active"},
    {userId:p2.id, plan:"Standard", status:"active"}
  ];

  // RX (ordonnances)
  state.rx = [
    {id:uid("RX"), patientId:p1.id, doctorId:d2.id, pharmacyId:ph1.id, status:"Reçue", flagged:false, createdAt:new Date(Date.now()-1000*60*22).toISOString()},
    {id:uid("RX"), patientId:p2.id, doctorId:d1.id, pharmacyId:ph1.id, status:"En préparation", flagged:false, createdAt:new Date(Date.now()-1000*60*85).toISOString()},
    {id:uid("RX"), patientId:p1.id, doctorId:d1.id, pharmacyId:ph1.id, status:"Prête", flagged:true, createdAt:new Date(Date.now()-1000*60*220).toISOString()},
  ];

  // Consults
  const today = new Date();
  const later = new Date(today.getTime()+1000*60*60*2);
  const yesterday = new Date(today.getTime()-1000*60*60*24);

  state.consults = [
    {id:uid("C"), patientId:p1.id, doctorId:d1.id, dateISO:later.toISOString(), status:"à venir"},
    {id:uid("C"), patientId:p2.id, doctorId:d2.id, dateISO:today.toISOString(), status:"à venir"},
    {id:uid("C"), patientId:p1.id, doctorId:d2.id, dateISO:yesterday.toISOString(), status:"terminée"},
  ];

  // Lab requests
  state.labs = [
    {id:uid("LAB"), patientId:p1.id, labId:lab1.id, analysis:"NFS", status:"pending", resultAvailable:false, createdAt:new Date(Date.now()-1000*60*40).toISOString()},
    {id:uid("LAB"), patientId:p2.id, labId:lab1.id, analysis:"Bilan lipidique", status:"progress", resultAvailable:false, createdAt:new Date(Date.now()-1000*60*140).toISOString()},
    {id:uid("LAB"), patientId:p2.id, labId:lab1.id, analysis:"HbA1c", status:"completed", resultAvailable:true, createdAt:new Date(Date.now()-1000*60*500).toISOString()},
  ];

  saveAll();
}

// -------------------------
// KPI + hero info
// -------------------------
function renderKpis(){
  const activePatients = state.users.filter(u => u.role==="patient" && u.active).length;
  const rxCount = state.rx.length;

  const consultsToday = state.consults.filter(c => isToday(c.dateISO)).length;
  const partners = state.users.filter(u => (u.role==="pharmacie" || u.role==="laboratoire") && u.active).length;

  setText("kpiPatients", activePatients);
  setText("kpiRx", rxCount);
  setText("kpiConsults", consultsToday);
  setText("kpiPartners", partners);

  setText("gPatients", activePatients);
  setText("gRx", rxCount);
  setText("gConsultsToday", consultsToday);
  setText("gPartners", partners);

  setText("lastUpdate", state.meta.lastUpdateISO ? fmtDate(state.meta.lastUpdateISO) : "—");
}
function setText(id, val){
  const el = document.getElementById(id);
  if (el) el.textContent = String(val);
}

// -------------------------
// Tabs navigation
// -------------------------
function setActiveTab(tab){
  state.tab = tab;

  document.querySelectorAll(".side-link").forEach(b => {
    b.classList.toggle("active", b.dataset.tab === tab);
  });

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  const active = document.getElementById(`tab-${tab}`);
  if (active) active.classList.add("active");
}

// -------------------------
// A. Users
// -------------------------
function renderUsers(){
  const tbody = document.getElementById("usersTbody");
  if (!tbody) return;

  let list = [...state.users];

  if (state.userRoleFilter !== "ALL"){
    list = list.filter(u => u.role === state.userRoleFilter);
  }
  if (state.userSearch.trim()){
    const q = state.userSearch.trim().toLowerCase();
    list = list.filter(u => `${u.id} ${u.name} ${u.email} ${u.role}`.toLowerCase().includes(q));
  }

  list.sort((a,b)=> a.role.localeCompare(b.role) || a.name.localeCompare(b.name));

  tbody.innerHTML = list.map(u => `
    <tr>
      <td>${escapeHtml(u.id)}</td>
      <td>${escapeHtml(u.name)}</td>
      <td>${escapeHtml(u.email)}</td>
      <td><span class="badge blue">${escapeHtml(roleLabel(u.role))}</span></td>
      <td>${badgeForActive(!!u.active)}</td>
      <td>
        <div class="row-actions">
          <button class="btn-mini gray" data-action="editUser" data-id="${u.id}">Modifier</button>
          ${u.active
            ? `<button class="btn-mini red" data-action="toggleUser" data-id="${u.id}">Désactiver</button>`
            : `<button class="btn-mini green" data-action="toggleUser" data-id="${u.id}">Activer</button>`
          }
          <button class="btn-mini red" data-action="deleteUser" data-id="${u.id}">Supprimer</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function toggleUser(id){
  const u = findUser(id);
  if (!u) return;
  u.active = !u.active;
  saveAll();
  refreshAll();
}

function deleteUser(id){
  const u = findUser(id);
  if (!u) return;

  // nettoyage relations
  state.subs = state.subs.filter(s => s.userId !== id);
  state.rx = state.rx.filter(r => r.patientId !== id && r.doctorId !== id && r.pharmacyId !== id);
  state.consults = state.consults.filter(c => c.patientId !== id && c.doctorId !== id);
  state.labs = state.labs.filter(l => l.patientId !== id && l.labId !== id);

  state.users = state.users.filter(x => x.id !== id);

  saveAll();
  refreshAll();
}

// Modal create/edit user
let editingUserId = null;

function openUserModal(user=null){
  const modal = document.getElementById("userModal");
  if (!modal) return;

  editingUserId = user ? user.id : null;
  setTextValue("mName", user?.name || "");
  setTextValue("mEmail", user?.email || "");
  setSelectValue("mRole", user?.role || "patient");
  setSelectValue("mActive", String(!!(user?.active ?? true)));
  setTextValue("mPassword", user?.password || "1234");

  const title = document.getElementById("userModalTitle");
  if (title) title.textContent = user ? "Modifier le compte" : "Créer un compte";

  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
}

function closeUserModal(){
  const modal = document.getElementById("userModal");
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden","true");
  editingUserId = null;
}

function setTextValue(id,val){
  const el = document.getElementById(id);
  if (el) el.value = val;
}
function setSelectValue(id,val){
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function saveUserFromModal(){
  const name = document.getElementById("mName")?.value?.trim();
  const email = document.getElementById("mEmail")?.value?.trim();
  const role = document.getElementById("mRole")?.value;
  const active = document.getElementById("mActive")?.value === "true";
  const password = document.getElementById("mPassword")?.value?.trim() || "1234";

  if (!name || !email){
    alert("⚠️ Nom et email sont obligatoires.");
    return;
  }

  // email unique
  const exists = state.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== editingUserId);
  if (exists){
    alert("⚠️ Cet email existe déjà.");
    return;
  }

  if (editingUserId){
    const u = findUser(editingUserId);
    if (!u) return;
    u.name = name;
    u.email = email;
    u.role = role;
    u.active = active;
    u.password = password;
  } else {
    state.users.push({
      id: uid(role === "patient" ? "P" : role === "medecin" ? "D" : role === "pharmacie" ? "PH" : "L"),
      name, email, role, active, password
    });
  }

  saveAll();
  closeUserModal();
  refreshAll();
}

// -------------------------
// B. Subscriptions
// -------------------------
function ensureSubForPatient(userId){
  const u = findUser(userId);
  if (!u || u.role !== "patient") return;
  const sub = state.subs.find(s => s.userId === userId);
  if (!sub){
    state.subs.push({userId, plan:"Essai", status:"active"});
  }
}

function renderSubs(){
  const tbody = document.getElementById("subsTbody");
  if (!tbody) return;

  // patients only
  const patients = state.users.filter(u => u.role==="patient");
  patients.forEach(p => ensureSubForPatient(p.id));

  let rows = patients.map(p => {
    const sub = state.subs.find(s => s.userId === p.id) || {plan:"Essai", status:"active"};
    return { p, sub };
  });

  if (state.subPlanFilter !== "ALL"){
    rows = rows.filter(r => r.sub.plan === state.subPlanFilter);
  }
  if (state.subSearch.trim()){
    const q = state.subSearch.trim().toLowerCase();
    rows = rows.filter(r => `${r.p.name} ${r.p.email} ${r.sub.plan}`.toLowerCase().includes(q));
  }

  rows.sort((a,b)=> a.p.name.localeCompare(b.p.name));

  tbody.innerHTML = rows.map(({p,sub}) => `
    <tr>
      <td>${escapeHtml(p.name)}</td>
      <td>${escapeHtml(p.email)}</td>
      <td>${badgeForPlan(sub.plan)}</td>
      <td>${badgeForSubStatus(sub.status)}</td>
      <td>
        <div class="row-actions">
          <button class="btn-mini gray" data-action="setPlan" data-id="${p.id}" data-plan="Essai">Essai</button>
          <button class="btn-mini gray" data-action="setPlan" data-id="${p.id}" data-plan="Standard">Standard</button>
          <button class="btn-mini gray" data-action="setPlan" data-id="${p.id}" data-plan="Premium">Premium</button>
          ${sub.status === "active"
            ? `<button class="btn-mini red" data-action="toggleSub" data-id="${p.id}">Suspendre</button>`
            : `<button class="btn-mini green" data-action="toggleSub" data-id="${p.id}">Activer</button>`
          }
        </div>
      </td>
    </tr>
  `).join("");
}

function setPlan(userId, plan){
  ensureSubForPatient(userId);
  const sub = state.subs.find(s => s.userId === userId);
  if (!sub) return;
  sub.plan = plan;
  sub.status = "active";
  saveAll();
  refreshAll();
}

function toggleSub(userId){
  ensureSubForPatient(userId);
  const sub = state.subs.find(s => s.userId === userId);
  if (!sub) return;
  sub.status = sub.status === "active" ? "suspended" : "active";
  saveAll();
  refreshAll();
}

// -------------------------
// C. RX management
// -------------------------
function renderRx(){
  const tbody = document.getElementById("rxTbody");
  if (!tbody) return;

  let list = [...state.rx];

  if (state.rxStatusFilter !== "ALL"){
    if (state.rxStatusFilter === RX_SPECIAL){
      list = list.filter(r => !!r.flagged);
    } else {
      list = list.filter(r => r.status === state.rxStatusFilter);
    }
  }

  if (state.rxSearch.trim()){
    const q = state.rxSearch.trim().toLowerCase();
    list = list.filter(r => {
      const p = findUser(r.patientId)?.name || "";
      const d = findUser(r.doctorId)?.name || "";
      const ph = findUser(r.pharmacyId)?.name || "";
      const blob = `${r.id} ${p} ${d} ${ph} ${r.status} ${r.flagged ? "probleme" : ""}`.toLowerCase();
      return blob.includes(q);
    });
  }

  list.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));

  tbody.innerHTML = list.map(r => {
    const p = findUser(r.patientId);
    const d = findUser(r.doctorId);
    const ph = findUser(r.pharmacyId);
    return `
      <tr>
        <td>${escapeHtml(r.id)}</td>
        <td>${escapeHtml(p?.name || "—")}</td>
        <td>${escapeHtml(d?.name || "—")}</td>
        <td>${escapeHtml(ph?.name || "—")}</td>
        <td>${badgeForRxStatus(r.status, r.flagged)}</td>
        <td>${r.flagged ? `<span class="badge warn">À valider</span>` : `<span class="badge ok">OK</span>`}</td>
        <td>
          <div class="row-actions">
            <button class="btn-mini gray" data-action="rxSetStatus" data-id="${r.id}" data-status="Reçue">Reçue</button>
            <button class="btn-mini gray" data-action="rxSetStatus" data-id="${r.id}" data-status="En préparation">Prépa</button>
            <button class="btn-mini gray" data-action="rxSetStatus" data-id="${r.id}" data-status="Prête">Prête</button>
            <button class="btn-mini gray" data-action="rxSetStatus" data-id="${r.id}" data-status="En livraison">Livraison</button>
            ${r.flagged
              ? `<button class="btn-mini green" data-action="rxValidate" data-id="${r.id}">Valider</button>`
              : `<button class="btn-mini red" data-action="rxFlag" data-id="${r.id}">Signaler</button>`
            }
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function rxSetStatus(rxId, status){
  const r = state.rx.find(x => x.id === rxId);
  if (!r) return;
  r.status = status;
  saveAll();
  refreshAll();
}
function rxFlag(rxId){
  const r = state.rx.find(x => x.id === rxId);
  if (!r) return;
  r.flagged = true;
  saveAll();
  refreshAll();
}
function rxValidate(rxId){
  const r = state.rx.find(x => x.id === rxId);
  if (!r) return;
  r.flagged = false;
  saveAll();
  refreshAll();
}

// -------------------------
// D. Consultations
// -------------------------
function renderConsults(){
  const tbody = document.getElementById("consultsTbody");
  const byDocTbody = document.getElementById("consultsByDoctorTbody");
  if (!tbody || !byDocTbody) return;

  const list = [...state.consults].sort((a,b)=> new Date(b.dateISO)-new Date(a.dateISO));

  tbody.innerHTML = list.map(c => {
    const p = findUser(c.patientId);
    const d = findUser(c.doctorId);
    return `
      <tr>
        <td>${escapeHtml(fmtDate(c.dateISO))}</td>
        <td>${escapeHtml(p?.name || "—")}</td>
        <td>${escapeHtml(d?.name || "—")}</td>
        <td>${badgeForConsultStatus(c.status)}</td>
        <td>
          <div class="row-actions">
            ${c.status !== "terminée"
              ? `<button class="btn-mini green" data-action="consultDone" data-id="${c.id}">Terminer</button>`
              : `<button class="btn-mini gray" data-action="consultReopen" data-id="${c.id}">Réouvrir</button>`
            }
            <button class="btn-mini red" data-action="consultDelete" data-id="${c.id}">Supprimer</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  // Count by doctor
  const doctors = state.users.filter(u => u.role==="medecin");
  const rows = doctors.map(d => {
    const total = state.consults.filter(c => c.doctorId === d.id).length;
    const today = state.consults.filter(c => c.doctorId === d.id && isToday(c.dateISO)).length;
    return {d,total,today};
  }).sort((a,b)=> b.total - a.total);

  byDocTbody.innerHTML = rows.map(r => `
    <tr>
      <td>${escapeHtml(r.d.name)}</td>
      <td><span class="badge blue">${r.total}</span></td>
      <td><span class="badge ok">${r.today}</span></td>
    </tr>
  `).join("");
}

function consultDone(id){
  const c = state.consults.find(x => x.id === id);
  if (!c) return;
  c.status = "terminée";
  saveAll();
  refreshAll();
}
function consultReopen(id){
  const c = state.consults.find(x => x.id === id);
  if (!c) return;
  c.status = "à venir";
  saveAll();
  refreshAll();
}
function consultDelete(id){
  state.consults = state.consults.filter(x => x.id !== id);
  saveAll();
  refreshAll();
}

// -------------------------
// E. Pharmacies
// -------------------------
function renderPharmacies(){
  const tbody = document.getElementById("pharmTbody");
  if (!tbody) return;

  const pharmacies = state.users.filter(u => u.role==="pharmacie");
  tbody.innerHTML = pharmacies.map(ph => {
    const rxFor = state.rx.filter(r => r.pharmacyId === ph.id);
    const recues = rxFor.filter(r => r.status === "Reçue").length;
    const prep = rxFor.filter(r => r.status === "En préparation").length;
    const liv = rxFor.filter(r => r.status === "En livraison").length;

    return `
      <tr>
        <td>${escapeHtml(ph.name)}</td>
        <td>${escapeHtml(ph.email)}</td>
        <td><span class="badge blue">${recues}</span></td>
        <td><span class="badge warn">${prep}</span></td>
        <td><span class="badge purple">${liv}</span></td>
        <td>
          <div class="row-actions">
            ${ph.active
              ? `<button class="btn-mini red" data-action="toggleUser" data-id="${ph.id}">Désactiver</button>`
              : `<button class="btn-mini green" data-action="toggleUser" data-id="${ph.id}">Activer</button>`
            }
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// -------------------------
// F. Labs
// -------------------------
function renderLabs(){
  const tbody = document.getElementById("labsTbody");
  if (!tbody) return;

  const labs = state.users.filter(u => u.role==="laboratoire");
  tbody.innerHTML = labs.map(lab => {
    const req = state.labs.filter(x => x.labId === lab.id);
    const total = req.length;
    const progress = req.filter(x => x.status === "progress").length;
    const results = req.filter(x => x.resultAvailable).length;

    return `
      <tr>
        <td>${escapeHtml(lab.name)}</td>
        <td>${escapeHtml(lab.email)}</td>
        <td><span class="badge blue">${total}</span></td>
        <td><span class="badge warn">${progress}</span></td>
        <td><span class="badge ok">${results}</span></td>
        <td>
          <div class="row-actions">
            ${lab.active
              ? `<button class="btn-mini red" data-action="toggleUser" data-id="${lab.id}">Désactiver</button>`
              : `<button class="btn-mini green" data-action="toggleUser" data-id="${lab.id}">Activer</button>`
            }
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// -------------------------
// G. Stats
// -------------------------
function renderStatsLists(){
  const rxList = document.getElementById("rxStatsList");
  const subList = document.getElementById("subStatsList");
  if (!rxList || !subList) return;

  // RX status counts
  const counts = {};
  RX_STATUSES.forEach(s => counts[s] = 0);
  counts[RX_SPECIAL] = state.rx.filter(r => r.flagged).length;

  state.rx.forEach(r => {
    if (counts[r.status] !== undefined) counts[r.status] += 1;
  });

  rxList.innerHTML = Object.entries(counts).map(([k,v]) => `
    <li><span>${escapeHtml(k)}</span><span>${v}</span></li>
  `).join("");

  // Subs plan counts
  const plans = {Essai:0, Standard:0, Premium:0};
  state.users.filter(u => u.role==="patient").forEach(p => ensureSubForPatient(p.id));
  state.subs.forEach(s => { if (plans[s.plan] !== undefined) plans[s.plan] += 1; });

  subList.innerHTML = Object.entries(plans).map(([k,v]) => `
    <li><span>${escapeHtml(k)}</span><span>${v}</span></li>
  `).join("");
}

// -------------------------
// Notifications (simple)
/// Nouvelles alertes: RX flagged + subs suspended
// -------------------------
function updateNotifications(){
  const notif = document.getElementById("notifCount");
  if (!notif) return;

  const flagged = state.rx.filter(r => r.flagged).length;
  const suspended = state.subs.filter(s => s.status === "suspended").length;
  const total = flagged + suspended;

  notif.textContent = String(total);
}

// -------------------------
// Refresh all UI
// -------------------------
function refreshAll(){
  renderKpis();
  updateNotifications();

  renderUsers();
  renderSubs();
  renderRx();
  renderConsults();
  renderPharmacies();
  renderLabs();
  renderStatsLists();
}

// -------------------------
// Events
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadAll();
  seedIfEmpty();
  refreshAll();

  // Sidebar tabs
  document.querySelectorAll(".side-link").forEach(btn => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
  });

  // A users filters
  document.querySelectorAll("[data-user-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-user-filter]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.userRoleFilter = btn.dataset.userFilter;
      renderUsers();
    });
  });
  const userSearch = document.getElementById("userSearch");
  if (userSearch){
    userSearch.addEventListener("input", e => {
      state.userSearch = e.target.value || "";
      renderUsers();
    });
  }

  // B subs filters
  document.querySelectorAll("[data-sub-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-sub-filter]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.subPlanFilter = btn.dataset.subFilter;
      renderSubs();
      renderStatsLists();
      updateNotifications();
      renderKpis();
    });
  });
  const subSearch = document.getElementById("subSearch");
  if (subSearch){
    subSearch.addEventListener("input", e => {
      state.subSearch = e.target.value || "";
      renderSubs();
    });
  }

  // C rx filters
  document.querySelectorAll("[data-rx-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-rx-filter]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.rxStatusFilter = btn.dataset.rxFilter;
      renderRx();
    });
  });
  const rxSearch = document.getElementById("rxSearch");
  if (rxSearch){
    rxSearch.addEventListener("input", e => {
      state.rxSearch = e.target.value || "";
      renderRx();
    });
  }

  // Create user modal
  document.getElementById("btnCreateUser")?.addEventListener("click", () => openUserModal(null));
  document.getElementById("userModalClose")?.addEventListener("click", closeUserModal);
  document.getElementById("userModalCancel")?.addEventListener("click", closeUserModal);
  document.getElementById("userModalSave")?.addEventListener("click", saveUserFromModal);

  // Close modal on outside click
  document.getElementById("userModal")?.addEventListener("click", (e) => {
    if (e.target.id === "userModal") closeUserModal();
  });

  // Seed reset
  document.getElementById("seedBtn")?.addEventListener("click", () => {
    if (!confirm("Réinitialiser toutes les données admin (demo) ?")) return;
    localStorage.removeItem(K_USERS);
    localStorage.removeItem(K_SUBS);
    localStorage.removeItem(K_RX);
    localStorage.removeItem(K_CONS);
    localStorage.removeItem(K_LABS);
    localStorage.removeItem(K_META);
    loadAll();
    seedIfEmpty();
    refreshAll();
  });

  // Notification click
  document.getElementById("notifBtn")?.addEventListener("click", () => {
    const flagged = state.rx.filter(r => r.flagged).length;
    const suspended = state.subs.filter(s => s.status === "suspended").length;

    if (!flagged && !suspended){
      alert("🔔 Aucune alerte.");
      return;
    }

    alert(
      `🔔 Alertes Admin:\n\n` +
      `• Ordonnances à valider (Problème): ${flagged}\n` +
      `• Abonnements suspendus: ${suspended}\n`
    );
  });

  // Logout (demo)
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    // Si tu as une logique auth locale, adapte ici
    window.location.href = "login.html";
  });

  // Global delegation for row actions
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === "toggleUser"){
      toggleUser(id);
      return;
    }
    if (action === "deleteUser"){
      if (confirm("Supprimer ce compte ?")) deleteUser(id);
      return;
    }
    if (action === "editUser"){
      const u = findUser(id);
      if (u) openUserModal(u);
      return;
    }

    // Subs
    if (action === "setPlan"){
      setPlan(id, btn.dataset.plan);
      return;
    }
    if (action === "toggleSub"){
      toggleSub(id);
      return;
    }

    // RX
    if (action === "rxSetStatus"){
      rxSetStatus(id, btn.dataset.status);
      return;
    }
    if (action === "rxFlag"){
      rxFlag(id);
      return;
    }
    if (action === "rxValidate"){
      rxValidate(id);
      return;
    }

    // Consultations
    if (action === "consultDone"){
      consultDone(id);
      return;
    }
    if (action === "consultReopen"){
      consultReopen(id);
      return;
    }
    if (action === "consultDelete"){
      if (confirm("Supprimer ce RDV ?")) consultDelete(id);
      return;
    }
  });
});
