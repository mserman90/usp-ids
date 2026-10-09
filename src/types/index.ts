/**
 * Ulusal Su Planı (2026–2035) İzleme ve Değerlendirme Bilgi Sistemi (USP-İDS)
 * Tip Tanımlamaları ve Veri Modelleri
 */

export type GostergeTipi = "NUMERIK" | "ORANSAL_YUZDE" | "KILOMETRE_TASI";

export type OnayDurumu = "BEKLEMEDE" | "SORUMLU_ONAYINDA" | "SYGM_ONAYINDA" | "ONAYLANDI" | "IADE";

export type DurumKodu = "YESIL" | "SARI" | "KIRMIZI";

export type KullaniciRolu = 
  | "SYGM_YONETICI"      // Su Yönetimi Genel Müdürlüğü (Süpervizör)
  | "SORUMLU_KURUM"      // Eylem Koordinatörü (*) (örn: DSİ, TRGM, ÇŞİDB)
  | "ILGILI_KURUM"       // Katkı Sağlayan Paydaş (örn: ASKİ, İSKİ, Üniversite)
  | "KURUL_SEKRETERYASI" // USUK veya Havza Su Kurulu Sekreteryası
  | "IZLEME_UZMANI";     // Kamu İzleme ve Değerlendirme Uzmanı

export interface Gosterge {
  gosterge_id: number;
  eylem_id: number;
  tanim: string;
  tip: GostergeTipi;
  baz_deger: number;
  hedef_deger: number;
  birim: string;
}

export interface Eylem {
  eylem_id: number;
  strateji_id: number;
  eylem_kodu: string; // Örn: 'E-1.1.1'
  tanim: string;
  baslangic_yili: number;
  bitis_yili: number;
  koordinator_kurum: string; // '*' ile işaretli asıl sorumlu (örn: 'TOB_SYGM')
  ilgili_kurumlar: string[]; // ['TOB_DSI', 'ADALET_BAK', 'CSIDB_CYGM']
  gostergeler: Gosterge[];
}

export interface Strateji {
  strateji_id: number;
  hedef_id: number;
  strateji_kodu: string; // Örn: 'S-1.1'
  baslik: string;
  eylemler: Eylem[];
}

export interface Hedef {
  hedef_id: number;
  hedef_no: string; // Örn: 'HEDEF-1'
  baslik: string;
  aciklama: string;
  stratejiler: Strateji[];
}

export interface KurumBirim {
  kurum_kodu: string;
  kurum_adi: string;
  tur: "BAKANLIK" | "GENEL_MUDURLUK" | "SUKI" | "BELEDIYE" | "UNIVERSITE" | "ENSTITU";
  detsis_no?: string;
  alt_birimler?: string[];
}

export interface GostergeGerceklesme {
  id: string | number;
  gosterge_id: number;
  eylem_kodu: string;
  gosterge_tanimi: string;
  kurum_kodu: string;
  alt_birim?: string;
  donem: string; // Örn: '2026-2027'
  girilen_deger: number;
  birim: string;
  aciklama: string;
  kanit_belge_adi: string;
  kanit_belge_turu: "RESMI_YAZI" | "RESMI_GAZETE" | "TEKNIK_RAPOR" | "CBS_VERISI" | "TUTANAK";
  kanit_sha256: string;
  onay_durumu: OnayDurumu;
  tarih: string;
  iade_gerekcesi?: string;
}

export interface SuKuruluKarari {
  karar_id: string;
  kurul_turu: "USUK" | "HAVZA" | "IL";
  kurul_adi: string;
  toplanti_tarihi: string;
  karar_no: string;
  karar_ozeti: string;
  ilgili_eylem_kodu: string;
  uygulama_durumu: "UYGULANDI" | "DEVAM_EDIYOR" | "PLANLANDI" | "BEKLEMEDE";
}

export interface HavzaCBS {
  havza_kodu: string;
  havza_adi: string;
  bolge: string;
  oncelikli_sorunlar: string;
  eylem_sayisi: number;
  tamamlanan_eylem: number;
  ortalama_gerceklesme: number;
  karar_uygulama_orani: number;
}
