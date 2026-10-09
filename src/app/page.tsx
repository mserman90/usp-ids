"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { FormsPortal } from "@/components/FormsPortal";
import { SheetsGrid } from "@/components/SheetsGrid";
import { HierarchyViewer } from "@/components/HierarchyViewer";
import { EarlyWarningDashboard } from "@/components/EarlyWarningDashboard";
import { BasinMap } from "@/components/BasinMap";
import { BiennialReport } from "@/components/BiennialReport";
import { INITIAL_RESPONSES } from "@/data/sampleResponses";
import { GostergeGerceklesme, KullaniciRolu, OnayDurumu, TabId, ROLE_PERMISSIONS } from "@/types";
import { Lock, ShieldAlert } from "lucide-react";

export default function Home() {
  const [currentRole, setCurrentRole] = useState<KullaniciRolu>("SYGM_YONETICI");
  const [activeTab, setActiveTab] = useState<TabId>("sheets");
  const [responses, setResponses] = useState<GostergeGerceklesme[]>(INITIAL_RESPONSES);

  // Rol değiştiğinde erişim izinlerini kontrol et ve gerekirse izinli sekmeye yönlendir
  const handleRoleChange = (newRole: KullaniciRolu) => {
    setCurrentRole(newRole);
    const roleConfig = ROLE_PERMISSIONS[newRole];
    if (!roleConfig.allowedTabs.includes(activeTab)) {
      setActiveTab(roleConfig.defaultTab);
    }
  };

  const handleTabChange = (newTab: TabId) => {
    const roleConfig = ROLE_PERMISSIONS[currentRole];
    if (roleConfig.allowedTabs.includes(newTab)) {
      setActiveTab(newTab);
    }
  };

  const handleNewSubmission = (newEntry: GostergeGerceklesme) => {
    setResponses((prev) => [newEntry, ...prev]);
  };

  const handleUpdateStatus = (id: string | number, newStatus: OnayDurumu) => {
    setResponses((prev) =>
      prev.map((r) => (r.id === id ? { ...r, onay_durumu: newStatus } : r))
    );
  };

  const currentRoleConfig = ROLE_PERMISSIONS[currentRole];
  const isTabAllowed = currentRoleConfig.allowedTabs.includes(activeTab);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <main className="flex-1 pb-12">
        {!isTabAllowed ? (
          <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-rose-200 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-200">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Erişim Kısıtlandı (Yetkisiz Modül)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bu ekran, aktif kullanıcı rolünüz olan <strong>'{currentRoleConfig.roleLabel}'</strong> için
              güvenlik ve RBAC kuralları gereği kısıtlanmıştır.
            </p>
            <button
              onClick={() => setActiveTab(currentRoleConfig.defaultTab)}
              className="bg-[#006747] hover:bg-[#005238] text-white font-bold text-xs px-5 py-2.5 rounded-lg cursor-pointer transition shadow"
            >
              Varsayılan Ekranıma Dön ({currentRoleConfig.defaultTab.toUpperCase()})
            </button>
          </div>
        ) : (
          <>
            {activeTab === "forms" && (
              <FormsPortal
                currentRole={currentRole}
                onNewSubmission={handleNewSubmission}
                onSwitchToSheets={() => setActiveTab("sheets")}
              />
            )}

            {activeTab === "sheets" && (
              <SheetsGrid
                currentRole={currentRole}
                responses={responses}
                onUpdateStatus={handleUpdateStatus}
                onOpenNewForm={() => setActiveTab("forms")}
              />
            )}

            {activeTab === "hierarchy" && <HierarchyViewer />}

            {activeTab === "earlyWarning" && (
              <EarlyWarningDashboard responses={responses} />
            )}

            {activeTab === "basins" && <BasinMap />}

            {activeTab === "reports" && <BiennialReport responses={responses} />}
          </>
        )}
      </main>

      <footer className="bg-slate-800 text-slate-400 text-xs py-4 px-6 border-t border-slate-700 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <span>
            © 2026 T.C. Tarım ve Orman Bakanlığı • Su Yönetimi Genel Müdürlüğü (SYGM)
          </span>
          <span className="font-mono text-[11px] text-slate-500">
            USP-İDS Sürüm 2.0 (Next.js 15 • App Router • Rol Bazlı Yetkilendirme / RBAC)
          </span>
        </div>
      </footer>
    </div>
  );
}
