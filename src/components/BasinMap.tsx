"use client";

import React, { useState } from "react";
import { BASINS_DATA, SU_KURULU_KARARLARI } from "@/data/sampleResponses";
import { MapPin, Compass, ShieldAlert, Award, FileText } from "lucide-react";

export function BasinMap() {
  const [selectedBasinCode, setSelectedBasinCode] = useState<string>("KONYA_KAPALI");
  const selectedBasin = BASINS_DATA.find(b => b.havza_kodu === selectedBasinCode) || BASINS_DATA[0];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Üst Bilgi Kartı */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-[#006747] font-bold text-xs px-2.5 py-0.5 rounded">
              FR-07 CBS & Havza Modülü
            </span>
            <span className="text-xs text-slate-500 font-medium">Ulusal Su Planı Coğrafi Katmanı</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            25 Nehir Havzası ve Su Kurulları Karar Takibi
          </h2>
          <p className="text-xs text-slate-600">
            Ulusal Su Kurulu, 25 Havza Su Kurulu ve 81 İl Su Kurulu kararlarının havza ölçeğinde gerçekleşme ve etki seviyesi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Havza Kartları Listesi */}
        <div className="lg:col-span-1 space-y-2.5">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Nehir Havzaları Seçimi
          </h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {BASINS_DATA.map((basin) => {
              const isSelected = basin.havza_kodu === selectedBasinCode;
              return (
                <div
                  key={basin.havza_kodu}
                  onClick={() => setSelectedBasinCode(basin.havza_kodu)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? "bg-emerald-50 border-emerald-600 shadow-sm ring-1 ring-emerald-600"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">{basin.havza_adi}</span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {basin.bolge}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Ortalama Gerçekleşme:</span>
                    <span className="font-black text-[#006747]">%{basin.ortalama_gerceklesme}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-[#006747] h-full rounded-full"
                      style={{ width: `${basin.ortalama_gerceklesme}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seçili Havza Detay ve Kararlar Kartı */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                  {selectedBasin.bolge} Bölgesi
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{selectedBasin.havza_adi}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Kurul Kararı Uygulanma Oranı</span>
                <span className="text-2xl font-black text-[#006747]">%{selectedBasin.karar_uygulama_orani}</span>
              </div>
            </div>

            {/* Havza Öncelikleri */}
            <div className="bg-amber-50 p-3.5 rounded-lg border border-amber-200 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-900 block">Havza Öncelikli Su Sorunları & Tehditler</span>
                <p className="text-xs text-amber-800 mt-0.5">{selectedBasin.oncelikli_sorunlar}</p>
              </div>
            </div>

            {/* Havza Metrikleri */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Toplam Eylem</span>
                <span className="text-lg font-black text-slate-900">{selectedBasin.eylem_sayisi}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Tamamlanan</span>
                <span className="text-lg font-black text-[#006747]">{selectedBasin.tamamlanan_eylem}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Gerçekleşme</span>
                <span className="text-lg font-black text-purple-900">%{selectedBasin.ortalama_gerceklesme}</span>
              </div>
            </div>

            {/* İlgili Su Kurulları Kararları */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-700" />
                Bu Havza ile İlişkili Su Kurulu Kararları
              </h4>
              <div className="space-y-2">
                {SU_KURULU_KARARLARI.map((k) => (
                  <div key={k.karar_id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 font-mono">{k.karar_no} • {k.kurul_adi}</span>
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {k.uygulama_durumu}
                      </span>
                    </div>
                    <p className="text-slate-700">{k.karar_ozeti}</p>
                    <div className="text-[10px] text-purple-900 font-bold pt-1">
                      İlişkili Eylem: {k.ilgili_eylem_kodu} | Tarih: {k.toplanti_tarihi}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
