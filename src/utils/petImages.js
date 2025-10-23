// Pet fotoğrafları için ücretsiz kaynak URL'leri
// Unsplash'ten pet fotoğrafları

export const petImages = {
  // Köpekler
  dogs: [
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800',
    'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
    'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800',
    'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800',
    'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=800',
  ],

  // Kediler
  cats: [
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
    'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=800',
    'https://images.unsplash.com/photo-1573865526739-10c1de0b6c78?w=800',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
    'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800',
    'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800',
    'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=800',
    'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800',
  ],

  // Karışık (köpek + kedi)
  mixed: [
    'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800',
    'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800',
    'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=800',
    'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800',
  ],

  // Veteriner klinik görüntüleri
  clinic: [
    'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800',
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800',
    'https://images.unsplash.com/photo-1581888227599-779811939961?w=800',
  ],

  // Yavru hayvanlar
  puppies: [
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
    'https://images.unsplash.com/photo-1587402092301-725e37c70fd8?w=800',
    'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800',
    'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800',
  ],

  kittens: [
    'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=800',
    'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800',
    'https://images.unsplash.com/photo-1472491235688-bdc81a63246e?w=800',
  ],

  // Veteriner ekip fotoğrafları (genel medikal)
  team: [
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800',
    'https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=800',
  ],

  // Hero section için büyük görseller
  hero: [
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200',
    'https://images.unsplash.com/photo-1568572933382-74d440642117?w=1200',
  ],
};

// Random bir fotoğraf seç
export const getRandomPetImage = (category = 'mixed') => {
  const images = petImages[category] || petImages.mixed;
  return images[Math.floor(Math.random() * images.length)];
};

// Belirli index'teki fotoğrafı getir
export const getPetImage = (category, index = 0) => {
  const images = petImages[category] || petImages.mixed;
  return images[index % images.length];
};

// Tüm kategorilerden karışık al
export const getAllPetImages = () => {
  return [
    ...petImages.dogs,
    ...petImages.cats,
    ...petImages.puppies,
    ...petImages.kittens,
  ];
};
