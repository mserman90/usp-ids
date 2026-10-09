import { GostergeGerceklesme, SuKuruluKarari, HavzaCBS } from "@/types";

export const INITIAL_RESPONSES: GostergeGerceklesme[] = [
  {
    id: "RESP-001",
    gosterge_id: 1,
    eylem_kodu: "E-1.1.1",
    gosterge_tanimi: "Su Kanununun Resmi Gazete'de Yayımlanması",
    kurum_kodu: "TOB_SYGM",
    alt_birim: "Su Hukuku ve Politikaları Daire Bşk.",
    donem: "2026-2027",
    girilen_deger: 1,
    birim: "Kanun",
    aciklama: "Taslak Su Kanunu metni kurumlar arası mutabakatla TBMM Başkanlığına sunulmuştur.",
    kanit_belge_adi: "TBMM_Su_Kanunu_Sevk_Yazisi.pdf",
    kanit_belge_turu: "RESMI_YAZI",
    kanit_sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    onay_durumu: "ONAYLANDI",
    tarih: "2026-06-15"
  },
  {
    id: "RESP-002",
    gosterge_id: 3,
    eylem_kodu: "E-1.2.1",
    gosterge_tanimi: "Uygulamaya Geçen Su Kurulu Kararı Oranı",
    kurum_kodu: "TOB_SYGM",
    alt_birim: "Havza Yönetimi Daire Başkanlığı",
    donem: "2026-2027",
    girilen_deger: 68.5,
    birim: "%",
    aciklama: "Ulusal Su Kurulu 2. Toplantı kararlarının 24'ü uygulamaya konulmuştur.",
    kanit_belge_adi: "USUK_2_Toplanti_Tutanagi.pdf",
    kanit_belge_turu: "TUTANAK",
    kanit_sha256: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
    onay_durumu: "SYGM_ONAYINDA",
    tarih: "2026-07-20"
  },
  {
    id: "RESP-003",
    gosterge_id: 4,
    eylem_kodu: "E-2.1.1",
    gosterge_tanimi: "Ölçüm Sistemi Takılan YAS Kuyu Oranı",
    kurum_kodu: "TOB_DSI",
    alt_birim: "Yeraltısuları Şubesi",
    donem: "2026-2027",
    girilen_deger: 42.0,
    birim: "%",
    aciklama: "Konya Kapalı Havzası ve Gediz Havzası'nda 14.200 kuyuya akıllı debimetre takılmıştır.",
    kanit_belge_adi: "DSI_YAS_Sayaç_Hakedis_Raporu.pdf",
    kanit_belge_turu: "TEKNIK_RAPOR",
    kanit_sha256: "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
    onay_durumu: "SORUMLU_ONAYINDA",
    tarih: "2026-08-01"
  },
  {
    id: "RESP-004",
    gosterge_id: 5,
    eylem_kodu: "E-2.2.1",
    gosterge_tanimi: "İzlenen Online Nitrat İstasyonu Sayısı",
    kurum_kodu: "TOB_TRGM",
    alt_birim: "Çevre ve Doğal Kaynaklar Daire Bşk.",
    donem: "2026-2027",
    girilen_deger: 1350,
    birim: "İstasyon",
    aciklama: "Büyük Menderes ve Ergene havzalarında yeni sensörler devreye alınmıştır.",
    kanit_belge_adi: "TRGM_Nitrat_Ag_Analiz_Raporu.pdf",
    kanit_belge_turu: "CBS_VERISI",
    kanit_sha256: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    onay_durumu: "ONAYLANDI",
    tarih: "2026-08-14"
  },
  {
    id: "RESP-005",
    gosterge_id: 7,
    eylem_kodu: "E-3.2.1",
    gosterge_tanimi: "Arıtılmış Atıksuyun Yeniden Kullanım Oranı",
    kurum_kodu: "CSIDB_CYGM",
    alt_birim: "Su ve Toprak Yönetimi Dairesi Bşk.",
    donem: "2026-2027",
    girilen_deger: 8.4,
    birim: "%",
    aciklama: "İSKİ Paşaköy ve ASKİ Tatlar AAT çıkış suları sanayi soğutma suyuna tahsis edilmiştir.",
    kanit_belge_adi: "AAT_Geri_Kullanim_Istatistik_2026.pdf",
    kanit_belge_turu: "TEKNIK_RAPOR",
    kanit_sha256: "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    onay_durumu: "SYGM_ONAYINDA",
    tarih: "2026-09-02"
  },
  {
    id: "RESP-006",
    gosterge_id: 8,
    eylem_kodu: "E-4.1.1",
    gosterge_tanimi: "Taşkın Erken Uyarı Sistemi Kurulu Havza Sayısı",
    kurum_kodu: "TOB_SYGM",
    alt_birim: "Havza Yönetimi Daire Başkanlığı",
    donem: "2026-2027",
    girilen_deger: 14,
    birim: "Havza",
    aciklama: "Batı Karadeniz, Doğu Karadeniz ve Antalya havzalarında radarlar entegre edilmiştir.",
    kanit_belge_adi: "MGM_Taskin_Radar_Kabul_Tutanagi.pdf",
    kanit_belge_turu: "RESMI_YAZI",
    kanit_sha256: "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b",
    onay_durumu: "ONAYLANDI",
    tarih: "2026-09-25"
  }
];

