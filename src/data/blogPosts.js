import { petImages } from '../utils/petImages';

export const blogPosts = [
  {
    id: 1,
    slug: 'kopeklerde-asilama-ne-zaman-hangi-asilar',
    title: 'Köpeklerde Aşılama: Ne Zaman ve Hangi Aşılar?',
    excerpt: 'Köpeğinizin sağlıklı bir yaşam sürmesi için aşılama programının önemi ve aşılama takvimi hakkında bilmeniz gerekenler.',
    category: 'Sağlık',
    date: '15 Mart 2024',
    author: 'Dr. Ayşe Yılmaz',
    image: petImages.dogs[0],
    content: `
      <h2>Aşılama Neden Önemlidir?</h2>
      <p>Köpeklerde aşılama, birçok ciddi ve potansiyel olarak ölümcül hastalıktan korunmak için en etkili yöntemdir. Düzenli aşılama programı, hem köpeğinizin hem de çevresindeki diğer hayvanların sağlığını korur.</p>

      <h2>Temel Aşılar ve Zamanlaması</h2>
      <h3>6-8 Haftalık</h3>
      <ul>
        <li><strong>Karma Aşı (5'li veya 6'lı):</strong> Parvovirüs, Distemper, Hepatitis, Parainfluenza, Leptospirosis</li>
      </ul>

      <h3>12 Haftalık</h3>
      <ul>
        <li><strong>Karma Aşı Rapeli:</strong> İlk aşının pekiştirilmesi</li>
        <li><strong>Kuduz Aşısı:</strong> Zorunlu aşı</li>
      </ul>

      <h3>16 Haftalık</h3>
      <ul>
        <li><strong>Son Rapel:</strong> Tam koruma için son doz</li>
      </ul>

      <h2>Yıllık Aşılar</h2>
      <p>İlk aşılama programı tamamlandıktan sonra, köpeğiniz her yıl rapel aşılarını yaptırmalıdır. Bu aşılar şunları içerir:</p>
      <ul>
        <li>Karma aşı rapeli (yıllık)</li>
        <li>Kuduz aşısı rapeli (yıllık veya 3 yılda bir, yerel düzenlemelere göre)</li>
      </ul>

      <h2>Aşı Öncesi ve Sonrası Dikkat Edilmesi Gerekenler</h2>
      <ul>
        <li>Köpeğinizin sağlıklı olduğundan emin olun</li>
        <li>Aşı sonrası 24-48 saat köpeğinizi dinlendirin</li>
        <li>Hafif ateş ve halsizlik normaldir</li>
        <li>Ciddi yan etkiler görürseniz hemen veterinerinize başvurun</li>
      </ul>

      <h2>Sonuç</h2>
      <p>Düzenli aşılama programı, köpeğinizin uzun ve sağlıklı bir yaşam sürmesi için vazgeçilmezdir. Aşılama takvimi için mutlaka veterinerinizle görüşün ve kayıtları düzenli tutun.</p>
    `,
    tags: ['aşılama', 'köpek sağlığı', 'veteriner', 'koruyucu sağlık'],
  },
  {
    id: 2,
    slug: 'kedilerde-tuy-bakimi-ve-onemi',
    title: 'Kedilerde Tüy Bakımı ve Önemi',
    excerpt: 'Kedinizin tüylerini düzenli olarak bakmanın önemi ve doğru tüy bakımı teknikleri hakkında detaylı bilgiler.',
    category: 'Bakım',
    date: '12 Mart 2024',
    author: 'Dr. Zeynep Kaya',
    image: petImages.cats[0],
    content: `
      <h2>Tüy Bakımının Önemi</h2>
      <p>Kediler doğal olarak temiz hayvanlardır ve kendilerini düzenli olarak temizlerler. Ancak, özellikle uzun tüylü kedilerde düzenli tüy bakımı hayati önem taşır.</p>

      <h2>Tüy Bakımının Faydaları</h2>
      <ul>
        <li><strong>Tüy Toplarını Önler:</strong> Düzenli tarama, kedinin yuttuğu tüy miktarını azaltır</li>
        <li><strong>Cilt Sağlığı:</strong> Kan dolaşımını uyarır ve cilt sağlığını korur</li>
        <li><strong>Bağ Kurma:</strong> Kedinizle aranızdaki bağı güçlendirir</li>
        <li><strong>Erken Teşhis:</strong> Cilt problemleri, parazitler veya şişlikleri erken fark etmenizi sağlar</li>
      </ul>

      <h2>Tüy Bakımı Sıklığı</h2>
      <h3>Kısa Tüylü Kediler</h3>
      <p>Haftada 1-2 kez tarama yeterlidir.</p>

      <h3>Uzun Tüylü Kediler</h3>
      <p>Her gün veya en az gün aşırı tarama yapılmalıdır.</p>

      <h2>Doğru Tarama Teknikleri</h2>
      <ol>
        <li>Kedinizin rahat olduğu bir ortam seçin</li>
        <li>Uygun tarak veya fırça kullanın</li>
        <li>Tüy yönünde nazikçe tarayın</li>
        <li>Düğümlenen tüyleri sabırla açın</li>
        <li>Özellikle kulak arkası, koltuk altı ve karnı kontrol edin</li>
      </ol>

      <h2>Gerekli Araçlar</h2>
      <ul>
        <li>Metal tarak (ince ve kalın dişli)</li>
        <li>Fırça (kedi tüyüne uygun)</li>
        <li>Tüy topu önleyici macun</li>
        <li>Makas (düğümleri açmak için)</li>
      </ul>

      <h2>Sonuç</h2>
      <p>Düzenli tüy bakımı, kedinizin sağlığını ve mutluluğunu doğrudan etkiler. Sabırlı ve nazik olmayı unutmayın!</p>
    `,
    tags: ['kedi bakımı', 'tüy bakımı', 'grooming', 'kedi sağlığı'],
  },
  {
    id: 3,
    slug: 'yavru-kopek-beslenmesi-ilk-adimlar',
    title: 'Yavru Köpek Beslenmesi: İlk Adımlar',
    excerpt: 'Yavru köpeğinizin sağlıklı büyümesi için doğru beslenme programı ve dikkat edilmesi gereken noktalar.',
    category: 'Beslenme',
    date: '8 Mart 2024',
    author: 'Dr. Mehmet Demir',
    image: petImages.puppies[0],
    content: `
      <h2>Yavru Köpek Beslenmesinin Önemi</h2>
      <p>Yaşamın ilk ayları, köpeğinizin gelecekteki sağlığının temelini atar. Doğru beslenme, kemik gelişimi, bağışıklık sistemi ve genel sağlık için kritik öneme sahiptir.</p>

      <h2>Yaş Gruplarına Göre Beslenme</h2>

      <h3>0-4 Hafta: Anne Sütü Dönemi</h3>
      <p>Bu dönemde yavru köpekler sadece anne sütüyle beslenir. Anne sütü, yavrular için en mükemmel besindir ve antikor içerir.</p>

      <h3>4-8 Hafta: Geçiş Dönemi</h3>
      <ul>
        <li>Yavaş yavaş katı mamaya geçiş yapılır</li>
        <li>Yumuşatılmış yavru maması verilir</li>
        <li>Günde 4-5 öğün küçük porsiyonlar</li>
      </ul>

      <h3>8-12 Hafta: Tam Katı Gıda</h3>
      <ul>
        <li>Kuru yavru maması verilmeye başlanır</li>
        <li>Günde 3-4 öğün</li>
        <li>Taze su her zaman erişilebilir olmalı</li>
      </ul>

      <h3>3-6 Ay</h3>
      <ul>
        <li>Günde 3 öğün düzenli beslenme</li>
        <li>Irkına uygun yavru maması</li>
      </ul>

      <h3>6-12 Ay</h3>
      <ul>
        <li>Günde 2 öğüne geçiş</li>
        <li>Porsiyon miktarı artırılır</li>
      </ul>

      <h2>Mama Seçimi</h2>
      <ul>
        <li><strong>Yavru Mamalarını Tercih Edin:</strong> Büyüme için gerekli besinleri içerir</li>
        <li><strong>Irk Büyüklüğüne Uygun:</strong> Küçük, orta veya büyük ırk formülleri</li>
        <li><strong>Kaliteli Protein:</strong> İlk maddede et olmalı</li>
        <li><strong>DHA ve Kalsiyum:</strong> Beyin ve kemik gelişimi için önemli</li>
      </ul>

      <h2>Yapılmaması Gerekenler</h2>
      <ul>
        <li>İnsan yemeği vermek</li>
        <li>Çikolata, üzüm, soğan gibi zehirli gıdalar</li>
        <li>Aşırı beslenme - obeziteye yol açar</li>
        <li>Ani mama değişiklikleri</li>
      </ul>

      <h2>Sonuç</h2>
      <p>Doğru beslenme programı, yavru köpeğinizin sağlıklı bir yetişkin olması için temeldir. Veterinerinizle düzenli iletişimde kalın.</p>
    `,
    tags: ['yavru köpek', 'beslenme', 'köpek bakımı', 'yavru mama'],
  },
  {
    id: 4,
    slug: 'evcil-hayvanlarda-dis-sagligi',
    title: 'Evcil Hayvanlarda Diş Sağlığı',
    excerpt: 'Köpek ve kedilerde diş bakımının önemi, diş taşı oluşumu ve tedavi yöntemleri hakkında bilgiler.',
    category: 'Sağlık',
    date: '5 Mart 2024',
    author: 'Dr. Can Öztürk',
    image: petImages.dogs[1],
    content: `
      <h2>Diş Sağlığının Önemi</h2>
      <p>Evcil hayvanlarda diş ve diş eti sağlığı, genel sağlık durumunu doğrudan etkiler. İhmal edilen diş problemleri kalp, böbrek ve karaciğer hastalıklarına yol açabilir.</p>

      <h2>Yaygın Diş Problemleri</h2>

      <h3>Diş Taşı</h3>
      <p>Plak birikiminin mineralize olması sonucu oluşur. Diş eti hastalıklarına ve diş kaybına yol açabilir.</p>

      <h3>Diş Eti İltihabı (Gingivitis)</h3>
      <p>Diş etlerinde kızarıklık, şişlik ve kanama ile karakterizedir. Tedavi edilmezse periodontitise ilerler.</p>

      <h3>Periodontitis</h3>
      <p>Diş etini ve dişi tutan kemiği etkileyen ciddi bir durumdur. Diş kaybına neden olabilir.</p>

      <h2>Diş Bakımı Nasıl Yapılır?</h2>

      <h3>Günlük Diş Fırçalama</h3>
      <ol>
        <li>Evcil hayvan diş macunu ve fırçası kullanın</li>
        <li>Yavaş ve nazik hareketlerle başlayın</li>
        <li>Dış yüzeylere odaklanın</li>
        <li>Alıştıkça süreyi artırın</li>
      </ol>

      <h3>Diş Bakım Ürünleri</h3>
      <ul>
        <li>Diş çubukları ve çiğneme oyuncakları</li>
        <li>Diş temizleme ağız suları</li>
        <li>Özel diş bakım mamaları</li>
      </ul>

      <h2>Profesyonel Diş Temizliği</h2>
      <p>Veteriner kontrolünde yapılan profesyonel diş temizliği yılda 1-2 kez önerilir. Bu işlem:</p>
      <ul>
        <li>Anestezi altında yapılır</li>
        <li>Diş taşı tamamen temizlenir</li>
        <li>Diş etleri kontrol edilir</li>
        <li>Gerekirse diş çekimi yapılır</li>
      </ul>

      <h2>Diş Problemi Belirtileri</h2>
      <ul>
        <li>Ağız kokusu</li>
        <li>Aşırı salyalanma</li>
        <li>Yemek yerken zorluk</li>
        <li>Ağzına dokunulmasından rahatsız olma</li>
        <li>Diş eti kanaması</li>
      </ul>

      <h2>Önleyici Tedbirler</h2>
      <ul>
        <li>Düzenli diş fırçalama (günlük idealdir)</li>
        <li>Yılda 1-2 kez veteriner kontrolü</li>
        <li>Kaliteli diş bakım ürünleri kullanımı</li>
        <li>Sert kemik ve oyuncaklardan kaçının</li>
      </ul>

      <h2>Sonuç</h2>
      <p>Diş sağlığı, evcil hayvanınızın yaşam kalitesini doğrudan etkiler. Düzenli bakım ve veteriner kontrolleriyle birçok ciddi problemi önleyebilirsiniz.</p>
    `,
    tags: ['diş sağlığı', 'köpek sağlığı', 'kedi sağlığı', 'veteriner bakım'],
  },
  {
    id: 5,
    slug: 'kedi-kopeklerde-parazit-korumasi',
    title: 'Kedi ve Köpeklerde Parazit Koruması',
    excerpt: 'İç ve dış parazitlerden korunma yöntemleri ve düzenli parazit kontrol programının önemi.',
    category: 'Koruma',
    date: '1 Mart 2024',
    author: 'Dr. Ayşe Yılmaz',
    image: petImages.cats[1],
    content: `
      <h2>Parazitler Neden Tehlikelidir?</h2>
      <p>Parazitler evcil hayvanınızın sağlığını ciddi şekilde tehdit edebilir ve bazıları insanlara da bulaşabilir (zoonoz hastalıklar). Düzenli korunma programı hayati önem taşır.</p>

      <h2>Dış Parazitler</h2>

      <h3>Pire</h3>
      <ul>
        <li>Kaşıntı ve cilt tahrişi</li>
        <li>Alerjik dermatit</li>
        <li>Tenya taşıyabilir</li>
      </ul>

      <h3>Kene</h3>
      <ul>
        <li>Lyme hastalığı</li>
        <li>Ehrlichiosis</li>
        <li>Babesiosis</li>
      </ul>

      <h3>Uyuz</h3>
      <ul>
        <li>Ciddi kaşıntı</li>
        <li>Tüy dökülmesi</li>
        <li>Cilt enfeksiyonları</li>
      </ul>

      <h2>İç Parazitler</h2>

      <h3>Yuvarlak Solucanlar</h3>
      <p>Özellikle yavru köpek ve kedilerde yaygındır. Karın şişliği, kusma ve ishale neden olur.</p>

      <h3>Tenya (Şerit Solucan)</h3>
      <p>Pireler aracılığıyla bulaşır. Kilo kaybı ve anüs çevresinde tahriş yapar.</p>

      <h3>Kancalı Solucanlar</h3>
      <p>Bağırsaklara yapışarak kan emerler. Anemi ve zayıflığa neden olur.</p>

      <h3>Giardia</h3>
      <p>Mikroskobik bir parazittir. İshal ve kilo kaybına yol açar.</p>

      <h2>Koruma Programı</h2>

      <h3>Dış Parazitler İçin</h3>
      <ul>
        <li><strong>Damla İlaçlar:</strong> Aylık uygulanır, pire ve kene korur</li>
        <li><strong>Tasma:</strong> Kene ve pire önleyici tasmalar</li>
        <li><strong>Sprey/Pudra:</strong> Acil durumlarda kullanılır</li>
        <li><strong>Tablet:</strong> Aylık çiğneme tabletleri</li>
      </ul>

      <h3>İç Parazitler İçin</h3>
      <ul>
        <li><strong>3 Aylık İlaçlama:</strong> Düzenli iç parazit ilaçları</li>
        <li><strong>Dışkı Muayenesi:</strong> Yılda 1-2 kez veteriner kontrolü</li>
        <li><strong>Hijyen:</strong> Kum kabı ve yaşam alanının temizliği</li>
      </ul>

      <h2>İlaçlama Takvimi</h2>

      <h3>Yavru Köpek/Kedi (0-6 Ay)</h3>
      <ul>
        <li>Her 2 haftada bir iç parazit ilacı (ilk 12 hafta)</li>
        <li>Sonra aylık devam</li>
        <li>8. haftadan itibaren dış parazit koruması</li>
      </ul>

      <h3>Yetişkin (6+ Ay)</h3>
      <ul>
        <li>Her 3 ayda bir iç parazit ilacı</li>
        <li>Aylık dış parazit koruması</li>
        <li>Yılda 1-2 dışkı kontrolü</li>
      </ul>

      <h2>Parazit Belirtileri</h2>
      <ul>
        <li>Aşırı kaşınma</li>
        <li>Tüy dökülmesi</li>
        <li>Kilo kaybı</li>
        <li>Kusma ve ishal</li>
        <li>Şişkin karın (yavru hayvanlarda)</li>
        <li>Anüs çevresinde kayma</li>
      </ul>

      <h2>Çevre Hijyeni</h2>
      <ul>
        <li>Yatak ve oyuncakları düzenli yıkayın</li>
        <li>Halıları ve mobilyaları temizleyin</li>
        <li>Dışkıları hemen toplayın</li>
        <li>Bahçe/balkon dezenfeksiyonu yapın</li>
      </ul>

      <h2>Sonuç</h2>
      <p>Düzenli parazit kontrol programı, hem evcil hayvanınızın hem de ailenizin sağlığı için kritik önem taşır. Veterinerinizle birlikte uygun koruma programını belirleyin.</p>
    `,
    tags: ['parazit', 'koruma', 'ilaçlama', 'veteriner bakım'],
  },
  {
    id: 6,
    slug: 'yasli-kedi-kopek-bakimi',
    title: 'Yaşlı Kedi ve Köpek Bakımı',
    excerpt: 'Yaşlanan evcil hayvanlarınız için özel bakım gereksinimleri ve sağlık kontrol programı.',
    category: 'Bakım',
    date: '28 Şubat 2024',
    author: 'Dr. Zeynep Kaya',
    image: petImages.mixed[0],
    content: `
      <h2>Evcil Hayvanlar Ne Zaman Yaşlı Sayılır?</h2>
      <ul>
        <li><strong>Küçük Köpekler (10kg altı):</strong> 7+ yaş</li>
        <li><strong>Orta/Büyük Köpekler:</strong> 6+ yaş</li>
        <li><strong>Dev Irk Köpekler:</strong> 5+ yaş</li>
        <li><strong>Kediler:</strong> 7+ yaş</li>
      </ul>

      <h2>Yaşlanma Belirtileri</h2>
      <ul>
        <li>Enerji seviyesinde azalma</li>
        <li>Gri tüylerin artması</li>
        <li>Görme ve işitme problemleri</li>
        <li>Eklem sertliği</li>
        <li>Kilo değişiklikleri</li>
        <li>Davranış değişiklikleri</li>
      </ul>

      <h2>Yaşlı Hayvan Bakım İhtiyaçları</h2>

      <h3>Beslenme</h3>
      <ul>
        <li><strong>Yaşlı Hayvan Maması:</strong> Özel formülasyonlu mamalar</li>
        <li><strong>Kolay Sindirim:</strong> Yumuşak veya küçük granüllü mamalar</li>
        <li><strong>Uygun Kalori:</strong> Aktivite seviyesine göre ayarlama</li>
        <li><strong>Eklem Desteği:</strong> Glucosamine ve chondroitin içerikli</li>
      </ul>

      <h3>Egzersiz</h3>
      <ul>
        <li>Kısa ama düzenli yürüyüşler</li>
        <li>Eklemlere zarar vermeyen aktiviteler</li>
        <li>Yüzme (mümkünse) - eklemlere nazik</li>
        <li>Zihinsel uyarıcı oyunlar</li>
      </ul>

      <h3>Veteriner Kontrolleri</h3>
      <p>Yaşlı hayvanlarda veteriner kontrolü 6 ayda bir yapılmalıdır:</p>
      <ul>
        <li>Kan testleri (böbrek, karaciğer fonksiyonları)</li>
        <li>İdrar analizi</li>
        <li>Tansiyon ölçümü</li>
        <li>Diş kontrolü</li>
        <li>Eklem muayenesi</li>
      </ul>

      <h2>Yaygın Yaşlılık Hastalıkları</h2>

      <h3>Artrit ve Eklem Problemleri</h3>
      <ul>
        <li>Ağrı kesici ve anti-enflamatuar ilaçlar</li>
        <li>Eklem takviyesi</li>
        <li>Yumuşak yatak</li>
        <li>Rampa kullanımı</li>
      </ul>

      <h3>Böbrek Hastalığı</h3>
      <ul>
        <li>Özel diyet</li>
        <li>Bol su tüketimi</li>
        <li>Düzenli kan testleri</li>
      </ul>

      <h3>Kalp Hastalığı</h3>
      <ul>
        <li>İlaç tedavisi</li>
        <li>Düşük sodyum diyeti</li>
        <li>Ilımlı egzersiz</li>
      </ul>

      <h3>Bilişsel Bozukluk (Demans)</h3>
      <ul>
        <li>Rutin koruma</li>
        <li>Zihinsel uyarım</li>
        <li>Özel ilaçlar</li>
      </ul>

      <h2>Ev Düzenlemeleri</h2>
      <ul>
        <li><strong>Yumuşak Yatak:</strong> Eklem rahatlığı için ortopedik yatak</li>
        <li><strong>Rampa/Basamak:</strong> Kanepe/yatağa erişim için</li>
        <li><strong>Kaymaz Zemin:</strong> Kayma riskini azaltır</li>
        <li><strong>Kolay Erişim:</strong> Su, mama ve tuvalet yakın olmalı</li>
        <li><strong>Sıcaklık Kontrolü:</strong> Soğuktan koruma</li>
      </ul>

      <h2>Yaşam Kalitesi</h2>

      <h3>Konfor</h3>
      <ul>
        <li>Ağrı yönetimi</li>
        <li>Rahat uyku alanı</li>
        <li>Kolay ulaşılabilir ihtiyaçlar</li>
      </ul>

      <h3>Sevgi ve İlgi</h3>
      <ul>
        <li>Daha fazla zaman geçirin</li>
        <li>Nazik fiziksel temas</li>
        <li>Sabırlı olun</li>
      </ul>

      <h3>Rutin</h3>
      <ul>
        <li>Düzenli beslenme saatleri</li>
        <li>Tahmin edilebilir aktiviteler</li>
        <li>Stres azaltma</li>
      </ul>

      <h2>Ağrı Belirtilerini Tanıma</h2>
      <ul>
        <li>Hareketlerde azalma</li>
        <li>İştahsızlık</li>
        <li>İnleme veya sızlanma</li>
        <li>Agresyon</li>
        <li>Saklanma</li>
        <li>Topallama</li>
      </ul>

      <h2>Sonuç</h2>
      <p>Yaşlı evcil hayvanlar özel bakım ve ilgi gerektirir. Sevginiz, sabırınız ve düzenli veteriner kontrolüyle yaşlı dostunuzun hayat kalitesini maksimum seviyede tutabilirsiniz. Her anın kıymetini bilin!</p>
    `,
    tags: ['yaşlı hayvan', 'senior bakım', 'geriatrik', 'yaşlılık'],
  },
];
