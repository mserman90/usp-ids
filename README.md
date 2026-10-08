# Ulusal Su Planı (2026–2035) İzleme ve Değerlendirme Sistemi (USP-İDS)

**Ulusal Su Planı (2026–2035)** kapsamındaki **8 Hedef, 31 Strateji ve 141 Eylemin** çevrim içi izlenmesi, doğrulanması, sapma analizlerinin yapılması ve konsolide raporlanması amacıyla geliştirilmiş bağımsız izleme ve değerlendirme bilgi sistemi.

> **Önemli Bilgilendirme:** Bu platform ve yazılım resmi bir kamu veya bakanlık uygulaması değildir; gösterge izleme, veri analitiği, simülasyon ve araştırma amacıyla geliştirilmiş bağımsız bir sistemdir.

---

## 💻 Kullanıcı Deneyimi ve Arayüz Standartları

* **Modern ve Erişilebilir Tasarım:** Responsive HTML5/TailwindCSS arayüz mimarisi.
* **Erişilebilirlik (WCAG 2.1):** Yazı boyutu ayarlayıcı (`A-`, `A`, `A+`) ve Yüksek Karşıtlık (High-Contrast) modu.
* **Rol Bazlı Yetkilendirme (RBAC):** Yönetici Süpervizör, Koordinatör Kurum `*`, Paydaş Kurum, Kurul Sekreteryası, İzleme Kurulu rolleri.
* **Çoklu Çalışma Desteği:** Canlı FastAPI Backend API ve GitHub Pages statik çalışma modu.

---

## 🌟 Sistem Modülleri

* **FR-01 (Stratejik Hiyerarşi Modülü):** 8 Hedef, 31 Strateji ve 141 Eylem hiyerarşik akordiyon ağacı; arama ve filtreleme.
* **FR-02 (Çok Paydaşlı Kurum Matrisi):** Koordinatör birimler, DSİ, su idareleri (ASKİ, İSKİ, İZSU), belediyeler ve araştırma enstitüleri.
* **FR-03 (Dinamik Gösterge Tipleri):** Sayısal/Kümülatif, Oransal (%) ve Kilometre Taşı (Milestone/Boolean) metrikleri.
* **FR-04 (Kanıt Tabanlı Belge Yönetimi):** SHA-256 bütünlük imzalı kanıt yükleme (teknik rapor, tutanak, mevzuat metni, CBS katmanı).
* **FR-05 (Su Kurulları Karar Takip):** Merkezi, havza ve yerel kurulların kararları; *"Uygulamaya geçen karar oranı"* hesaplama motoru.
* **FR-06 (Sapma Analizi ve Erken Uyarı Motoru):** Teorik ilerleme ile gerçekleşen gösterge değeri kıyaslaması (🟢 Yeşil, 🟡 Sarı, 🔴 Kırmızı durum kodlaması).
* **FR-07 (CBS ve Havza Bazlı Mekânsal Görünüm):** 25 Nehir Havzası CBS kartları, havza öncelikleri ve gerçekleşme oranları.
* **FR-08 (İki Yıllık Değerlendirme Raporu):** Plandaki 2 yıllık periyotlara uygun, tek tıkla yazdırılabilir konsolide brifing çıktısı.
* **NFR-04 (Denetim İzi / Audit Trail):** Değiştirilemez, zaman damgalı işlem günlüğü.

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
* Python 3.10+
* `fastapi`, `uvicorn`

### Bağımlılıkları Yükleme
```bash
pip install fastapi uvicorn
```

### Uygulamayı Başlatma
```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8080 --reload
```

* **Web Portalı:** [http://127.0.0.1:8080](http://127.0.0.1:8080)
* **Swagger API Dokümantasyonu:** [http://127.0.0.1:8080/docs](http://127.0.0.1:8080/docs)

---

## 📁 Proje Dosya Yapısı

```
usp-ids/
├── database.py                 # SQLite ilişkisel veri tabanı şeması ve tohum verileri
├── engine.py                   # Erken uyarı algoritması, sapma motoru ve analitik hesaplayıcılar
├── main.py                     # FastAPI REST API servisleri ve iş akışı kontrolcüsü
├── usp_ids.db                  # Örnek tohumlanmış veri tabanı
├── static/
│   ├── index.html              # Responsive HTML5 arayüzü
│   ├── style.css               # Tema stilleri, erişilebilirlik ve A4 yazdırma şablonu
│   └── app.js                  # RBAC yetki yönetimi, onay masası ve asenkron veri motoru
├── .gitignore                  # Git hariç tutma kuralları
└── README.md                   # Dokümantasyon
```

---

## ⚖️ Lisans ve Haklar
© 2026 USP-İDS Ulusal Su Planı İzleme ve Değerlendirme Sistemi. Açık kaynak / araştırma amaçlı kullanım içindir.
