"use client";

import React, { useState } from "react";
import { MASTER_TARGETS } from "@/data/targets";
import { ChevronDown, ChevronRight, Layers, Target, CheckCircle2 } from "lucide-react";

export function HierarchyViewer() {
  const [openTargetId, setOpenTargetId] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-4">
      {/* Başlık */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-[#006747] font-bold text-xs px-2.5 py-0.5 rounded">
              FR-01 Stratejik Hiyerarşi
            </span>
            <span className="text-xs text-slate-500 font-medium">Ulusal Su Planı (2026–2035)</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            8 Hedef, 31 Strateji ve 141 Eylem Ağacı
          </h2>
          <p className="text-xs text-slate-600">
            Plandaki tüm hedefler, stratejiler ve bunlara bağlı sorumlu kurum eşleştirmeleri hiyerarşik olarak listelenmektedir.
          </p>
        </div>

        <input
          type="text"
          placeholder="Eylem metni veya kod ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-xs w-full sm:w-72 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-600"
        />
      </div>

      {/* Akordiyon Hedef Listesi */}
      <div className="space-y-3">
        {MASTER_TARGETS.map((target) => {
          const isOpen = openTargetId === target.hedef_id;
          const totalActions = target.stratejiler.reduce((sum, s) => sum + s.eylemler.length, 0);

          return (
            <div key={target.hedef_id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenTargetId(isOpen ? 0 : target.hedef_id)}
                className="w-full p-4 text-left flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-black text-xs">
                    {target.hedef_id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-800">{target.hedef_no}</span>
                      <h3 className="font-extrabold text-sm text-slate-900">{target.baslik}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{target.aciklama}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                    {totalActions} Eylem
                  </span>
                  {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                </div>
              </button>

              {isOpen && (
                <div className="p-4 border-t border-slate-200 space-y-4 bg-white">
                  {target.stratejiler.map((strat) => (
                    <div key={strat.strateji_id} className="border-l-2 border-emerald-600 pl-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded border border-emerald-200">
                          {strat.strateji_kodu}
                        </span>
                        <h4 className="font-bold text-xs text-slate-800">{strat.baslik}</h4>
                      </div>

                      {/* Eylemler Tablosu */}
                      <div className="grid grid-cols-1 gap-2.5">
                        {strat.eylemler
                          .filter(e => !searchTerm || e.tanim.toLowerCase().includes(searchTerm.toLowerCase()) || e.eylem_kodu.toLowerCase().includes(searchTerm.toLowerCase()))
                          .map((eylem) => (
                            <div key={eylem.eylem_id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-black text-[#006747]">{eylem.eylem_kodu}</span>
                                  <span className="text-slate-900 font-semibold">{eylem.tanim}</span>
                                </div>
                                <span className="bg-white border border-slate-300 font-mono text-[11px] px-2 py-0.5 rounded text-slate-700">
                                  {eylem.baslangic_yili}–{eylem.bitis_yili}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200 text-[11px]">
                                <div className="flex items-center gap-2">
                                  <span className="text-purple-900 font-bold">
                                    ★ Asıl Sorumlu: <u>{eylem.koordinator_kurum}</u>
                                  </span>
                                  <span className="text-slate-400">|</span>
                                  <span className="text-slate-600">
                                    İlgili Kurumlar: {eylem.ilgili_kurumlar.join(", ")}
                                  </span>
                                </div>

                                {eylem.gostergeler.map(g => (
                                  <div key={g.gosterge_id} className="bg-emerald-100 text-emerald-900 font-mono px-2 py-0.5 rounded text-[10px] font-bold">
                                    Hedef: {g.hedef_deger} {g.birim} ({g.tip})
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
