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

export type TabId = "forms" | "sheets" | "hierarchy" | "earlyWarning" | "basins" | "reports";

export interface RolePermissionConfig {
  roleLabel: string;
  badgeColor: string;
  description: string;
  allowedTabs: TabId[];
  defaultTab: TabId;
  canApprove: boolean;     // Nihai onay verme (ONAYLANDI) yetkisi
  canCoordinate: boolean; // Koordinatör inceleme / nihai onaya sunma / iade yetkisi
  canSubmitForm: boolean; // Veri girişi yapabilme yetkisi
}

export const ROLE_PERMISSIONS: Record<KullaniciRolu, RolePermissionConfig> = {
  SYGM_YONETICI: {
    roleLabel: "SYGM Süpervizör / Sistem Yöneticisi",
    badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
    description: "Tüm sistem modüllerine tam erişim, nihai onaylama, sapma analitiği ve 2 yıllık resmî brifing raporu üretme yetkisi.",
    allowedTabs: ["forms", "sheets", "hierarchy", "earlyWarning", "basins", "reports"],
    defaultTab: "sheets",
    canApprove: true,
    canCoordinate: true,
    canSubmitForm: true
  },
  SORUMLU_KURUM: {
    roleLabel: "Sorumlu Kurum Koordinatörü (*)",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    description: "Koordinatörü olduğu eylemleri izleme, paydaş verilerini denetleyip nihai onaya sunma ve erken uyarı takibi.",
    allowedTabs: ["forms", "sheets", "hierarchy", "earlyWarning", "basins"],
    defaultTab: "sheets",
    canApprove: false,
    canCoordinate: true,
    canSubmitForm: true
  },
  ILGILI_KURUM: {
    roleLabel: "İlgili Paydaş Kurum (SUKİ / Belediye / Enstitü)",
    badgeColor: "bg-sky-100 text-sky-900 border-sky-300",
    description: "Gösterge gerçekleşmelerini ve SHA-256 kanıt belgelerini bildirme, kendi bildirimlerinin onay durumunu takip etme.",
    allowedTabs: ["forms", "sheets", "hierarchy"],
    defaultTab: "forms",
    canApprove: false,
    canCoordinate: false,
    canSubmitForm: true
  },
  KURUL_SEKRETERYASI: {
    roleLabel: "Su Kurulları Sekreteryası (USUK / Havza / İl)",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    description: "25 Nehir Havzası ve 81 İl Su Kurulu kararlarını eylemlerle eşleştirme ve kurul kararları brifing takibi.",
    allowedTabs: ["basins", "sheets", "hierarchy", "reports"],
    defaultTab: "basins",
    canApprove: false,
    canCoordinate: false,
    canSubmitForm: false
  },
  IZLEME_UZMANI: {
    roleLabel: "Bağımsız İzleme ve Denetim Uzmanı",
    badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
    description: "Plandaki sapma analitiği, riskli eylemler, havza gerçekleşmeleri ve resmî brifing raporlarını inceleme yetkisi (Salt Okunur).",
    allowedTabs: ["earlyWarning", "sheets", "hierarchy", "basins", "reports"],
    defaultTab: "earlyWarning",
    canApprove: false,
    canCoordinate: false,
    canSubmitForm: false
  }
};

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
