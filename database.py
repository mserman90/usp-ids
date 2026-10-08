"""
USP-İDS (Ulusal Su Planı İzleme ve Değerlendirme Bilgi Sistemi)
Veri Tabanı Katmanı ve Başlangıç Veri Tohumlayıcısı (Database & Seeder)
"""

import sqlite3
import json
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "usp_ids.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    conn = get_connection()
    cur = conn.cursor()

    # 1. hedef
    cur.execute("""
    CREATE TABLE IF NOT EXISTS hedef (
        hedef_id INTEGER PRIMARY KEY AUTOINCREMENT,
        hedef_no TEXT NOT NULL UNIQUE,
        baslik TEXT NOT NULL,
        aciklama TEXT,
        aktif INTEGER DEFAULT 1,
        olusturma_tarihi TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. strateji
    cur.execute("""
    CREATE TABLE IF NOT EXISTS strateji (
        strateji_id INTEGER PRIMARY KEY AUTOINCREMENT,
        hedef_id INTEGER NOT NULL REFERENCES hedef(hedef_id),
        strateji_kodu TEXT NOT NULL UNIQUE,
        baslik TEXT NOT NULL,
        aciklama TEXT,
        olusturma_tarihi TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 3. eylem (141 Eylem Listesi)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS eylem (
        eylem_id INTEGER PRIMARY KEY AUTOINCREMENT,
        strateji_id INTEGER NOT NULL REFERENCES strateji(strateji_id),
        eylem_kodu TEXT NOT NULL UNIQUE,
        eylem_tanimi TEXT NOT NULL,
        baslangic_yili INTEGER NOT NULL,
        bitis_yili INTEGER NOT NULL,
        genel_durum TEXT DEFAULT 'BASLAMADI', -- 'BASLAMADI', 'DEVAM_EDIYOR', 'TAMAMLANDI', 'RISKLI'
        havza_kodu TEXT, -- İlgili pilot/odak havza varsa
        olusturma_tarihi TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 4. kurum
    cur.execute("""
    CREATE TABLE IF NOT EXISTS kurum (
        kurum_id INTEGER PRIMARY KEY AUTOINCREMENT,
        kurum_kodu TEXT NOT NULL UNIQUE,
        kurum_adi TEXT NOT NULL,
        kurum_turu TEXT NOT NULL, -- 'BAKANLIK', 'GENEL_MUDURLUK', 'SUKI', 'BELEDIYE', 'UNIVERSITE', vb.
        iletisim_eposta TEXT NOT NULL,
        telefon TEXT,
        aktif INTEGER DEFAULT 1
    );
    """)

    # 5. eylem_kurum_iliski
    cur.execute("""
    CREATE TABLE IF NOT EXISTS eylem_kurum_iliski (
        iliski_id INTEGER PRIMARY KEY AUTOINCREMENT,
        eylem_id INTEGER NOT NULL REFERENCES eylem(eylem_id) ON DELETE CASCADE,
        kurum_id INTEGER NOT NULL REFERENCES kurum(kurum_id),
        rol_turu TEXT NOT NULL, -- 'KOORDINATOR_SORUMLU', 'ORTAK_SORUMLU', 'ILGILI_KURUM'
        UNIQUE(eylem_id, kurum_id)
    );
    """)

    # 6. gosterge
    cur.execute("""
    CREATE TABLE IF NOT EXISTS gosterge (
        gosterge_id INTEGER PRIMARY KEY AUTOINCREMENT,
        eylem_id INTEGER NOT NULL REFERENCES eylem(eylem_id) ON DELETE CASCADE,
        gosterge_tanimi TEXT NOT NULL,
        gosterge_tipi TEXT NOT NULL, -- 'NUMERIK', 'ORANSAL_YUZDE', 'KILOMETRE_TASI'
        hedef_deger REAL,
        baslangic_degeri REAL DEFAULT 0.0,
        olcu_birimi TEXT,
        izleme_frekansi TEXT DEFAULT 'YILLIK'
    );
    """)

    # 7. izleme_donemi
    cur.execute("""
    CREATE TABLE IF NOT EXISTS izleme_donemi (
        donem_id INTEGER PRIMARY KEY AUTOINCREMENT,
        donem_adi TEXT NOT NULL,
        yil INTEGER NOT NULL,
        baslangic_tarihi TEXT NOT NULL,
        bitis_tarihi TEXT NOT NULL,
        durum TEXT DEFAULT 'ACIK', -- 'ACIK', 'DEGERLENDIRMEDE', 'KILITLI'
        resmi_rapor_periyodu INTEGER DEFAULT 0
    );
    """)

    # 8. gosterge_gerceklesme
    cur.execute("""
    CREATE TABLE IF NOT EXISTS gosterge_gerceklesme (
        gerceklesme_id INTEGER PRIMARY KEY AUTOINCREMENT,
        gosterge_id INTEGER NOT NULL REFERENCES gosterge(gosterge_id),
        kurum_id INTEGER NOT NULL REFERENCES kurum(kurum_id),
        donem_id INTEGER NOT NULL REFERENCES izleme_donemi(donem_id),
        girilen_deger REAL NOT NULL,
        kumulatif_deger REAL,
        aciklama TEXT,
        sapma_gerekcesi TEXT,
        onleyici_tedbir TEXT,
        onay_durumu TEXT DEFAULT 'TASLAK', -- 'TASLAK', 'SORUMLU_ONAYINDA', 'SYGM_ONAYINDA', 'ONAYLANDI', 'IADE'
        iade_gerekcesi TEXT,
        kayit_tarihi TEXT DEFAULT CURRENT_TIMESTAMP,
        guncelleme_tarihi TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(gosterge_id, donem_id, kurum_id)
    );
    """)

    # 9. gerceklesme_kanit
    cur.execute("""
    CREATE TABLE IF NOT EXISTS gerceklesme_kanit (
        kanit_id INTEGER PRIMARY KEY AUTOINCREMENT,
        gerceklesme_id INTEGER NOT NULL REFERENCES gosterge_gerceklesme(gerceklesme_id) ON DELETE CASCADE,
        dosya_adi TEXT NOT NULL,
        dosya_yolu TEXT NOT NULL,
        dosya_hash_sha256 TEXT NOT NULL,
        belge_turu TEXT NOT NULL, -- 'RESMI_YAZI', 'RESMI_GAZETE', 'TUTANAK', 'RAPOR', 'CBS_KATMANI'
        resmi_gazete_sayi TEXT,
        resmi_gazete_tarih TEXT,
        yukleme_tarihi TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 10. su_kurulu_karar
    cur.execute("""
    CREATE TABLE IF NOT EXISTS su_kurulu_karar (
        karar_id INTEGER PRIMARY KEY AUTOINCREMENT,
        kurul_turu TEXT NOT NULL, -- 'ULUSAL_SU_KURULU', 'HAVZA_SU_KURULU', 'IL_SU_KURULU'
        havza_kodu TEXT, -- Örn: 'SUSURLUK', 'GEDIZ', 'KONYA_KAPALI'
        il_kodu TEXT,
        toplanti_tarihi TEXT NOT NULL,
        karar_no TEXT NOT NULL,
        karar_metni TEXT NOT NULL,
        ilgili_eylem_id INTEGER REFERENCES eylem(eylem_id),
        uygulama_durumu TEXT DEFAULT 'TAKIPTE', -- 'UYGULANDI', 'DEVAM_EDIYOR', 'UYGULANAMADI', 'TAKIPTE'
        tamamlanma_orani REAL DEFAULT 0.0,
        son_kontrol_tarihi TEXT
    );
    """)

    # 11. sistem_denetim_kaydi (Audit Trail)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS sistem_denetim_kaydi (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        islem_zamani TEXT DEFAULT CURRENT_TIMESTAMP,
        kullanici_rol TEXT,
        kurum_kodu TEXT,
        ip_adresi TEXT,
        tablo_adi TEXT NOT NULL,
        islem_turu TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'ONAY', 'IADE'
        kayit_id TEXT,
        islem_detayi TEXT
    );
    """)

    conn.commit()
    conn.close()

def seed_data():
    conn = get_connection()
    cur = conn.cursor()

    # Kontrol et, veri varsa tekrar tohumlama yapma
    cur.execute("SELECT COUNT(*) FROM hedef")
    if cur.fetchone()[0] > 0:
        conn.close()
        return

    print("Veri tohumlama baslatiliyor...")

    # 1. HEDEFLER (8 Temel Hedef)
    hedefler = [
        ("HEDEF-1", "Su Yönetiminde Kurumsal ve Yasal Yapının Güçlendirilmesi", "Su Kanunu ve Taşkın Kanununun çıkarılması, su kurullarının etkin işletilmesi ve mükerrerliklerin önlenmesi."),
        ("HEDEF-2", "Su Kaynaklarının Miktar ve Kalite Olarak Korunması ve Sürdürülebilir Kullanımı", "Yeraltı ve yerüstü su kütlelerinin iyi su durumuna ulaştırılması, tahsis planlaması ve kirlilik kontrolü."),
        ("HEDEF-3", "İklim Değişikliğine Uyum ve Su Verimliliğinin Artırılması", "Tarımsal sulamada modernizasyon, sanayide ve kentsel kullanımda su kayıplarının azaltılması ve yeniden kullanım."),
        ("HEDEF-4", "Taşkın ve Kuraklık Yönetimi ile Afet Risklerinin Azaltılması", "Erken uyarı sistemleri, taşkın yönetim planları, kuraklık kriz planları ve yeşil altyapı uygulamaları."),
        ("HEDEF-5", "Su Temini, Dağıtımı ve Arıtma Altyapısının Geliştirilmesi", "İçme suyu arıtma tesisleri, kayıp-kaçak oranlarının %25 ve altına indirilmesi ve ileri atıksu arıtımı."),
        ("HEDEF-6", "Havza Bazlı Bütünleşik Su Yönetimi ve İzleme Ağı", "25 Nehir Havzasında nehir havza yönetim planları, sektörel su tahsisleri ve izleme istasyonları entegrasyonu."),
        ("HEDEF-7", "Su Bilgi Sistemi, Dijitalleşme, Ar-Ge ve İnovasyon", "Ulusal Su Bilgi Sistemi (USBS) tam entegrasyonu, yapay zekâ destekli su bütçesi ve yerli teknolojiler."),
        ("HEDEF-8", "Su Bilinci, Katılımcılık ve Uluslararası İşbirliği", "Su verimliliği seferberliği, kamuoyu farkındalığı, sınır aşan sularda hakkaniyetli işbirliği.")
    ]
    cur.executemany("INSERT INTO hedef (hedef_no, baslik, aciklama) VALUES (?, ?, ?)", hedefler)

    # 2. STRATEJİLER (Örnek Temsilî 12 Strateji)
    stratejiler = [
        (1, "S-1.1", "Su Kanunu ve İlgili Mevzuatın Yürürlüğe Konulması", "Bütünleşik su yönetimini güvence altına alacak yasal çerçevenin tamamlanması."),
        (1, "S-1.2", "Ulusal, Havza ve İl Su Kurullarının Etkinliğinin Artırılması", "Kurul kararlarının uygulanma ve takip mekanizmasının dijitalleştirilmesi."),
        (2, "S-2.1", "Yeraltı Su Seviyelerinin Korunması ve Kaçak Kuyuların Kontrolü", "Tahsis dışı çekimlerin önlenmesi ve debi izleme sistemlerinin kurulumu."),
        (2, "S-2.2", "Noktasal ve Yayılı Kirletici Kaynakların Kontrolü", "Nitrat eylem planları ve sanayi atıksu deşarjlarının çevrimiçi denetimi."),
        (3, "S-3.1", "Tarımsal Sulamada Basınçlı ve Kapalı Sistemlere Geçiş", "Geleneksel vahşi sulamanın terk edilmesi ve damla/yağmurlama oranının %75'e çıkarılması."),
        (3, "S-3.2", "Kentsel ve Sanayi Sektörlerinde Su Verimliliği Seferberliği", "Arıtılmış atıksuların gri su olarak geri kazanımı ve eko-verimlilik."),
        (4, "S-4.1", "Havza Bazlı Taşkın Tahmin ve Erken Uyarı Sistemlerinin Yaygınlaştırılması", "Meteorolojik ve hidrolojik radar ağlarının entegrasyonu."),
        (5, "S-5.1", "İçme Suyu Dağıtım Şebekelerinde Fiziki Su Kayıplarının Azaltılması", "SUKİ ve belediyelerde DMA (İzole Alt Bölge) ve basınç yönetimi sistemleri."),
        (6, "S-6.1", "25 Nehir Havzasında Nehir Havzası Yönetim Planlarının Güncellenmesi", "AB Su Çerçeve Direktifi ve ulusal hedeflere tam uyum."),
        (7, "S-7.1", "Ulusal Su Bilgi Sistemi'nin (USBS) Tüm Kamu Verilerine Açılması", "Bakanlıklar arası veri paylaşımı ve IoT sensör entegrasyonu."),
        (7, "S-7.2", "Yapay Zekâ Tabanlı Su Tahsis ve Kuraklık Tahmin Modelleri", "Optimum su dağıtımı için karar destek algoritmalarının geliştirilmesi."),
        (8, "S-8.1", "Su Verimliliği Kültürünün Yaygınlaştırılması ve Eğitim", "Milli Eğitim müfredatı, çiftçi eğitimleri ve kamu spotları.")
    ]
    cur.executemany("INSERT INTO strateji (hedef_id, strateji_kodu, baslik, aciklama) VALUES (?, ?, ?, ?)", stratejiler)

    # 3. KURUMLAR
    kurumlar = [
        ("TOB_SYGM", "T.C. Tarım ve Orman Bakanlığı - Su Yönetimi Genel Müdürlüğü", "GENEL_MUDURLUK", "sygm.izleme@tarimorman.gov.tr", "0312 458 8400"),
        ("TOB_DSI", "Devlet Su İşleri Genel Müdürlüğü", "GENEL_MUDURLUK", "strateji@dsi.gov.tr", "0312 454 5400"),
        ("CSIDB_CYGM", "Çevre, Şehircilik ve İklim Değişikliği Bak. - Çevre Yönetimi Gn. Md.", "GENEL_MUDURLUK", "cygm.su@csb.gov.tr", "0312 410 1000"),
        ("TOB_TRGM", "Tarımsal Reform Genel Müdürlüğü", "GENEL_MUDURLUK", "sulama@tarimorman.gov.tr", "0312 258 8000"),
        ("MGM", "Meteoroloji Genel Müdürlüğü", "GENEL_MUDURLUK", "hidrometeoroloji@mgm.gov.tr", "0312 359 7545"),
        ("ASKI", "Ankara Su ve Kanalizasyon İdaresi Genel Müdürlüğü", "SUKI", "su.kayiplari@aski.gov.tr", "0312 616 1000"),
        ("ISKI", "İstanbul Su ve Kanalizasyon İdaresi Genel Müdürlüğü", "SUKI", "ar-ge@iski.gov.tr", "0212 321 0000"),
        ("IZSU", "İzmir Su ve Kanalizasyon İdaresi Genel Müdürlüğü", "SUKI", "izleme@izsu.gov.tr", "0232 293 2000"),
        ("TBB", "Türkiye Belediyeler Birliği", "BELEDIYE", "cevre@tbb.gov.tr", "0312 419 2100"),
        ("TUBITAK_MAM", "TÜBİTAK Marmara Araştırma Merkezi Çevre Enstitüsü", "UNIVERSITE", "mam.cevre@tubitak.gov.tr", "0262 677 2000"),
        ("AFAD", "Afet ve Acil Durum Yönetimi Başkanlığı", "BAKANLIK", "taskin.risk@afad.gov.tr", "0312 258 2323")
    ]
    cur.executemany("INSERT INTO kurum (kurum_kodu, kurum_adi, kurum_turu, iletisim_eposta, telefon) VALUES (?, ?, ?, ?, ?)", kurumlar)

    # 4. EYLEMLER (Temsilî ve Resmî Ulusal Su Planı Odaklı 14 Eylem)
    eylemler = [
        (1, "E-1.1.1", "Taslak Su Kanunu'nun TBMM'ye sevk edilerek yasalaşması sağlanacaktır.", 2026, 2027, "DEVAM_EDIYOR", None),
        (2, "E-1.2.1", "Ulusal Su Kurulu, 25 Havza Su Kurulu ve 81 İl Su Kurulu kararlarının dijital izleme platformu üzerinden düzenli takibi yapılacaktır.", 2026, 2035, "DEVAM_EDIYOR", None),
        (3, "E-2.1.1", "Tüm nehir havzalarında yeraltı suyu tahsis miktarları belirlenecek ve kaçak kuyuların kapatılması/kayıt altına alınması tamamlanacaktır.", 2026, 2028, "RISKLI", "KONYA_KAPALI"),
        (4, "E-2.2.1", "Hassas su alanlarında tarımsal kaynaklı nitrat kirliliğinin izlenmesi için 2.500 istasyondan veri toplanacaktır.", 2026, 2030, "DEVAM_EDIYOR", "GEDIZ"),
        (5, "E-3.1.1", "Modern basınçlı sulama sistemine sahip tarımsal alan oranı %40'tan %65'e çıkarılacaktır.", 2026, 2030, "DEVAM_EDIYOR", "FIRAT"),
        (6, "E-3.2.1", "Büyükşehirlerde ve sanayi bölgelerinde arıtılmış kentsel atıksuların yeniden kullanım oranı %15'e yükseltilecektir.", 2026, 2028, "RISKLI", "MARMARA"),
        (7, "E-4.1.1", "25 Nehir Havzasında taşkın erken uyarı radarları ve hidrolojik tahmin modeli aktif edilecektir.", 2026, 2028, "TAMAMLANDI", "BATI_KARADENIZ"),
        (8, "E-5.1.1", "Büyükşehir belediyelerinde içme suyu şebekelerindeki fiziksel su kayıp oranı %25'in altına düşürülecektir.", 2026, 2030, "DEVAM_EDIYOR", "SUSURLUK"),
        (9, "E-6.1.1", "25 Nehir Havzasının tamamında 2. Döngü Nehir Havza Yönetim Planları hazırlanarak yürürlüğe girecektir.", 2026, 2028, "DEVAM_EDIYOR", None),
        (10, "E-7.1.1", "Ulusal Su Bilgi Sistemi (USBS) ile SUKİ'ler ve DSİ scada sistemleri arasında iki yönlü API entegrasyonu kurulacaktır.", 2026, 2027, "DEVAM_EDIYOR", None),
        (11, "E-7.2.1", "Konya Kapalı ve Gediz havzalarında pilot yapay zekâ tabanlı kuraklık risk ve tahsis simülasyon motoru devreye alınacaktır.", 2026, 2028, "DEVAM_EDIYOR", "KONYA_KAPALI"),
        (12, "E-8.1.1", "81 ilde 1.000.000 öğrenci ve 150.000 çiftçiye yönelik 'Su Verimliliği Seferberliği' eğitimleri verilecektir.", 2026, 2035, "DEVAM_EDIYOR", None),
        (1, "E-1.1.2", "Su Verimliliği Yönetmeliği ve Su Tahsis Yönetmeliği güncellenerek yürürlüğe konulacaktır.", 2026, 2026, "TAMAMLANDI", None),
        (8, "E-5.1.2", "Kayıp-kaçak oranı %35'in üzerinde olan 30 ilçe belediyesinde DMA (İzole Sayaç Bölgesi) altyapısı kurulacaktır.", 2026, 2027, "RISKLI", "DICLE")
    ]
    cur.executemany("""
        INSERT INTO eylem (strateji_id, eylem_kodu, eylem_tanimi, baslangic_yili, bitis_yili, genel_durum, havza_kodu)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, eylemler)

    # 5. EYLEM-KURUM İLİŞKİLERİ (Koordinatör * ve İlgili Kurumlar)
    # Kurum ID'leri:
    # 1: TOB_SYGM, 2: TOB_DSI, 3: CSIDB_CYGM, 4: TOB_TRGM, 5: MGM, 6: ASKI, 7: ISKI, 8: IZSU, 9: TBB, 10: TUBITAK_MAM, 11: AFAD
    iliski_kayitlari = [
        # E-1.1.1 Su Kanunu (Koord: SYGM, İlgili: DSI, CSIDB)
        (1, 1, "KOORDINATOR_SORUMLU"), (1, 2, "ORTAK_SORUMLU"), (1, 3, "ILGILI_KURUM"),
        # E-1.2.1 Kurul Kararları (Koord: SYGM, İlgili: DSI, TBB)
        (2, 1, "KOORDINATOR_SORUMLU"), (2, 2, "ORTAK_SORUMLU"), (2, 9, "ILGILI_KURUM"),
        # E-2.1.1 Yeraltı Suyu Kaçak Kuyu (Koord: DSI, İlgili: SYGM, TRGM)
        (3, 2, "KOORDINATOR_SORUMLU"), (3, 1, "ORTAK_SORUMLU"), (3, 4, "ILGILI_KURUM"),
        # E-2.2.1 Nitrat Kirliliği (Koord: SYGM, İlgili: TRGM, CSIDB)
        (4, 1, "KOORDINATOR_SORUMLU"), (4, 4, "ORTAK_SORUMLU"), (4, 3, "ILGILI_KURUM"),
        # E-3.1.1 Basınçlı Sulama (Koord: DSI, İlgili: TRGM)
        (5, 2, "KOORDINATOR_SORUMLU"), (5, 4, "ORTAK_SORUMLU"),
        # E-3.2.1 Gri Su Yeniden Kullanım (Koord: CSIDB, İlgili: SYGM, ISKI, ASKI, TBB)
        (6, 3, "KOORDINATOR_SORUMLU"), (6, 1, "ORTAK_SORUMLU"), (6, 7, "ILGILI_KURUM"), (6, 6, "ILGILI_KURUM"), (6, 9, "ILGILI_KURUM"),
        # E-4.1.1 Taşkın Erken Uyarı (Koord: SYGM, İlgili: MGM, DSI, AFAD)
        (7, 1, "KOORDINATOR_SORUMLU"), (7, 5, "ORTAK_SORUMLU"), (7, 2, "ORTAK_SORUMLU"), (7, 11, "ILGILI_KURUM"),
        # E-5.1.1 Kayıp Kaçak < %25 (Koord: SYGM, İlgili: TBB, ASKI, ISKI, IZSU)
        (8, 1, "KOORDINATOR_SORUMLU"), (8, 9, "ORTAK_SORUMLU"), (8, 6, "ILGILI_KURUM"), (8, 7, "ILGILI_KURUM"), (8, 8, "ILGILI_KURUM"),
        # E-6.1.1 2. Döngü NHYP (Koord: SYGM, İlgili: DSI, TUBITAK_MAM)
        (9, 1, "KOORDINATOR_SORUMLU"), (9, 2, "ORTAK_SORUMLU"), (9, 10, "ILGILI_KURUM"),
        # E-7.1.1 USBS Entegrasyonu (Koord: SYGM, İlgili: DSI, ASKI, ISKI)
        (10, 1, "KOORDINATOR_SORUMLU"), (10, 2, "ILGILI_KURUM"), (10, 6, "ILGILI_KURUM"),
        # E-7.2.1 YZ Kuraklık Modeli (Koord: SYGM, İlgili: TUBITAK_MAM, MGM)
        (11, 1, "KOORDINATOR_SORUMLU"), (11, 10, "ORTAK_SORUMLU"), (11, 5, "ILGILI_KURUM"),
        # E-8.1.1 Su Seferberliği Eğitimi (Koord: SYGM, İlgili: TRGM, TBB)
        (12, 1, "KOORDINATOR_SORUMLU"), (12, 4, "ILGILI_KURUM"), (12, 9, "ILGILI_KURUM"),
        # E-1.1.2 Su Yönetmelikleri (Koord: SYGM)
        (13, 1, "KOORDINATOR_SORUMLU"),
        # E-5.1.2 DMA Kurulumu (Koord: TBB, İlgili: SYGM, DSI)
        (14, 9, "KOORDINATOR_SORUMLU"), (14, 1, "ORTAK_SORUMLU"), (14, 2, "ILGILI_KURUM")
    ]
    cur.executemany("INSERT INTO eylem_kurum_iliski (eylem_id, kurum_id, rol_turu) VALUES (?, ?, ?)", iliski_kayitlari)

    # 6. GÖSTERGELER
    gostergeler = [
        (1, "Su Kanununun Yürürlüğe Girmesi", "KILOMETRE_TASI", 1.0, 0.0, "Kanun"),
        (2, "Uygulamaya Geçen Su Kurulu Kararı Oranı", "ORANSAL_YUZDE", 85.0, 40.0, "%"),
        (3, "Kayıt Altına Alınan ve Ölçüm Takılan Yeraltı Su Kuyusu Oranı", "ORANSAL_YUZDE", 80.0, 25.0, "%"),
        (4, "İzlenen Nitrat İstasyonu Sayısı", "NUMERIK", 2500.0, 800.0, "Adet İstasyon"),
        (5, "Basınçlı Borulu Sulama Şebekesi Oranı", "ORANSAL_YUZDE", 65.0, 38.0, "%"),
        (6, "Geri Kazanılan Arıtılmış Atıksu Oranı", "ORANSAL_YUZDE", 15.0, 4.2, "%"),
        (7, "Kurulan Taşkın Erken Uyarı Radarları Sayısı", "NUMERIK", 18.0, 18.0, "Adet Radar"),
        (8, "Büyükşehirlerde Ortalama Su Kayıp-Kaçak Oranı", "ORANSAL_YUZDE", 25.0, 34.0, "%"),
        (9, "Tamamlanan 2. Döngü Nehir Havzası Yönetim Planı Sayısı", "NUMERIK", 25.0, 8.0, "Adet Havza"),
        (10, "USBS'ye Gerçek Zamanlı Veri Aktaran Kurum Oranı", "ORANSAL_YUZDE", 100.0, 45.0, "%"),
        (11, "Yapay Zekâ Kuraklık Tahmin Modeli Doğruluk Skoru", "ORANSAL_YUZDE", 90.0, 68.0, "%"),
        (12, "Eğitilen Öğrenci ve Çiftçi Sayısı (Kümülatif)", "NUMERIK", 1150000.0, 280000.0, "Kişi"),
        (13, "Yayımlanan Su Verimliliği Yönetmelik Sayısı", "KILOMETRE_TASI", 2.0, 2.0, "Yönetmelik"),
        (14, "Tamamlanan DMA (İzole Alt Bölge) Sayısı", "NUMERIK", 300.0, 65.0, "Bölge")
    ]
    cur.executemany("""
        INSERT INTO gosterge (eylem_id, gosterge_tanimi, gosterge_tipi, hedef_deger, baslangic_degeri, olcu_birimi)
        VALUES (?, ?, ?, ?, ?, ?)
    """, gostergeler)

    # 7. İZLEME DÖNEMLERİ
    donemler = [
        ("2026 Yıllık İzleme", 2026, "2026-01-01", "2026-12-31", "ACIK", 0),
        ("2026-2027 İki Yıllık Değerlendirme (USUK)", 2027, "2026-01-01", "2027-12-31", "DEGERLENDIRMEDE", 1),
        ("2028-2029 İki Yıllık Değerlendirme", 2029, "2028-01-01", "2029-12-31", "KILITLI", 1)
    ]
    cur.executemany("""
        INSERT INTO izleme_donemi (donem_adi, yil, baslangic_tarihi, bitis_tarihi, durum, resmi_rapor_periyodu)
        VALUES (?, ?, ?, ?, ?, ?)
    """, donemler)

    # 8. GÖSTERGE GERÇEKLEŞME KAYITLARI & İŞ AKIŞLARI
    gerceklesmeler = [
        # Gosterge 1: Su Kanunu (SYGM - Taslak aşamada komisyonda)
        (1, 1, 1, 0.5, 0.5, "Su Kanunu Taslağı ilgili bakanlıkların görüşlerine açılmış olup Adalet ve Çevre Bakanlığı mutabakatı beklenmektedir.", "Mevzuat görüşlerinin uzaması", "Bakanlıklar arası özel çalışma komisyonu toplandı.", "SORUMLU_ONAYINDA", None),
        # Gosterge 2: Karar oranı (SYGM - Onaylı)
        (2, 1, 1, 62.5, 62.5, "2026 yılı 1. ve 2. dönem kurul kararlarından 48 adedi sahada uygulamaya geçirilmiştir.", None, None, "ONAYLANDI", None),
        # Gosterge 3: Kaçak kuyu (DSI - Riskli, İade edilmiş)
        (3, 2, 1, 35.0, 35.0, "Konya Kapalı Havzasında 12.000 kuyuya debimetre takılması hedeflenmiş, bütçe kısıtı nedeniyle 4.200 kuyu tamamlanabilmiştir.", "Ödenek ve saha sayaç temin gecikmesi", "2027 bütçesinde ek ödenek talep edildi.", "IADE", "Sahadaki sayaç muayene tutanakları ve mühür belgeleri sisteme yüklenmediğinden revize edilmek üzere iade edilmiştir."),
        # Gosterge 6: Gri Su (CSIDB - Sorumlu onayında)
        (6, 3, 1, 6.8, 6.8, "İstanbul ve Ankara'da toplam 4 arıtma tesisinde gri su geri kazanım ünitesi devreye alındı.", "Belediye şebeke bağlantı gecikmeleri", "SUKİ koordinasyon toplantısı düzenlenecektir.", "SYGM_ONAYINDA", None),
        # Gosterge 7: Taşkın Radar (SYGM - Onaylı)
        (7, 1, 1, 18.0, 18.0, "18 adet hidrolojik erken uyarı radarı ve istasyonu B.Karadeniz ve D.Karadeniz havzalarında devreye alınarak USBS'ye bağlandı.", None, None, "ONAYLANDI", None),
        # Gosterge 8: Su Kayıp Kaçak (ASKI - İlgili Kurumdan Sorumlu Kurum Onayına sunulmuş)
        (8, 6, 1, 31.2, 31.2, "Ankara genelinde 42 izole sayaç bölgesi kurularak su kayıp oranı %34'ten %31.2'ye düşürüldü.", None, None, "SORUMLU_ONAYINDA", None),
        # Gosterge 13: Yönetmelikler (SYGM - Onaylı Tamamlandı)
        (13, 1, 1, 2.0, 2.0, "Su Verimliliği Yönetmeliği Resmî Gazete'de yayımlanarak yürürlüğe girdi.", None, None, "ONAYLANDI", None)
    ]
    cur.executemany("""
        INSERT INTO gosterge_gerceklesme (gosterge_id, kurum_id, donem_id, girilen_deger, kumulatif_deger, aciklama, sapma_gerekcesi, onleyici_tedbir, onay_durumu, iade_gerekcesi)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, gerceklesmeler)

    # 9. GERÇEKLEŞME KANITLARI (Belgeler, SHA256)
    kanitlar = [
        (2, "USUK_2026_Karar_Tutanagi.pdf", "/uploads/kanitlar/USUK_2026_Karar_Tutanagi.pdf", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "TUTANAK", "2026/1", "2026-04-15"),
        (5, "Resmi_Gazete_Taskin_Sistem_Acilis.pdf", "/uploads/kanitlar/Resmi_Gazete_Taskin.pdf", "a6c8e31a98fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852cd19", "RESMI_GAZETE", "32890", "2026-06-20"),
        (7, "Su_Verimliligi_Yonetmeligi_RG.pdf", "/uploads/kanitlar/Su_Verimliligi_RG.pdf", "9f83c12298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852ab41", "RESMI_GAZETE", "32712", "2026-02-10"),
        (6, "ASKI_DMA_Performans_Raporu.pdf", "/uploads/kanitlar/ASKI_DMA_Raporu.pdf", "3d4f8a9298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852fe88", "RAPOR", "2026-Teknik-04", "2026-09-30")
    ]
    cur.executemany("""
        INSERT INTO gerceklesme_kanit (gerceklesme_id, dosya_adi, dosya_yolu, dosya_hash_sha256, belge_turu, resmi_gazete_sayi, resmi_gazete_tarih)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, kanitlar)

    # 10. SU KURULLARI KARARLARI (USUK, Havza ve İl Su Kurulları)
    kararlar = [
        ("ULUSAL_SU_KURULU", None, None, "2026-03-20", "USUK-2026/01", "Tüm nehir havzalarında kuraklık eylem planlarının revize edilmesi ve su kayıp-kaçak oranlarının izlenmesi.", 2, "UYGULANDI", 100.0, "2026-09-01"),
        ("HAVZA_SU_KURULU", "KONYA_KAPALI", "42", "2026-04-12", "HSK-KNY-2026/04", "Konya Kapalı Havzasında kaçak tarımsal kuyu açılmasının önlenmesi için kolluk kuvvetleriyle ortak denetim başlatılması.", 3, "DEVAM_EDIYOR", 55.0, "2026-09-15"),
        ("HAVZA_SU_KURULU", "GEDIZ", "35", "2026-05-18", "HSK-GDZ-2026/02", "Gediz Havzası organize sanayi bölgelerinde su geri kazanım tesislerinin zorunlu kılınması.", 6, "DEVAM_EDIYOR", 70.0, "2026-08-20"),
        ("HAVZA_SU_KURULU", "SUSURLUK", "16", "2026-06-05", "HSK-SSR-2026/01", "Nilüfer Çayı kirliliğinin önlenmesi amacıyla arıtma tesisi deşarj standartlarının sıkılaştırılması.", 4, "UYGULANDI", 100.0, "2026-09-10"),
        ("IL_SU_KURULU", "MARMARA", "34", "2026-02-14", "ISK-IST-2026/03", "İstanbul genelinde park ve bahçe sulamalarında arıtılmış gri su kullanımına geçilmesi.", 6, "UYGULANDI", 95.0, "2026-09-01"),
        ("IL_SU_KURULU", "BATI_KARADENIZ", "74", "2026-05-10", "ISK-BRT-2026/02", "Bartın Çayı taşkın erken uyarı sensörlerinin dere yataklarına montajı.", 7, "UYGULANDI", 100.0, "2026-07-01"),
        ("HAVZA_SU_KURULU", "DICLE", "21", "2026-07-22", "HSK-DCL-2026/05", "Dicle Havzası sulama birliklerinde ön ödemeli sayaç sistemine geçiş kararı.", 14, "TAKIPTE", 30.0, "2026-09-25")
    ]
    cur.executemany("""
        INSERT INTO su_kurulu_karar (kurul_turu, havza_kodu, il_kodu, toplanti_tarihi, karar_no, karar_metni, ilgili_eylem_id, uygulama_durumu, tamamlanma_orani, son_kontrol_tarihi)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, kararlar)

    # 11. AUDIT LOG (İlk Sistem Günlüğü)
    audit_init = [
        ("SYGM_YONETICI", "TOB_SYGM", "127.0.0.1", "hedef", "INSERT", "ALL", "Ulusal Su Planı (2026-2035) 8 Hedef ve 141 Eylem ana omurgası sisteme yüklendi."),
        ("SYGM_YONETICI", "TOB_SYGM", "127.0.0.1", "izleme_donemi", "INSERT", "1", "2026 Yıllık İzleme dönemi veri girişine açıldı."),
        ("SORUMLU_KURUM", "TOB_DSI", "192.168.1.45", "gosterge_gerceklesme", "UPDATE", "3", "Konya YAS kuyusu gerçekleşme verisi girildi."),
        ("SYGM_UZMAN", "TOB_SYGM", "127.0.0.1", "gosterge_gerceklesme", "IADE", "3", "Eksik kanıt gerekçesiyle kayıt sorumlu kuruma iade edildi.")
    ]
    cur.executemany("""
        INSERT INTO sistem_denetim_kaydi (kullanici_rol, kurum_kodu, ip_adresi, tablo_adi, islem_turu, kayit_id, islem_detayi)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, audit_init)

    conn.commit()
    conn.close()
    print("Veri tohumlama basariyla tamamlandi.")

if __name__ == "__main__":
    init_db()
    seed_data()
