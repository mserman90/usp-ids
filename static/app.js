/**
 * USP-İDS (Ulusal Su Planı İzleme ve Değerlendirme Bilgi Sistemi)
 * T.C. Tarım ve Orman Bakanlığı Standartları İstemci Mantığı (app.js)
 */

let currentRole = "SYGM_YONETICI";
let currentPeriod = "2027";
let hierarchyData = [];
let earlyWarningData = [];
let currentFontSize = 14;

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  document.getElementById("periodSelect").addEventListener("change", (e) => {
    currentPeriod = e.target.value;
    refreshDashboard();
    loadEarlyWarning();
    loadReports();
  });

  refreshDashboard();
  loadHierarchy();
  loadWorkflows();
  loadBasins();
  loadCouncils();
  loadEarlyWarning();
  loadReports();
  loadAuditLogs();
}

// 1. ERİŞİLEBİLİRLİK FONKSİYONLARI (WCAG / Kamu Standardı)
function changeFontSize(delta) {
  if (delta === 0) {
    currentFontSize = 14;
  } else {
    currentFontSize = Math.min(18, Math.max(12, currentFontSize + delta));
  }
  document.documentElement.style.setProperty("--base-font-size", `${currentFontSize}px`);
  document.body.style.fontSize = `${currentFontSize}px`;
}

function toggleHighContrast() {
  document.body.classList.toggle("high-contrast");
}

// 2. SEKME GEÇİŞİ (TAB SWITCHER)
function switchTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
  document.querySelectorAll(".tob-nav-item").forEach(el => el.classList.remove("active"));

  const targetTab = document.getElementById(tabId);
  const targetBtn = document.getElementById(`tabBtn-${tabId}`);
  if (targetTab) targetTab.classList.remove("hidden");
  if (targetBtn) targetBtn.classList.add("active");

  if (tabId === "hierarchyTab" && hierarchyData.length === 0) loadHierarchy();
  if (tabId === "workflowTab") loadWorkflows();
  if (tabId === "earlyWarningTab") loadEarlyWarning();
  if (tabId === "reportsTab") loadReports();
  if (tabId === "auditTab") loadAuditLogs();
}

// 3. ROL SEÇİCİ (RBAC SİMÜLASYONU)
function changeActiveRole(newRole) {
  currentRole = newRole;
  console.log("Aktif Yetki Değiştirildi:", currentRole);

  const uName = document.getElementById("userNameBadge");
  const uRole = document.getElementById("userRoleBadge");

  if (newRole === "SYGM_YONETICI") {
    if (uName) uName.textContent = "Mert YILMAZ";
    if (uRole) uRole.textContent = "SYGM İzleme Uzmanı • TOB_SYGM";
  } else if (newRole === "SORUMLU_KURUM") {
    if (uName) uName.textContent = "Ahmet KAYA";
    if (uRole) uRole.textContent = "Strateji Daire Bşk. • TOB_DSI";
  } else if (newRole === "ILGILI_KURUM") {
    if (uName) uName.textContent = "Zeynep DEMİR";
    if (uRole) uRole.textContent = "Su Kayıpları Şb. Md. • ASKI";
  } else if (newRole === "SEKRETERYA") {
    if (uName) uName.textContent = "Mustafa ÇELİK";
    if (uRole) uRole.textContent = "Havza Sekreteri • HSK_KNY";
  } else if (newRole === "YONETICI_USUK") {
    if (uName) uName.textContent = "Prof. Dr. İbrahim ÖZTÜRK";
    if (uRole) uRole.textContent = "Ulusal Su Kurulu Üyesi • USUK";
  }

  const btnNew = document.getElementById("btnNewSubmission");
  if (btnNew) {
    if (currentRole === "YONETICI_USUK") {
      btnNew.classList.add("hidden");
    } else {
      btnNew.classList.remove("hidden");
    }
  }

  loadWorkflows();
}

