import { DurumKodu } from "@/types";

export interface DeviationAnalysis {
  teorik_ilerleme: number;
  gerceklesme_orani: number;
  durum_kodu: DurumKodu;
  kalan_yil: number;
  sapma_miktari: number;
}

/**
 * FR-06 Sapma Analizi ve Erken Uyarı Motoru
 * @param baslangicYili Eylemin başlama yılı (örn: 2026)
 * @param bitisYili Eylemin bitiş yılı (örn: 2028)
 * @param simdikiYil İzleme yılı (örn: 2027)
 * @param girilenDeger Gerçekleşen gösterge değeri
 * @param bazDeger Plandaki baz değer
 * @param hedefDeger Plandaki hedef değer
 */
export function calculateDeviation(
  baslangicYili: number,
  bitisYili: number,
  simdikiYil: number,
  girilenDeger: number,
  bazDeger: number,
  hedefDeger: number
): DeviationAnalysis {
  const toplamSure = Math.max(1, bitisYili - baslangicYili);
  const gecenSure = Math.max(0, Math.min(toplamSure, simdikiYil - baslangicYili));
  const teorikIlerleme = Math.round((gecenSure / toplamSure) * 100);

  // Gerçekleşme Yüzdesi
  let gerceklesmeOrani = 0;
  if (hedefDeger !== bazDeger) {
    gerceklesmeOrani = Math.round(
      Math.min(100, Math.max(0, ((girilenDeger - bazDeger) / (hedefDeger - bazDeger)) * 100))
    );
  } else {
    gerceklesmeOrani = girilenDeger >= hedefDeger ? 100 : 0;
  }

  const kalanYil = bitisYili - simdikiYil;
  const sapmaMiktari = teorikIlerleme - gerceklesmeOrani;

  let durumKodu: DurumKodu = "YESIL";

  if (simdikiYil >= bitisYili && gerceklesmeOrani < 100) {
    durumKodu = "KIRMIZI"; // Süre bitti ama hedef tutmadı
  } else if (kalanYil <= 1 && gerceklesmeOrani < 50) {
    durumKodu = "KIRMIZI"; // Bitişe 1 yıldan az kaldı ve < %50
  } else if (sapmaMiktari > 20) {
    durumKodu = "SARI"; // Hedefin %20 gerisinde
  } else if (gerceklesmeOrani >= teorikIlerleme || gerceklesmeOrani >= 100) {
    durumKodu = "YESIL";
  } else {
    durumKodu = "SARI";
  }

  return {
    teorik_ilerleme: teorikIlerleme,
    gerceklesme_orani: gerceklesmeOrani,
    durum_kodu: durumKodu,
    kalan_yil: kalanYil,
    sapma_miktari: sapmaMiktari
  };
}
