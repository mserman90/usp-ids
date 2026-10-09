"use client";

import React from "react";
import { KullaniciRolu, TabId, ROLE_PERMISSIONS } from "@/types";
import { ShieldCheck, UserCheck, Droplets, Lock, CheckCircle2, ShieldAlert } from "lucide-react";

interface HeaderProps {
  currentRole: KullaniciRolu;
  onRoleChange: (role: KullaniciRolu) => void;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const ALL_TABS: { id: TabId; label: string; icon: string; minRole: string }[] = [
  { id: "forms", label: "📝 Google Forms (Veri Giriş Portalı)", icon: "forms", minRole: "Kurum Yetkilisi" },
  { id: "sheets", label: "📊 Google Sheets (Canlı E-Tablo & Onay)", icon: "sheets", minRole: "Tüm Roller" },
  { id: "hierarchy", label: "🌳 141 Eylem Hiyerarşisi (FR-01)", icon: "tree", minRole: "Genel Erişim" },
  { id: "earlyWarning", label: "🚦 Erken Uyarı & Sapma (FR-06)", icon: "alert", minRole: "Yönetici & Denetçi" },
  { id: "basins", label: "🗺️ 25 Havza & Su Kurulları (FR-07)", icon: "map", minRole: "Kurul Sekreteryası" },
  { id: "reports", label: "📄 2 Yıllık Resmî Rapor (FR-08)", icon: "doc", minRole: "Süpervizör & Denetçi" }
];

export function Header({ currentRole, onRoleChange, activeTab, onTabChange }: HeaderProps) {
  const currentConfig = ROLE_PERMISSIONS[currentRole];
  const allowedTabs = currentConfig.allowedTabs;

  return (
    <header className="bg-[#006747] text-white shadow-md border-b-4 border-[#c8102e]">
      {/* T.C. Üst Şerit */}
      <div className="bg-[#005238] py-1 px-4 text-xs font-semibold tracking-wider text-emerald-100 flex justify-between items-center border-b border-emerald-800">
        <div className="flex items-center space-x-2">
          <Droplets className="w-3.5 h-3.5 text-emerald-300" />
          <span>T.C. TARIM VE ORMAN BAKANLIĞI • SU YÖNETİMİ GENEL MÜDÜRLÜĞÜ</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            USBS & DETSİS Entegre
          </span>
          <span className="bg-[#c8102e] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">
            2026–2035 DÖNEMİ
          </span>
        </div>
      </div>

      {/* Ana Başlık ve Kullanıcı Rolü */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span className="bg-white text-[#006747] px-2 py-0.5 rounded shadow text-base font-extrabold">USP-İDS</span>
            Ulusal Su Planı İzleme ve Değerlendirme Bilgi Sistemi
          </h1>
          <p className="text-xs text-emerald-100 mt-0.5">
            8 Hedef • 31 Strateji • 141 Eylem | Rol Tabanlı Yetkilendirme (RBAC) ve Güvenli Veri Akışı
          </p>
        </div>

        {/* RBAC Rol Değiştirici */}
        <div className="mt-3 sm:mt-0 flex items-center gap-2 bg-[#005238] p-2 rounded-xl border border-emerald-700 shadow-inner">
          <UserCheck className="w-5 h-5 text-emerald-300 shrink-0" />
          <div className="text-xs">
            <div className="text-[10px] text-emerald-300 uppercase font-black tracking-wider flex items-center justify-between">
              <span>Aktif Kullanıcı Rolü</span>
              <span className="text-[9px] text-emerald-200">RBAC Seviyesi</span>
            </div>
            <select
              aria-label="Kullanıcı Rolü Seçimi"
              value={currentRole}
              onChange={(e) => {
                const newRole = e.target.value as KullaniciRolu;
                onRoleChange(newRole);
              }}
              className="bg-emerald-950 text-white font-bold text-xs rounded-lg px-2.5 py-1.5 mt-0.5 outline-none border border-emerald-600 cursor-pointer focus:ring-2 focus:ring-emerald-400"
            >
              <option value="SYGM_YONETICI">👑 SYGM Süpervizör / Yönetici</option>
              <option value="SORUMLU_KURUM">⭐ Sorumlu Kurum Koordinatörü (*)</option>
              <option value="ILGILI_KURUM">🏢 İlgili Kurum / SUKİ / Belediye</option>
              <option value="KURUL_SEKRETERYASI">⚖️ Su Kurulu Sekreteryası</option>
              <option value="IZLEME_UZMANI">🔍 Bağımsız İzleme Uzmanı</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rol Yetki ve Erişim Açıklama Şeridi */}
      <div className="bg-[#003827] px-4 py-1.5 border-t border-emerald-900 text-[11px] text-emerald-100">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase border ${currentConfig.badgeColor}`}>
              {currentConfig.roleLabel}
            </span>
            <span className="text-emerald-200 font-medium">
              {currentConfig.description}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span className={`flex items-center gap-1 ${currentConfig.canApprove ? "text-emerald-300 font-bold" : "text-slate-400"}`}>
              {currentConfig.canApprove ? "✓ Nihai Onay Yetkisi" : "✕ Nihai Onay Yok"}
            </span>
            <span>•</span>
            <span className={`flex items-center gap-1 ${currentConfig.canSubmitForm ? "text-emerald-300 font-bold" : "text-slate-400"}`}>
              {currentConfig.canSubmitForm ? "✓ Veri Girişi Açık" : "✕ Veri Girişi Kapalı"}
            </span>
            <span>•</span>
            <span className="text-amber-300 font-bold">
              {allowedTabs.length} / {ALL_TABS.length} Modül Açık
            </span>
          </div>
        </div>
      </div>

      {/* Sekmeler Navigasyonu (Role Göre Filtrelenmiş Ekranlar) */}
      <nav className="bg-[#004731] border-t border-emerald-800 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-1">
          {ALL_TABS.map((tab) => {
            const isAllowed = allowedTabs.includes(tab.id);

            if (!isAllowed) {
              return (
                <div
                  key={tab.id}
                  title={`Bu ekran '${currentConfig.roleLabel}' rolüne kapalıdır.`}
                  className="px-3 py-2 text-xs font-medium text-emerald-800/60 flex items-center gap-1.5 cursor-not-allowed select-none border-b-2 border-transparent"
                >
                  <Lock className="w-3 h-3 text-emerald-800" />
                  <span className="line-through">{tab.label.split("(")[0]}</span>
                  <span className="text-[9px] bg-emerald-950/40 text-emerald-700 px-1 rounded">Kilitli</span>
                </div>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3.5 py-2 text-xs font-bold transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "border-[#c8102e] bg-[#006747] text-white shadow-inner font-black"
                    : "border-transparent text-emerald-200 hover:text-white hover:bg-[#00573c]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
