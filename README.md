# Ulusal Su Planı (2026–2035) İzleme ve Değerlendirme Bilgi Sistemi (USP-İDS)

**Ulusal Su Planı (2026–2035)** kapsamındaki **8 Hedef, 31 Strateji ve 141 Eylemin** çevrim içi izlenmesi, doğrulanması, sapma analizlerinin yapılması ve konsolide raporlanması amacıyla geliştirilecek bağımsız izleme ve değerlendirme bilgi sistemi.

> **Durum:** Önceki tek sayfalık prototip tamamen kaldırılmış ve `v1.0-legacy` etiketiyle arşivlenmiştir. Sistem modern kurumsal mimari, Google Forms veri toplama, Google Sheets e-tablo analitik ve CBS havza modülleri ile sıfırdan yeniden kurgulanmaktadır.

---

## 📑 Sıfırdan Kurgulama İş Planı

Sistemin sıfırdan inşası için hazırlanan detaylı mimari tasarım, fazlandırma ve teknik şartname uyumluluk yol haritasına [**IS_PLANI.md**](IS_PLANI.md) dosyasından ulaşabilirsiniz.

### Temel Fazlar
* **Faz 1:** Temel Veri Modeli ve Stratejik Hiyerarşi (8 Hedef, 31 Strateji, 141 Eylem, DETSİS Matrisi)
* **Faz 2:** Google Forms Mantığında Veri Toplama Portalı (Dinamik Göstergeler, SHA-256 Kanıt Yükleme)
* **Faz 3:** Google Sheets Mantığında Canlı E-Tablo ve Onay Masası (Formül Çubuğu, Çoklu Sekmeler, Hücre İçi Onay)
* **Faz 4:** Sapma Analitiği, Erken Uyarı Motoru ve 25 Nehir Havzası CBS Katmanı
* **Faz 5:** 2 Yıllık Resmî Brifing Raporlama, Güvenlik (RBAC / e-Devlet), USBS Entegrasyonu ve Yayına Alma

---

## 📋 Mevcut Google Entegrasyon Araçları

* 📝 **Kurumlara Gönderilecek Veri Giriş Formu:** [Formu Görüntüle ve Doldur](https://docs.google.com/forms/d/e/1FAIpQLScx8z6PGPH7QpbWbmfWU5-KWB0PcTlsXvWLZyttQLiInpDfdQ/viewform)
* ⚙️ **Yönetici Form Düzenleme Portalı:** [Google Form Editörü](https://docs.google.com/forms/d/1TN_SWy4wV4vFh48xIBVeeIkYA8SGA43QwjjnfQF2v2Y/edit)
* 📊 **Gelen Yanıtların Toplandığı E-Tablo Veritabanı:** [Google Sheets Yanıt Tablosu](https://docs.google.com/spreadsheets/d/12fnhBqKeIp_EkM0lTIQ0isV0uK1L4xFTBGgwKsiRzYc/edit)
* 🛠️ **Form Oluşturucu Otomasyon Kodu:** [`scripts/create_google_form.js`](scripts/create_google_form.js)
* 🏛️ **DETSİS Birim Verileri:** [`scripts/detsis_usp_birimler.json`](scripts/detsis_usp_birimler.json)

---

## 🏛️ Arşiv ve Geçmiş Sürümler
Eski prototip kodlarına ihtiyaç duyulması halinde Git geçmişinden veya [v1.0-legacy](https://github.com/mserman90/usp-ids/releases/tag/v1.0-legacy) etiketinden erişilebilir.
