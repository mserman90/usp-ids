/**
 * USP-İDS (Ulusal Su Planı İzleme ve Değerlendirme Bilgi Sistemi)
 * İstemci Mantığı (app.js)
 * Hibrit Mimari: Canlı FastAPI Backend, Google Forms ve Google Sheets Modülleri & Vercel / GitHub Pages Desteği
 */

let currentRole = "SYGM_YONETICI";
let currentPeriod = "2027";
let hierarchyData = [];
let earlyWarningData = [];
let currentFontSize = 14;
let activeSheetTab = "responses";
let currentSheetRows = [];

// Gösterge ve Eylem Haritası (Google Forms için Dinamik Bilgiler)
const INDICATORS_MAP = {
  1: { kod: "E-1.1.1", name: "Su Kanununun Yürürlüğe Girmesi", type: "KILOMETRE_TASI", unit: "Kanun", base: 0, target: 1 },
  2: { kod: "E-1.2.1", name: "Uygulamaya Geçen Su Kurulu Kararı Oranı", type: "ORANSAL_YUZDE", unit: "%", base: 40, target: 85 },
  3: { kod: "E-2.1.1", name: "Kayıt Altına Alınan ve Ölçüm Takılan Yeraltı Su Kuyusu Oranı", type: "ORANSAL_YUZDE", unit: "%", base: 25, target: 80 },
  4: { kod: "E-2.2.1", name: "İzlenen Nitrat İstasyonu Sayısı", type: "NUMERIK", unit: "Adet İstasyon", base: 800, target: 2500 },
  5: { kod: "E-3.1.1", name: "Basınçlı Borulu Sulama Şebekesi Oranı", type: "ORANSAL_YUZDE", unit: "%", base: 38, target: 65 },
  6: { kod: "E-3.2.1", name: "Geri Kazanılan Arıtılmış Atıksu Oranı", type: "ORANSAL_YUZDE", unit: "%", base: 4.2, target: 15 },
  7: { kod: "E-4.1.1", name: "Kurulan Taşkın Erken Uyarı Radarları Sayısı", type: "NUMERIK", unit: "Adet Radar", base: 18, target: 18 },
  8: { kod: "E-5.1.1", name: "Büyükşehirlerde Ortalama Su Kayıp-Kaçak Oranı", type: "ORANSAL_YUZDE", unit: "%", base: 34, target: 25 },
  9: { kod: "E-6.1.1", name: "Tamamlanan 2. Döngü Nehir Havzası Yönetim Planı Sayısı", type: "NUMERIK", unit: "Adet Havza", base: 8, target: 25 },
  10: { kod: "E-7.1.1", name: "USBS'ye Gerçek Zamanlı Veri Aktaran Kurum Oranı", type: "ORANSAL_YUZDE", unit: "%", base: 45, target: 100 },
  11: { kod: "E-7.2.1", name: "Yapay Zekâ Kuraklık Tahmin Modeli Doğruluk Skoru", type: "ORANSAL_YUZDE", unit: "%", base: 68, target: 90 },
  12: { kod: "E-8.1.1", name: "Eğitilen Öğrenci ve Çiftçi Sayısı (Kümülatif)", type: "NUMERIK", unit: "Kişi", base: 280000, target: 1150000 }
};

// Başlangıç E-Tablo Satırları (Canlı Form Yanıtları Havuzu)
let initialResponses = [
  { id: 101, timestamp: "2026-10-08 09:15", kurum: "TOB_SYGM", eylem_kodu: "E-1.1.1", gosterge: "Su Kanununun Yürürlüğe Girmesi", hedef: 1.0, gerceklesen: 0.5, birim: "Kanun", donem: "2026-2027 İki Yıllık", kanit: "Su_Kanunu_Gorus_Tutanagi.pdf", hash: "e3b0c44298fc1c14", durum: "SORUMLU_ONAYINDA", aciklama: "Bakanlıklar arası komisyon taslak metninde uzlaştı." },
  { id: 102, timestamp: "2026-10-08 10:42", kurum: "TOB_SYGM", eylem_kodu: "E-1.2.1", gosterge: "Uygulamaya Geçen Karar Oranı", hedef: 85.0, gerceklesen: 62.5, birim: "%", donem: "2026-2027 İki Yıllık", kanit: "USUK_Karar_Tutanagi.pdf", hash: "a6c8e31a98fc1c14", durum: "ONAYLANDI", aciklama: "Havza ve il su kurulu kararlarının icra takibi yapıldı." },
  { id: 103, timestamp: "2026-10-08 11:30", kurum: "TOB_DSI", eylem_kodu: "E-2.1.1", gosterge: "Kayıt Altına Alınan Kuyu Oranı", hedef: 80.0, gerceklesen: 35.0, birim: "%", donem: "2026-2027 İki Yıllık", kanit: "DSI_Saha_Sayac_Raporu.pdf", hash: "3d4f8a9298fc1c14", durum: "IADE", aciklama: "Konya Kapalı Havzasında 4.200 kuyuya debimetre takıldı." },
  { id: 104, timestamp: "2026-10-08 13:20", kurum: "CSIDB_CYGM", eylem_kodu: "E-3.2.1", gosterge: "Geri Kazanılan Atıksu Oranı", hedef: 15.0, gerceklesen: 6.8, birim: "%", donem: "2026-2027 İki Yıllık", kanit: "Atiksu_Gri_Su_Raporu.pdf", hash: "7c2a4f9198fc1c14", durum: "SYGM_ONAYINDA", aciklama: "4 büyükşehirde gri su ünitesi aktif edildi." },
  { id: 105, timestamp: "2026-10-08 14:05", kurum: "TOB_SYGM", eylem_kodu: "E-4.1.1", gosterge: "Taşkın Erken Uyarı Radarları", hedef: 18.0, gerceklesen: 18.0, birim: "Adet", donem: "2026-2027 İki Yıllık", kanit: "Taskin_Radar_Protokol.pdf", hash: "9f83c12298fc1c14", durum: "ONAYLANDI", aciklama: "18 radarın tamamı USBS ağına entegre edildi." },
  { id: 106, timestamp: "2026-10-08 15:50", kurum: "ASKI", eylem_kodu: "E-5.1.1", gosterge: "Su Kayıp-Kaçak Oranı", hedef: 25.0, gerceklesen: 31.2, birim: "%", donem: "2026-2027 İki Yıllık", kanit: "ASKI_DMA_Raporu.pdf", hash: "4a1c8e3198fc1c14", durum: "SORUMLU_ONAYINDA", aciklama: "Ankara'da 42 DMA bölgesi devreye alındı." }
];

// Hibrit İstemci
async function apiRequest(endpoint, method = "GET", body = null) {
  try {
    const options = { method, headers: { "Content-Type": "application/json" } };
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(endpoint, options);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Çevrimdışı / Vercel statik durumunda yerel depolamayı işlet
  }
  return fallbackApi(endpoint, method, body);
}

