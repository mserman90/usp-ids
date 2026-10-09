# Ulusal Su Planı (2026–2035) İzleme ve Veri Toplama Araçları

Bu depo, **Ulusal Su Planı (2026–2035)** kapsamındaki **8 Hedef, 31 Strateji ve 141 Eyleme** ilişkin paydaş kurumlardan gösterge gerçekleşmesi ve kanıt belgesi toplamak üzere geliştirilen **Google Form & Google Sheets Entegrasyon Araçlarını ve Otomasyon Betiklerini** içerir.

---

## 📋 Canlı Google Portalları ve Bağlantıları

| Hizmet | Bağlantı | Açıklama |
|---|---|---|
| 📝 **Veri Bildirim Formu** | [Formu Görüntüle ve Doldur](https://docs.google.com/forms/d/e/1FAIpQLScx8z6PGPH7QpbWbmfWU5-KWB0PcTlsXvWLZyttQLiInpDfdQ/viewform) | Kurumların dönemsel gösterge gerçekleşmesi ve kanıt yüklediği form |
| ⚙️ **Form Yönetim Portalı** | [Google Form Editörü](https://docs.google.com/forms/d/1TN_SWy4wV4vFh48xIBVeeIkYA8SGA43QwjjnfQF2v2Y/edit) | Yetkili yöneticiler için form sorularını ve eylemleri düzenleme paneli |
| 📊 **Yanıt E-Tablosu** | [Google Sheets Veritabanı](https://docs.google.com/spreadsheets/d/12fnhBqKeIp_EkM0lTIQ0isV0uK1L4xFTBGgwKsiRzYc/edit) | Gelen bildirimlerin satır satır toplandığı canlı elektronik tablo |

---

## 🛠️ Entegrasyon Betikleri ve Araçlar

Depoda yer alan betikler şunlardır:

1. **[`scripts/create_google_form.js`](scripts/create_google_form.js)**
   * Google Apps Script (GAS) otomasyon betiğidir.
   * [script.google.com](https://script.google.com) editörüne yapıştırılıp çalıştırıldığında, Ulusal Su Planı'nın 141 eylemini, DETSİS kurum listesini, gösterge tiplerini ve kanıt yükleme sorularını içeren Google Formu'nu tek tıkla otomatik olarak sıfırdan oluşturur.

2. **[`scripts/detsis_usp_birimler.json`](scripts/detsis_usp_birimler.json)**
   * Ulusal Su Planı'nda sorumlu ve ilgili olarak tanımlanan tüm bakanlıklar, genel müdürlükler (DSİ, TRGM, ÇEM vb.), SUKİ'ler (ASKİ, İSKİ, İZSU vb.) ve belediyelere ait DETSİS birim kodları ve resmi unvan listesidir.

3. **[`scripts/fetch_detsis_units.py`](scripts/fetch_detsis_units.py)**
   * DETSİS kayıtlarını ve kamu teşkilat yapısını sorgulayan, güncel birim verilerini senkronize eden Python betiğidir.

---

## 🚀 Betiklerin Kullanımı

### DETSİS Birim Verilerini Güncelleme
```bash
python scripts/fetch_detsis_units.py
```

### Google Form Oluşturma (Google Apps Script)
1. [Google Apps Script](https://script.google.com) sayfasını açın ve **Yeni Proje** oluşturun.
2. `scripts/create_google_form.js` dosyasının içeriğini kopyalayıp editöre yapıştırın.
3. `createUlusalSuPlaniForm()` fonksiyonunu seçip **Çalıştır (Run)** butonuna basın.
4. Google Formunuz Google Drive hesabınızda anında oluşturulacak ve düzenleme/yanıt bağlantıları konsola yazdırılacaktır.
