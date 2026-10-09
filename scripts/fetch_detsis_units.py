"""
DETSİS API sorgulayıcı (Detseasy reposu mantığıyla)
Ulusal Su Planında (2026-2035) görevlendirilmiş olan kurum ve birimleri DETSİS'ten çeker.
"""

import urllib.request
import urllib.parse
import json
import time
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'Origin': 'https://yetkili.detsis.gov.tr',
    'Referer': 'https://yetkili.detsis.gov.tr/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8'
}

def search_birim(query):
    url = f"https://yetkiliapi.detsis.gov.tr/api/backoffice/unauthorizedaccessdata/tumbirimler/{urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            data = json.loads(res.read().decode('utf-8'))
            return data.get('data', [])
    except Exception as e:
        print(f"Hata ({query}): {e}")
        return []

# Ulusal Su Planında 141 eylemde görevlendirilmiş ana kurum ve birimler
TARGET_QUERIES = [
    # 1. Su ve Çevre Ana Kurumları
    "Su Yönetimi Genel Müdürlüğü",
    "Devlet Su İşleri Genel Müdürlüğü",
    "Çevre Yönetimi Genel Müdürlüğü",
    "Tarımsal Reform Genel Müdürlüğü",
    "Meteoroloji Genel Müdürlüğü",
    "Çölleşme ve Erozyonla Mücadele Genel Müdürlüğü",
    "Orman Genel Müdürlüğü",
    "Doğa Koruma ve Milli Parklar Genel Müdürlüğü",
    "Tarımsal Araştırmalar ve Politikalar Genel Müdürlüğü",
    "Balıkçılık ve Su Ürünleri Genel Müdürlüğü",
    "Gıda ve Kontrol Genel Müdürlüğü",
    "Bitkisel Üretim Genel Müdürlüğü",
    "Türkiye Su Enstitüsü",
    "İller Bankası",
    "Afet ve Acil Durum Yönetimi",
    "Halk Sağlığı Genel Müdürlüğü",
    "Çevresel Etki Değerlendirmesi, İzin ve Denetim",
    "Tabiat Varlıklarını Koruma Genel Müdürlüğü",
    "Mekânsal Planlama Genel Müdürlüğü",
    "İklim Değişikliği Başkanlığı",
    
    # 2. İlgili Diğer Bakanlık Birimleri
    "Sanayi Bölgeleri Genel Müdürlüğü",
    "Enerji İşleri Genel Müdürlüğü",
    "Karayolları Genel Müdürlüğü",
    "Devlet Demiryolları",
    "Devlet Hava Meydanları İşletmesi",
    "Harita Genel Müdürlüğü",
    "Türkiye İstatistik Kurumu",
    "Türkiye Belediyeler Birliği",
    "Organize Sanayi Bölgeleri Üst Kuruluşu",
    "TÜBİTAK Marmara Araştırma Merkezi",
    
    # 3. 30 Büyükşehir Su ve Kanalizasyon İdaresi (SUKİ)
    "Adana Su ve Kanalizasyon",
    "Ankara Su ve Kanalizasyon",
    "Antalya Su ve Atıksu",
    "Aydın Su ve Kanalizasyon",
    "Balıkesir Su ve Kanalizasyon",
    "Bursa Su ve Kanalizasyon",
    "Denizli Su ve Kanalizasyon",
    "Diyarbakır Su ve Kanalizasyon",
    "Erzurum Su ve Kanalizasyon",
    "Eskişehir Su ve Kanalizasyon",
    "Gaziantep Su ve Kanalizasyon",
    "Hatay Su ve Kanalizasyon",
    "İstanbul Su ve Kanalizasyon",
    "İzmir Su ve Kanalizasyon",
    "Kahramanmaraş Su ve Kanalizasyon",
    "Kayseri Su ve Kanalizasyon",
    "Kocaeli Su ve Kanalizasyon",
    "Konya Su ve Kanalizasyon",
    "Malatya Su ve Kanalizasyon",
    "Manisa Su ve Kanalizasyon",
    "Mardin Su ve Kanalizasyon",
    "Mersin Su ve Kanalizasyon",
    "Muğla Su ve Kanalizasyon",
    "Ordu Su ve Kanalizasyon",
    "Sakarya Su ve Kanalizasyon",
    "Samsun Su ve Kanalizasyon",
    "Şanlıurfa Su ve Kanalizasyon",
    "Tekirdağ Su ve Kanalizasyon",
    "Trabzon İçmesuyu ve Kanalizasyon",
    "Van Su ve Kanalizasyon"
]

if __name__ == "__main__":
    results = {}
    print(f"Toplam {len(TARGET_QUERIES)} hedef kurum/birim için DETSİS taranıyor...")
    for q in TARGET_QUERIES:
        birimler = search_birim(q)
        time.sleep(0.1) # nezaket beklemesi
        if birimler:
            # En uygun ana birimi veya genel müdürlük düzeyindeki ilk kaydı seç
            best = None
            for b in birimler:
                name = b.get('birimAdi', '').lower()
                # Ana birim adı eşleşmesine öncelik ver
                if any(x in name for x in ['genel müdürlüğü', 'idaresi', 'başkanlığı', 'bankası', 'enstitüsü', 'birliği', 'kurumu']):
                    best = b
                    break
            if not best and birimler:
                best = birimler[0]
            
            results[q] = {
                'detsisNo': best.get('detsisNo'),
                'birimAdi': best.get('birimAdi'),
                'kurumHiyerarsisi': best.get('kurumHiyerarsisi'),
                'il': best.get('uavtIlAdi')
            }
            print(f"✓ [{best.get('detsisNo')}] {best.get('birimAdi')} ({best.get('uavtIlAdi')})")
        else:
            print(f"✗ Bulunamadı: {q}")

    # JSON dosyasına kaydet
    out_file = "scripts/detsis_usp_birimler.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\nSonuçlar {out_file} dosyasına kaydedildi. Toplam kayıt: {len(results)}")