function fallbackApi(endpoint, method, body) {
  if (endpoint.includes("/api/dashboard/summary")) {
    return {
      yil: parseInt(currentPeriod),
      sayaclar: {
        hedef_sayisi: 8,
        strateji_sayisi: 31,
        eylem_sayisi: 141,
        kurum_sayisi: 11,
        onayli_veri: initialResponses.filter(r => r.durum === "ONAYLANDI").length,
        bekleyen_onay: initialResponses.filter(r => r.durum.includes("ONAYINDA")).length,
        uygulamaya_gecen_karar_orani: 57.1
      },
      erken_uyari_ozeti: { YESIL: 6, SARI: 4, KIRMIZI: 4, TOPLAM: 14 },
      hedef_ilerlemeleri: [
        { hedef_no: "HEDEF-1", baslik: "Su Yönetiminde Kurumsal ve Yasal Yapının Güçlendirilmesi", eylem_sayisi: 14, tamamlanan: 6, ilerleme_orani: 42.8 },
        { hedef_no: "HEDEF-2", baslik: "Su Kaynaklarının Miktar ve Kalite Olarak Korunması", eylem_sayisi: 22, tamamlanan: 8, ilerleme_orani: 54.2 },
        { hedef_no: "HEDEF-3", baslik: "İklim Değişikliğine Uyum ve Su Verimliliğinin Artırılması", eylem_sayisi: 28, tamamlanan: 11, ilerleme_orani: 39.5 },
        { hedef_no: "HEDEF-4", baslik: "Taşkın ve Kuraklık Yönetimi ile Afet Risklerinin Azaltılması", eylem_sayisi: 18, tamamlanan: 12, ilerleme_orani: 85.0 },
        { hedef_no: "HEDEF-5", baslik: "Su Temini, Dağıtımı ve Arıtma Altyapısının Geliştirilmesi", eylem_sayisi: 20, tamamlanan: 7, ilerleme_orani: 45.0 },
        { hedef_no: "HEDEF-6", baslik: "Havza Bazlı Bütünleşik Su Yönetimi ve İzleme Ağı", eylem_sayisi: 15, tamamlanan: 9, ilerleme_orani: 60.0 },
        { hedef_no: "HEDEF-7", baslik: "Su Bilgi Sistemi, Dijitalleşme, Ar-Ge ve İnovasyon", eylem_sayisi: 12, tamamlanan: 6, ilerleme_orani: 50.0 },
        { hedef_no: "HEDEF-8", baslik: "Su Bilinci, Katılımcılık ve Uluslararası İşbirliği", eylem_sayisi: 12, tamamlanan: 8, ilerleme_orani: 66.7 }
      ]
    };
  }
  return null;
}

function getLocalEarlyWarning(period) {
  const is2027 = period === "2027";
  return {
    summary: is2027 ? { YESIL: 4, SARI: 3, KIRMIZI: 7, TOPLAM: 14 } : { YESIL: 6, SARI: 4, KIRMIZI: 4, TOPLAM: 14 },
    items: [
      {
        eylem_id: 1, eylem_kodu: "E-1.1.1", eylem_tanimi: "Taslak Su Kanunu'nun TBMM'ye sevk edilerek yasalaşması sağlanacaktır.",
        hedef_no: "HEDEF-1", hedef_baslik: "Kurumsal ve Yasal Yapı", koordinator_kodu: "TOB_SYGM",
        baslangic_yili: 2026, bitis_yili: 2027, teorik_ilerleme: is2027 ? 100 : 50, gerceklesme_orani: 50.0,
        durum_kodu: is2027 ? "KIRMIZI" : "SARI",
        sapma_gerekcesi: "Kurumlar arası komisyon mutabakat takviminin uzaması.",
        onleyici_tedbir: "Mevzuat ve Hukuk Komisyonu nezdinde özel oturum planlandı."
      },
      {
        eylem_id: 3, eylem_kodu: "E-2.1.1", eylem_tanimi: "Tüm havzalarda kaçak yeraltı suyu kuyularının kapatılması ve debimetre takılması.",
        hedef_no: "HEDEF-2", hedef_baslik: "Su Kaynaklarının Korunması", koordinator_kodu: "TOB_DSI",
        baslangic_yili: 2026, bitis_yili: 2028, teorik_ilerleme: is2027 ? 66.7 : 33.3, gerceklesme_orani: 35.0,
        durum_kodu: "KIRMIZI",
        sapma_gerekcesi: "Konya Kapalı Havzası sayaç temin ve saha ihale gecikmesi.",
        onleyici_tedbir: "2027 ek bütçesinde debimetre alımına ilave ödenek ayrıldı."
      },
      {
        eylem_id: 6, eylem_kodu: "E-3.2.1", eylem_tanimi: "Büyükşehirlerde arıtılmış kentsel atıksuların yeniden kullanım oranı %15'e çıkarılacaktır.",
        hedef_no: "HEDEF-3", hedef_baslik: "Su Verimliliği", koordinator_kodu: "CSIDB_CYGM",
        baslangic_yili: 2026, bitis_yili: 2028, teorik_ilerleme: is2027 ? 66.7 : 33.3, gerceklesme_orani: 45.3,
        durum_kodu: "SARI",
        sapma_gerekcesi: "SUKİ arıtma deşarj hatları ile sanayi bölgeleri arası bağlantı yatırımları.",
        onleyici_tedbir: "İLBANK hibeleri önceliklendirildi."
      },
      {
        eylem_id: 7, eylem_kodu: "E-4.1.1", eylem_tanimi: "25 Havzada taşkın erken uyarı radarları ve hidrolojik tahmin modeli aktif edilecektir.",
        hedef_no: "HEDEF-4", hedef_baslik: "Afet Risklerinin Azaltılması", koordinator_kodu: "TOB_SYGM",
        baslangic_yili: 2026, bitis_yili: 2028, teorik_ilerleme: 100, gerceklesme_orani: 100.0,
        durum_kodu: "YESIL", sapma_gerekcesi: null, onleyici_tedbir: null
      }
    ]
  };
}
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  // LocalStorage kontrolü
  const savedResponses = localStorage.getItem("usp_ids_responses");
  if (savedResponses) {
    try {
      initialResponses = JSON.parse(savedResponses);
    } catch(e) {}
  }
  currentSheetRows = [...initialResponses];

  document.getElementById("periodSelect").addEventListener("change", (e) => {
    currentPeriod = e.target.value;
    refreshDashboard();
    loadEarlyWarning();
    loadReports();
    loadSheetData();
  });

  refreshDashboard();
  loadHierarchy();
  loadWorkflows();
  loadBasins();
  loadCouncils();
  loadEarlyWarning();
  loadReports();
  loadAuditLogs();
  loadSheetData();
}

// 1. ERİŞİLEBİLİRLİK (WCAG)
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
  if (tabId === "sheetsTab") loadSheetData();
  if (tabId === "formsTab") initGoogleForms();
}

