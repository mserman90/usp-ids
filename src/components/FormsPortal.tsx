"use client";

import React, { useState } from "react";
import { MASTER_TARGETS } from "@/data/targets";
import { DETSIS_INSTITUTIONS } from "@/data/detsisInstitutions";
import { GostergeGerceklesme, KullaniciRolu, ROLE_PERMISSIONS } from "@/types";
import { calculateSHA256 } from "@/lib/crypto";
import { CheckCircle2, FileUp, Sparkles, AlertCircle, ShieldCheck, Lock } from "lucide-react";

interface FormsPortalProps {
  currentRole: KullaniciRolu;
  onNewSubmission: (submission: GostergeGerceklesme) => void;
  onSwitchToSheets: () => void;
}

export function FormsPortal({ currentRole, onNewSubmission, onSwitchToSheets }: FormsPortalProps) {
  // Flatten indicators list for easy selection
  const allIndicators = MASTER_TARGETS.flatMap(h =>
    h.stratejiler.flatMap(s =>
      s.eylemler.flatMap(e =>
        e.gostergeler.map(g => ({
          ...g,
          eylem_kodu: e.eylem_kodu,
          eylem_tanimi: e.tanim,
          hedef_no: h.hedef_no,
          koordinator: e.koordinator_kurum
        }))
      )
    )
  );

  const [selectedIndicatorId, setSelectedIndicatorId] = useState<number>(allIndicators[0]?.gosterge_id || 1);
  const selectedIndicator = allIndicators.find(i => i.gosterge_id === selectedIndicatorId) || allIndicators[0];

  const [selectedKurum, setSelectedKurum] = useState<string>("TOB_DSI");
  const currentInstitution = DETSIS_INSTITUTIONS.find(k => k.kurum_kodu === selectedKurum);
  const [selectedAltBirim, setSelectedAltBirim] = useState<string>(currentInstitution?.alt_birimler?.[0] || "");

  const [donem, setDonem] = useState<string>("2026-2027");
  const [girilenDeger, setGirilenDeger] = useState<string>("");
  const [aciklama, setAciklama] = useState<string>("");
  const [kanitAdi, setKanitAdi] = useState<string>("2026_Yili_Resmi_Kanit_Raporu.pdf");
  const [kanitTuru, setKanitTuru] = useState<"RESMI_YAZI" | "RESMI_GAZETE" | "TEKNIK_RAPOR" | "CBS_VERISI" | "TUTANAK">("TEKNIK_RAPOR");
  
  const [sha256Hash, setSha256Hash] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Auto calculate hash when file name or comment changes
  React.useEffect(() => {
    calculateSHA256(kanitAdi + aciklama).then(hash => setSha256Hash(hash));
  }, [kanitAdi, aciklama]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!girilenDeger) {
      alert("Lütfen gerçekleşme değerini giriniz.");
      return;
    }

    setIsSubmitting(true);

    const newEntry: GostergeGerceklesme = {
      id: `RESP-${Math.floor(100 + Math.random() * 900)}`,
      gosterge_id: selectedIndicator.gosterge_id,
      eylem_kodu: selectedIndicator.eylem_kodu,
      gosterge_tanimi: selectedIndicator.tanim,
      kurum_kodu: selectedKurum,
      alt_birim: selectedAltBirim,
      donem: donem,
      girilen_deger: parseFloat(girilenDeger),
      birim: selectedIndicator.birim,
      aciklama: aciklama,
      kanit_belge_adi: kanitAdi,
      kanit_belge_turu: kanitTuru,
      kanit_sha256: sha256Hash,
      onay_durumu: currentRole === "SYGM_YONETICI" ? "ONAYLANDI" : "SORUMLU_ONAYINDA",
      tarih: new Date().toISOString().split("T")[0]
    };

    // Simulate async submission
    setTimeout(() => {
      onNewSubmission(newEntry);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      {/* Google Forms Başlık Kartı */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 border-t-8 border-t-purple-700 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 text-[11px] font-black uppercase px-2.5 py-1 rounded">
              Google Forms Modülü
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded">
              DETSİS & USBS Onaylı
            </span>
          </div>
          <button
            onClick={onSwitchToSheets}
            className="text-xs font-semibold text-purple-700 hover:text-purple-900 underline cursor-pointer"
          >
            📊 Yanıtları E-Tabloda Görüntüle →
          </button>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Ulusal Su Planı (2026–2035) Dönemsel Gösterge ve Kanıt Bildirim Formu
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Bu form aracılığıyla girilen tüm veriler ve resmi kanıt belgeleri (Resmi Gazete, teknik rapor, tutanak vb.) 
          anında <strong>Google Sheets Canlı Veritabanı Tablosuna</strong> işlenmekte ve ilgili koordinatör kurumun 
          onay masasına aktarılmaktadır.
        </p>
        <div className="text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded border border-amber-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Şartname FR-04 gereği kanıtsız veri girişi onay sürecine iletilemez.</span>
        </div>
      </div>

      {isSuccess ? (
        <div className="bg-white rounded-xl shadow-sm border border-emerald-200 p-8 text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900">Yanıtınız Başarıyla Kaydedildi!</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Bildirdiğiniz gerçekleşme verisi ve SHA-256 dijital parmak izli kanıt belgesi sisteme eklendi.
            Şimdi veriyi canlı Google Sheets e-tablosunda inceleyebilir veya yeni bir yanıt gönderebilirsiniz.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setIsSuccess(false);
                setGirilenDeger("");
                setAciklama("");
              }}
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer transition shadow"
            >
              Başka Bir Yanıt Gönder
            </button>
            <button
              onClick={onSwitchToSheets}
              className="bg-[#006747] hover:bg-[#005238] text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer transition shadow"
            >
              Canlı E-Tabloyu Aç (Sheets)
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kart 1: Eylem ve Gösterge Seçimi */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <label htmlFor="selectIndicator" className="block text-sm font-bold text-slate-900">
              1. İzlenen Eylem ve Performans Göstergesi <span className="text-[#c8102e]">*</span>
            </label>
            <p className="text-xs text-slate-500">
              Bildirimde bulunacağınız Ulusal Su Planı eylemini listeden seçiniz.
            </p>
            <select
              id="selectIndicator"
              value={selectedIndicatorId}
              onChange={(e) => setSelectedIndicatorId(parseInt(e.target.value))}
              className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none"
            >
              {allIndicators.map((ind) => (
                <option key={ind.gosterge_id} value={ind.gosterge_id}>
                  [{ind.eylem_kodu}] {ind.tanim} ({ind.tip} • Hedef: {ind.hedef_deger} {ind.birim})
                </option>
              ))}
            </select>

            {/* Otomatik Seçilen Gösterge Detay Rozeti */}
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-purple-700 font-bold block uppercase">Eylem Kodu</span>
                <span className="font-extrabold text-slate-900">{selectedIndicator.eylem_kodu}</span>
              </div>
              <div>
                <span className="text-[10px] text-purple-700 font-bold block uppercase">Gösterge Tipi</span>
                <span className="font-semibold text-slate-900">{selectedIndicator.tip}</span>
              </div>
              <div>
                <span className="text-[10px] text-purple-700 font-bold block uppercase">Plandaki Hedef</span>
                <span className="font-extrabold text-[#006747]">{selectedIndicator.hedef_deger} {selectedIndicator.birim}</span>
              </div>
              <div>
                <span className="text-[10px] text-purple-700 font-bold block uppercase">Asıl Sorumlu (*)</span>
                <span className="font-bold text-slate-800">{selectedIndicator.koordinator}</span>
              </div>
            </div>
          </div>

          {/* Kart 2: DETSİS Kurum ve Alt Birim Seçimi */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <label htmlFor="selectKurum" className="block text-sm font-bold text-slate-900">
              2. Bildirim Yapan Kurum ve DETSİS Birimi <span className="text-[#c8102e]">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="selectKurum" className="text-xs text-slate-600 block mb-1">Kurum Seçimi</label>
                <select
                  id="selectKurum"
                  value={selectedKurum}
                  onChange={(e) => {
                    setSelectedKurum(e.target.value);
                    const inst = DETSIS_INSTITUTIONS.find(k => k.kurum_kodu === e.target.value);
                    setSelectedAltBirim(inst?.alt_birimler?.[0] || "");
                  }}
                  className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none"
                >
                  {DETSIS_INSTITUTIONS.map((k) => (
                    <option key={k.kurum_kodu} value={k.kurum_kodu}>
                      {k.detsis_no ? `[${k.detsis_no}] ` : ""}{k.kurum_adi}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="selectAltBirim" className="text-xs text-slate-600 block mb-1">İlgili Daire / Şube</label>
                <select
                  id="selectAltBirim"
                  value={selectedAltBirim}
                  onChange={(e) => setSelectedAltBirim(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none"
                >
                  {(currentInstitution?.alt_birimler || ["Genel Koordinasyon"]).map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Kart 3: Dönem ve Gerçekleşme Değeri */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <label className="block text-sm font-bold text-slate-900">
              3. İzleme Dönemi ve Gerçekleşen Değer <span className="text-[#c8102e]">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="selectPeriod" className="text-xs text-slate-600 block mb-1">İzleme Dönemi</label>
                <select
                  id="selectPeriod"
                  value={donem}
                  onChange={(e) => setDonem(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white outline-none"
                >
                  <option value="2026-2027">2026–2027 (1. İzleme Döngüsü)</option>
                  <option value="2028-2029">2028–2029 (2. İzleme Döngüsü)</option>
                  <option value="2030-2035">2030–2035 (Nihai Hedef Döngüsü)</option>
                </select>
              </div>

              <div>
                <label htmlFor="inputGirilenDeger" className="text-xs text-slate-600 block mb-1">
                  Gerçekleşen Miktar ({selectedIndicator.birim})
                </label>
                <input
                  id="inputGirilenDeger"
                  type="number"
                  step="any"
                  placeholder={`Örn: ${selectedIndicator.hedef_deger}`}
                  value={girilenDeger}
                  onChange={(e) => setGirilenDeger(e.target.value)}
                  required
                  className="w-full text-xs font-bold text-[#006747] p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="textareaAciklama" className="text-xs text-slate-600 block mb-1">Gerçekleşme ve Operasyonel İlerleme Özeti</label>
              <textarea
                id="textareaAciklama"
                rows={2}
                value={aciklama}
                onChange={(e) => setAciklama(e.target.value)}
                placeholder="Sahada tamamlanan çalışmalar, ihale durumu veya kanunlaşma aşaması..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Kart 4: Kanıt Belgesi ve SHA-256 Kriptografik İmza */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <label className="block text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>4. Resmî Kanıt Belgesi Yükleme (FR-04) <span className="text-[#c8102e]">*</span></span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> SHA-256
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="selectKanitTuru" className="text-xs text-slate-600 block mb-1">Belge Türü</label>
                <select
                  id="selectKanitTuru"
                  value={kanitTuru}
                  onChange={(e) => setKanitTuru(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 outline-none"
                >
                  <option value="TEKNIK_RAPOR">Onaylı Teknik Rapor / İlerleme Cetveli</option>
                  <option value="RESMI_YAZI">Bakanlık / Kurum Resmî Yazısı</option>
                  <option value="RESMI_GAZETE">Resmî Gazete Yayımı / Karar Sayısı</option>
                  <option value="CBS_VERISI">CBS / Harita Katmanı Verisi</option>
                  <option value="TUTANAK">Kurul Toplantı Tutanağı</option>
                </select>
              </div>

              <div>
                <label htmlFor="inputKanitAdi" className="text-xs text-slate-600 block mb-1">Dosya Adı</label>
                <div className="relative">
                  <input
                    id="inputKanitAdi"
                    type="text"
                    value={kanitAdi}
                    onChange={(e) => setKanitAdi(e.target.value)}
                    required
                    className="w-full text-xs font-mono p-2.5 pl-8 rounded-lg border border-slate-300 bg-slate-50 outline-none"
                  />
                  <FileUp className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 font-mono text-[11px] text-slate-600 break-all">
              <span className="font-bold text-slate-800">Elektronik Bütünlük Hash'i: </span>
              {sha256Hash}
            </div>
          </div>

          {/* Form Gönderim Butonları */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setGirilenDeger("");
                setAciklama("");
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Formu Temizle
            </button>

            {!ROLE_PERMISSIONS[currentRole]?.canSubmitForm ? (
              <div className="bg-amber-100 text-amber-900 border border-amber-300 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-700" />
                <span>Bu rol ('{ROLE_PERMISSIONS[currentRole]?.roleLabel}') veri girişi yapamaz; sadece izleme/denetim yetkisine sahiptir.</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-extrabold text-xs px-6 py-3 rounded-lg shadow-md cursor-pointer transition flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>İşleniyor...</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-purple-200" />
                    Gönder ve Canlı E-Tabloya Ekle
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
