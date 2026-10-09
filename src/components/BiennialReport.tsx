"use client";

import React from "react";
import { GostergeGerceklesme } from "@/types";
import { Printer, Download, Award, FileCheck2, Building2 } from "lucide-react";

interface ReportProps {
  responses: GostergeGerceklesme[];
}

export function BiennialReport({ responses }: ReportProps) {
  const printReport = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Yazdırma ve Üst Kontrol */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between print:hidden">
        <div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded uppercase">
            FR-08 Resmî Raporlama
          </span>
          <h2 className="text-base font-bold text-slate-900 mt-1">
            İki Yıllık Resmî Gözden Geçirme ve Brifing Raporu (2026–2027)
          </h2>
        </div>
        <button
          onClick={printReport}
          className="bg-[#006747] hover:bg-[#005238] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition"
        >
          <Printer className="w-4 h-4" />
          Raporu Yazdır / PDF İndir
        </button>
      </div>

      {/* A4 Brifing Belgesi Şablonu */}
      <div className="bg-white p-8 sm:p-12 rounded-xl border border-slate-300 shadow-lg space-y-6 text-slate-900 font-sans print:border-none print:shadow-none print:p-0">
        {/* Resmî Başlık */}
        <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
          <div className="text-xs font-bold tracking-widest uppercase text-slate-600">
            T.C. TARIM VE ORMAN BAKANLIĞI • SU YÖNETİMİ GENEL MÜDÜRLÜĞÜ
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            ULUSAL SU PLANI (2026–2035) 1. İKİ YILLIK İZLEME VE DEĞERLENDİRME BRİFİNGİ
          </h1>
          <div className="text-xs text-slate-500 font-mono">
            Rapor Dönemi: 2026–2027 | Rapor Tarihi: {new Date().toLocaleDateString("tr-TR")}
          </div>
        </div>

        {/* 1. Yönetici Özeti */}
        <div className="space-y-2">
          <h3 className="text-sm font-extrabold uppercase border-b border-slate-300 pb-1 text-[#006747]">
            1. Genel İlerleme ve Yönetici Özeti
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            Ulusal Su Planı kapsamında 2026–2027 uygulama dönemi için tanımlanan eylemler doğrultusunda kurumlar arası
            veri toplama döngüsü başarıyla işletilmiştir. İncelenen dönemde Taslak Su Kanunu'nun TBMM sevk süreci,
            yeraltı suyu kuyularına uzaktan telemetrik debimetre takılması ve taşkın erken uyarı radarlarının
            kurulması ana kilometre taşları olarak gerçekleşmiştir.
          </p>
        </div>

        {/* 2. Temel Performans Göstergeleri Matrisi */}
        <div className="space-y-2">
          <h3 className="text-sm font-extrabold uppercase border-b border-slate-300 pb-1 text-[#006747]">
            2. Kritik Gösterge Gerçekleşmeleri
          </h3>
          <table className="w-full text-xs border border-slate-400 border-collapse">
            <thead>
              <tr className="bg-slate-100 font-bold border-b border-slate-400">
                <th className="border border-slate-400 p-2">Eylem Kodu</th>
                <th className="border border-slate-400 p-2">Performans Göstergesi</th>
                <th className="border border-slate-400 p-2 text-center">Hedef</th>
                <th className="border border-slate-400 p-2 text-center">Gerçekleşen</th>
                <th className="border border-slate-400 p-2 text-center">Onay Durumu</th>
              </tr>
            </thead>
            <tbody>
              {responses.slice(0, 5).map((r) => (
                <tr key={r.id}>
                  <td className="border border-slate-400 p-2 font-mono font-bold">{r.eylem_kodu}</td>
                  <td className="border border-slate-400 p-2">{r.gosterge_tanimi}</td>
                  <td className="border border-slate-400 p-2 text-center font-mono">100 {r.birim}</td>
                  <td className="border border-slate-400 p-2 text-center font-mono font-bold text-[#006747]">
                    {r.girilen_deger} {r.birim}
                  </td>
                  <td className="border border-slate-400 p-2 text-center font-semibold text-[10px]">
                    {r.onay_durumu}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Kurumsal Başarı Matrisi */}
        <div className="space-y-2">
          <h3 className="text-sm font-extrabold uppercase border-b border-slate-300 pb-1 text-[#006747]">
            3. Kurumsal Koordinasyon ve Katkı Düzeyi
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-50 border border-slate-300 rounded">
              <span className="font-bold text-slate-700 block">DSİ Genel Müdürlüğü</span>
              <span className="text-base font-black text-[#006747]">%{58.4}</span>
              <span className="text-[10px] text-slate-500 block">Sorumlu: 24 Eylem</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-300 rounded">
              <span className="font-bold text-slate-700 block">SYGM (Su Yönetimi)</span>
              <span className="text-base font-black text-[#006747]">%{72.0}</span>
              <span className="text-[10px] text-slate-500 block">Sorumlu: 38 Eylem</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-300 rounded">
              <span className="font-bold text-slate-700 block">SUKİ'ler & Belediyeler</span>
              <span className="text-base font-black text-purple-900">%{64.5}</span>
              <span className="text-[10px] text-slate-500 block">İlgili: 30 Eylem</span>
            </div>
          </div>
        </div>

        {/* 4. Yetkili Onay ve İmza Bloku */}
        <div className="pt-8 grid grid-cols-2 text-center text-xs font-semibold text-slate-800">
          <div>
            <div>İzleme ve Değerlendirme Şube Müdürü</div>
            <div className="h-14"></div>
            <div>İmza / e-İmza</div>
          </div>
          <div>
            <div>Su Yönetimi Genel Müdürü</div>
            <div className="h-14"></div>
            <div>Onay / e-İmza</div>
          </div>
        </div>
      </div>
    </div>
  );
}
