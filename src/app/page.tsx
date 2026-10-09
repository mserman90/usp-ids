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
import { GostergeGerceklesme, KullaniciRolu, OnayDurumu } from "@/types";

export default function Home() {
  const [currentRole, setCurrentRole] = useState<KullaniciRolu>("SYGM_YONETICI");
  const [activeTab, setActiveTab] = useState<string>("forms");
  const [responses, setResponses] = useState<GostergeGerceklesme[]>(INITIAL_RESPONSES);

  const handleNewSubmission = (newEntry: GostergeGerceklesme) => {
    setResponses((prev) => [newEntry, ...prev]);
  };

  const handleUpdateStatus = (id: string | number, newStatus: OnayDurumu) => {
    setResponses((prev) =>
      prev.map((r) => (r.id === id ? { ...r, onay_durumu: newStatus } : r))
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="flex-1 pb-12">
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
      </main>

      <footer className="bg-slate-800 text-slate-400 text-xs py-4 px-6 border-t border-slate-700 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <span>
            © 2026 T.C. Tarım ve Orman Bakanlığı • Su Yönetimi Genel Müdürlüğü (SYGM)
          </span>
          <span className="font-mono text-[11px] text-slate-500">
            USP-İDS Sürüm 2.0 (Next.js 15 • App Router • DETSİS & USBS Entegre)
          </span>
        </div>
      </footer>
    </div>
  );
}
