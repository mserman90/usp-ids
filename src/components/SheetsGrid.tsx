"use client";

import React, { useState } from "react";
import { GostergeGerceklesme, KullaniciRolu, OnayDurumu } from "@/types";
import { MASTER_TARGETS } from "@/data/targets";
import { SU_KURULU_KARARLARI } from "@/data/sampleResponses";
import { 
  Download, Search, Filter, RefreshCw, FileSpreadsheet, 
  CheckCircle, Clock, AlertTriangle, ArrowRightCircle 
} from "lucide-react";

interface SheetsGridProps {
  currentRole: KullaniciRolu;
  responses: GostergeGerceklesme[];
  onUpdateStatus: (id: string | number, newStatus: OnayDurumu) => void;
  onOpenNewForm: () => void;
}

export function SheetsGrid({ currentRole, responses, onUpdateStatus, onOpenNewForm }: SheetsGridProps) {
  const [activeTab, setActiveTab] = useState<"responses" | "actions" | "councils" | "institutions">("responses");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [activeCell, setActiveCell] = useState<string>("G2");
  const [formulaValue, setFormulaValue] = useState<string>("=ORTALAMA(G2:G7)");

  // Filtered responses
  const filteredResponses = responses.filter(r => {
    const matchSearch = r.eylem_kodu.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.gosterge_tanimi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.kurum_kodu.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "ALL" || r.onay_durumu === filterStatus;
    return matchSearch && matchStatus;
  });

  // Calculate statistics for the Google Sheets status bar
  const totalCount = filteredResponses.length;
  const approvedCount = filteredResponses.filter(r => r.onay_durumu === "ONAYLANDI").length;
  const pendingCount = filteredResponses.filter(r => r.onay_durumu.includes("ONAYINDA")).length;
  const valuesSum = filteredResponses.reduce((acc, curr) => acc + (curr.girilen_deger || 0), 0);
  const avgValue = totalCount > 0 ? (valuesSum / totalCount).toFixed(1) : 0;

  // Export to CSV
  const exportCSV = () => {
    const headers = ["ID", "Eylem Kodu", "Gosterge", "Kurum", "Donem", "Gerceklesen", "Birim", "Onay Durumu", "Kanit Belgesi", "Tarih"];
    const rows = filteredResponses.map(r => [
      r.id,
      r.eylem_kodu,
      `"${r.gosterge_tanimi.replace(/"/g, '""')}"`,
      r.kurum_kodu,
      r.donem,
      r.girilen_deger,
      r.birim,
      r.onay_durumu,
      r.kanit_belge_adi,
      r.tarih
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `USP_IDS_Form_Yanitlari_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto py-4 px-3 sm:px-6 space-y-3">
      {/* Google Sheets Başlık ve Toolbar */}
      <div className="bg-white rounded-t-xl border border-slate-300 shadow-sm">
        <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                  USP-İDS Canlı Yanıt ve Karar Veritabanı
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  Google Sheets Görünümü
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Tüm kurum bildirimleri, 141 eylem matrisi ve kurul kararları tek bir dinamik tablodan yönetilir.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewForm}
              className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition"
            >
              📝 Form İle Veri Ekle
            </button>
            <button
              onClick={exportCSV}
              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              CSV İndir
            </button>
          </div>
        </div>

        {/* Araç Çubuğu (Toolbar): Arama, Filtre, Fonksiyonlar */}
        <div className="p-2 px-3 bg-white flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Eylem kodu, kurum veya gösterge ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded border border-slate-300 outline-none focus:ring-1 focus:ring-emerald-600 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Durum:</span>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-slate-300 rounded text-xs px-2 py-1 bg-white font-semibold outline-none"
            >
              <option value="ALL">Tümü ({responses.length})</option>
              <option value="ONAYLANDI">🟢 Onaylandı</option>
              <option value="SYGM_ONAYINDA">👑 SYGM Onayında</option>
              <option value="SORUMLU_ONAYINDA">⭐ Sorumlu Onayında</option>
              <option value="IADE">🔴 İade Edildi</option>
            </select>
          </div>
        </div>

        {/* Formula Bar (Formül Çubuğu) */}
        <div className="px-3 py-1.5 bg-slate-100 flex items-center gap-2 border-b border-slate-300 font-mono text-xs">
          <div className="w-12 text-center font-bold text-slate-600 bg-white border border-slate-300 py-0.5 rounded text-[11px]">
            {activeCell}
          </div>
          <span className="text-slate-400 font-bold italic select-none">fx</span>
          <input
            type="text"
            value={formulaValue}
            onChange={(e) => setFormulaValue(e.target.value)}
            className="flex-1 bg-white border border-slate-300 px-2 py-0.5 rounded text-xs text-slate-800 outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
          />
        </div>

        {/* Tablo Alanı */}
        <div className="overflow-x-auto min-h-[420px] max-h-[580px] bg-slate-50">
          {activeTab === "responses" && (
            <table className="w-full border-collapse text-left font-sans text-xs">
              <thead>
                <tr className="bg-slate-200 text-slate-700 font-bold border-b border-slate-300 select-none">
                  <th className="w-10 p-2 text-center bg-slate-300 border-r border-slate-400 font-mono text-[10px]">#</th>
                  <th className="p-2 border-r border-slate-300">A • Eylem Kodu</th>
                  <th className="p-2 border-r border-slate-300">B • Performans Göstergesi</th>
                  <th className="p-2 border-r border-slate-300">C • Sorumlu / Paydaş Kurum</th>
                  <th className="p-2 border-r border-slate-300">D • Dönem</th>
                  <th className="p-2 border-r border-slate-300 text-right">E • Gerçekleşen</th>
                  <th className="p-2 border-r border-slate-300">F • Kanıt Belgesi (SHA-256)</th>
                  <th className="p-2 border-r border-slate-300">G • Onay Durumu (Inline)</th>
                  <th className="p-2 text-center">H • Hızlı Aksiyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredResponses.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400 font-medium">
                      Filtreye uygun veri satırı bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredResponses.map((row, idx) => (
                    <tr 
                      key={row.id} 
                      onClick={() => setActiveCell(`G${idx + 2}`)}
                      className="hover:bg-emerald-50/60 transition group cursor-pointer"
                    >
                      <td className="p-2 text-center bg-slate-100 border-r border-slate-300 font-mono text-slate-500 text-[10px]">
                        {idx + 1}
                      </td>
                      <td className="p-2 border-r border-slate-200 font-bold text-slate-900 font-mono">
                        {row.eylem_kodu}
                      </td>
                      <td className="p-2 border-r border-slate-200 max-w-xs">
                        <div className="font-semibold text-slate-800 line-clamp-1">{row.gosterge_tanimi}</div>
                        {row.aciklama && <div className="text-[10px] text-slate-500 italic truncate">{row.aciklama}</div>}
                      </td>
                      <td className="p-2 border-r border-slate-200">
                        <span className="font-bold text-slate-900">{row.kurum_kodu}</span>
                        {row.alt_birim && <span className="block text-[10px] text-slate-500">{row.alt_birim}</span>}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-600 font-mono">
                        {row.donem}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-right font-black text-[#006747] font-mono text-sm">
                        {row.girilen_deger} <span className="text-[10px] text-slate-500 font-normal">{row.birim}</span>
                      </td>
                      <td className="p-2 border-r border-slate-200">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Kanıt: ${row.kanit_belge_adi}\nTür: ${row.kanit_belge_turu}\nSHA256: ${row.kanit_sha256}`);
                          }}
                          className="text-[#006747] hover:underline font-semibold block truncate max-w-[150px]"
                        >
                          📎 {row.kanit_belge_adi}
                        </a>
                        <span className="text-[9px] font-mono text-slate-400 block truncate max-w-[150px]">
                          {row.kanit_sha256.substring(0, 16)}...
                        </span>
                      </td>

                      {/* Hücre İçi Doğrudan Onay Menüsü (Inline Approval Chip) */}
                      <td className="p-2 border-r border-slate-200">
                        <select
                          value={row.onay_durumu}
                          onChange={(e) => onUpdateStatus(row.id, e.target.value as OnayDurumu)}
                          className={`text-[11px] font-bold py-1 px-2 rounded border cursor-pointer outline-none ${
                            row.onay_durumu === "ONAYLANDI"
                              ? "bg-emerald-100 text-emerald-900 border-emerald-300 font-black"
                              : row.onay_durumu === "SYGM_ONAYINDA"
                              ? "bg-sky-100 text-sky-900 border-sky-300 font-extrabold"
                              : row.onay_durumu === "SORUMLU_ONAYINDA"
                              ? "bg-amber-100 text-amber-900 border-amber-300 font-bold"
                              : "bg-rose-100 text-rose-900 border-rose-300 font-bold"
                          }`}
                        >
                          <option value="ONAYLANDI">🟢 ONAYLANDI</option>
                          <option value="SYGM_ONAYINDA">👑 SYGM Onayında</option>
                          <option value="SORUMLU_ONAYINDA">⭐ Sorumlu Onayında</option>
                          <option value="IADE">🔴 İade Edildi</option>
                        </select>
                      </td>

                      {/* Hızlı Aksiyon */}
                      <td className="p-2 text-center">
                        {currentRole === "SYGM_YONETICI" && row.onay_durumu !== "ONAYLANDI" ? (
                          <button
                            onClick={() => onUpdateStatus(row.id, "ONAYLANDI")}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xs cursor-pointer"
                          >
                            Hızlı Onayla
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[10px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === "actions" && (
            <table className="w-full border-collapse text-left font-sans text-xs">
              <thead>
                <tr className="bg-slate-200 text-slate-700 font-bold border-b border-slate-300">
                  <th className="w-10 p-2 text-center bg-slate-300 border-r border-slate-400 font-mono text-[10px]">#</th>
                  <th className="p-2 border-r border-slate-300">Hedef No</th>
                  <th className="p-2 border-r border-slate-300">Eylem Kodu</th>
                  <th className="p-2 border-r border-slate-300">Eylem Resmi Tanımı</th>
                  <th className="p-2 border-r border-slate-300">Dönem</th>
                  <th className="p-2 border-r border-slate-300">Asıl Sorumlu Kurum (*)</th>
                  <th className="p-2">İlgili Paydaş Kurumlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {MASTER_TARGETS.flatMap(h => 
                  h.stratejiler.flatMap(s => 
                    s.eylemler.map((e, idx) => (
                      <tr key={e.eylem_id} className="hover:bg-slate-50">
                        <td className="p-2 text-center bg-slate-100 border-r border-slate-300 font-mono text-slate-500 text-[10px]">
                          {e.eylem_id}
                        </td>
                        <td className="p-2 border-r border-slate-200 font-bold text-slate-900">{h.hedef_no}</td>
                        <td className="p-2 border-r border-slate-200 font-mono font-bold text-emerald-800">{e.eylem_kodu}</td>
                        <td className="p-2 border-r border-slate-200 max-w-md font-medium text-slate-800">{e.tanim}</td>
                        <td className="p-2 border-r border-slate-200 font-mono">{e.baslangic_yili}–{e.bitis_yili}</td>
                        <td className="p-2 border-r border-slate-200 font-bold text-purple-900">{e.koordinator_kurum}</td>
                        <td className="p-2 text-slate-600 text-[11px]">{e.ilgili_kurumlar.join(", ")}</td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          )}

          {activeTab === "councils" && (
            <table className="w-full border-collapse text-left font-sans text-xs">
              <thead>
                <tr className="bg-slate-200 text-slate-700 font-bold border-b border-slate-300">
                  <th className="w-10 p-2 text-center bg-slate-300 border-r border-slate-400 font-mono text-[10px]">#</th>
                  <th className="p-2 border-r border-slate-300">Karar No</th>
                  <th className="p-2 border-r border-slate-300">Kurul Adı</th>
                  <th className="p-2 border-r border-slate-300">Tarih</th>
                  <th className="p-2 border-r border-slate-300">Karar Özeti</th>
                  <th className="p-2 border-r border-slate-300">İlişkili Eylem</th>
                  <th className="p-2">Uygulama Durumu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {SU_KURULU_KARARLARI.map((k, idx) => (
                  <tr key={k.karar_id} className="hover:bg-slate-50">
                    <td className="p-2 text-center bg-slate-100 border-r border-slate-300 font-mono text-slate-500 text-[10px]">
                      {idx + 1}
                    </td>
                    <td className="p-2 border-r border-slate-200 font-mono font-bold text-slate-900">{k.karar_no}</td>
                    <td className="p-2 border-r border-slate-200 font-bold text-emerald-800">{k.kurul_adi}</td>
                    <td className="p-2 border-r border-slate-200 font-mono text-slate-600">{k.toplanti_tarihi}</td>
                    <td className="p-2 border-r border-slate-200 max-w-md font-medium text-slate-800">{k.karar_ozeti}</td>
                    <td className="p-2 border-r border-slate-200 font-mono font-bold text-purple-900">{k.ilgili_eylem_kodu}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        k.uygulama_durumu === "UYGULANDI"
                          ? "bg-emerald-100 text-emerald-900"
                          : "bg-amber-100 text-amber-900"
                      }`}>
                        {k.uygulama_durumu}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* E-Tablo Alt Sekmeleri (Sheet Tabs Bar) */}
        <div className="bg-slate-200 px-2 py-1.5 flex flex-wrap items-center gap-1 border-t border-slate-300">
          {[
            { id: "responses", label: `Form Yanıtları (${responses.length})`, count: responses.length },
            { id: "actions", label: "141 Eylem Listesi", count: 141 },
            { id: "councils", label: `Su Kurulları Kararları (${SU_KURULU_KARARLARI.length})`, count: SU_KURULU_KARARLARI.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 text-xs font-bold rounded-t transition cursor-pointer border ${
                activeTab === tab.id
                  ? "bg-white text-emerald-900 border-slate-400 border-b-transparent shadow-xs"
                  : "bg-slate-100 text-slate-600 border-transparent hover:bg-slate-300"
              }`}
            >
              📄 {tab.label}
            </button>
          ))}
        </div>

        {/* Durum Çubuğu (Sheets Status Bar) */}
        <div className="bg-slate-100 px-4 py-2 border-t border-slate-300 flex flex-wrap items-center justify-between text-[11px] text-slate-600 font-mono">
          <div className="flex items-center gap-4">
            <span>Toplam Satır: <strong>{totalCount}</strong></span>
            <span>•</span>
            <span className="text-emerald-800">Onaylı: <strong>{approvedCount}</strong></span>
            <span>•</span>
            <span className="text-amber-800">İncelemede: <strong>{pendingCount}</strong></span>
          </div>

          <div className="flex items-center gap-4">
            <span>TOPLA: <strong>{valuesSum}</strong></span>
            <span>•</span>
            <span>ORTALAMA: <strong>{avgValue}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
