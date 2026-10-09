import { Hedef } from "@/types";

export const MASTER_TARGETS: Hedef[] = [
  {
    hedef_id: 1,
    hedef_no: "HEDEF-1",
    baslik: "Su Yönetiminde Kurumsal ve Yasal Yapının Güçlendirilmesi",
    aciklama: "Su Kanunu'nun yürürlüğe konulması, kurumsal yetki çakışmalarının önlenmesi ve su kurullarının etkin işletilmesi.",
    stratejiler: [
      {
        strateji_id: 101,
        hedef_id: 1,
        strateji_kodu: "S-1.1",
        baslik: "Mevzuat Altyapısının Güncellenmesi ve Su Kanunu",
        eylemler: [
          {
            eylem_id: 1,
            strateji_id: 101,
            eylem_kodu: "E-1.1.1",
            tanim: "Taslak Su Kanunu'nun TBMM'ye sevk edilerek yasalaşması ve ikincil mevzuatın yayımlanması sağlanacaktır.",
            baslangic_yili: 2026,
            bitis_yili: 2027,
            koordinator_kurum: "TOB_SYGM",
            ilgili_kurumlar: ["ADALET_BAK", "CSIDB_CYGM", "TOB_DSI", "TBMM"],
            gostergeler: [
              {
                gosterge_id: 1,
                eylem_id: 1,
                tanim: "Su Kanununun Resmi Gazete'de Yayımlanması",
                tip: "KILOMETRE_TASI",
                baz_deger: 0,
                hedef_deger: 1,
                birim: "Kanun"
              }
            ]
          },
          {
            eylem_id: 2,
            strateji_id: 101,
            eylem_kodu: "E-1.1.2",
            tanim: "Havza bazlı su tahsis yönetmelikleri güncellenecek ve sektörel öncelikler belirlenecektir.",
            baslangic_yili: 2026,
            bitis_yili: 2028,
            koordinator_kurum: "TOB_SYGM",
            ilgili_kurumlar: ["TOB_DSI", "SANAYI_BAK", "ENERJI_BAK"],
            gostergeler: [
              {
                gosterge_id: 2,
                eylem_id: 2,
                tanim: "Güncellenen Havza Su Tahsis Planı Sayısı",
                tip: "NUMERIK",
                baz_deger: 5,
                hedef_deger: 25,
                birim: "Havza"
              }
            ]
          }
        ]
      },
      {
        strateji_id: 102,
        hedef_id: 1,
        strateji_kodu: "S-1.2",
        baslik: "Su Kurullarının Etkinliğinin Artırılması",
        eylemler: [
          {
            eylem_id: 3,
            strateji_id: 102,
            eylem_kodu: "E-1.2.1",
            tanim: "Ulusal Su Kurulu, 25 Havza Su Kurulu ve 81 İl Su Kurulu kararlarının dijital sistem üzerinden takibi sağlanacaktır.",
            baslangic_yili: 2026,
            bitis_yili: 2029,
            koordinator_kurum: "TOB_SYGM",
            ilgili_kurumlar: ["ICISLERI_BAK", "VALILIKLER", "BELEDIYELER", "SUKILER"],
            gostergeler: [
              {
                gosterge_id: 3,
                eylem_id: 3,
                tanim: "Uygulamaya Geçen Su Kurulu Kararı Oranı",
                tip: "ORANSAL_YUZDE",
                baz_deger: 40,
                hedef_deger: 85,
                birim: "%"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    hedef_id: 2,
    hedef_no: "HEDEF-2",
    baslik: "Su Kaynaklarının Miktar ve Kalite Olarak Korunması",
    aciklama: "Yeraltı ve yerüstü su kütlelerinin iyi su durumuna ulaştırılması, kirlilik kaynaklarının kontrolü ve kaçak çekimlerin önlenmesi.",
    stratejiler: [
      {
        strateji_id: 201,
        hedef_id: 2,
        strateji_kodu: "S-2.1",
        baslik: "Yeraltı Sularının Korunması ve Ölçümlü Kullanım",
        eylemler: [
          {
            eylem_id: 4,
            strateji_id: 201,
            eylem_kodu: "E-2.1.1",
            tanim: "Tüm havzalarda kaçak yeraltı suyu kuyularının kapatılması ve ruhsatlı kuyulara uzaktan sayaç takılması tamamlanacaktır.",
            baslangic_yili: 2026,
            bitis_yili: 2028,
            koordinator_kurum: "TOB_DSI",
            ilgili_kurumlar: ["TOB_SYGM", "ENERJI_EPDK", "VALILIKLER"],
            gostergeler: [
              {
                gosterge_id: 4,
                eylem_id: 4,
                tanim: "Ölçüm Sistemi Takılan YAS Kuyu Oranı",
                tip: "ORANSAL_YUZDE",
                baz_deger: 25,
                hedef_deger: 80,
                birim: "%"
              }
            ]
          }
        ]
      },
      {
        strateji_id: 202,
        hedef_id: 2,
        strateji_kodu: "S-2.2",
        baslik: "Tarımsal ve Noktasal Kirliliğin Azaltılması",
        eylemler: [
          {
            eylem_id: 5,
            strateji_id: 202,
            eylem_kodu: "E-2.2.1",
            tanim: "Nitrat hassas alanlarda iyi tarım uygulamaları yaygınlaştırılacak ve online nitrat istasyon ağı kurulacaktır.",
            baslangic_yili: 2026,
            bitis_yili: 2030,
            koordinator_kurum: "TOB_TRGM",
            ilgili_kurumlar: ["TOB_SYGM", "CSIDB_CYGM", "UNIVERSITELER"],
            gostergeler: [
              {
                gosterge_id: 5,
                eylem_id: 5,
                tanim: "İzlenen Online Nitrat İstasyonu Sayısı",
                tip: "NUMERIK",
                baz_deger: 800,
                hedef_deger: 2500,
                birim: "İstasyon"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    hedef_id: 3,
    hedef_no: "HEDEF-3",
    baslik: "Sektörel Su Verimliliğinin ve Alternatif Su Kaynaklarının Geliştirilmesi",
    aciklama: "Tarımsal sulamada kapalı sisteme geçiş, sanayide ve kentsel şebekelerde su kayıplarının azaltılması, arıtılmış atıksuların yeniden kullanımı.",
    stratejiler: [
      {
        strateji_id: 301,
        hedef_id: 3,
        strateji_kodu: "S-3.1",
        baslik: "Tarımsal Sulamada Modernizasyon",
        eylemler: [
          {
            eylem_id: 6,
            strateji_id: 301,
            eylem_kodu: "E-3.1.1",
            tanim: "Açık kanal sulama şebekeleri basınçlı borulu kapalı sistemlere dönüştürülecektir.",
            baslangic_yili: 2026,
            bitis_yili: 2035,
            koordinator_kurum: "TOB_DSI",
            ilgili_kurumlar: ["TOB_TRGM", "SULAMA_BIRLIKLERI", "HAZINE_MALIYE"],
            gostergeler: [
              {
                gosterge_id: 6,
                eylem_id: 6,
                tanim: "Basınçlı Borulu Sulama Şebekesi Oranı",
                tip: "ORANSAL_YUZDE",
                baz_deger: 34,
                hedef_deger: 65,
                birim: "%"
              }
            ]
          }
        ]
      },
      {
        strateji_id: 302,
        hedef_id: 3,
        strateji_kodu: "S-3.2",
        baslik: "Arıtılmış Atıksuların Geri Kazanımı",
        eylemler: [
          {
            eylem_id: 7,
            strateji_id: 302,
            eylem_kodu: "E-3.2.1",
            tanim: "Büyükşehirlerde arıtılmış kentsel atıksuların yeşil alan sulaması ve sanayide yeniden kullanım oranı artırılacaktır.",
            baslangic_yili: 2026,
            bitis_yili: 2028,
            koordinator_kurum: "CSIDB_CYGM",
            ilgili_kurumlar: ["SUKILER", "BELEDIYELER", "ILBANK", "OSB_LER"],
            gostergeler: [
              {
                gosterge_id: 7,
                eylem_id: 7,
                tanim: "Arıtılmış Atıksuyun Yeniden Kullanım Oranı",
                tip: "ORANSAL_YUZDE",
                baz_deger: 5.2,
                hedef_deger: 15.0,
                birim: "%"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    hedef_id: 4,
    hedef_no: "HEDEF-4",
    baslik: "Su Kaynaklı Afetler ve İklim Değişikliğine Uyum",
    aciklama: "Taşkın, kuraklık kriz yönetim planlarının uygulanması ve erken uyarı radar sistemlerinin kurulması.",
    stratejiler: [
      {
        strateji_id: 401,
        hedef_id: 4,
        strateji_kodu: "S-4.1",
        baslik: "Taşkın ve Kuraklık Erken Uyarı Ağı",
        eylemler: [
          {
            eylem_id: 8,
            strateji_id: 401,
            eylem_kodu: "E-4.1.1",
            tanim: "25 Havzada taşkın erken uyarı radarları ve hidrolojik tahmin modeli aktif edilecektir.",
            baslangic_yili: 2026,
            bitis_yili: 2028,
            koordinator_kurum: "TOB_SYGM",
            ilgili_kurumlar: ["MGM", "AFAD", "TOB_DSI", "BELEDIYELER"],
            gostergeler: [
              {
                gosterge_id: 8,
                eylem_id: 8,
                tanim: "Taşkın Erken Uyarı Sistemi Kurulu Havza Sayısı",
                tip: "NUMERIK",
                baz_deger: 8,
                hedef_deger: 25,
                birim: "Havza"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    hedef_id: 5,
    hedef_no: "HEDEF-5",
    baslik: "İçme ve Kullanma Suyu Güvenliğinin Sağlanması",
    aciklama: "Belediye şebekelerinde gelir getirmeyen su kaybının %25'in altına düşürülmesi ve arıtma altyapısının iyileştirilmesi.",
    stratejiler: [
      {
        strateji_id: 501,
        hedef_id: 5,
        strateji_kodu: "S-5.1",
        baslik: "Kentsel Şebeke Kayıplarının Azaltılması",
        eylemler: [
          {
            eylem_id: 9,
            strateji_id: 501,
            eylem_kodu: "E-5.1.1",
            tanim: "Belediye içme suyu şebekelerinde gelir getirmeyen su kayıp oranı %25 seviyesinin altına indirilecektir.",
            baslangic_yili: 2026,
            bitis_yili: 2030,
            koordinator_kurum: "TOB_SYGM",
            ilgili_kurumlar: ["SUKILER", "BELEDIYELER", "ILBANK"],
            gostergeler: [
              {
                gosterge_id: 9,
                eylem_id: 9,
                tanim: "Ortalama Kentsel Su Kayıp Oranı",
                tip: "ORANSAL_YUZDE",
                baz_deger: 32.2,
                hedef_deger: 25.0,
                birim: "%"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    hedef_id: 6,
    hedef_no: "HEDEF-6",
    baslik: "Havza Bazlı Bütünleşik Yönetim ve İzleme Ağı",
    aciklama: "Nehir havzası yönetim planları, taşkın yönetim planları ve kuraklık yönetim planlarının entegrasyonu.",
    stratejiler: [
      {
        strateji_id: 601,
        hedef_id: 6,
        strateji_kodu: "S-6.1",
        baslik: "Bütünleşik Havza İzleme İstasyonları",
        eylemler: [
          {
            eylem_id: 10,
            strateji_id: 601,
            eylem_kodu: "E-6.1.1",
            tanim: "Bütünleşik su kalitesi ve debi ölçüm istasyonları kurulacak, USBS'ye otomatik veri aktarımı sağlanacaktır.",
            baslangic_yili: 2026,
            bitis_yili: 2029,
            koordinator_kurum: "TOB_SYGM",
            ilgili_kurumlar: ["TOB_DSI", "CSIDB_CED", "TUBITAK"],
            gostergeler: [
              {
                gosterge_id: 10,
                eylem_id: 10,
                tanim: "Entegre Online İstasyon Sayısı",
                tip: "NUMERIK",
                baz_deger: 450,
                hedef_deger: 1200,
                birim: "İstasyon"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    hedef_id: 7,
    hedef_no: "HEDEF-7",
    baslik: "Ulusal Su Bilgi Sistemi (USBS) ve Dijital Dönüşüm",
    aciklama: "Tüm su verilerinin tek çatı altında toplanması, CBS ve yapay zeka tabanlı karar destek modellerinin geliştirilmesi.",
    stratejiler: [
      {
        strateji_id: 701,
        hedef_id: 7,
        strateji_kodu: "S-7.1",
        baslik: "USBS Entegrasyonu ve Veri Standardizasyonu",
        eylemler: [
          {
            eylem_id: 11,
            strateji_id: 701,
            eylem_kodu: "E-7.1.1",
            tanim: "Tüm paydaş kurumların su verileri USBS API servisleri üzerinden tek veri tabanında birleştirilecektir.",
            baslangic_yili: 2026,
            bitis_yili: 2027,
            koordinator_kurum: "TOB_SYGM",
            ilgili_kurumlar: ["TOB_DSI", "SUKILER", "MGM", "TUBITAK_BILGEM"],
            gostergeler: [
              {
                gosterge_id: 11,
                eylem_id: 11,
                tanim: "USBS'ye Tam Entegre Kurum Sayısı",
                tip: "NUMERIK",
                baz_deger: 12,
                hedef_deger: 48,
                birim: "Kurum"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    hedef_id: 8,
    hedef_no: "HEDEF-8",
    baslik: "Su Bilinci, Toplumsal Katılım ve Uluslararası İşbirliği",
    aciklama: "Su verimliliği seferberliği eğitimleri, su ayak izi farkındalığı ve sınır aşan sularda aktif diplomasi.",
    stratejiler: [
      {
        strateji_id: 801,
        hedef_id: 8,
        strateji_kodu: "S-8.1",
        baslik: "Toplumsal Su Verimliliği Seferberliği",
        eylemler: [
          {
            eylem_id: 12,
            strateji_id: 801,
            eylem_kodu: "E-8.1.1",
            tanim: "Okullarda ve kamu kurumlarında su verimliliği eğitim modülleri zorunlu hale getirilecektir.",
            baslangic_yili: 2026,
            bitis_yili: 2030,
            koordinator_kurum: "TOB_SYGM",
            ilgili_kurumlar: ["MEB", "YOK", "DISE_BAK"],
            gostergeler: [
              {
                gosterge_id: 12,
                eylem_id: 12,
                tanim: "Eğitilen Öğrenci ve Personel Sayısı",
                tip: "NUMERIK",
                baz_deger: 120000,
                hedef_deger: 1500000,
                birim: "Kişi"
              }
            ]
          }
        ]
      }
    ]
  }
];
