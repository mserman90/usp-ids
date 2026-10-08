"""
USP-İDS Erken Uyarı, Sapma Analizi ve Analitik Hesaplama Motoru (engine.py)
FR-05 (Karar Takip), FR-06 (Sapma & Erken Uyarı), FR-07 (CBS Havza), FR-08 (Raporlama)
"""

from database import get_connection

# 25 Nehir Havzası Resmi Listesi
HAVZALAR_LISTESI = [
    {"kod": "MERİC_ERGENE", "ad": "Meriç-Ergene Havzası", "bolge": "Marmara", "oncelik": "Kirlilik ve Taşkın"},
    {"kod": "MARMARA", "ad": "Marmara Havzası", "bolge": "Marmara", "oncelik": "Kentsel Baskı ve Sanayi"},
    {"kod": "SUSURLUK", "ad": "Susurluk Havzası", "bolge": "Marmara/Ege", "oncelik": "Tarımsal Kirlilik ve Tahsis"},
    {"kod": "KUZEY_EGE", "ad": "Kuzey Ege Havzası", "bolge": "Ege", "oncelik": "Kuraklık ve Tarımsal Su"},
    {"kod": "GEDIZ", "ad": "Gediz Havzası", "bolge": "Ege", "oncelik": "Aşırı Çekim ve Sanayi Atıksuyu"},
    {"kod": "KUCUK_MENDERES", "ad": "Küçük Menderes Havzası", "bolge": "Ege", "oncelik": "YAS Çekimi ve Nitrat"},
    {"kod": "BUYUK_MENDERES", "ad": "Büyük Menderes Havzası", "bolge": "Ege", "oncelik": "Jeotermal Deşarj ve Kuraklık"},
    {"kod": "BATI_AKDENIZ", "ad": "Batı Akdeniz Havzası", "bolge": "Akdeniz", "oncelik": "Eko-Turizm ve Kıyı Su Kalitesi"},
    {"kod": "ANTALYA", "ad": "Antalya Havzası", "bolge": "Akdeniz", "oncelik": "Yeraltı Suyu ve Kıyı Yönetimi"},
    {"kod": "BURDUR", "ad": "Burdur Gölü Havzası", "bolge": "Akdeniz/İç Anadolu", "oncelik": "Göl Kuruması ve Sulama"},
    {"kod": "AKARCAY", "ad": "Akarçay Havzası", "bolge": "İç Anadolu", "oncelik": "Kapalı Havza Su Bütçesi"},
    {"kod": "KONYA_KAPALI", "ad": "Konya Kapalı Havzası", "bolge": "İç Anadolu", "oncelik": "Obruklar, YAS ve Kuraklık"},
    {"kod": "DOGU_AKDENIZ", "ad": "Doğu Akdeniz Havzası", "bolge": "Akdeniz", "oncelik": "Kıyı Dinamikleri ve Su Tahsisi"},
    {"kod": "SEYHAN", "ad": "Seyhan Havzası", "bolge": "Akdeniz/İç Anadolu", "oncelik": "Tarımsal Sulama ve Taşkın"},
    {"kod": "CEYHAN", "ad": "Ceyhan Havzası", "bolge": "Akdeniz", "oncelik": "Endüstriyel Su ve Sulama"},
    {"kod": "ASI", "ad": "Asi Havzası", "bolge": "Akdeniz", "oncelik": "Sınır Aşan Sular ve Deprem İyileştirme"},
    {"kod": "FIRAT", "ad": "Fırat Havzası", "bolge": "Doğu/Güneydoğu", "oncelik": "GAP Sulaması ve Hidroelektrik"},
    {"kod": "DICLE", "ad": "Dicle Havzası", "bolge": "Güneydoğu", "oncelik": "Sulama Şebekesi ve Sınır Aşan Sular"},
    {"kod": "BATI_KARADENIZ", "ad": "Batı Karadeniz Havzası", "bolge": "Karadeniz", "oncelik": "Taşkın Erken Uyarı ve Heyelan"},
    {"kod": "YESILIRMAK", "ad": "Yeşilırmak Havzası", "bolge": "Karadeniz", "oncelik": "Erozyon ve Tarımsal Drenaj"},
    {"kod": "KIZILIRMAK", "ad": "Kızılırmak Havzası", "bolge": "İç Anadolu/Karadeniz", "oncelik": "Su Kıtlığı ve Çok Sektörlü Tahsis"},
    {"kod": "DOGU_KARADENIZ", "ad": "Doğu Karadeniz Havzası", "bolge": "Karadeniz", "oncelik": "Rüsubat ve Ani Taşkınlar"},
    {"kod": "CORUH", "ad": "Çoruh Havzası", "bolge": "Karadeniz/Doğu Anadolu", "oncelik": "Baraj Zincirleri ve Sediment"},
    {"kod": "ARAS", "ad": "Aras Havzası", "bolge": "Doğu Anadolu", "oncelik": "Sınır Aşan Sular ve Ekolojik Durum"},
    {"kod": "VAN_GOLU", "ad": "Van Gölü Kapalı Havzası", "bolge": "Doğu Anadolu", "oncelik": "Kapalı Göl Ekolojisi ve Arıtma"}
]