export const SU_KURULU_KARARLARI: SuKuruluKarari[] = [
  {
    karar_id: "USUK-2026-01",
    kurul_turu: "USUK",
    kurul_adi: "Ulusal Su Kurulu (USUK)",
    toplanti_tarihi: "2026-02-14",
    karar_no: "2026/01",
    karar_ozeti: "Yeraltı suyu seviyesi kritik eşiğin altına düşen havzalarda sulu tarım deseninin sınırlandırılması ve münavebe zorunluluğu.",
    ilgili_eylem_kodu: "E-2.1.1",
    uygulama_durumu: "UYGULANDI"
  },
  {
    karar_id: "USUK-2026-02",
    kurul_turu: "USUK",
    kurul_adi: "Ulusal Su Kurulu (USUK)",
    toplanti_tarihi: "2026-05-20",
    karar_no: "2026/02",
    karar_ozeti: "Belediyelerde şebeke su kaybı %25'in üzerinde olan idarelerin İLBANK altyapı kredilerinde su kaybı azaltma şartı getirilmesi.",
    ilgili_eylem_kodu: "E-5.1.1",
    uygulama_durumu: "DEVAM_EDIYOR"
  },
  {
    karar_id: "HAVZA-GEDIZ-04",
    kurul_turu: "HAVZA",
    kurul_adi: "Gediz Havzası Su Kurulu",
    toplanti_tarihi: "2026-04-10",
    karar_no: "G-2026/04",
    karar_ozeti: "Sanayi bölgelerinde arıtılmış atıksuların proses suyu olarak zorunlu kullanımına yönelik denetim protokolü.",
    ilgili_eylem_kodu: "E-3.2.1",
    uygulama_durumu: "UYGULANDI"
  },
  {
    karar_id: "IL-KONYA-03",
    kurul_turu: "IL",
    kurul_adi: "Konya İl Su Kurulu",
    toplanti_tarihi: "2026-06-05",
    karar_no: "K-2026/03",
    karar_ozeti: "Obruk oluşum riski yüksek sahalarda yeraltısuyu çekim kotunun günlük telemetri ile izlenmesi.",
    ilgili_eylem_kodu: "E-2.1.1",
    uygulama_durumu: "DEVAM_EDIYOR"
  }
];

export const BASINS_DATA: HavzaCBS[] = [
  {
    havza_kodu: "KONYA_KAPALI",
    havza_adi: "Konya Kapalı Havzası",
    bolge: "İç Anadolu",
    oncelikli_sorunlar: "YAS Aşırı Çekimi, Obruklar, Tarımsal Kuraklık",
    eylem_sayisi: 18,
    tamamlanan_eylem: 8,
    ortalama_gerceklesme: 48.5,
    karar_uygulama_orani: 65.0
  },
  {
    havza_kodu: "GEDIZ",
    havza_adi: "Gediz Havzası",
    bolge: "Ege",
    oncelikli_sorunlar: "Sanayi Baskısı, Aşırı Çekim, Noktasal Kirlilik",
    eylem_sayisi: 14,
    tamamlanan_eylem: 7,
    ortalama_gerceklesme: 54.0,
    karar_uygulama_orani: 72.5
  },
  {
    havza_kodu: "BATI_KARADENIZ",
    havza_adi: "Batı Karadeniz Havzası",
    bolge: "Karadeniz",
    oncelikli_sorunlar: "Taşkın ve Sel Riski, Heyelan, Kıyı Erozyonu",
    eylem_sayisi: 16,
    tamamlanan_eylem: 12,
    ortalama_gerceklesme: 82.0,
    karar_uygulama_orani: 90.0
  },
  {
    havza_kodu: "MARMARA",
    havza_adi: "Marmara Havzası",
    bolge: "Marmara",
    oncelikli_sorunlar: "Kentsel Nüfus Yoğunluğu, Müsilaj, AAT Kapasitesi",
    eylem_sayisi: 22,
    tamamlanan_eylem: 11,
    ortalama_gerceklesme: 58.5,
    karar_uygulama_orani: 80.0
  },
  {
    havza_kodu: "FIRAT_DICLE",
    havza_adi: "Fırat-Dicle Havzası",
    bolge: "Güneydoğu Anadolu",
    oncelikli_sorunlar: "Sınır Aşan Sular, GAP Sulama Dönüşümü, Buharlaşma",
    eylem_sayisi: 20,
    tamamlanan_eylem: 9,
    ortalama_gerceklesme: 52.0,
    karar_uygulama_orani: 60.0
  },
  {
    havza_kodu: "BUYUK_MENDERES",
    havza_adi: "Büyük Menderes Havzası",
    bolge: "Ege",
    oncelikli_sorunlar: "Jeotermal Deşarjlar, Tekstil Atıksuları, Kuraklık",
    eylem_sayisi: 15,
    tamamlanan_eylem: 8,
    ortalama_gerceklesme: 55.4,
    karar_uygulama_orani: 70.0
  }
];
