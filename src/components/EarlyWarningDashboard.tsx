"use client";

import React from "react";
import { MASTER_TARGETS } from "@/data/targets";
import { GostergeGerceklesme } from "@/types";
import { calculateDeviation } from "@/lib/analytics";
import { AlertOctagon, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

interface EarlyWarningProps {
  responses: GostergeGerceklesme[];
}

export function EarlyWarningDashboard({ responses }: EarlyWarningProps) {
  const currentYear = 2027;

  // Flatten all actions and compute deviation
  const evaluatedActions = MASTER_TARGETS.flatMap(h =>
    h.stratejiler.flatMap(s =>
      s.eylemler.map(e => {
        const ind = e.gostergeler[0];
        // Find matching response or use fallback
        const matchingResp = responses.find(r => r.eylem_kodu === e.eylem_kodu);
        const girilen = matchingResp ? matchingResp.girilen_deger : ind.baz_deger;

        const dev = calculateDeviation(
          e.baslangic_yili,
          e.bitis_yili,
          currentYear,
          girilen,
          ind.baz_deger,
          ind.hedef_deger
        );

        return {
          ...e,
          hedef_no: h.hedef_no,
          gosterge: ind,
          girilen_deger: girilen,
          analiz: dev,
          kanit_mevcut: !!matchingResp
        };
      })
    )
  );

  const greenCount = evaluatedActions.filter(a => a.analiz.durum_kodu === "YESIL").length;
  const yellowCount = evaluatedActions.filter(a => a.analiz.durum_kodu === "SARI").length;
  const redCount = evaluatedActions.filter(a => a.analiz.durum_kodu === "KIRMIZI").length;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Toplam İzlenen Eylem</span>
          <div className="text-3xl font-black text-slate-900 mt-1">{evaluatedActions.length}</div>
          <span className="text-[11px] text-slate-400">141 Eylem Master Planı</span>
        </div>

        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase">🟢 Hedefe Uygun / Tamamlanan</span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-900 mt-1">{greenCount}</div>
          <span className="text-[11px] text-emerald-700 font-semibold">Takviminde İlerliyor</span>
        </div>

        <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase">🟡 Riskli / Hafif Sapma</span>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-900 mt-1">{yellowCount}</div>
          <span className="text-[11px] text-amber-700 font-semibold">Önlem Planı Gerekiyor</span>
        </div>

        <div className="bg-rose-50 p-5 rounded-xl border border-rose-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-800 uppercase">🔴 Kritik Sapma (Erken Uyarı)</span>
            <AlertOctagon className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-900 mt-1">{redCount}</div>
          <span className="text-[11px] text-rose-700 font-semibold">USUK Gündemine Alınmalı</span>
        </div>
      </div>

      {/* Erken Uyarı ve Sapma Tablosu */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              FR-06 Sapma Analizi ve Erken Uyarı Takip Listesi
            </h3>
            <p className="text-xs text-slate-500">
              Uygulama dönemi ({currentYear}) teorik ilerleme oranı ile fiili gerçekleşme kıyaslanmaktadır.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                <th className="p-3">Eylem Kodu & Tanım</th>
                <th className="p-3">Sorumlu Kurum (*)</th>
                <th className="p-3">Dönem</th>
                <th className="p-3 text-center">Teorik İlerleme</th>
                <th className="p-3 text-center">Gerçekleşme Oranı</th>
                <th className="p-3 text-center">Erken Uyarı Durumu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {evaluatedActions.map((item) => (
                <tr key={item.eylem_id} className="hover:bg-slate-50">
                  <td className="p-3 max-w-sm">
                    <div className="font-bold text-slate-900 font-mono">{item.eylem_kodu}</div>
                    <div className="text-slate-700 line-clamp-1">{item.tanim}</div>
                  </td>
                  <td className="p-3 font-semibold text-purple-900">{item.koordinator_kurum}</td>
                  <td className="p-3 font-mono text-slate-600">{item.baslangic_yili}–{item.bitis_yili}</td>
                  <td className="p-3 text-center font-mono font-bold text-slate-700">
                    %{item.analiz.teorik_ilerleme}
                  </td>
                  <td className="p-3 text-center font-mono font-extrabold text-[#006747]">
                    %{item.analiz.gerceklesme_orani}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-1 rounded font-black text-[11px] ${
                      item.analiz.durum_kodu === "YESIL"
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : item.analiz.durum_kodu === "SARI"
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-rose-100 text-rose-900 border border-rose-300 animate-pulse"
                    }`}>
                      {item.analiz.durum_kodu === "YESIL" ? "🟢 Hedefe Uygun" : item.analiz.durum_kodu === "SARI" ? "🟡 Riskli" : "🔴 Kritik Sapma"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
