"use client";

import React from "react";
import { KullaniciRolu } from "@/types";
import { ShieldCheck, UserCheck, Droplets } from "lucide-react";

interface HeaderProps {
  currentRole: KullaniciRolu;
  onRoleChange: (role: KullaniciRolu) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ currentRole, onRoleChange, activeTab, onTabChange }: HeaderProps) {
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
            8 Hedef • 31 Strateji • 141 Eylem | Çevrim İçi Doğrulama, E-Tablo ve Erken Uyarı Portalı
          </p>
        </div>

        {/* RBAC Rol Değiştirici */}
        <div className="mt-3 sm:mt-0 flex items-center gap-2 bg-[#005238] p-1.5 rounded-lg border border-emerald-700">
          <UserCheck className="w-4 h-4 text-emerald-300 shrink-0" />
          <div className="text-xs">
            <div className="text-[10px] text-emerald-300 uppercase font-bold">Aktif Kullanıcı Rolü</div>
            <select
              aria-label="Kullanıcı Rolü Seçimi"
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as KullaniciRolu)}
              className="bg-emerald-950 text-white font-semibold text-xs rounded px-2 py-1 outline-none border border-emerald-600 cursor-pointer focus:ring-1 focus:ring-emerald-400"
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

      {/* Sekmeler Navigasyonu */}
      <nav className="bg-[#004731] border-t border-emerald-800 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-1">
          {[
            { id: "forms", label: "📝 Google Forms (Veri Giriş Portalı)", icon: "forms" },
            { id: "sheets", label: "📊 Google Sheets (Canlı E-Tablo)", icon: "sheets" },
            { id: "hierarchy", label: "🌳 141 Eylem Hiyerarşisi (FR-01)", icon: "tree" },
            { id: "earlyWarning", label: "🚦 Erken Uyarı & Sapma (FR-06)", icon: "alert" },
            { id: "basins", label: "🗺️ 25 Havza & Su Kurulları (FR-07)", icon: "map" },
            { id: "reports", label: "📄 2 Yıllık Resmî Rapor (FR-08)", icon: "doc" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3.5 py-2 text-xs font-bold transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "border-[#c8102e] bg-[#006747] text-white shadow-inner"
                  : "border-transparent text-emerald-200 hover:text-white hover:bg-[#00573c]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