// 3. ROL SEÇİCİ (RBAC SİMÜLASYONU)
function changeActiveRole(newRole) {
  currentRole = newRole;
  const uName = document.getElementById("userNameBadge");
  const uRole = document.getElementById("userRoleBadge");

  if (newRole === "SYGM_YONETICI") {
    if (uName) uName.textContent = "Mert YILMAZ";
    if (uRole) uRole.textContent = "Sistem Uzmanı • Yönetici";
  } else if (newRole === "SORUMLU_KURUM") {
    if (uName) uName.textContent = "Ahmet KAYA";
    if (uRole) uRole.textContent = "Koordinatör Kurum • Yetkili";
  } else if (newRole === "ILGILI_KURUM") {
    if (uName) uName.textContent = "Zeynep DEMİR";
    if (uRole) uRole.textContent = "Paydaş Kurum • Yetkili";
  } else if (newRole === "SEKRETERYA") {
    if (uName) uName.textContent = "Mustafa ÇELİK";
    if (uRole) uRole.textContent = "Havza / İl Sekreteryası";
  } else if (newRole === "YONETICI_USUK") {
    if (uName) uName.textContent = "Prof. Dr. İbrahim ÖZTÜRK";
    if (uRole) uRole.textContent = "İzleme Kurulu Üyesi";
  }

  loadWorkflows();
  loadSheetData();
}

// 4. GOOGLE FORMS MODÜLÜ (DİNAMİK VERİ TOPLAMA FORMU)
function initGoogleForms() {
  const select = document.getElementById("gfEylem");
  if (select) updateFormIndicatorDetails(select.value);
}

function updateFormIndicatorDetails(actionId) {
  const info = INDICATORS_MAP[actionId] || INDICATORS_MAP[1];
  const nameEl = document.getElementById("gfIndName");
  const typeEl = document.getElementById("gfIndType");
  const baseEl = document.getElementById("gfIndBase");
  const targetEl = document.getElementById("gfIndTarget");
  const unitEl = document.getElementById("gfIndUnit");

  if (nameEl) nameEl.textContent = info.name;
  if (typeEl) typeEl.textContent = info.type;
  if (baseEl) baseEl.textContent = info.base;
  if (targetEl) targetEl.textContent = `${info.target} ${info.unit}`;
  if (unitEl) unitEl.textContent = info.unit;
}

function handleGoogleFormSubmit(e) {
  e.preventDefault();
  const kurum = document.getElementById("gfKurum").value;
  const eylemId = document.getElementById("gfEylem").value;
  const indInfo = INDICATORS_MAP[eylemId] || INDICATORS_MAP[1];
  const value = parseFloat(document.getElementById("gfValue").value);
  const desc = document.getElementById("gfDesc").value;
  const proofType = document.getElementById("gfProofType").value;
  const proofFile = document.getElementById("gfProofFile").value;
  const dev = document.getElementById("gfDeviation")?.value || "";
  const mit = document.getElementById("gfMitigation")?.value || "";

  // Otomatik SHA-256 simülasyonu
  const fakeHash = "sha256_" + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 16).replace("T", " ");

  const newRecord = {
    id: 100 + initialResponses.length + 1,
    timestamp: dateStr,
    kurum: kurum,
    eylem_kodu: indInfo.kod,
    gosterge: indInfo.name,
    hedef: indInfo.target,
    gerceklesen: value,
    birim: indInfo.unit,
    donem: "2026-2027 İki Yıllık",
    kanit: proofFile,
    hash: fakeHash,
    durum: "SORUMLU_ONAYINDA",
    aciklama: desc,
    sapma: dev,
    onlem: mit
  };

  // Listeye ekle ve sakla
  initialResponses.unshift(newRecord);
  currentSheetRows = [...initialResponses];
  localStorage.setItem("usp_ids_responses", JSON.stringify(initialResponses));

  // Form görünümünü başarı kartına çevir
  document.getElementById("googleFormContent").classList.add("hidden");
  document.getElementById("gfSuccessCard").classList.remove("hidden");

  // Dashboard & E-Tablo'yu güncelle
  refreshDashboard();
  loadSheetData();
}

function resetGoogleFormView() {
  document.getElementById("googleFormContent").reset();
  document.getElementById("googleFormContent").classList.remove("hidden");
  document.getElementById("gfSuccessCard").classList.add("hidden");
  initGoogleForms();
}

// 5. GOOGLE SHEETS MODÜLÜ (MERKEZİ CANLI ELEKTRONİK TABLO)
function loadSheetData() {
  const tbody = document.getElementById("sheetTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (activeSheetTab === "responses") {
    renderSheetResponses(tbody);
  } else if (activeSheetTab === "actions") {
    renderSheetMasterActions(tbody);
  } else if (activeSheetTab === "councils") {
    renderSheetCouncils(tbody);
  } else if (activeSheetTab === "performance") {
    renderSheetPerformance(tbody);
  }
}

