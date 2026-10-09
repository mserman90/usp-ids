/**
 * Ulusal Su Planı (2026-2035) Çevrim İçi İzleme Formu Oluşturucu (USP-İDS)
 * 
 * Bu script; ulusal_su_plani_izleme_sablonu-v3.xlsx veri modelini,
 * 8 Temel Hedef, 141 Eylem ve veri tabanı standartlarını birebir karşılayan 
 * bir Google Form ve bağlı Google E-Tablo yanıt veritabanını otomatik olarak oluşturur.
 * 
 * Kurulum Adımları:
 * 1. Google Drive'da boş bir Google E-Tablo (Google Sheets) açın.
 * 2. Üst menüden Uzantılar (Extensions) > Apps Script yolunu izleyin.
 * 3. Açılan kod editörüne bu kodun tamamını yapıştırıp 'Çalıştır' (Run) butonuna basın.
 */

function createUlusalSuPlaniForm() {
  // 1. Google Formunu Başlat
  var form = FormApp.create('Ulusal Su Planı (2026-2035) Eylem İzleme ve Veri Giriş Portalı');
  form.setDescription(
    'ULUSAL SU PLANI (2026–2035) İZLEME VE DEĞERLENDİRME SİSTEMİ (USP-İDS)\n\n' +
    'Bu form, Ulusal Su Planı (2026–2035) kapsamındaki 8 Hedef ve 141 Eyleme ilişkin sorumlu (*) ve paydaş ' +
    'kurum/kuruluşların dönemsel gerçekleşmelerini, gösterge değerlerini ve doğrulayıcı kanıt evraklarını sisteme aktarması amacıyla hazırlanmıştır.\n\n' +
    '⚠️ ÖNEMLİ KULLANIM NOTU: Her eylem için ayrı bir form gönderimi yapınız. Birden fazla eylemde görevliyseniz formu her eylem için tekrar doldurabilirsiniz.\n' +
    'ℹ️ BİLGİLENDİRME: Bu portal, veri toplama ve analitik izleme simülasyonu amacıyla işletilmektedir.'
  );
  
  form.setIsQuiz(false);
  form.setAllowResponseEdits(true);
  form.setProgressBar(true);

  // ==========================================
  // BÖLÜM 1: KURUMSAL BİLGİLER VE İRTİBAT
  // ==========================================
  var sec1 = form.addSectionHeaderItem();
  sec1.setTitle('BÖLÜM 1: Kurumsal Bilgiler ve İrtibat Odak Noktası');

  var kurumList = form.addListItem();
  kurumList.setTitle('1. Veri Girişi Yapan Kurum / Birim (DETSİS)')
    .setHelpText('Lütfen Ulusal Su Planında görevlendirilmiş resmi kurum/biriminizi seçiniz (DETSİS numarası veya kurum adı ile arayabilirsiniz).')
    .setChoiceValues(getUspDetsisInstitutions())
    .setRequired(true);

  var rolChoice = form.addMultipleChoiceItem();
  rolChoice.setTitle('2. Kurumunuzun Eylemdeki Rolü')
    .setChoiceValues([
      'Koordinatör / Asıl Sorumlu Kurum (*)',
      'Ortak Sorumlu Kurum',
      'İlgili Kurum / Katkı Sağlayan Paydaş'
    ])
    .setRequired(true);

  var donemList = form.addListItem();
  donemList.setTitle('3. Raporlanan İzleme Dönemi')
    .setChoiceValues([
      '2026 Yıllık İzleme',
      '2026-2027 (1. İki Yıllık Değerlendirme)',
      '2028 Yıllık İzleme',
      '2028-2029 (2. İki Yıllık Değerlendirme)',
      '2030 ve Sonrası Uzun Dönem'
    ])
    .setRequired(true);

  var irtibat = form.addTextItem();
  irtibat.setTitle('4. İrtibat Görevlisi (Ad-Soyad, Ünvan, Telefon, E-posta)')
    .setHelpText('Örn: Ahmet YILMAZ, Şube Müdürü, 0312 000 0000, ayilmaz@kurum.org')
    .setRequired(true);

  // ==========================================
  // BÖLÜM 2: EYLEM VE STRATEJİK HİYERARŞİ
  // ==========================================
  var page2 = form.addPageBreakItem();
  page2.setTitle('BÖLÜM 2: Eylem ve Gösterge Bilgileri');

  var hedefList = form.addListItem();
  hedefList.setTitle('5. İlgili Temel Hedef')
    .setChoiceValues([
      'Hedef 1: Kurumsal ve Yasal Yapının Güçlendirilmesi',
      'Hedef 2: Su Kaynaklarının Kalite ve Miktar Olarak Korunması, İyileştirilmesi ve Geliştirilmesi',
      'Hedef 3: Değişen İklim Şartlarına Uyum ve Su Kaynaklarının Verimli Kullanılması',
      'Hedef 4: Hidrometeorolojik Afetler (Taşkın, Kuraklık, Erozyon)',
      'Hedef 5: Bütünleşik Su Yönetiminde Dijital Dönüşüm',
      'Hedef 6: Suya İlişkin Yatırımların Önceliklendirilmesi ve Finansman Mekanizmaları',
      'Hedef 7: Su, Enerji, Gıda ve Ekosistem Esaslı Bağlantısallık Yaklaşımı',
      'Hedef 8: Eğitim, Farkındalık ve İş Birliğinin Artırılması'
    ])
    .setRequired(true);

  var eylemKodu = form.addListItem();
  eylemKodu.setTitle('6. Eylem Kodu ve Tanımı (141 Eylem Listesi)')
    .setHelpText('Raporlama yaptığınız eylemi listeden seçiniz.')
    .setChoiceValues(getUlusalSuPlaniEylemleri())
    .setRequired(true);

  var gostergeTuru = form.addMultipleChoiceItem();
  gostergeTuru.setTitle('7. Gösterge Türü')
    .setChoiceValues([
      'Sayısal / Kümülatif (Adet, Kişi, Tesis, Kuyu vb.)',
      'Oransal / Yüzde (%)',
      'Kilometre Taşı (Mevzuat / Sistem Kurulumu - 1/0)'
    ])
    .setRequired(true);

  // ==========================================
  // BÖLÜM 3: GERÇEKLEŞME VE İLERLEME DURUMU
  // ==========================================
  var page3 = form.addPageBreakItem();
  page3.setTitle('BÖLÜM 3: Cari Dönem Gerçekleşmesi ve İlerleme Durumu');

  var gerceklesenDeger = form.addTextItem();
  gerceklesenDeger.setTitle('8. Cari İzleme Döneminde Gerçekleşen Değer')
    .setHelpText('Sayısal olarak giriniz (Örn: 25, 45.5, %60 için 60 vb.). Kilometre taşı ise tamamlandıysa 1, devam ediyorsa 0 yazınız.')
    .setRequired(true);

  var ilerlemeDurumu = form.addMultipleChoiceItem();
  ilerlemeDurumu.setTitle('9. Eylem İlerleme Durumu')
    .setHelpText('Eylemin takvimine göre mevcut ilerleme seviyesini işaretleyiniz.')
    .setChoiceValues([
      '🟢 Tamamlandı (Hedefe ulaşıldı)',
      '🟢 Hedefe Uygun Devam Ediyor',
      '🟡 Gecikme Riski / Yavaş',
      '🔴 Başlamadı / Beklemede',
      '⚪ İptal / Revize Edilecek'
    ])
    .setRequired(true);

  // ==========================================
  // BÖLÜM 4: KANIT BELGELERİ VE DOĞRULAMA
  // ==========================================
  var page4 = form.addPageBreakItem();
  page4.setTitle('BÖLÜM 4: Kanıt Belgeleri ve Doğrulama');

  var kanitTuru = form.addMultipleChoiceItem();
  kanitTuru.setTitle('10. Kanıt Belgesi Türü')
    .setChoiceValues([
      'Mevzuat / İlan Yayını',
      'Kurumsal Yazışma / EBYS Evrakı',
      'Teknik Rapor / Proje Kabul Tutanağı',
      'CBS / Bilgi Sistemi Verisi',
      'Eğitim / Katılımcı Listesi',
      'Protokol / Sözleşme Metni',
      'Diğer Doğrulayıcı Belge'
    ])
    .setRequired(true);

  var evrakNo = form.addTextItem();
  evrakNo.setTitle('11. Kanıt Belgesi Sayısı / Tarihi / Kayıt No')
    .setHelpText('Örn: E-847291 / 15.03.2026 veya Sayı: 32740 / Rapor No: R-112')
    .setRequired(true);

  // ==========================================
  // BÖLÜM 5: SU KURULLARI, SAPMA VE RİSK YÖNETİMİ
  // ==========================================
  var page5 = form.addPageBreakItem();
  page5.setTitle('BÖLÜM 5: Kurul Kararları, Sapma ve Riskler');

  var suKurulu = form.addMultipleChoiceItem();
  suKurulu.setTitle('12. Eylemle İlişkili Bir Su Kurulu Kararı Var mı?')
    .setChoiceValues([
      'Ulusal Su Kurulu (USUK)',
      'Havza Su Kurulu (25 Havza)',
      'İl Su Kurulu (81 İl)',
      'İlişkili Kurul Kararı Bulunmuyor'
    ])
    .setRequired(true);

  var sapmaDurumu = form.addMultipleChoiceItem();
  sapmaDurumu.setTitle('13. Takvim Sapması veya Risk Var mı?')
    .setChoiceValues([
      'Hayır (Çalışmalar plana uygun yürüyor)',
      'Evet (Öngörülen takvimin gerisinde kalındı)',
      'Kritik Risk (Uygulama dönemi aşıldı / durduruldu)'
    ])
    .setRequired(true);

  var aciklamaNotu = form.addParagraphTextItem();
  aciklamaNotu.setTitle('14. Kurum Açıklaması / Sapma Gerekçesi ve Alınan Düzeltici Tedbirler')
    .setHelpText('Gecikme veya sapma varsa gerekçesini (bütçe, kamulaştırma, mevzuat, tedarik vb.) ve alınan telafi edici tedbirleri özetleyiniz.')
    .setRequired(false);

  // 2. Yanıtların otomatik bağlanacağı Google E-Tabloyu oluştur
  var ss = SpreadsheetApp.create('Ulusal Su Planı İzleme - Gelen Yanıtlar (USP-İDS Veritabanı)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Logger.log('=== FORM BAŞARIYLA OLUŞTURULDU ===');
  Logger.log('1. Form Düzenleme Linki (Editör): ' + form.getEditUrl());
  Logger.log('2. Kurumlara Gönderilecek Form Linki: ' + form.getPublishedUrl());
  Logger.log('3. Yanıtların Toplandığı E-Tablo Linki: ' + ss.getUrl());
}

/**
 * Excel Şablonundaki 141 Eylemin Kod ve Tanım Listesi
 */
function getUlusalSuPlaniEylemleri() {
  return [
    'E-1.1.1: Havza ölçeğinde bütünleşik izleme ve takip sistemi geliştirilmesi, kurumsal yapının güçlendirilmesi',
    'E-1.1.2: Su Kurullarında alınan kararların ulusal ve yerel düzeyde uygulanması ve takibi',
    'E-1.1.3: Büyükşehir dışındaki il belediyelerinde su ve atıksu hizmetlerinin etkinliği için kurumsal yapı geliştirilmesi',
    'E-1.1.4: Sulama birlikleri, kooperatifleri ve halk sulamalarının tek çatı altında toplanması',
    'E-1.2.1: Su Kanunu hazırlık çalışmalarının tamamlanması',
    'E-1.2.2: Taşkın Kanunu hazırlık çalışmalarının tamamlanması',
    'E-1.2.3: Su yönetimi konusunda ikincil mevzuat hazırlama ve güncelleme çalışmaları',
    'E-1.2.4: 167 Sayılı Yeraltı Suları Hakkında Kanunda düzenleme yapılması',
    'E-1.2.5: Su kaynaklarının kalite ve miktarının korunması için havza bazlı takip mevzuatının geliştirilmesi',
    'E-1.2.6: Su tahsisine ilişkin yetkilerin tek çatı altında toplanması ve havza su tahsis planları mevzuatı',
    'E-1.3.1: Yerel yönetimlerde personelin su planlaması ve denetimi kapasitesinin geliştirilmesi',
    'E-2.1.1: Havza izleme programlarının güncellenmesi ve mükerrerliklerin önlenmesi',
    'E-2.1.2: Havza izleme programlarına uygun şekilde sürekli izlemelerin yapılması',
    'E-2.1.3: Su analiz laboratuvarlarının teknik ve personel kapasitesinin geliştirilmesi ve koordinasyonu',
    'E-2.1.4: Yeraltı sularının miktar takibi, debimetre sayaç takılması ve kalite izlemeleri',
    'E-2.1.5: Su tahsisi yapılan tüm tesislerde ölçüm ve izleme sistemlerinin yaygınlaştırılması',
    'E-2.1.6: Hidrometeorolojik veri gözlem ağının güçlendirilmesi',
    'E-2.2.1: Nehir Havza Yönetim Planlarının (NHYP) tamamlanması, uygulanması ve takibi',
    'E-2.2.2: Alıcı ortam bazlı deşarj limitlerinin belirlenerek mevzuata aktarılması ve uygulanması',
    'E-2.2.3: Nitrata Hassas Bölgeler ilan edilerek Nitrat Eylem Planının uygulanması',
    'E-2.2.4: Pestisit kaynaklı kirliliğin azaltılması ve önlenmesi için izleme ve denetim sistemi',
    'E-2.2.5: Evsel ve kentsel atıksu arıtma tesislerinin tamamlanması ve işletilmesi',
    'E-2.2.6: Endüstriyel kuruluşlarda atıksu arıtma tesislerinin tamamlanması ve işletilmesi',
    'E-2.2.7: Arıtma çamurlarının nihai bertarafı kapsamında entegre çözümlerin hayata geçirilmesi',
    'E-2.2.8: Yeraltı suyu tahsisine kapalı havzalarda koruma eylem planları hazırlanması',
    'E-2.2.9: Yeraltı sularından emniyetli rezervin üzerinde çekimlerin engellenmesi',
    'E-2.3.1: Doğa temelli çözümleri içerecek rehber doküman hazırlanması',
    'E-2.3.2: Havza ölçekli planlarda doğa temelli rehabilitasyon ve restorasyon tedbirleri',
    'E-2.4.1: İhtiyaç duyulan konu ve alanlarda hidropolitik strateji belgelerinin hazırlanması',
    'E-2.4.2: Uluslararası kuruluşlarda mukim su ve iklim temsilcileriyle periyodik istişareler',
    'E-2.5.1: Havza Master Planlarının güncellenmesi',
    'E-2.5.2: Havza bazlı Hidrojeolojik Etüt Raporlarının hazırlanması',
    'E-2.5.3: İçme Suyu, Atıksu ve Yağmur Suyu Master Planlarının tamamlanması / güncellenmesi',
    'E-2.6.1: İçme-kullanma suyu havzalarında su kaynaklarının korunmasına yönelik bütünleşik denetim',
    'E-2.6.2: Evsel ve endüstriyel atıksu arıtma tesislerinin bütünleşik denetimi',
    'E-2.6.3: Yeraltı sularına yapılan deşarjların kontrolü ve denetim mekanizmalarının güçlendirilmesi',
    'E-2.6.4: Yeraltı suyu miktarında etkin denetim, kaçak kuyu tespiti ve ruhsatlandırma takibi',
    'E-2.6.5: Ticari maksatlı doğal mineralli sular ve kaynak suların takip ve denetimi',
    'E-2.7.1: Kaynaktan musluğa içme-kullanma suyu güvenliği sisteminin geliştirilmesi',
    'E-2.7.2: İçme-kullanma suyu yerüstü kaynaklarının hidrolojik sınırlarının belirlenmesi',
    'E-2.7.3: İçme-Kullanma Suyu Havzası Koruma Planlarını kapsayan Su Güvenliği Planları hazırlanması',
    'E-2.7.4: İçme-Kullanma Suyu Güvenliği Planlarının uygulanması ve takibi',
    'E-2.7.5: İçme suyu yeraltı kaynakları envanteri ve koruma alanlarının belirlenmesi',
    'E-2.7.6: Kırsalda içme suyu güvenliğinin sağlanması için yasal, idari ve teknik mekanizmalar',
    'E-2.7.7: İçme suyu arıtma tesislerinin revizyon ve rehabilitasyonunun yapılması',
    'E-2.7.8: İçme suyu arıtma tesislerini işleten personelin kapasitesinin artırılması ve sertifikasyonu',
    'E-2.7.9: İçme suyu kaynaklarında ve arıtma tesislerinde düzenli izlemelerin yapılması',
    'E-2.7.10: İçme suyunun dezenfeksiyonu ile su depolarının temizlik ve bakımının etkin yapılması',
    'E-2.7.11: İçme sularında mikrokirleticiler izleme parametrelerinin belirlenmesi',
    'E-2.8.1: Biyolojik filtrasyon ve yenilikçi dezenfeksiyon arıtma teknolojilerinin yaygınlaştırılması',
    'E-2.8.2: Kırsal ve düşük gelirli bölgelerde temiz içme suyuna erişim altyapı yatırımları',
    'E-2.8.3: İklim değişikliğine bağlı su kıtlığı ve aşırı yağışlardan kaynaklanan sağlık risklerinin azaltılması',
    'E-2.8.4: Mikroplastiklerin ve mikrokirleticilerin neden olduğu su kirliliğinin önlenmesi',
    'E-2.8.5: Su kaynaklı hastalık ve salgınların epidemiyolojisi için halk sağlığı gözetimi',
    'E-2.8.6: Sağlık Etki Değerlendirmesi (SED) yöntemine ilişkin çalışmalar yapılması',
    'E-2.8.7: Atıksu ve çevresel sürveyans uygulama sonuçlarının yaygınlaştırılması',
    'E-2.9.1: Yeraltı suyu depolama tesisleri (YAS Barajları) ve suni besleme yapıları inşası',
    'E-2.9.2: Uygun yerlerde baraj ve gölet yatırımlarının yapılması',
    'E-3.1.1: Su kaynaklarında ve depolamalı tesislerde iklim değişikliği etkilerinin analizi',
    'E-3.1.2: İklim değişikliğinin deniz seviyesi, kıyılar, göller ve sulak alanlar üzerindeki etkileri',
    'E-3.1.3: İklim değişikliğinin su kaynakları üzerindeki etkisinin kalite ve miktar olarak ele alınması',
    'E-3.2.1: Havza bütünlüğünde arazi tahribatının dengelenmesi ve erozyon kontrolü',
    'E-3.2.2: Taşkın ve sellerle gelen suların yerüstü ve yeraltında depolanması',
    'E-3.2.3: Ekosistem esaslı yaklaşım kapsamında doğal su tutma uygulamaları',
    'E-3.2.4: Kuraklık riski altında olan göller için Eylem Planı hazırlanması ve uygulanması',
    'E-3.2.5: Yerüstü su kaynaklarında buharlaşmanın önlenmesi için yüzer GES uygulamaları',
    'E-3.3.1: Su Verimliliği Strateji Belgesi ve Eylem Planında yer alan eylemlerin uygulanması',
    'E-3.3.2: Kurakçıl peyzaj uygulamalarının yaygınlaştırılması',
    'E-3.3.3: Su verimliliği kapsamında kurumlar arası iş birliğinin güçlendirilmesi',
    'E-3.3.4: Su verimliliği il planlarının hazırlanması',
    'E-4.1.1: 25 Nehir Havzasında Taşkın Yönetim Planlarının tamamlanması ve güncellenmesi',
    'E-4.1.2: Taşkın Yönetim Planlarında belirlenen tedbirlerin koordinasyonu ve izlenmesi',
    'E-4.1.3: İl Risk Azaltma Planları (İRAP) ve mekânsal planlamanın taşkın planlarıyla uyumu',
    'E-4.1.4: Taşkın Risk Yönetim Planlarında yer alan yapısal ve yapısal olmayan tedbirlerin uygulanması',
    'E-4.1.5: Akarsu yataklarına müdahalelerin önlenmesi, temizliği ve hidrolik yapıların bakımı',
    'E-4.1.6: Taşkın riskini azaltmaya yönelik kamulaştırma çalışmalarının yapılması',
    'E-4.1.7: Taşkın riski yüksek illerde risk azaltıcı yatırımlara öncelik verilmesi',
    'E-4.1.8: Mutlak taşkın alanlarının güncellenerek ilan edilmesi',
    'E-4.2.1: Kuraklık riski yüksek havzalarda kuraklık yatırımlarına öncelik verilmesi',
    'E-4.2.2: Kuraklık Yönetim Planlarında yer alan tedbirlerin uygulanması ve takibi',
    'E-4.3.1: Yukarı havzalarda sedimantasyon kontrolü ve arazi kullanım faaliyetleri',
    'E-4.3.2: Toprak koruma ve erozyonla mücadele politikaları ve izleme araçları',
    'E-4.3.3: Bütünleşik doğal kaynak yönetimini destekleyecek planlama, uygulama ve izleme',
    'E-5.1.1: Su yönetimi verilerinin tek çatı altında toplanması, siber güvenlik ve standartlaştırılması',
    'E-5.1.2: Havza ölçekli su yönetimi istatistiklerinin periyodik olarak üretilmesi',
    'E-5.1.3: Sektörel su kullanımlarında SCADA, IoT sensör ve akıllı ölçüm cihazlarının artırılması',
    'E-5.2.1: CBS tabanlı Ulusal Su Bilgi Sisteminin kurulması ve canlıya alınması',
    'E-5.2.2: Kurumlar tarafından işletilen su bilgi ve izleme sistemlerinin entegrasyonu',
    'E-5.2.3: Su kalitesi ve miktarı için dijital ikiz, yapay zekâ ve uzaktan algılama yazılımları',
    'E-5.2.4: Tarımsal su tüketiminin uydu görüntüleri ile izlenmesi ve düzenli raporlanması',
    'E-5.2.5: Gerçek zamanlı izleme, yapay zekâ ve senaryo üretme kabiliyetli Akıllı Su Yönetim Sistemi',
    'E-5.2.6: HİDROTÜRK hidrolojik, hidrodinamik ve su kalitesi modellerinin geliştirilmesi',
    'E-5.2.7: SUTEM Bilgi Sistemi kapsamının genişletilmesi, sulamalarda performans değerlendirmesi',
    'E-5.2.8: Sulama şebekelerinde ön ödemeli sayaç uygulamalarının yaygınlaştırılması',
    'E-5.2.9: Bitki koruma ilaçlarının takibine ilişkin dinamik bilgi sisteminin kurulması',
    'E-5.2.10: Su yönetiminde teknolojik gelişmeleri takip edecek inovasyon biriminin kurulması',
    'E-5.2.11: Karar destek ve bilgi sistemlerinin personel, donanım ve yazılım altyapısının iyileştirilmesi',
    'E-5.3.1: Yapay zekâ ve fizik tabanlı Taşkın Tahmini ve Erken Uyarı Sistemlerinin kurulması',
    'E-5.3.2: Kuraklık Tahmini ve Erken Uyarı Sisteminin kurulması ve yaygınlaştırılması',
    'E-5.4.1: Mikrobiyal yakıt hücrelerinin su havzaları ve bozulmuş arazilerde rehabilitasyon kullanımı',
    'E-5.4.2: Mikro şebekeler, güneş panelleri ve akıllı su dağıtım ağları ile su tedariki',
    'E-5.4.3: Su verimliliği ve düşük karbon emisyonu hedefleriyle rejeneratif tarım uygulamaları',
    'E-5.4.4: Su kaynaklarında antibiyotik varlıkları ve direnç genlerinin araştırılması ve arıtımı',
    'E-6.1.1: Havza ölçekli planlar ve riskler dikkate alınarak yatırım önceliklendirme metodolojisi',
    'E-6.1.2: Su yönetimi proje ve yatırımlarının sürdürülebilirliği için finansal mekanizmalar',
    'E-6.1.3: Önceliklendirme programına uygun olarak su yönetimi yatırımlarının programa alınması',
    'E-6.1.4: Yenilenebilir enerji altyapıları, suyun geri kazanımı ve yeşil altyapı yatırımları',
    'E-6.2.1: Su ve atıksu tesislerinde alternatif enerji ve net sıfır enerji modeline geçiş',
    'E-6.2.2: Suya ilişkin yatırımların etkin işletilmesi için idarelerin personel kapasitesi',
    'E-6.2.3: Yağmur suyu ve atıksu toplama hatlarının ayrık sistem olarak projelendirilmesi',
    'E-6.2.4: Sudan elde edilen gelirlerin su yatırımlarında kullanılması oranının artırılması',
    'E-6.3.1: Tüm sektörlerde verimli su kullanımını teşvik edecek düzenleyici fiyatlandırma yapısı',
    'E-6.3.2: Ulusal ve uluslararası finansman programlarında su verimliliği çalışmalarına öncelik',
    'E-6.3.3: Riskli havzalarda SUKAP ve kamu-özel iş birliği yatırım modellerinin geliştirilmesi',
    'E-7.1.1: Enerji, tarım ve ekosistem ihtiyacının optimizasyonu için sektörler arası dijital veri paylaşımı',
    'E-7.1.2: Sektörler arası bağlantısallığı (WEFE Nexus) anlayan nitelikli uzmanların yetiştirilmesi',
    'E-7.1.3: Gıda, enerji, su ve ulaşım teşvik ve destek programlarının uyumlaştırılması',
    'E-7.2.1: İçme suyu, sanayi ve tarım sektörlerinde su yönetimi iş birliği ve farkındalık etkinlikleri',
    'E-7.2.2: Su, gıda ve enerji sektörel girişimlerini destekleyen projelerin hayata geçirilmesi',
    'E-7.2.3: Çapraz sektörel çalışma grupları ile çözüm önerilerinin geliştirilmesi',
    'E-7.2.4: Kamu, özel sektör, akademi ve sivil toplum çok paydaşlı platformlarının kurulması',
    'E-7.3.1: Gıda ve enerji sektörlerine ilişkin konuların su kurullarının gündemine alınması',
    'E-7.3.2: Uygulanan politikaların ekonomik sürdürülebilirliği ve iş gücü etkilerinin izlenmesi',
    'E-7.3.3: Çevre dostu ürün ve teknolojilerin üretimi ile ticaretini teşvik eden politikalar',
    'E-7.4.1: Mekânsal ve sektörel planlamalarda suya göre planlama ilkesinin esas alınması',
    'E-7.4.2: Suya göre planlama esasına dayalı havzalararası su transferi etki analizleri',
    'E-7.4.3: Kurak dönemlerde havza ve alt havza bazında sektörel su ihtiyaçlarının belirlenmesi',
    'E-8.1.1: Bilgilendirme, danışma ve karar alma süreçlerini içeren Su İletişim Planı hazırlanması',
    'E-8.1.2: Su İletişim Planı bilgilendirme aşaması faaliyetlerinin yürütülmesi',
    'E-8.1.3: Su İletişim Planı dahilinde danışma ve paydaş görüş alma süreçlerinin işletilmesi',
    'E-8.1.4: Ulusal ve uluslararası düzeyde dijital su eğitim programlarının uygulanması',
    'E-8.2.1: Çevre dostu tarım ve nitrat kirliliğinin önlenmesine yönelik çiftçi eğitimleri',
    'E-8.2.2: Tarımsal sulamada su verimliliğinin sağlanmasına yönelik çiftçi eğitimleri',
    'E-8.2.3: Sanayi bölgelerinde atıksu geri kazanımı ve döngüsel su kullanımı eğitimleri',
    'E-8.2.4: Geleneksel olmayan su kaynakları konusunda teknik kapasite ve farkındalık artırma',
    'E-8.2.5: Eğitim müfredatlarında su kaynaklarının önemi ve verimli kullanım içeriği',
    'E-8.2.6: Su baskını, sel ve taşkın afetleri konusunda toplumsal bilinçlendirme',
    'E-8.2.7: Su kıtlığı ve kuraklık riskine karşı kapasite geliştirme ve farkındalık',
    'E-8.2.8: Temiz su, sanitasyon ve güvenli su kullanımı konusunda toplum eğitimi',
    'E-8.2.9: Su tasarrufu ve su kaynaklarının korunması sosyal medya ve yerel etkinlikleri',
    'E-8.2.10: İklim değişikliğinin su kaynaklarına etkileri hususunda farkındalık ve bilinçlendirme'
  ];
}


/**
 * =========================================================================
 * MEVCUT CANLI FORMU GÜNCELLEME FONKSİYONU (ÖNERİLEN - TEK TIKLA ÇALIŞTIRIN)
 * =========================================================================
 * 
 * Daha önce oluşturduğunuz mevcut Google Formu (ID: 1TN_SWy4wV4vFh48xIBVeeIkYA8SGA43QwjjnfQF2v2Y)
 * sıfırdan oluşturmaya gerek kalmadan, 1. sorudaki kurum listesini 
 * Ulusal Su Planı DETSİS kayıtları (83 resmi kurum/birim) ile anında günceller.
 */
function updateExistingFormWithDetsis() {
  var formId = '1TN_SWy4wV4vFh48xIBVeeIkYA8SGA43QwjjnfQF2v2Y';
  var form = FormApp.openById(formId);
  var items = form.getItems();
  var kurumItem = null;

  for (var i = 0; i < items.length; i++) {
    var title = items[i].getTitle();
    if (title.indexOf('Veri Girişi Yapan Kurum') !== -1 || title.indexOf('1.') === 0) {
      if (items[i].getType() === FormApp.ItemType.LIST) {
        kurumItem = items[i].asListItem();
        break;
      }
    }
  }

  var detsisChoices = getUspDetsisInstitutions();

  if (kurumItem) {
    kurumItem.setTitle('1. Veri Girişi Yapan Kurum / Birim (DETSİS)')
      .setHelpText('Lütfen Ulusal Su Planında görevlendirilmiş resmi kurum/biriminizi seçiniz (DETSİS numarası veya kurum adı ile arayabilirsiniz).')
      .setChoiceValues(detsisChoices)
      .setRequired(true);
    Logger.log('Mevcut Form başarıyla DETSİS kurumları ile güncellendi! Toplam Kurum/Birim: ' + detsisChoices.length);
  } else {
    Logger.log('Kurum sorusu bulunamadı, lütfen form yapısını kontrol ediniz.');
  }
}

/**
 * Ulusal Su Planında (2026-2035) 141 eylemde görevlendirilmiş resmi kurum ve birimlerin
 * DETSİS (Devlet Teşkilatı Merkezi Kayıt Sistemi) listesi (83 adet)
 */
function getUspDetsisInstitutions() {
  return [
    '[10528498] Tarım ve Orman Bakanlığı - Su Yönetimi Genel Müdürlüğü (SYGM)',
    '[62165727] Devlet Su İşleri Genel Müdürlüğü (DSİ)',
    '[92036835] Tarım ve Orman Bakanlığı - Tarım Reformu Genel Müdürlüğü (TRGM)',
    '[42074107] Meteoroloji Genel Müdürlüğü (MGM)',
    '[79106933] Çevre, Şehircilik ve İklim Değişikliği Bakanlığı - Çölleşme ve Erozyonla Mücadele Genel Müdürlüğü (ÇEM)',
    '[79936596] Orman Genel Müdürlüğü (OGM)',
    '[67904778] Doğa Koruma ve Milli Parklar Genel Müdürlüğü (DKMP)',
    '[12595311] Tarım ve Orman Bakanlığı - Tarımsal Araştırmalar ve Politikalar Genel Müdürlüğü (TAGEM)',
    '[83364995] Tarım ve Orman Bakanlığı - Balıkçılık ve Su Ürünleri Genel Müdürlüğü (BSGM)',
    '[62664799] Tarım ve Orman Bakanlığı - Bitkisel Üretim Genel Müdürlüğü (BÜGEM)',
    '[15182305] Tarım ve Orman Bakanlığı - Gıda ve Kontrol Genel Müdürlüğü (GKGM)',
    '[29038238] Türkiye Su Enstitüsü Başkanlığı (SUEN)',
    '[24308110] Tarım ve Orman Bakanlığı (Merkez Teşkilatı)',
    '[38256534] Çevre, Şehircilik ve İklim Değişikliği Bakanlığı - Çevre Yönetimi Genel Müdürlüğü (ÇYGM)',
    '[50038206] İklim Değişikliği Başkanlığı',
    '[58003700] Çevre, Şehircilik ve İklim Değişikliği Bakanlığı - Çevresel Etki Değerlendirmesi, İzin ve Denetim GM (ÇEDİDGM)',
    '[52942367] Çevre, Şehircilik ve İklim Değişikliği Bakanlığı - Mekânsal Planlama Genel Müdürlüğü',
    '[78883034] Çevre, Şehircilik ve İklim Değişikliği Bakanlığı - Tabiat Varlıklarını Koruma Genel Müdürlüğü (TVKGM)',
    '[90564351] Çevre, Şehircilik ve İklim Değişikliği Bakanlığı - Yapı İşleri Genel Müdürlüğü',
    '[91257196] İller Bankası Anonim Şirketi Genel Müdürlüğü (İLBANK)',
    '[24304062] Çevre, Şehircilik ve İklim Değişikliği Bakanlığı (Merkez Teşkilatı)',
    '[56388857] Afet ve Acil Durum Yönetimi Başkanlığı (AFAD)',
    '[56906803] İçişleri Bakanlığı - İller İdaresi Genel Müdürlüğü',
    '[24312041] İçişleri Bakanlığı (Merkez Teşkilatı)',
    '[23248055] Sağlık Bakanlığı - Halk Sağlığı Genel Müdürlüğü',
    '[24322010] Sağlık Bakanlığı (Merkez Teşkilatı)',
    '[12631110] Sanayi ve Teknoloji Bakanlığı - Sanayi Bölgeleri Genel Müdürlüğü',
    '[18174606] TÜBİTAK - Marmara Araştırma Merkezi Başkanlığı (MAM)',
    '[24302121] Sanayi ve Teknoloji Bakanlığı (Merkez Teşkilatı)',
    '[39146371] Enerji ve Tabii Kaynaklar Bakanlığı - Enerji İşleri Genel Müdürlüğü',
    '[37028593] Maden Tetkik ve Arama Genel Müdürlüğü (MTA)',
    '[48909307] Maden ve Petrol İşleri Genel Müdürlüğü (MAPEG)',
    '[67717851] Elektrik Üretim Anonim Şirketi Genel Müdürlüğü (EÜAŞ)',
    '[24306170] Enerji ve Tabii Kaynaklar Bakanlığı (Merkez Teşkilatı)',
    '[84003517] Karayolları Genel Müdürlüğü (KGM)',
    '[15922579] T.C. Devlet Demiryolları İşletmesi Genel Müdürlüğü (TCDD)',
    '[60279093] Devlet Hava Meydanları İşletmesi Genel Müdürlüğü (DHMİ)',
    '[58891979] Ulaştırma ve Altyapı Bakanlığı - Altyapı Yatırımları Genel Müdürlüğü (AYGM)',
    '[24325150] Ulaştırma ve Altyapı Bakanlığı (Merkez Teşkilatı)',
    '[69162001] Harita Genel Müdürlüğü (HGM)',
    '[24314011] Strateji ve Bütçe Başkanlığı (SBB)',
    '[24316011] Hazine ve Maliye Bakanlığı',
    '[24305112] Dışişleri Bakanlığı',
    '[24316060] Milli Eğitim Bakanlığı (MEB)',
    '[24314261] Kültür ve Turizm Bakanlığı',
    '[19743215] Türkiye İstatistik Kurumu Başkanlığı (TÜİK)',
    '[43118544] Türkiye Belediyeler Birliği Başkanlığı (TBB)',
    '[32625594] Yükseköğretim Kurulu Başkanlığı (YÖK) / Üniversiteler',
    '[37609250] Adana Su ve Kanalizasyon İdaresi Genel Müdürlüğü (ASKİ)',
    '[39182813] Ankara Su ve Kanalizasyon İdaresi Genel Müdürlüğü (ASKİ)',
    '[98741390] Antalya Su ve Atıksu İdaresi Genel Müdürlüğü (ASAT)',
    '[88606772] Aydın Su ve Kanalizasyon İdaresi Genel Müdürlüğü (ASKİ)',
    '[15884763] Balıkesir Su ve Kanalizasyon İdaresi Genel Müdürlüğü (BASKİ)',
    '[66170681] Bursa Su ve Kanalizasyon İdaresi Genel Müdürlüğü (BUSKİ)',
    '[89114452] Denizli Su ve Kanalizasyon İdaresi Genel Müdürlüğü (DESKİ)',
    '[40430699] Diyarbakır Su ve Kanalizasyon İdaresi Genel Müdürlüğü (DİSKİ)',
    '[71957391] Erzurum Su ve Kanalizasyon İdaresi Genel Müdürlüğü (ESKİ)',
    '[15074753] Eskişehir Su ve Kanalizasyon İdaresi Genel Müdürlüğü (ESKİ)',
    '[16330667] Gaziantep Su ve Kanalizasyon İdaresi Genel Müdürlüğü (GASKİ)',
    '[41736506] Hatay Su ve Kanalizasyon İdaresi Genel Müdürlüğü (HATSU)',
    '[19394389] İstanbul Su ve Kanalizasyon İdaresi Genel Müdürlüğü (İSKİ)',
    '[52158563] İzmir Su ve Kanalizasyon İdaresi Genel Müdürlüğü (İZSU)',
    '[52327194] Kahramanmaraş Su ve Kanalizasyon İdaresi Genel Müdürlüğü (KASKİ)',
    '[93326652] Kayseri Su ve Kanalizasyon İdaresi Genel Müdürlüğü (KASKİ)',
    '[37801275] Kocaeli Su ve Kanalizasyon İdaresi Genel Müdürlüğü (İSU)',
    '[12066277] Konya Su ve Kanalizasyon İdaresi Genel Müdürlüğü (KOSKİ)',
    '[41668568] Malatya Su ve Kanalizasyon İdaresi Genel Müdürlüğü (MASKİ)',
    '[84120892] Manisa Su ve Kanalizasyon İdaresi Genel Müdürlüğü (MASKİ)',
    '[24894789] Mardin Su ve Kanalizasyon İdaresi Genel Müdürlüğü (MARSU)',
    '[10655259] Mersin Su ve Kanalizasyon İdaresi Genel Müdürlüğü (MESKİ)',
    '[52914738] Muğla Su ve Kanalizasyon İdaresi Genel Müdürlüğü (MUSKİ)',
    '[94384226] Ordu Su ve Kanalizasyon İdaresi Genel Müdürlüğü (OSKİ)',
    '[87494595] Sakarya Su ve Kanalizasyon İdaresi Genel Müdürlüğü (SASKİ)',
    '[29764081] Samsun Su ve Kanalizasyon İdaresi Genel Müdürlüğü (SASKİ)',
    '[56353920] Şanlıurfa Su ve Kanalizasyon İdaresi Genel Müdürlüğü (ŞUSKİ)',
    '[31616290] Tekirdağ Su ve Kanalizasyon İdaresi Genel Müdürlüğü (TESKİ)',
    '[72009125] Trabzon İçmesuyu ve Kanalizasyon İdaresi Genel Müdürlüğü (TİSKİ)',
    '[94255678] Van Su ve Kanalizasyon İdaresi Genel Müdürlüğü (VASKİ)',
    '[YEREL-VALI] Valilikler / İl Su Kurulları / İl Özel İdareleri',
    '[YEREL-BLD] Büyükşehir, İl ve İlçe Belediyeleri (Su İdaresi Dışındaki Birimler)',
    '[YEREL-SULAMA] Sulama Birlikleri ve Sulama Kooperatifleri',
    '[YEREL-OSB] Organize Sanayi Bölgeleri (OSB) Yönetimleri',
    '[DIGER] Diğer İlgili Kurum / Kuruluş'
  ];
}
