# Ulusal Su Planı (2026–2035) İzleme ve Değerlendirme Bilgi Sistemi (USP-İDS)

**T.C. Tarım ve Orman Bakanlığı Su Yönetimi Genel Müdürlüğü (SYGM)** koordinasyonunda ve **Ulusal Su Kurulu (USUK)** kararları doğrultusunda uygulanan **Ulusal Su Planı (2026–2035)** kapsamındaki **8 Hedef, 31 Strateji ve 141 Eylemin** çevrim içi izlenmesi, doğrulanması, sapma analizlerinin yapılması ve konsolide raporlanması amacıyla geliştirilmiş modern kurumsal bilgi sistemi.

---

## 🏛️ Mimari ve Teknoloji Yığını (Sürüm 2.0)

* **Ön Yüz & API:** Next.js 15 (React 19, TypeScript, App Router, Route Handlers)
* **Stil & Tasarım:** Tailwind CSS v4, Lucide Icons (T.C. Bakanlık ve DETSİS Standartları)
* **Veri Giriş Portalı:** Google Forms mantığında dinamik kartlı anket deneyimi, otomatik gösterge seçimi ve SHA-256 kanıt doğrulama
* **Canlı Analitik & Onay Masası:** Google Sheets mantığında formül çubuğu (`fx =ORTALAMA(G2:G7)`), hücre içi açılır menüden doğrudan onaylama ve CSV dışa aktarımı
* **Stratejik Hiyerarşi (FR-01):** 8 Hedef, 31 Strateji ve 141 Eylem akordiyon ağacı
* **Sapma & Erken Uyarı (FR-06):** 🟢 Yeşil, 🟡 Sarı, 🔴 Kırmızı trafik ışığı sapma analiz motoru
* **CBS ve Havza Modülü (FR-07):** 25 Nehir Havzası ve Su Kurulları kararları (USUK, Havza ve İl Su Kurulları)
* **Resmî Brifing (FR-08):** 2 Yıllık Cumhurbaşkanlığı / USUK uyumlu yazdırılabilir A4 raporu

---

## 🚀 Kurulum ve Yerel Çalıştırma

### Gereksinimler
* Node.js v18+ (Önerilen: v20+)
* npm v9+

### Çalıştırma Adımları
```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. Geliştirme sunucusunu başlatın
npm run dev
# Uygulama http://localhost:3000 adresinde açılacaktır.

# 3. Üretim (Production) derlemesi
npm run build
npm run start
```

---

## 📑 Sıfırdan Kurgulama İş Planı
Mimari yol haritası ve fazlandırma detayları için [**IS_PLANI.md**](IS_PLANI.md) dosyasına bakabilirsiniz.

---

## ⚖️ Lisans ve Haklar
© 2026 T.C. Tarım ve Orman Bakanlığı • Su Yönetimi Genel Müdürlüğü (SYGM)
Ulusal Su Planı İzleme ve Değerlendirme Bilgi Sistemi (USP-İDS).