function renderSheetResponses(tbody) {
  let rows = currentSheetRows;
  let totalPercent = 0;
  let validPercentCount = 0;

  rows.forEach((row, idx) => {
    // Koşullu biçimlendirme (Conditional Formatting)
    let percent = (row.gerceklesen / (row.hedef || 1)) * 100;
    percent = Math.min(100, Math.round(percent * 10) / 10);
    totalPercent += percent;
    validPercentCount++;

    let condStyle = percent >= 70 ? "background-color: #dcfce7; color: #166534; font-weight: bold;" :
                    percent >= 40 ? "background-color: #fef9c3; color: #854d0e; font-weight: bold;" :
                    "background-color: #fee2e2; color: #991b1b; font-weight: bold;";

    // Dropdown Chip (Google Sheets Usulü Onay Durumu)
    let chipColor = row.durum === "ONAYLANDI" ? "bg-emerald-100 text-emerald-800 border-emerald-300" :
                    row.durum === "SORUMLU_ONAYINDA" ? "bg-amber-100 text-amber-900 border-amber-300" :
                    row.durum === "SYGM_ONAYINDA" ? "bg-sky-100 text-sky-900 border-sky-300" :
                    "bg-rose-100 text-rose-800 border-rose-300";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="gsheet-row-index">${idx + 1}</td>
      <td class="font-mono text-slate-500">#GG-${row.id}</td>
      <td class="font-mono text-slate-600">${row.timestamp}</td>
      <td class="font-bold text-slate-800">${row.kurum}</td>
      <td class="font-mono font-bold text-[#006747]">${row.eylem_kodu}</td>
      <td class="text-slate-800 max-w-xs truncate" title="${row.gosterge}">${row.gosterge}</td>
      <td class="text-right font-mono font-semibold">${row.hedef}</td>
      <td class="text-right font-mono" style="${condStyle}">${row.gerceklesen} (%${percent})</td>
      <td class="text-slate-500 font-mono text-center">${row.birim}</td>
      <td class="text-slate-600">${row.donem}</td>
      <td>
        <a href="#" onclick="alert('Resmî Kanıt Belgesi: ' + '${row.kanit}' + '\\nSHA-256 Hash: ' + '${row.hash}'); return false;" class="text-[#006747] hover:underline font-bold flex items-center gap-1">
          <i class="fa-solid fa-file-pdf text-[#c8102e]"></i> ${row.kanit}
        </a>
      </td>
      <td>
        <select onchange="updateRowStatusInline(${row.id}, this.value)" class="text-[10px] font-bold rounded px-1.5 py-0.5 border ${chipColor} cursor-pointer focus:outline-none">
          <option value="SORUMLU_ONAYINDA" ${row.durum === 'SORUMLU_ONAYINDA' ? 'selected' : ''}>⭐ Sorumlu Onayında</option>
          <option value="SYGM_ONAYINDA" ${row.durum === 'SYGM_ONAYINDA' ? 'selected' : ''}>👑 SYGM Onayında</option>
          <option value="ONAYLANDI" ${row.durum === 'ONAYLANDI' ? 'selected' : ''}>🟢 ONAYLANDI</option>
          <option value="IADE" ${row.durum === 'IADE' ? 'selected' : ''}>🔴 İADE</option>
        </select>
      </td>
      <td class="text-center">
        <button onclick="alert('Açıklama: ' + '${row.aciklama || 'Belirtilmedi'}');" class="text-slate-500 hover:text-[#006747] px-1" title="Açıklamayı İncele">
          <i class="fa-solid fa-eye"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const avg = validPercentCount > 0 ? (totalPercent / validPercentCount).toFixed(1) : 0;
  const countEl = document.getElementById("sheetRowCount");
  const avgEl = document.getElementById("sheetAverage");
  const fInput = document.getElementById("sheetFormulaInput");
  if (countEl) countEl.textContent = `Satır Sayısı: ${rows.length}`;
  if (avgEl) avgEl.textContent = `Ortalama Gerçekleşme: %${avg}`;
  if (fInput) fInput.value = `=ORTALAMA(G2:G${rows.length + 1}) • Kümülatif: %${avg} • Toplam Kayıt: ${rows.length} • Canlı E-Tablo`;
}

function updateRowStatusInline(rowId, newStatus) {
  const row = initialResponses.find(r => r.id === rowId);
  if (row) {
    row.durum = newStatus;
    localStorage.setItem("usp_ids_responses", JSON.stringify(initialResponses));
    loadSheetData();
    refreshDashboard();
  }
}

function switchSheetTab(tabKey) {
  activeSheetTab = tabKey;
  document.querySelectorAll(".gsheet-tab-btn").forEach(b => b.classList.remove("active"));
  const btn = document.getElementById(`sTab-${tabKey}`);
  if (btn) btn.classList.add("active");
  loadSheetData();
}

function renderSheetMasterActions(tbody) {
  const actionsList = [
    { kod: "E-1.1.1", tanim: "Taslak Su Kanunu'nun TBMM'ye sevki", koord: "TOB_SYGM", basla: 2026, bitis: 2027, hedef: 1, birim: "Kanun", durum: "DEVAM_EDIYOR" },
    { kod: "E-1.2.1", tanim: "Su kurulları kararlarının dijital takibi", koord: "TOB_SYGM", basla: 2026, bitis: 2035, hedef: 85, birim: "%", durum: "DEVAM_EDIYOR" },
    { kod: "E-2.1.1", tanim: "Kaçak yeraltı suyu kuyularının kontrolü ve debimetre", koord: "TOB_DSI", basla: 2026, bitis: 2028, hedef: 80, birim: "%", durum: "RISKLI" },
    { kod: "E-2.2.1", tanim: "Hassas su alanlarında nitrat izleme istasyonları", koord: "TOB_SYGM", basla: 2026, bitis: 2030, hedef: 2500, birim: "Adet", durum: "DEVAM_EDIYOR" },
    { kod: "E-3.1.1", tanim: "Basınçlı kapalı borulu sulama şebekesi yaygınlaştırma", koord: "TOB_DSI", basla: 2026, bitis: 2030, hedef: 65, birim: "%", durum: "DEVAM_EDIYOR" },
    { kod: "E-3.2.1", tanim: "Arıtılmış kentsel atıksuların yeniden kullanımı", koord: "CSIDB_CYGM", basla: 2026, bitis: 2028, hedef: 15, birim: "%", durum: "RISKLI" },
    { kod: "E-4.1.1", tanim: "25 Havzada taşkın erken uyarı radarları kurulumu", koord: "TOB_SYGM", basla: 2026, bitis: 2028, hedef: 18, birim: "Adet", durum: "TAMAMLANDI" },
    { kod: "E-5.1.1", tanim: "Büyükşehirlerde fiziki su kayıp-kaçak oranının azaltılması", koord: "TOB_SYGM", basla: 2026, bitis: 2030, hedef: 25, birim: "%", durum: "DEVAM_EDIYOR" },
    { kod: "E-6.1.1", tanim: "2. Döngü Nehir Havza Yönetim Planlarının hazırlanması", koord: "TOB_SYGM", basla: 2026, bitis: 2028, hedef: 25, birim: "Havza", durum: "DEVAM_EDIYOR" },
    { kod: "E-7.1.1", tanim: "Ulusal Su Bilgi Sistemi (USBS) tam API entegrasyonu", koord: "TOB_SYGM", basla: 2026, bitis: 2027, hedef: 100, birim: "%", durum: "DEVAM_EDIYOR" },
    { kod: "E-7.2.1", tanim: "Yapay zekâ destekli kuraklık risk tahmin modeli", koord: "TOB_SYGM", basla: 2026, bitis: 2028, hedef: 90, birim: "%", durum: "DEVAM_EDIYOR" },
    { kod: "E-8.1.1", tanim: "Su Verimliliği Seferberliği öğrenci ve çiftçi eğitimleri", koord: "TOB_SYGM", basla: 2026, bitis: 2035, hedef: 1150000, birim: "Kişi", durum: "DEVAM_EDIYOR" }
  ];

  actionsList.forEach((a, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="gsheet-row-index">${idx + 1}</td>
      <td class="font-mono text-slate-500">M-${idx + 1}</td>
      <td class="font-mono text-slate-500">2026-2035</td>
      <td class="font-bold text-slate-800">${a.koord}</td>
      <td class="font-mono font-bold text-[#006747]">${a.kod}</td>
      <td class="text-slate-800 max-w-sm truncate">${a.tanim}</td>
      <td class="text-right font-mono font-semibold">${a.hedef}</td>
      <td class="text-right font-mono text-slate-600">—</td>
      <td class="text-center font-mono text-slate-500">${a.birim}</td>
      <td class="text-slate-600">${a.basla}-${a.bitis}</td>
      <td class="text-slate-400 italic">Plan Kararı</td>
      <td><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">${a.durum}</span></td>
      <td class="text-center font-mono text-xs text-slate-400">141 Master</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderSheetCouncils(tbody) {
  const councils = [
    { no: "USUK-2026/01", tarih: "2026-03-20", kurul: "ULUSAL_SU_KURULU", metin: "Tüm nehir havzalarında kuraklık eylem planlarının revize edilmesi.", eylem: "E-1.2.1", durum: "UYGULANDI", oran: 100 },
    { no: "HSK-KNY-2026/04", tarih: "2026-04-12", kurul: "HAVZA_SU_KURULU", metin: "Konya Kapalı Havzasında kaçak tarımsal kuyu denetimi.", eylem: "E-2.1.1", durum: "DEVAM_EDIYOR", oran: 55 },
    { no: "HSK-GDZ-2026/02", tarih: "2026-05-18", kurul: "HAVZA_SU_KURULU", metin: "Gediz Havzası OSB su geri kazanım tesislerinin zorunlu kılınması.", eylem: "E-3.2.1", durum: "DEVAM_EDIYOR", oran: 70 },
    { no: "HSK-SSR-2026/01", tarih: "2026-06-05", kurul: "HAVZA_SU_KURULU", metin: "Nilüfer Çayı kirliliğinin önlenmesi amacıyla arıtma denetimleri.", eylem: "E-2.2.1", durum: "UYGULANDI", oran: 100 }
  ];

  councils.forEach((c, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="gsheet-row-index">${idx + 1}</td>
      <td class="font-mono text-slate-500">K-${idx + 1}</td>
      <td class="font-mono text-slate-600">${c.tarih}</td>
      <td class="font-bold text-slate-800">${c.kurul}</td>
      <td class="font-mono font-bold text-[#006747]">${c.no}</td>
      <td class="text-slate-800 max-w-sm truncate">${c.metin}</td>
      <td class="text-right font-mono font-semibold">100.0</td>
      <td class="text-right font-mono font-bold text-[#006747]">${c.oran}.0 (%${c.oran})</td>
      <td class="text-center font-mono text-slate-500">%</td>
      <td class="text-slate-600">2026 Yıllık</td>
      <td class="text-slate-600 font-semibold">${c.eylem}</td>
      <td><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">${c.durum}</span></td>
      <td class="text-center font-mono text-xs text-[#006747]">Karar İcrası</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderSheetPerformance(tbody) {
  const perf = [
    { kurum: "TOB - Su Yönetimi Genel Müdürlüğü (SYGM)", toplam: 8, tamam: 3, basari: 78.5 },
    { kurum: "Devlet Su İşleri Genel Müdürlüğü (DSİ)", toplam: 2, tamam: 0, basari: 54.0 },
    { kurum: "Çevre, Şehircilik ve İklim Değ. Bak. (CYGM)", toplam: 1, tamam: 0, basari: 45.3 },
    { kurum: "Ankara Su ve Kanalizasyon İdaresi (ASKİ)", toplam: 1, tamam: 0, basari: 68.0 },
    { kurum: "Türkiye Belediyeler Birliği (TBB)", toplam: 1, tamam: 0, basari: 32.0 }
  ];

  perf.forEach((p, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="gsheet-row-index">${idx + 1}</td>
      <td class="font-mono text-slate-500">P-${idx + 1}</td>
      <td class="font-mono text-slate-600">2026-2027</td>
      <td class="font-bold text-slate-800">${p.kurum}</td>
      <td class="font-mono font-bold text-[#006747]">K-PERF</td>
      <td class="text-slate-800">Kurumsal Koordinasyon Performans Puanı</td>
      <td class="text-right font-mono font-semibold">${p.toplam} Eylem</td>
      <td class="text-right font-mono font-bold text-[#006747]">%${p.basari}</td>
      <td class="text-center font-mono text-slate-500">%</td>
      <td class="text-slate-600">Konsolide</td>
      <td class="text-slate-500">${p.tamam} Tamamlandı</td>
      <td><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">AKTİF</span></td>
      <td class="text-center font-mono text-xs text-[#006747]">Pivot Özet</td>
    `;
    tbody.appendChild(tr);
  });
}

function filterSheetTable() {
  const q = (document.getElementById("sheetSearchInput")?.value || "").toLowerCase();
  const k = document.getElementById("sheetFilterKurum")?.value || "ALL";
  const s = document.getElementById("sheetFilterStatus")?.value || "ALL";

  currentSheetRows = initialResponses.filter(row => {
    const matchQ = !q || row.eylem_kodu.toLowerCase().includes(q) || row.kurum.toLowerCase().includes(q) || row.gosterge.toLowerCase().includes(q);
    const matchK = k === "ALL" || row.kurum === k;
    const matchS = s === "ALL" || row.durum === s;
    return matchQ && matchK && matchS;
  });

  loadSheetData();
}

function resetSheetFilters() {
  if (document.getElementById("sheetSearchInput")) document.getElementById("sheetSearchInput").value = "";
  if (document.getElementById("sheetFilterKurum")) document.getElementById("sheetFilterKurum").value = "ALL";
  if (document.getElementById("sheetFilterStatus")) document.getElementById("sheetFilterStatus").value = "ALL";
  currentSheetRows = [...initialResponses];
  loadSheetData();
}

function exportSheetToCSV() {
  let csvContent = "\uFEFF"; // UTF-8 BOM
  csvContent += "Kayit_ID;Zaman_Damgasi;Kurum;Eylem_Kodu;Gosterge_Tanimi;Hedef;Gerceklesen;Birim;Donem;Kanit_Belgesi;SHA256;Onay_Durumu;Aciklama\n";

  currentSheetRows.forEach(r => {
    const row = [
      r.id,
      r.timestamp,
      r.kurum,
      r.eylem_kodu,
      `"${r.gosterge}"`,
      r.hedef,
      r.gerceklesen,
      r.birim,
      `"${r.donem}"`,
      `"${r.kanit}"`,
      r.hash,
      r.durum,
      `"${r.aciklama || ''}"`
    ];
    csvContent += row.join(";") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `USP_IDS_Merkezi_Izleme_Tablosu_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 6. DİĞER MODÜLLER (Dashboard, Hiyerarşi, Havzalar, Raporlar vb.)
async function refreshDashboard() {
  try {
    const data = await apiRequest(`/api/dashboard/summary?yil=${currentPeriod}`);
    if (!data) return;

    document.getElementById("kpi-hedef").textContent = data.sayaclar.hedef_sayisi;
    document.getElementById("kpi-eylem").textContent = data.sayaclar.eylem_sayisi;
    document.getElementById("kpi-yesil").textContent = data.erken_uyari_ozeti.YESIL;
    document.getElementById("kpi-sari").textContent = data.erken_uyari_ozeti.SARI;
    document.getElementById("kpi-kirmizi").textContent = data.erken_uyari_ozeti.KIRMIZI;
    document.getElementById("kpi-karar-oran").textContent = `%${data.sayaclar.uygulamaya_gecen_karar_orani}`;

    const container = document.getElementById("goalsProgressContainer");
    if (container) {
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
    }
  } catch (err) {}
}

async function loadHierarchy() {
  try {
    let data = await apiRequest("/api/hierarchy");
    if (!data) {
      data = [
        {
          hedef_id: 1, hedef_no: "HEDEF-1", baslik: "Su Yönetiminde Kurumsal ve Yasal Yapının Güçlendirilmesi",
          aciklama: "Su Kanunu, Taşkın Kanunu çıkarılması ve su kurullarının etkinliği.",
          stratejiler: [
            {
              strateji_id: 1, strateji_kodu: "S-1.1", baslik: "Su Kanunu ve İlgili Mevzuatın Yürürlüğe Konulması",
              eylemler: [
                { eylem_id: 1, eylem_kodu: "E-1.1.1", eylem_tanimi: "Taslak Su Kanunu'nun TBMM'ye sevk edilerek yasalaşması sağlanacaktır.", baslangic_yili: 2026, bitis_yili: 2027, genel_durum: "DEVAM_EDIYOR", gosterge_tanimi: "Su Kanununun Yürürlüğe Girmesi", hedef_deger: 1.0, olcu_birimi: "Kanun", paydas_kurumlar: [{ kurum_kodu: "TOB_SYGM", rol_turu: "KOORDINATOR_SORUMLU" }, { kurum_kodu: "TOB_DSI", rol_turu: "ORTAK_SORUMLU" }] }
              ]
            }
          ]
        },
        {
          hedef_id: 2, hedef_no: "HEDEF-2", baslik: "Su Kaynaklarının Miktar ve Kalite Olarak Korunması ve Sürdürülebilir Kullanımı",
          aciklama: "Yeraltı ve yerüstü su kütlelerinin iyi su durumuna ulaştırılması ve tahsis planlaması.",
          stratejiler: [
            {
              strateji_id: 3, strateji_kodu: "S-2.1", baslik: "Yeraltı Su Seviyelerinin Korunması ve Kaçak Kuyuların Kontrolü",
              eylemler: [
                { eylem_id: 3, eylem_kodu: "E-2.1.1", eylem_tanimi: "Tüm nehir havzalarında yeraltı suyu tahsis miktarları belirlenecektir.", baslangic_yili: 2026, bitis_yili: 2028, genel_durum: "RISKLI", gosterge_tanimi: "Kayıt Altına Alınan Kuyu Oranı", hedef_deger: 80.0, olcu_birimi: "%", paydas_kurumlar: [{ kurum_kodu: "TOB_DSI", rol_turu: "KOORDINATOR_SORUMLU" }, { kurum_kodu: "TOB_SYGM", rol_turu: "ORTAK_SORUMLU" }] }
              ]
            }
          ]
        }
      ];
    }
    hierarchyData = data;
    renderHierarchy(hierarchyData);
  } catch (err) {}
}

function renderHierarchy(data) {
  const container = document.getElementById("hierarchyTreeContainer");
  if (!container) return;
  container.innerHTML = "";

  data.forEach((hedef, hIdx) => {
    const hedefCard = document.createElement("div");
    hedefCard.className = "bg-white rounded border border-slate-300 overflow-hidden shadow-sm";
    
    let stratHtml = "";
    (hedef.stratejiler || []).forEach(st => {
      let eylemlerHtml = "";
      (st.eylemler || []).forEach(ey => {
        let kurumlarBadge = "";
        (ey.paydas_kurumlar || []).forEach(k => {
          if (k.rol_turu === "KOORDINATOR_SORUMLU") {
            kurumlarBadge += `<span class="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px] border border-amber-300"><i class="fa-solid fa-star text-amber-500 mr-1"></i>${k.kurum_kodu} (*)</span> `;
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
          <span class="text-xs text-slate-600 font-medium">${(hedef.stratejiler || []).length} Strateji</span>
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
    const matchingStrategies = (h.stratejiler || []).map(s => {
      const matchingActions = (s.eylemler || []).filter(e => 
        e.eylem_kodu.toLowerCase().includes(q) ||
        e.eylem_tanimi.toLowerCase().includes(q)
      );
      return { ...s, eylemler: matchingActions };
    }).filter(s => s.eylemler.length > 0);

    return { ...h, stratejiler: matchingStrategies };
  }).filter(h => h.stratejiler.length > 0);

  renderHierarchy(filtered);
}

// 7. VERİ ONAY MASASI
async function loadWorkflows(filter = "ALL") {
  try {
    let workflows = initialResponses;
    if (filter !== "ALL") {
      workflows = workflows.filter(w => w.durum === filter);
    }

    let onayli = 0, sorumlu = 0, sygm = 0, iade = 0;
    initialResponses.forEach(w => {
      if (w.durum === "ONAYLANDI") onayli++;
      else if (w.durum === "SORUMLU_ONAYINDA") sorumlu++;
      else if (w.durum === "SYGM_ONAYINDA") sygm++;
      else if (w.durum === "IADE") iade++;
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
  } catch (err) {}
}

function filterWorkflows(filter) {
  document.querySelectorAll(".wf-filter-btn").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-filter") === filter);
  });
  loadWorkflows(filter);
}

function renderWorkflowTable(items) {
  const tbody = document.getElementById("workflowTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400">Bu filtrelere uygun veri girişi bulunmuyor.</td></tr>`;
    return;
  }

  items.forEach(item => {
    const st = item.onay_durumu || item.durum;
    let statusBadge = "";
    if (st === "ONAYLANDI") {
      statusBadge = `<span class="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded font-black border border-emerald-300">🟢 ONAYLANDI</span>`;
    } else if (st === "SORUMLU_ONAYINDA") {
      statusBadge = `<span class="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold border border-amber-300">⭐ Sorumlu Onayında</span>`;
    } else if (st === "SYGM_ONAYINDA") {
      statusBadge = `<span class="bg-sky-100 text-sky-900 px-2 py-0.5 rounded font-bold border border-sky-300">👑 SYGM / Nihai Onayda</span>`;
    } else if (st === "IADE") {
      statusBadge = `<span class="bg-rose-100 text-rose-900 px-2 py-0.5 rounded font-bold border border-rose-300">🔴 İADE EDİLDİ</span>`;
    } else {
      statusBadge = `<span class="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold border border-slate-300">${st || 'Beklemede'}</span>`;
    }

    let actionButtons = "";
    const gId = item.gerceklesme_id || item.id;
    if (currentRole === "SORUMLU_KURUM" && st === "SORUMLU_ONAYINDA") {
      actionButtons = `
        <button onclick="triggerWorkflowAction(${gId}, 'ONAYLA')" class="tob-btn-primary py-1 px-2 text-[11px]">
          <i class="fa-solid fa-arrow-right-to-bracket"></i> Onaya Sun
        </button>
        <button onclick="openRejectModal(${gId})" class="tob-btn-secondary py-1 px-2 text-[11px] text-rose-700 border-rose-300">
          İade
        </button>
      `;
    } else if (currentRole === "SYGM_YONETICI" && (st === "SYGM_ONAYINDA" || st === "SORUMLU_ONAYINDA")) {
      actionButtons = `
        <button onclick="triggerWorkflowAction(${gId}, 'ONAYLA')" class="tob-btn-primary py-1 px-2 text-[11px] bg-emerald-700 hover:bg-emerald-800">
          <i class="fa-solid fa-check-double"></i> Onayla
        </button>
        <button onclick="openRejectModal(${gId})" class="tob-btn-secondary py-1 px-2 text-[11px] text-rose-700 border-rose-300">
          İade
        </button>
      `;
    } else {
      actionButtons = `
        <button onclick="switchTab('sheetsTab')" class="tob-btn-secondary text-[11px] py-1 px-2">
          <i class="fa-solid fa-table-cells mr-1"></i>E-Tabloda Aç
        </button>
      `;
    }

    const dosya = item.dosya_adi || item.kanit;
    const hash = item.dosya_hash_sha256 || item.hash;
    let kanitCell = "";
    if (dosya) {
      kanitCell = `
        <div class="space-y-0.5">
          <a href="#" onclick="alert('Kanıt Belgesi Detayı: ' + '${dosya}' + ' \\nElektronik Bütünlük Doğrulaması: Başarılı'); return false;" class="text-[#006747] hover:underline font-bold flex items-center gap-1">
            <i class="fa-solid fa-file-pdf text-[#c8102e]"></i> ${dosya}
          </a>
          <div class="text-[9px] font-mono text-slate-400 truncate w-36">
            SHA256: ${hash ? hash.substring(0, 16) + '...' : '-'}
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
        <div class="font-bold text-slate-900">${item.eylem_kodu || item.kod}</div>
        <div class="text-slate-600 line-clamp-1">${item.gosterge || item.eylem_tanimi || ''}</div>
      </td>
      <td class="p-3 font-semibold text-slate-800">${item.kurum || item.kurum_kodu || ''}</td>
      <td class="p-3 text-slate-600">${item.donem || '2026-2027'}</td>
      <td class="p-3 font-black text-[#006747] text-sm">${item.girilen_deger !== undefined ? item.girilen_deger : (item.gerceklesen !== undefined ? item.gerceklesen : '-')} <span class="text-xs font-normal text-slate-500">${item.birim || ''}</span></td>
      <td class="p-3">${kanitCell}</td>
      <td class="p-3">${statusBadge}</td>
      <td class="p-3 text-right">${actionButtons}</td>
    `;
    tbody.appendChild(tr);
  });
}

async function triggerWorkflowAction(gerceklesmeId, islem, gerekce = "") {
  try {
    await apiRequest(`/api/workflows/${gerceklesmeId}/action`, "POST", {
      islem: islem,
      gerekce: gerekce,
      kullanici_rol: currentRole,
      kurum_kodu: currentRole === "SORUMLU_KURUM" ? "TOB_DSI" : "TOB_SYGM"
    });
    alert(`İşlem Başarıyla Tamamlandı.`);
    loadWorkflows();
    refreshDashboard();
    loadAuditLogs();
  } catch (err) {
    // Client-side fallback update
    updateRowStatusInline(gerceklesmeId, islem === "ONAYLA" ? "ONAYLANDI" : "IADE");
    alert(`İşlem kaydedildi (Durum güncellendi).`);
    loadWorkflows();
  }
}

function openRejectModal(id) {
  const modal = document.getElementById("rejectModal");
  if (modal) {
    document.getElementById("rejectGerceklesmeId").value = id;
    document.getElementById("rejectReason").value = "";
    modal.showModal();
  } else {
    const reason = prompt("İade gerekçesini belirtiniz:");
    if (reason) triggerWorkflowAction(id, "IADE", reason);
  }
}

function handleRejectSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("rejectGerceklesmeId").value;
  const reason = document.getElementById("rejectReason").value;
  document.getElementById("rejectModal").close();
  triggerWorkflowAction(id, "IADE", reason);
}

function openNewSubmissionModal() {
  const modal = document.getElementById("submissionModal");
  if (modal) {
    modal.showModal();
  } else {
    switchTab("formsTab");
  }
}

async function handleProgressSubmit(e) {
  e.preventDefault();
  const data = {
    gosterge_id: parseInt(document.getElementById("subIndicatorSelect").value),
    kurum_id: 6,
    donem_id: parseInt(document.getElementById("subPeriodSelect").value),
    girilen_deger: parseFloat(document.getElementById("subValue").value),
    aciklama: document.getElementById("subDescription").value,
    kanit_dosya_adi: document.getElementById("subProofFileName").value,
    kanit_belge_turu: document.getElementById("subProofType").value,
    kullanici_rol: currentRole,
    kurum_kodu: "ASKI"
  };

  try {
    await apiRequest("/api/workflows/submit", "POST", data);
    alert("Gerçekleşme verisi ve kanıt belgesi onay sürecine sunuldu!");
    document.getElementById("submissionModal").close();
    loadWorkflows();
    refreshDashboard();
    loadAuditLogs();
  } catch (err) {
    alert("Veri gönderilirken hata oluştu!");
  }
}

// 7. 25 NEHİR HAVZASI CBS İZLEME (FR-07)
async function loadBasins() {
  try {
    let basins = await apiRequest("/api/basins");
    if (!basins) {
      basins = [
        { kod: "KONYA_KAPALI", ad: "Konya Kapalı Havzası", bolge: "İç Anadolu", oncelik: "Obruklar, YAS ve Kuraklık", karar_sayisi: 4, karar_basari_orani: 62.5, gerceklesme_orani: 42.0 },
        { kod: "GEDIZ", ad: "Gediz Havzası", bolge: "Ege", oncelik: "Aşırı Çekim ve Sanayi Atıksuyu", karar_sayisi: 3, karar_basari_orani: 70.0, gerceklesme_orani: 55.0 },
        { kod: "SUSURLUK", ad: "Susurluk Havzası", bolge: "Marmara/Ege", oncelik: "Tarımsal Kirlilik ve Tahsis", karar_sayisi: 2, karar_basari_orani: 100.0, gerceklesme_orani: 68.0 },
        { kod: "MARMARA", ad: "Marmara Havzası", bolge: "Marmara", oncelik: "Kentsel Baskı ve Sanayi", karar_sayisi: 5, karar_basari_orani: 80.0, gerceklesme_orani: 62.0 },
        { kod: "BATI_KARADENIZ", ad: "Batı Karadeniz Havzası", bolge: "Karadeniz", oncelik: "Taşkın Erken Uyarı ve Heyelan", karar_sayisi: 4, karar_basari_orani: 100.0, gerceklesme_orani: 85.0 },
        { kod: "FIRAT", ad: "Fırat Havzası", bolge: "Doğu/Güneydoğu", oncelik: "GAP Sulaması ve Hidroelektrik", karar_sayisi: 2, karar_basari_orani: 50.0, gerceklesme_orani: 58.0 }
      ];
    }

    const container = document.getElementById("basinsCardsContainer");
    if (!container) return;
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
  } catch (err) {}
}

// 9. SU KURULLARI KARARLARI
async function loadCouncils() {
  try {
    let data = await apiRequest("/api/water-councils");
    if (!data) {
      data = {
        kurul_bazli: [{ kurul_turu: "ULUSAL_SU_KURULU", toplam: 2 }, { kurul_turu: "HAVZA_SU_KURULU", toplam: 4 }, { kurul_turu: "IL_SU_KURULU", toplam: 2 }],
        kararlar: [
          { kurul_turu: "ULUSAL_SU_KURULU", karar_no: "USUK-2026/01", toplanti_tarihi: "2026-03-20", karar_metni: "Tüm nehir havzalarında kuraklık eylem planlarının revize edilmesi.", eylem_kodu: "E-1.2.1", uygulama_durumu: "UYGULANDI", tamamlanma_orani: 100 },
          { kurul_turu: "HAVZA_SU_KURULU", karar_no: "HSK-KNY-2026/04", toplanti_tarihi: "2026-04-12", karar_metni: "Konya Kapalı Havzasında kaçak tarımsal kuyu denetimi.", eylem_kodu: "E-2.1.1", uygulama_durumu: "DEVAM_EDIYOR", tamamlanma_orani: 55 }
        ]
      };
    }

    let usuk = 0, havza = 0, il = 0;
    (data.kurul_bazli || []).forEach(k => {
      if (k.kurul_turu === "ULUSAL_SU_KURULU") usuk = k.toplam;
      if (k.kurul_turu === "HAVZA_SU_KURULU") havza = k.toplam;
      if (k.kurul_turu === "IL_SU_KURULU") il = k.toplam;
    });

    const elU = document.getElementById("councils-usuk-count");
    const elH = document.getElementById("councils-havza-count");
    const elI = document.getElementById("councils-il-count");
    if (elU) elU.textContent = `${usuk} Karar`;
    if (elH) elH.textContent = `${havza} Karar`;
    if (elI) elI.textContent = `${il} Karar`;

    const tbody = document.getElementById("councilsTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    (data.kararlar || []).forEach(k => {
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
  } catch (err) {}
}

// 10. SAPMA VE ERKEN UYARI
async function loadEarlyWarning() {
  try {
    let data = await apiRequest(`/api/early-warning?yil=${currentPeriod}`);
    if (!data) {
      data = {
        summary: { YESIL: 6, SARI: 4, KIRMIZI: 4, TOPLAM: 14 },
        items: [
          { eylem_kodu: "E-1.1.1", eylem_tanimi: "Taslak Su Kanunu TBMM sevk süreci", hedef_no: "HEDEF-1", hedef_baslik: "Kurumsal ve Yasal Yapı", koordinator_kodu: "TOB_SYGM", baslangic_yili: 2026, bitis_yili: 2027, teorik_ilerleme: 50, gerceklesme_orani: 50, durum_kodu: "SARI", sapma_gerekcesi: "Mevzuat komisyon takvimi uzaması", onleyici_tedbir: "Bakanlıklar arası özel oturum planlandı." }
        ]
      };
    }
    earlyWarningData = data.items || [];
    renderEarlyWarningTable(earlyWarningData);
  } catch (err) {}
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
  if (!tbody) return;
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

// 10. İKİ YILLIK BRİFİNG RAPORU (FR-08)
async function loadReports() {
  try {
    let rep = await apiRequest(`/api/reports/biennial?yil=${currentPeriod}`);
    if (!rep) {
      rep = {
        tarih: new Date().toLocaleDateString("tr-TR"),
        ozet: { toplam_eylem: 141, tamamlanan_veya_uygun: 88, kritik_sapma: 16, su_kurullari_karar_orani: 57.1 },
        kurumsal_basari_matrisi: [
          { kurum: "Su Yönetimi Koordinasyon Birimi", sorumlu_eylem: 8, tamamlanan: 3, basari_orani: 78.5 },
          { kurum: "Devlet Su İşleri Genel Müdürlüğü (DSİ)", sorumlu_eylem: 2, tamamlanan: 0, basari_orani: 54.0 },
          { kurum: "Çevre Yönetimi Koordinasyon Birimi", sorumlu_eylem: 1, tamamlanan: 0, basari_orani: 45.3 },
          { kurum: "Ankara Su ve Kanalizasyon İdaresi (ASKİ)", sorumlu_eylem: 1, tamamlanan: 0, basari_orani: 68.0 }
        ],
        riskli_eylemler: [
          { eylem_kodu: "E-2.1.1", eylem_tanimi: "Tüm havzalarda kaçak yeraltı suyu kuyularının kapatılması ve debimetre takılması.", gerceklesme_orani: 35.0, teorik_ilerleme: 66.7, koordinator_kodu: "TOB_DSI", sapma_gerekcesi: "Konya Kapalı Havzası sayaç temin gecikmesi.", onleyici_tedbir: "2027 ek bütçesinde debimetre alımına ilave ödenek tahsisi." }
        ]
      };
    }

    const repDateEl = document.getElementById("repDate");
    const repTotEl = document.getElementById("repTotalActions");
    const repGreenEl = document.getElementById("repGreenActions");
    const repRedEl = document.getElementById("repRedActions");
    const repRateEl = document.getElementById("repCouncilRate");

    if (repDateEl) repDateEl.textContent = rep.tarih;
    if (repTotEl) repTotEl.textContent = rep.ozet.toplam_eylem;
    if (repGreenEl) repGreenEl.textContent = `${rep.ozet.tamamlanan_veya_uygun} Eylem`;
    if (repRedEl) repRedEl.textContent = `${rep.ozet.kritik_sapma} Eylem`;
    if (repRateEl) repRateEl.textContent = `%${rep.ozet.su_kurullari_karar_orani}`;

    const tInst = document.getElementById("repInstitutionTable");
    if (tInst) {
      tInst.innerHTML = "";
      (rep.kurumsal_basari_matrisi || []).forEach(k => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="border border-slate-400 p-2 font-medium">${k.kurum}</td>
          <td class="border border-slate-400 p-2 text-center font-mono">${k.sorumlu_eylem}</td>
          <td class="border border-slate-400 p-2 text-center font-mono">${k.tamamlanan}</td>
          <td class="border border-slate-400 p-2 text-center font-bold text-[#006747] font-mono">%${k.basari_orani}</td>
        `;
        tInst.appendChild(row);
      });
    }

    const riskyList = document.getElementById("repRiskyActionsList");
    if (riskyList) {
      riskyList.innerHTML = "";
      (rep.riskli_eylemler || []).forEach(r => {
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
            <strong>Önleyici Tedbir:</strong> ${r.onleyici_tedbir || 'İlgili paydaşlar arası çalışma grubu oluşturulması.'}
          </div>
        `;
        riskyList.appendChild(p);
      });
    }
  } catch (err) {
    console.error("Raporlar yükleme hatası:", err);
  }
}

// 12. DENETİM İZİ
async function loadAuditLogs() {
  try {
    let logs = await apiRequest("/api/audit-logs");
    if (!logs) {
      logs = [
        { islem_zamani: "2026-10-09 14:05:00", kullanici_rol: "SYGM_YONETICI", kurum_kodu: "TOB_SYGM", islem_turu: "ONAY", tablo_adi: "gosterge_gerceklesme", kayit_id: "105", islem_detayi: "Taşkın radar göstergesi resmî onaylandı." },
        { islem_zamani: "2026-10-09 11:30:15", kullanici_rol: "SORUMLU_KURUM", kurum_kodu: "TOB_DSI", islem_turu: "INSERT", tablo_adi: "gosterge_gerceklesme", kayit_id: "103", islem_detayi: "YAS kuyu sayaç gerçekleşmesi girildi." },
        { islem_zamani: "2026-10-08 08:05:00", kullanici_rol: "SİSTEM", kurum_kodu: "TOB_SYGM", islem_turu: "INSERT", tablo_adi: "hedef", kayit_id: "ALL", islem_detayi: "Ulusal Su Planı 141 Eylem master planı yüklendi." }
      ];
    }
    const tbody = document.getElementById("auditTableBody");
    if (!tbody) return;
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
  } catch (err) {}
}
