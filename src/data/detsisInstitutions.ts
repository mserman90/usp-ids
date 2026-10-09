import { KurumBirim } from "@/types";

export const DETSIS_INSTITUTIONS: KurumBirim[] = [
  {
    kurum_kodu: "TOB_SYGM",
    kurum_adi: "Tarım ve Orman Bakanlığı - Su Yönetimi Genel Müdürlüğü (SYGM)",
    detsis_no: "10528498",
    tur: "GENEL_MUDURLUK",
    alt_birimler: ["Havza Yönetimi Daire Başkanlığı", "Su Hukuku ve Politikaları Daire Bşk.", "Su Kalitesi Daire Bşk.", "İzleme ve Bilgi Sistemleri Şubesi"]
  },
  {
    kurum_kodu: "TOB_DSI",
    kurum_adi: "Devlet Su İşleri Genel Müdürlüğü (DSİ)",
    detsis_no: "62165727",
    tur: "GENEL_MUDURLUK",
    alt_birimler: ["Barajlar ve HES Dairesi", "Etüt Plan ve Tahsisler Dairesi", "Sulama Dairesi Bşk.", "Yeraltısuları Şubesi"]
  },
  {
    kurum_kodu: "TOB_TRGM",
    kurum_adi: "Tarım ve Orman Bakanlığı - Tarım Reformu Genel Müdürlüğü (TRGM)",
    detsis_no: "92036835",
    tur: "GENEL_MUDURLUK",
    alt_birimler: ["Tarımsal Sulama ve Arazi Islahı Daire Bşk.", "Çevre ve Doğal Kaynaklar Daire Bşk."]
  },
  {
    kurum_kodu: "MGM",
    kurum_adi: "Meteoroloji Genel Müdürlüğü (MGM)",
    detsis_no: "42074107",
    tur: "GENEL_MUDURLUK",
    alt_birimler: ["Hidrometeoroloji Şube Müdürlüğü", "Araştırma ve İklim Değişikliği Dairesi"]
  },
  {
    kurum_kodu: "CSIDB_CYGM",
    kurum_adi: "Çevre, Şehircilik ve İklim Değişikliği Bakanlığı - Çevre Yönetimi Genel Müdürlüğü (ÇYGM)",
    detsis_no: "38256534",
    tur: "GENEL_MUDURLUK",
    alt_birimler: ["Su ve Toprak Yönetimi Dairesi Bşk.", "Sıfır Atık ve Döngüsel Ekonomi Dairesi"]
  },
  {
    kurum_kodu: "IKLIM_BASKANLIGI",
    kurum_adi: "İklim Değişikliği Başkanlığı",
    detsis_no: "50038206",
    tur: "BAKANLIK",
    alt_birimler: ["Uyum ve Etki Değerlendirme Dairesi"]
  },
  {
    kurum_kodu: "ILBANK",
    kurum_adi: "İller Bankası Anonim Şirketi Genel Müdürlüğü (İLBANK)",
    detsis_no: "91257196",
    tur: "GENEL_MUDURLUK",
    alt_birimler: ["Kentsel Altyapı ve Su Hizmetleri Dairesi"]
  },
  {
    kurum_kodu: "AFAD",
    kurum_adi: "Afet ve Acil Durum Yönetimi Başkanlığı (AFAD)",
    detsis_no: "56388857",
    tur: "BAKANLIK",
    alt_birimler: ["Deprem ve Afet Risk Azaltma GM", "Müdahale Dairesi"]
  },
  {
    kurum_kodu: "SUEN",
    kurum_adi: "Türkiye Su Enstitüsü Başkanlığı (SUEN)",
    detsis_no: "29038238",
    tur: "ENSTITU",
    alt_birimler: ["Uluslararası Su Politikaları Koordinatörlüğü"]
  },
  {
    kurum_kodu: "TUBITAK_MAM",
    kurum_adi: "TÜBİTAK - Marmara Araştırma Merkezi Başkanlığı (MAM)",
    detsis_no: "18174606",
    tur: "ENSTITU",
    alt_birimler: ["Çevre ve Temiz Üretim Enstitüsü"]
  },
  {
    kurum_kodu: "ISKI",
    kurum_adi: "İstanbul Su ve Kanalizasyon İdaresi Genel Müdürlüğü (İSKİ)",
    detsis_no: "20760334",
    tur: "SUKI",
    alt_birimler: ["Su Arıtma Dairesi", "Kanalizasyon ve Ruhsat Dairesi", "Strateji Geliştirme"]
  },
  {
    kurum_kodu: "ASKI",
    kurum_adi: "Ankara Su ve Kanalizasyon İdaresi Genel Müdürlüğü (ASKİ)",
    detsis_no: "39182813",
    tur: "SUKI",
    alt_birimler: ["Su İsale ve Dağıtım Dairesi", "Çevre Koruma ve Havza Güvenliği"]
  },
  {
    kurum_kodu: "IZSU",
    kurum_adi: "İzmir Su ve Kanalizasyon İdaresi Genel Müdürlüğü (İZSU)",
    detsis_no: "67980387",
    tur: "SUKI",
    alt_birimler: ["Havza Koruma ve Arıtma Tesisleri Dairesi"]
  },
  {
    kurum_kodu: "BUSKI",
    kurum_adi: "Bursa Su ve Kanalizasyon İdaresi Genel Müdürlüğü (BUSKİ)",
    detsis_no: "66170681",
    tur: "SUKI",
    alt_birimler: ["İçmesuyu ve Havza Denetim Dairesi"]
  },
  {
    kurum_kodu: "YOK_UNIVERSITELER",
    kurum_adi: "Yükseköğretim Kurulu Başkanlığı (YÖK) / Üniversiteler",
    detsis_no: "32625594",
    tur: "UNIVERSITE",
    alt_birimler: ["Çevre Mühendisliği Bölümleri", "Su Kaynakları Araştırma Merkezleri"]
  },
  {
    kurum_kodu: "TBB",
    kurum_adi: "Türkiye Belediyeler Birliği Başkanlığı (TBB)",
    detsis_no: "43118544",
    tur: "BELEDIYE",
    alt_birimler: ["Akıllı Şehirler ve Altyapı Müdürlüğü"]
  }
];