def calculate_early_warning(current_year=2026):
    """
    Şartname FR-06 Sapma Analizi ve Erken Uyarı Motoru
    🟢 Yeşil: Hedefe uygun / tamamlandı
    🟡 Sarı: Bitişine az kalmış veya %20-%40 sapma
    🔴 Kırmızı: Bitiş aşılmış veya >%40 sapma
    """
    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT 
        e.eylem_id, e.eylem_kodu, e.eylem_tanimi, e.baslangic_yili, e.bitis_yili, e.genel_durum, e.havza_kodu,
        s.strateji_kodu, s.baslik as strateji_baslik,
        h.hedef_no, h.baslik as hedef_baslik,
        g.gosterge_id, g.gosterge_tanimi, g.gosterge_tipi, g.hedef_deger, g.baslangic_degeri, g.olcu_birimi,
        k.kurum_adi as koordinator_kurum, k.kurum_kodu as koordinator_kodu,
        gg.girilen_deger, gg.kumulatif_deger, gg.onay_durumu, gg.sapma_gerekcesi, gg.onleyici_tedbir
    FROM eylem e
    JOIN strateji s ON e.strateji_id = s.strateji_id
    JOIN hedef h ON s.hedef_id = h.hedef_id
    LEFT JOIN gosterge g ON g.eylem_id = e.eylem_id
    LEFT JOIN eylem_kurum_iliski eki ON eki.eylem_id = e.eylem_id AND eki.rol_turu = 'KOORDINATOR_SORUMLU'
    LEFT JOIN kurum k ON eki.kurum_id = k.kurum_id
    LEFT JOIN (
        SELECT gosterge_id, MAX(girilen_deger) as girilen_deger, MAX(kumulatif_deger) as kumulatif_deger, 
               MAX(onay_durumu) as onay_durumu, MAX(sapma_gerekcesi) as sapma_gerekcesi, MAX(onleyici_tedbir) as onleyici_tedbir
        FROM gosterge_gerceklesme
        GROUP BY gosterge_id
    ) gg ON gg.gosterge_id = g.gosterge_id
    """
    cur.execute(query)
    rows = cur.fetchall()
    conn.close()

    results = []
    summary = {"YESIL": 0, "SARI": 0, "KIRMIZI": 0, "TOPLAM": 0}

    for r in rows:
        baslangic = r["baslangic_yili"]
        bitis = r["bitis_yili"]
        toplam_sure = max(1, bitis - baslangic + 1)
        gecen_sure = max(0, min(toplam_sure, current_year - baslangic + 1))
        
        # Teorik İlerleme (%)
        teorik_ilerleme = round((gecen_sure / toplam_sure) * 100, 1)

        hedef_val = r["hedef_deger"] or 100.0
        baslangic_val = r["baslangic_degeri"] or 0.0
        gerceklesen_val = r["kumulatif_deger"] if r["kumulatif_deger"] is not None else (r["girilen_deger"] or baslangic_val)

        # Gerçekleşme Oranı (%)
        if r["gosterge_tipi"] == "KILOMETRE_TASI":
            gerceklesme_orani = 100.0 if gerceklesen_val >= hedef_val else round((gerceklesen_val / hedef_val) * 100, 1)
        else:
            fark = hedef_val - baslangic_val
            if fark != 0:
                gerceklesme_orani = round(((gerceklesen_val - baslangic_val) / fark) * 100, 1)
            else:
                gerceklesme_orani = 100.0 if gerceklesen_val >= hedef_val else 0.0

        gerceklesme_orani = max(0.0, gerceklesme_orani)

        # Durum Analizi (FR-06)
        sapma = round(teorik_ilerleme - gerceklesme_orani, 1)
        kalan_yil = bitis - current_year

        if gerceklesme_orani >= 100.0 or r["genel_durum"] == "TAMAMLANDI":
            durum_kodu = "YESIL"
            durum_mesaj = "Eylem tamamlandı."
        elif sapma > 40.0 or (kalan_yil <= 0 and gerceklesme_orani < 100.0) or r["genel_durum"] == "RISKLI":
            durum_kodu = "KIRMIZI"
            durum_mesaj = f"Kritik sapma tespit edildi! (%{sapma} geride, bitişe {kalan_yil} yıl)."
        elif (kalan_yil <= 1 and gerceklesme_orani < 50.0) or (20.0 <= sapma <= 40.0):
            durum_kodu = "SARI"
            durum_mesaj = f"Gecikme riski: İlerleme teorik takvimin %{sapma} gerisinde."
        else:
            durum_kodu = "YESIL"
            durum_mesaj = "Hedefe ve takvime uygun ilerliyor."

        summary[durum_kodu] += 1
        summary["TOPLAM"] += 1

        results.append({
            "eylem_id": r["eylem_id"],
            "eylem_kodu": r["eylem_kodu"],
            "eylem_tanimi": r["eylem_tanimi"],
            "hedef_no": r["hedef_no"],
            "hedef_baslik": r["hedef_baslik"],
            "strateji_kodu": r["strateji_kodu"],
            "baslangic_yili": baslangic,
            "bitis_yili": bitis,
            "koordinator_kurum": r["koordinator_kurum"] or "TOB_SYGM",
            "koordinator_kodu": r["koordinator_kodu"] or "TOB_SYGM",
            "gosterge_tanimi": r["gosterge_tanimi"] or "-",
            "gosterge_tipi": r["gosterge_tipi"] or "NUMERIK",
            "hedef_deger": hedef_val,
            "gerceklesen_deger": gerceklesen_val,
            "olcu_birimi": r["olcu_birimi"] or "",
            "teorik_ilerleme": teorik_ilerleme,
            "gerceklesme_orani": gerceklesme_orani,
            "sapma": sapma,
            "durum_kodu": durum_kodu,
            "durum_mesaj": durum_mesaj,
            "onay_durumu": r["onay_durumu"] or "TASLAK",
            "sapma_gerekcesi": r["sapma_gerekcesi"],
            "onleyici_tedbir": r["onleyici_tedbir"],
            "havza_kodu": r["havza_kodu"]
        })

    return {"summary": summary, "items": results}

def get_basin_analytics():
    """
    25 Nehir Havzası CBS ve Gerçekleşme Verileri (FR-07)
    """
    conn = get_connection()
    cur = conn.cursor()

    # Kararları havzaya göre say
    cur.execute("""
        SELECT havza_kodu, COUNT(*) as karar_sayisi,
               SUM(CASE WHEN uygulama_durumu = 'UYGULANDI' THEN 1 ELSE 0 END) as uygulanan_karar,
               AVG(tamamlanma_orani) as ort_tamamlanma
        FROM su_kurulu_karar
        WHERE havza_kodu IS NOT NULL
        GROUP BY havza_kodu
    """)
    karar_map = {r["havza_kodu"]: dict(r) for r in cur.fetchall()}

    # Eylemleri havzaya göre eşle
    cur.execute("""
        SELECT havza_kodu, COUNT(*) as eylem_sayisi,
               SUM(CASE WHEN genel_durum = 'TAMAMLANDI' THEN 1 ELSE 0 END) as tamamlanan_eylem,
               SUM(CASE WHEN genel_durum = 'RISKLI' THEN 1 ELSE 0 END) as riskli_eylem
        FROM eylem
        WHERE havza_kodu IS NOT NULL
        GROUP BY havza_kodu
    """)
    eylem_map = {r["havza_kodu"]: dict(r) for r in cur.fetchall()}
    conn.close()

    basin_data = []
    for h in HAVZALAR_LISTESI:
        kod = h["kod"]
        k_info = karar_map.get(kod, {"karar_sayisi": 0, "uygulanan_karar": 0, "ort_tamamlanma": 0.0})
        e_info = eylem_map.get(kod, {"eylem_sayisi": 0, "tamamlanan_eylem": 0, "riskli_eylem": 0})
        
        # Simüle edilen havza gerçekleşme skoru (veri varsa ortalama, yoksa baz puan)
        if e_info["eylem_sayisi"] > 0:
            oran = round(35.0 + (e_info["tamamlanan_eylem"] * 30.0) - (e_info["riskli_eylem"] * 10.0), 1)
        else:
            oran = round(45.0 + (k_info["uygulanan_karar"] * 15.0), 1)
        oran = max(15.0, min(95.0, oran))

        basin_data.append({
            **h,
            "karar_sayisi": k_info["karar_sayisi"],
            "uygulanan_karar": k_info["uygulanan_karar"],
            "karar_basari_orani": round((k_info["uygulanan_karar"] / max(1, k_info["karar_sayisi"])) * 100, 1) if k_info["karar_sayisi"] > 0 else 0.0,
            "eylem_sayisi": e_info["eylem_sayisi"],
            "riskli_eylem": e_info["riskli_eylem"],
            "gerceklesme_orani": oran
        })

    return basin_data

def get_water_councils_summary():
    """
    FR-05 Su Kurulları Karar Takip Metrikleri
    """
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT kurul_turu, COUNT(*) as toplam,
               SUM(CASE WHEN uygulama_durumu = 'UYGULANDI' THEN 1 ELSE 0 END) as uygulandi,
               SUM(CASE WHEN uygulama_durumu = 'DEVAM_EDIYOR' THEN 1 ELSE 0 END) as devam_ediyor,
               SUM(CASE WHEN uygulama_durumu = 'TAKIPTE' THEN 1 ELSE 0 END) as takipte,
               SUM(CASE WHEN uygulama_durumu = 'UYGULANAMADI' THEN 1 ELSE 0 END) as uygulanamadi,
               AVG(tamamlanma_orani) as ortalama_tamamlanma
        FROM su_kurulu_karar
        GROUP BY kurul_turu
    """)
    rows = cur.fetchall()

    # Tüm kararlar
    cur.execute("""
        SELECT k.*, e.eylem_kodu, e.eylem_tanimi
        FROM su_kurulu_karar k
        LEFT JOIN eylem e ON k.ilgili_eylem_id = e.eylem_id
        ORDER BY k.toplanti_tarihi DESC
    """)
    all_decisions = [dict(r) for r in cur.fetchall()]
    conn.close()

    total_count = sum(r["toplam"] for r in rows)
    total_applied = sum(r["uygulandi"] for r in rows)
    genel_basari = round((total_applied / max(1, total_count)) * 100, 1) if total_count > 0 else 0.0

    return {
        "genel_karar_sayisi": total_count,
        "uygulanan_karar_sayisi": total_applied,
        "uygulamaya_gecen_karar_orani": genel_basari,
        "kurul_bazli": [dict(r) for r in rows],
        "kararlar": all_decisions
    }