// 4. DASHBOARD YÜKLEYİCİ
async function refreshDashboard() {
  try {
    const res = await fetch(`/api/dashboard/summary?yil=${currentPeriod}`);
    const data = await res.json();

    document.getElementById("kpi-hedef").textContent = data.sayaclar.hedef_sayisi;
    document.getElementById("kpi-eylem").textContent = data.sayaclar.eylem_sayisi;
    document.getElementById("kpi-yesil").textContent = data.erken_uyari_ozeti.YESIL;
    document.getElementById("kpi-sari").textContent = data.erken_uyari_ozeti.SARI;
    document.getElementById("kpi-kirmizi").textContent = data.erken_uyari_ozeti.KIRMIZI;
    document.getElementById("kpi-karar-oran").textContent = `%${data.sayaclar.uygulamaya_gecen_karar_orani}`;

    const container = document.getElementById("goalsProgressContainer");
    container.innerHTML = "";
    data.hedef_ilerlemeleri.forEach(h => {
      const barColor = h.ilerleme_orani >= 70 ? "bg-[#006747]" : h.ilerleme_orani >= 40 ? "bg-teal-600" : "bg-amber-600";
      const div = document.createElement("div");
      div.className = "p-3 rounded border border-slate-200 bg-white hover:border-[#006747] transition";
      div.innerHTML = `
        <div class="flex items-center justify-between text-xs mb-1.5">
          <div class="font-bold text-slate-800 flex items-center gap-2">
            <span class="bg-[#006747] text-white px-2 py-0.5 rounded text-[11px] font-mono font-bold">${h.hedef_no}</span>
            <span>${h.baslik}</span>
          </div>
          <span class="font-black text-slate-900 font-mono">%${h.ilerleme_orani}</span>
        </div>
        <div class="w-full bg-slate-200 rounded h-2 overflow-hidden">
          <div class="${barColor} h-2 rounded transition-all duration-500" style="width: ${h.ilerleme_orani}%"></div>
        </div>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Dashboard yüklenirken hata:", err);
  }
}

// 5. STRATEJİK HİYERARŞİ (FR-01)
async function loadHierarchy() {
  try {
    const res = await fetch("/api/hierarchy");
    hierarchyData = await res.json();
    renderHierarchy(hierarchyData);
  } catch (err) {
    console.error("Hiyerarşi yüklenirken hata:", err);
  }
}

function renderHierarchy(data) {
  const container = document.getElementById("hierarchyTreeContainer");
  container.innerHTML = "";

  data.forEach((hedef, hIdx) => {
    const hedefCard = document.createElement("div");
    hedefCard.className = "bg-white rounded border border-slate-300 overflow-hidden shadow-sm";
    
    let stratHtml = "";
    hedef.stratejiler.forEach(st => {
      let eylemlerHtml = "";
      st.eylemler.forEach(ey => {
        let kurumlarBadge = "";
        ey.paydas_kurumlar.forEach(k => {
          if (k.rol_turu === "KOORDINATOR_SORUMLU") {
            kurumlarBadge += `<span class="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px] border border-amber-300" title="Koordinatör / Asıl Sorumlu Kurum"><i class="fa-solid fa-star text-amber-500 mr-1"></i>${k.kurum_kodu} (*)</span> `;
          } else {
            kurumlarBadge += `<span class="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] border border-slate-200">${k.kurum_kodu}</span> `;
          }
        });

        const durumClass = ey.genel_durum === "TAMAMLANDI" ? "bg-emerald-100 text-emerald-800 border-emerald-300" :
                           ey.genel_durum === "RISKLI" ? "bg-rose-100 text-rose-800 border-rose-300" :
                           "bg-sky-100 text-sky-800 border-sky-300";

        eylemlerHtml += `
          <div class="p-3 bg-white rounded border border-slate-200 hover:border-[#006747] transition space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-mono font-bold text-[#006747] text-xs">${ey.eylem_kodu}</span>
              <div class="flex items-center gap-2">
                <span class="text-[10px] px-2 py-0.5 rounded border font-bold ${durumClass}">${ey.genel_durum}</span>
                <span class="text-[10px] text-slate-500 font-mono">${ey.baslangic_yili} - ${ey.bitis_yili}</span>
              </div>
            </div>
            <p class="text-xs text-slate-800 leading-snug font-medium">${ey.eylem_tanimi}</p>
            <div class="pt-1.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-[11px]">
              <div><strong class="text-slate-600">Gösterge:</strong> ${ey.gosterge_tanimi || '-'} <span class="text-slate-500 font-mono">(${ey.hedef_deger || ''} ${ey.olcu_birimi || ''})</span></div>
              <div>${kurumlarBadge}</div>
            </div>
          </div>
        `;
      });

      stratHtml += `
        <div class="border-t border-slate-200 p-4 bg-slate-50/60 space-y-3">
          <div class="flex items-center gap-2 text-xs font-bold text-slate-800">
            <span class="bg-[#006747] text-white px-2 py-0.5 rounded text-[11px] font-mono">${st.strateji_kodu}</span>
            <span>${st.baslik}</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
            ${eylemlerHtml}
          </div>
        </div>
      `;
    });

    hedefCard.innerHTML = `
      <div class="p-3.5 bg-slate-100/90 border-b border-slate-300 flex items-center justify-between cursor-pointer" onclick="toggleAccordion('hedef-body-${hIdx}')">
        <div class="flex items-center gap-3">
          <span class="bg-[#004e35] text-white font-mono font-bold text-xs px-2.5 py-1 rounded">${hedef.hedef_no}</span>
          <div>
            <h3 class="font-bold text-slate-900 text-sm">${hedef.baslik}</h3>
            <p class="text-xs text-slate-500 line-clamp-1">${hedef.aciklama || ''}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs text-slate-600 font-medium">${hedef.stratejiler.length} Strateji</span>
          <i class="fa-solid fa-chevron-down text-slate-500 text-xs"></i>
        </div>
      </div>
      <div id="hedef-body-${hIdx}" class="hedef-body">
        ${stratHtml}
      </div>
    `;

    container.appendChild(hedefCard);
  });
}

function toggleAccordion(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle("hidden");
}

function filterHierarchy(query) {
  if (!query) {
    renderHierarchy(hierarchyData);
    return;
  }
  const q = query.toLowerCase();
  const filtered = hierarchyData.map(h => {
    const matchingStrategies = h.stratejiler.map(s => {
      const matchingActions = s.eylemler.filter(e => 
        e.eylem_kodu.toLowerCase().includes(q) ||
        e.eylem_tanimi.toLowerCase().includes(q) ||
        (e.koordinator_kodu && e.koordinator_kodu.toLowerCase().includes(q))
      );
      return { ...s, eylemler: matchingActions };
    }).filter(s => s.eylemler.length > 0);

    return { ...h, stratejiler: matchingStrategies };
  }).filter(h => h.stratejiler.length > 0);

  renderHierarchy(filtered);
}

// 6. İŞ AKIŞI & KANIT DOĞRULAMA (FR-04, 5.1)
async function loadWorkflows(filter = "ALL") {
  try {
    const url = filter === "ALL" ? "/api/workflows" : `/api/workflows?durum=${filter}`;
    const res = await fetch(url);
    const workflows = await res.json();

    let onayli = 0, sorumlu = 0, sygm = 0, iade = 0;
    workflows.forEach(w => {
      if (w.onay_durumu === "ONAYLANDI") onayli++;
      else if (w.onay_durumu === "SORUMLU_ONAYINDA") sorumlu++;
      else if (w.onay_durumu === "SYGM_ONAYINDA") sygm++;
      else if (w.onay_durumu === "IADE") iade++;
    });
    const sOnayli = document.getElementById("stat-onayli");
    const sSorumlu = document.getElementById("stat-sorumlu-onay");
    const sSygm = document.getElementById("stat-sygm-onay");
    const sIade = document.getElementById("stat-iade");
    if (sOnayli) sOnayli.textContent = onayli;
    if (sSorumlu) sSorumlu.textContent = sorumlu;
    if (sSygm) sSygm.textContent = sygm;
    if (sIade) sIade.textContent = iade;

    renderWorkflowTable(workflows);
  } catch (err) {
    console.error("İş akışları yüklenirken hata:", err);
  }
}

function filterWorkflows(filter) {
  document.querySelectorAll(".wf-filter-btn").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-filter") === filter);
  });
  loadWorkflows(filter);
}

function renderWorkflowTable(items) {
  const tbody = document.getElementById("workflowTableBody");
  tbody.innerHTML = "";

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400">Bu filtrelere uygun veri girişi bulunmuyor.</td></tr>`;
    return;
  }

  items.forEach(item => {
    let statusBadge = "";
    if (item.onay_durumu === "ONAYLANDI") {
      statusBadge = `<span class="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded font-black border border-emerald-300">🟢 ONAYLANDI</span>`;
    } else if (item.onay_durumu === "SORUMLU_ONAYINDA") {
      statusBadge = `<span class="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold border border-amber-300">⭐ Sorumlu Onayında</span>`;
    } else if (item.onay_durumu === "SYGM_ONAYINDA") {
      statusBadge = `<span class="bg-sky-100 text-sky-900 px-2 py-0.5 rounded font-bold border border-sky-300">👑 SYGM Onayında</span>`;
    } else if (item.onay_durumu === "IADE") {
      statusBadge = `<span class="bg-rose-100 text-rose-900 px-2 py-0.5 rounded font-bold border border-rose-300">🔴 İADE EDİLDİ</span>`;
    }

    let actionButtons = "";
    if (currentRole === "SORUMLU_KURUM" && item.onay_durumu === "SORUMLU_ONAYINDA") {
      actionButtons = `
        <button onclick="triggerWorkflowAction(${item.gerceklesme_id}, 'ONAYLA')" class="tob-btn-primary py-1 px-2 text-[11px]">
          <i class="fa-solid fa-arrow-right-to-bracket"></i> SYGM'ye Sun
        </button>
        <button onclick="openRejectModal(${item.gerceklesme_id})" class="tob-btn-secondary py-1 px-2 text-[11px] text-rose-700 border-rose-300">
          İade Et
        </button>
      `;
    } else if (currentRole === "SYGM_YONETICI" && item.onay_durumu === "SYGM_ONAYINDA") {
      actionButtons = `
        <button onclick="triggerWorkflowAction(${item.gerceklesme_id}, 'ONAYLA')" class="tob-btn-primary py-1 px-2 text-[11px] bg-emerald-700 hover:bg-emerald-800">
          <i class="fa-solid fa-check-double"></i> Resmî Onayla
        </button>
        <button onclick="openRejectModal(${item.gerceklesme_id})" class="tob-btn-secondary py-1 px-2 text-[11px] text-rose-700 border-rose-300">
          İade Et
        </button>
      `;
    } else if (currentRole === "SYGM_YONETICI" && item.onay_durumu === "SORUMLU_ONAYINDA") {
      actionButtons = `<span class="text-slate-400 text-[10px] italic">Sorumlu Kurum Ön İncelemesinde</span>`;
    } else {
      actionButtons = `<span class="text-slate-400 text-[10px]">—</span>`;
    }

    let kanitCell = "";
    if (item.dosya_adi) {
      kanitCell = `
        <div class="space-y-0.5">
          <a href="#" onclick="alert('Kanıt Belgesi Detayı: ' + '${item.dosya_adi}' + ' \\n5070 Sayılı Kanun Uyarınca e-İmzalıdır.'); return false;" class="text-[#006747] hover:underline font-bold flex items-center gap-1">
            <i class="fa-solid fa-file-pdf text-[#c8102e]"></i> ${item.dosya_adi}
          </a>
          <div class="text-[9px] font-mono text-slate-400 truncate w-40" title="Bütünlük Doğrulama Hash: ${item.dosya_hash_sha256}">
            SHA256: ${item.dosya_hash_sha256 ? item.dosya_hash_sha256.substring(0, 16) + '...' : '-'}
          </div>
        </div>
      `;
    } else {
      kanitCell = `<span class="text-rose-700 text-[10px] font-bold"><i class="fa-solid fa-triangle-exclamation mr-1"></i>Kanıtsız</span>`;
    }

    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-50 transition";
    tr.innerHTML = `
      <td class="p-3">
        <div class="font-bold text-slate-900">${item.eylem_kodu}</div>
        <div class="text-slate-600 line-clamp-1">${item.gosterge_tanimi}</div>
      </td>
      <td class="p-3 font-semibold text-slate-800">${item.kurum_kodu}</td>
      <td class="p-3 text-slate-600">${item.donem_adi}</td>
      <td class="p-3 font-black text-[#006747] text-sm">
        ${item.girilen_deger} <span class="text-xs font-normal text-slate-500">${item.olcu_birimi || ''}</span>
      </td>
      <td class="p-3">${kanitCell}</td>
      <td class="p-3">${statusBadge}</td>
      <td class="p-3 text-right space-x-1">${actionButtons}</td>
    `;
    tbody.appendChild(tr);
  });
}

async function triggerWorkflowAction(gerceklesmeId, islem, gerekce = "") {
  try {
    const res = await fetch(`/api/workflows/${gerceklesmeId}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        islem: islem,
        gerekce: gerekce,
        kullanici_rol: currentRole,
        kurum_kodu: currentRole === "SORUMLU_KURUM" ? "TOB_DSI" : "TOB_SYGM"
      })
    });
    const result = await res.json();
    alert(`İşlem Başarıyla Gerçekleşti:\n${result.mesaj}`);
    loadWorkflows();
    refreshDashboard();
    loadAuditLogs();
  } catch (err) {
    alert("İşlem sırasında hata meydana geldi!");
    console.error(err);
  }
}

function openRejectModal(id) {
  document.getElementById("rejectGerceklesmeId").value = id;
  document.getElementById("rejectReason").value = "";
  document.getElementById("rejectModal").showModal();
}

function handleRejectSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("rejectGerceklesmeId").value;
  const reason = document.getElementById("rejectReason").value;
  document.getElementById("rejectModal").close();
  triggerWorkflowAction(id, "IADE", reason);
}

function openNewSubmissionModal() {
  document.getElementById("submissionModal").showModal();
}

async function handleProgressSubmit(e) {
  e.preventDefault();
  const data = {
    gosterge_id: parseInt(document.getElementById("subIndicatorSelect").value),
    kurum_id: 6, // ASKI
    donem_id: parseInt(document.getElementById("subPeriodSelect").value),
    girilen_deger: parseFloat(document.getElementById("subValue").value),
    aciklama: document.getElementById("subDescription").value,
    kanit_dosya_adi: document.getElementById("subProofFileName").value,
    kanit_belge_turu: document.getElementById("subProofType").value,
    kullanici_rol: currentRole,
    kurum_kodu: "ASKI"
  };

  try {
    const res = await fetch("/api/workflows/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    alert("Gerçekleşme verisi ve kanıt belgesi sorumlu kurum onayına sunuldu!");
    document.getElementById("submissionModal").close();
    loadWorkflows();
    refreshDashboard();
    loadAuditLogs();
  } catch (err) {
    alert("Veri gönderilirken sistemsel bir hata oluştu!");
    console.error(err);
  }
}

// 7. 25 NEHİR HAVZASI CBS İZLEME (FR-07)
async function loadBasins() {
  try {
    const res = await fetch("/api/basins");
    const basins = await res.json();

    const container = document.getElementById("basinsCardsContainer");
    container.innerHTML = "";

    basins.forEach(b => {
      const card = document.createElement("div");
      card.className = "basin-card space-y-2";
      
      const badgeColor = b.gerceklesme_orani >= 60 ? "bg-emerald-100 text-emerald-900 border-emerald-300" :
                         b.gerceklesme_orani >= 40 ? "bg-amber-100 text-amber-900 border-amber-300" : "bg-rose-100 text-rose-900 border-rose-300";

      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <i class="fa-solid fa-water text-[#006747]"></i> ${b.ad}
          </span>
          <span class="text-xs px-2 py-0.5 rounded font-black border ${badgeColor}">%${b.gerceklesme_orani}</span>
        </div>
        <div class="text-[11px] text-slate-600 flex items-center gap-2">
          <span><strong>Bölge:</strong> ${b.bolge}</span>
          <span>•</span>
          <span class="text-[#006747] font-semibold"><strong>Öncelik:</strong> ${b.oncelik}</span>
        </div>
        <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
          <div class="p-1.5 bg-slate-50 rounded border border-slate-200 text-center">
            <span class="text-[10px] text-slate-500 block">Havza Kararı</span>
            <strong class="text-slate-800">${b.karar_sayisi} Karar</strong>
          </div>
          <div class="p-1.5 bg-slate-50 rounded border border-slate-200 text-center">
            <span class="text-[10px] text-slate-500 block">Uygulama Oranı</span>
            <strong class="text-[#006747] font-black">%${b.karar_basari_orani}</strong>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Havzalar yüklenirken hata:", err);
  }
}

// 8. SU KURULLARI KARARLARI (FR-05)
async function loadCouncils() {
  try {
    const res = await fetch("/api/water-councils");
    const data = await res.json();

    let usuk = 0, havza = 0, il = 0;
    data.kurul_bazli.forEach(k => {
      if (k.kurul_turu === "ULUSAL_SU_KURULU") usuk = k.toplam;
      if (k.kurul_turu === "HAVZA_SU_KURULU") havza = k.toplam;
      if (k.kurul_turu === "IL_SU_KURULU") il = k.toplam;
    });

    document.getElementById("councils-usuk-count").textContent = `${usuk} Karar`;
    document.getElementById("councils-havza-count").textContent = `${havza} Karar`;
    document.getElementById("councils-il-count").textContent = `${il} Karar`;

    const tbody = document.getElementById("councilsTableBody");
    tbody.innerHTML = "";

    data.kararlar.forEach(k => {
      const durumBadge = k.uygulama_durumu === "UYGULANDI" ? "bg-emerald-100 text-emerald-900 border-emerald-300" :
                         k.uygulama_durumu === "DEVAM_EDIYOR" ? "bg-sky-100 text-sky-900 border-sky-300" : "bg-slate-100 text-slate-800 border-slate-300";

      const tr = document.createElement("tr");
      tr.className = "hover:bg-slate-50 transition";
      tr.innerHTML = `
        <td class="p-3 font-bold text-slate-800">${k.kurul_turu}</td>
        <td class="p-3 font-mono text-[#006747] font-bold">${k.karar_no}<br><span class="text-[10px] text-slate-500 font-normal">${k.toplanti_tarihi}</span></td>
        <td class="p-3 text-slate-700 max-w-xs leading-snug">${k.karar_metni}</td>
        <td class="p-3 font-mono font-semibold text-slate-700">${k.eylem_kodu || 'Genel Plan'}</td>
        <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold border ${durumBadge}">${k.uygulama_durumu}</span></td>
        <td class="p-3 font-black text-[#006747] font-mono">%${k.tamamlanma_orani}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Kurul kararları yüklenirken hata:", err);
  }
}

// 9. ERKEN UYARI MOTORU (FR-06)
async function loadEarlyWarning() {
  try {
    const res = await fetch(`/api/early-warning?yil=${currentPeriod}`);
    const data = await res.json();
    earlyWarningData = data.items;
    renderEarlyWarningTable(earlyWarningData);
  } catch (err) {
    console.error("Erken uyarı yüklenirken hata:", err);
  }
}

function filterEarlyWarning(filter) {
  document.querySelectorAll(".ew-filter").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-filter") === filter);
  });
  if (filter === "ALL") {
    renderEarlyWarningTable(earlyWarningData);
  } else {
    renderEarlyWarningTable(earlyWarningData.filter(i => i.durum_kodu === filter));
  }
}

function renderEarlyWarningTable(items) {
  const tbody = document.getElementById("earlyWarningTableBody");
  tbody.innerHTML = "";

  items.forEach(i => {
    const icon = i.durum_kodu === "KIRMIZI" ? "🔴 KRİTİK SAPMA" :
                 i.durum_kodu === "SARI" ? "🟡 GECİKME RİSKİ" : "🟢 UYGUN";
    const statusColor = i.durum_kodu === "KIRMIZI" ? "text-[#c8102e] font-black" :
                        i.durum_kodu === "SARI" ? "text-amber-800 font-bold" : "text-emerald-800 font-bold";

    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-50 transition";
    tr.innerHTML = `
      <td class="p-3 text-xs ${statusColor}">${icon}</td>
      <td class="p-3 font-mono font-bold text-slate-900">${i.eylem_kodu}</td>
      <td class="p-3 max-w-sm">
        <div class="font-bold text-slate-900">${i.eylem_tanimi}</div>
        <div class="text-[10px] text-[#006747] font-semibold">${i.hedef_no}: ${i.hedef_baslik}</div>
      </td>
      <td class="p-3 font-semibold text-slate-800">${i.koordinator_kodu}</td>
      <td class="p-3 font-mono text-slate-700">${i.baslangic_yili}-${i.bitis_yili}<br><span class="text-[10px] text-teal-700 font-bold">Teorik: %${i.teorik_ilerleme}</span></td>
      <td class="p-3 font-mono font-black text-slate-900">%${i.gerceklesme_orani}</td>
      <td class="p-3 text-xs text-slate-700 max-w-xs leading-snug">
        ${i.sapma_gerekcesi ? `<strong class="text-[#c8102e]">Gerekçe:</strong> ${i.sapma_gerekcesi}<br>` : ''}
        ${i.onleyici_tedbir ? `<strong class="text-[#006747]">Tedbir:</strong> ${i.onleyici_tedbir}` : (i.durum_kodu !== 'YESIL' ? '<span class="text-amber-700 italic">Önlem planı bekleniyor</span>' : '<span class="text-slate-400">Takvime uygun</span>')}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 10. RESMİ İKİ YILLIK BRİFİNG RAPORU (FR-08)
async function loadReports() {
  try {
    const res = await fetch(`/api/reports/biennial?yil=${currentPeriod}`);
    const rep = await res.json();

    document.getElementById("repDate").textContent = rep.tarih;
    document.getElementById("repTotalActions").textContent = rep.ozet.toplam_eylem;
    document.getElementById("repGreenActions").textContent = `${rep.ozet.tamamlanan_veya_uygun} Eylem`;
    document.getElementById("repRedActions").textContent = `${rep.ozet.kritik_sapma} Eylem`;
    document.getElementById("repCouncilRate").textContent = `%${rep.ozet.su_kurullari_karar_orani}`;

    const tInst = document.getElementById("repInstitutionTable");
    tInst.innerHTML = "";
    rep.kurumsal_basari_matrisi.forEach(k => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="border border-slate-400 p-2 font-medium">${k.kurum}</td>
        <td class="border border-slate-400 p-2 text-center font-mono">${k.sorumlu_eylem}</td>
        <td class="border border-slate-400 p-2 text-center font-mono">${k.tamamlanan}</td>
        <td class="border border-slate-400 p-2 text-center font-bold text-[#006747] font-mono">%${k.basari_orani}</td>
      `;
      tInst.appendChild(row);
    });

    const riskyList = document.getElementById("repRiskyActionsList");
    riskyList.innerHTML = "";
    rep.riskli_eylemler.forEach(r => {
      const p = document.createElement("div");
      p.className = "p-2.5 bg-slate-50 border-l-4 border-[#c8102e] border-slate-300 rounded space-y-1";
      p.innerHTML = `
        <div class="font-bold text-slate-900 flex items-center justify-between">
          <span>${r.eylem_kodu}: ${r.eylem_tanimi}</span>
          <span class="text-[#c8102e] font-mono font-bold">%${r.gerceklesme_orani} Gerçekleşme (Teorik: %${r.teorik_ilerleme})</span>
        </div>
        <div class="text-[11px] text-slate-700">
          <strong>Sorumlu Kurum:</strong> ${r.koordinator_kodu} | 
          <strong>Sapma Gerekçesi:</strong> ${r.sapma_gerekcesi || 'Ödenek ve mevzuat mutabakat takvimi gecikmesi.'} |
          <strong>Önleyici Tedbir:</strong> ${r.onleyici_tedbir || 'USUK kararıyla ilgili bakanlıklar arası çalışma grubu oluşturulması.'}
        </div>
      `;
      riskyList.appendChild(p);
    });
  } catch (err) {
    console.error("Raporlar yüklenirken hata:", err);
  }
}

// 11. SİSTEM DENETİM İZİ (AUDIT LOG - NFR-04)
async function loadAuditLogs() {
  try {
    const res = await fetch("/api/audit-logs");
    const logs = await res.json();
    const tbody = document.getElementById("auditTableBody");
    tbody.innerHTML = "";

    logs.forEach(l => {
      const tr = document.createElement("tr");
      tr.className = "hover:bg-slate-50 transition";
      tr.innerHTML = `
        <td class="p-3 text-slate-500">${l.islem_zamani}</td>
        <td class="p-3 font-bold text-[#006747]">${l.kullanici_rol || 'SİSTEM'}</td>
        <td class="p-3 text-slate-800 font-semibold">${l.kurum_kodu || '-'}</td>
        <td class="p-3"><span class="px-1.5 py-0.5 rounded font-bold bg-slate-100 text-slate-900 border border-slate-300">${l.islem_turu}</span></td>
        <td class="p-3 text-slate-600">${l.tablo_adi} (#${l.kayit_id})</td>
        <td class="p-3 text-slate-800 font-sans">${l.islem_detayi}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Denetim günlüğü yüklenirken hata:", err);
  }
}
