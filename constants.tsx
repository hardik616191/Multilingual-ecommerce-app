
import { Language, Product, FulfillmentMode } from './types';

const generateProducts = (): Product[] => {
  const categories = ['Clothing', 'Electronics', 'Foods'];
  
  const catalogTemplates = {
    'Clothing': [
      { en: 'Slim Fit T-Shirt', hi: 'स्लिम फिट टी-शर्ट', gu: 'સ્લિમ ફિટ ટી-શર્ટ', tags: 'fashion,tshirt' },
      { en: 'Premium Denim Jeans', hi: 'प्रीमियम डेनिम जींस', gu: 'પ્રીમિયમ ડેનિમ જીન્સ', tags: 'jeans,denim' },
      { en: 'Traditional Silk Saree', hi: 'पारंपरिक रेशमी साड़ी', gu: 'પરંપરાગત રેશમી સાડી', tags: 'saree,indian,silk' },
      { en: 'Embroidered Kurta', hi: 'कढ़ाई वाला कुर्ता', gu: 'ભરતકામ કરેલ કુર્તા', tags: 'kurta,ethnic' },
      { en: 'Leather Biker Jacket', hi: 'लेदर बाइकर जैकेट', gu: 'લેધર બાઈકર જેકેટ', tags: 'jacket,leather' },
      { en: 'Linen Summer Dress', hi: 'लिनन समर ड्रेस', gu: 'લિનન સમર ડ્રેસ', tags: 'dress,summer' },
      { en: 'Formal Blazer', hi: 'फॉर्मल ब्लेज़र', gu: 'ફોર્મલ બ્લેઝર', tags: 'blazer,suit' },
      { en: 'Cotton Chinos', hi: 'कॉटन चिनोस', gu: 'કોટન ચીનોઝ', tags: 'pants,chinos' },
      { en: 'Knitted Sweater', hi: 'बुना हुआ स्वेटर', gu: 'ગૂંથેલા સ્વેટર', tags: 'sweater,winter' },
      { en: 'Graphic Hoodie', hi: 'ग्राफिक हुडी', gu: 'ગ્રાફિક હુડી', tags: 'hoodie,streetwear' }
    ],
    'Electronics': [
      { en: 'Wireless Headphones', hi: 'वायरलेस हेडफ़ोन', gu: 'વાયરલેસ હેડફોન', tags: 'headphones,audio' },
      { en: 'OLED Smart Watch', hi: 'OLED स्मार्ट वॉच', gu: 'OLED સ્માર્ટ વોચ', tags: 'smartwatch,tech' },
      { en: 'Portable Bluetooth Speaker', hi: 'पोर्टेबल ब्लूटूथ स्पीकर', gu: 'પોર્ટેબલ બ્લૂટૂથ સ્પીકર', tags: 'speaker,sound' },
      { en: 'Mechanical Keyboard', hi: 'मैकेनिकल कीबोर्ड', gu: 'મિકેનિકલ કીબોર્ડ', tags: 'keyboard,gaming' },
      { en: '4K Mirrorless Camera', hi: '4K मिररलेस कैमरा', gu: '4K મિરરલેસ કેમેરા', tags: 'camera,dslr' },
      { en: 'Noise Cancelling Earbuds', hi: 'शोर रद्द करने वाले ईयरबड्स', gu: 'નોઈઝ કેન્સલિંગ ઈયરબડ્સ', tags: 'earbuds,pods' },
      { en: 'Ultra Slim Laptop', hi: 'अल्ट्रा स्लिम लैपटॉप', gu: 'અલ્ટ્રા સ્લિમ લેપટોપ', tags: 'laptop,computer' },
      { en: 'High Speed Charger', hi: 'हाई स्पीड चार्जर', gu: 'હાઈ સ્પીડ ચાર્જર', tags: 'charger,fast' },
      { en: 'RGB Gaming Mouse', hi: 'RGB गेमिंग माउस', gu: 'RGB ગેમિંગ માઉસ', tags: 'mouse,gamer' },
      { en: 'Virtual Reality Headset', hi: 'वीआर हेडसेट', gu: 'VR હેડસેટ', tags: 'vr,meta' }
    ],
    'Foods': [
      { en: 'Organic Wild Honey', hi: 'जैविक शहद', gu: 'ઓર્ગેનિક મધ', tags: 'honey,organic' },
      { en: 'Roasted Almonds', hi: 'भुने हुए बादाम', gu: 'શેકેલા બદામ', tags: 'almonds,nuts' },
      { en: 'Premium Basmati Rice', hi: 'प्रीमियम बासमती चावल', gu: 'પ્રીમિયમ બાસમતી ચોખા', tags: 'rice,grain' },
      { en: 'Handmade Dark Chocolate', hi: 'हाथ से बनी डार्क चॉकलेट', gu: 'હેન્ડમેડ ડાર્ક ચોકલેટ', tags: 'chocolate,dark' },
      { en: 'Cold Pressed Coconut Oil', hi: 'कोल्ड प्रेस्ड नारियल तेल', gu: 'કોલ્ડ પ્રેસ્ડ નારિયેળ તેલ', tags: 'oil,coconut' },
      { en: 'Spicy Mango Pickle', hi: 'तीखा आम का अचार', gu: 'તીખું કેરીનું અથાણું', tags: 'pickle,mango' },
      { en: 'Gourmet Coffee Beans', hi: 'पेटू कॉफी बीन्स', gu: 'ગોર્મેટ કોફી બીન્સ', tags: 'coffee,beans' },
      { en: 'Himalayan Pink Salt', hi: 'हिमालयन पिंक साल्ट', gu: 'હિમાલયન પિંક સોલ્ટ', tags: 'salt,pink' },
      { en: 'Pure Cow Ghee', hi: 'शुद्ध गाय का घी', gu: 'શુદ્ધ ગાયનું ઘી', tags: 'ghee,dairy' },
      { en: 'Masala Makhana', hi: 'मसाला मखाना', gu: 'મસાલા મખાણા', tags: 'snacks,makhana' }
    ]
  };

  const brands = {
    'Clothing': ['Urban Thread', 'Vastra Gold', 'Classic Loom', 'Trendify', 'Ethnic Wear'],
    'Electronics': ['Electra', 'SonicWave', 'GizmoPro', 'PowerSync', 'Nexus'],
    'Foods': ['Organic Harvest', 'PureTaste', 'Village Fresh', 'SpiceRoute', 'NatureBest']
  };

  const products: Product[] = [];

  categories.forEach(cat => {
    const templates = (catalogTemplates as any)[cat];
    const catBrands = (brands as any)[cat];

    for (let i = 1; i <= 50; i++) {
      const template = templates[(i - 1) % templates.length];
      const brand = catBrands[i % catBrands.length];
      const id = `${cat.toLowerCase()}-${i}`;
      
      let basePrice = 0;
      if (cat === 'Electronics') basePrice = 999 + (i * 125);
      else if (cat === 'Clothing') basePrice = 399 + (i * 45);
      else basePrice = 99 + (i * 12);

      const variantSuffix = i > templates.length ? ` (Series ${Math.floor(i / templates.length) + 1})` : '';

      products.push({
        id: id,
        sku: `${cat.substring(0, 3).toUpperCase()}-${1000 + i}`,
        brand: brand,
        status: 'active',
        fulfillmentMode: i % 10 === 0 ? 'PLATFORM_FULFILLED' : 'SELLER_FULFILLED',
        title: {
          [Language.ENGLISH]: `${template.en}${variantSuffix}`,
          [Language.HINDI]: `${template.hi}${variantSuffix}`,
          [Language.GUJARATI]: `${template.gu}${variantSuffix}`
        },
        description: {
          [Language.ENGLISH]: `Premium ${template.en} from ${brand}. High quality standards for ${cat}.`,
          [Language.HINDI]: `${brand} द्वारा निर्मित प्रीमियम ${template.hi}। ${cat} के लिए उच्च गुणवत्ता मानक।`,
          [Language.GUJARATI]: `${brand} દ્વારા નિર્મિત પ્રીમિયમ ${template.gu}. ${cat} માટે ઉચ્ચ ગુણવત્તાના ધોરણો.`
        },
        price: basePrice,
        image: `https://loremflickr.com/800/800/${encodeURIComponent(template.tags + ',' + cat.toLowerCase() + ',product') + '?lock=' + (i + 100)}`,
        category: cat,
        stock: 15 + (i % 60),
        rating: 4.1 + (Math.random() * 0.9),
        reviews: [],
        merchantId: i % 2 === 0 ? 'm1' : 'm2',
        variants: cat !== 'Foods' ? [
          { id: `v-${id}-1`, sku: `${id}-S1`, type: cat === 'Clothing' ? 'Size' : 'Weight', value: cat === 'Clothing' ? 'M' : 'Standard', priceDelta: 0, stock: 10 },
          { id: `v-${id}-2`, sku: `${id}-S2`, type: cat === 'Clothing' ? 'Size' : 'Weight', value: cat === 'Clothing' ? 'L' : 'Premium', priceDelta: Math.floor(basePrice * 0.2), stock: 5 }
        ] as any : undefined
      });
    }
  });

  return products;
};

export const MOCK_PRODUCTS: Product[] = generateProducts();

export const MOCK_SALES_DATA = [
  { name: 'Mon', sales: 4800 },
  { name: 'Tue', sales: 4100 },
  { name: 'Wed', sales: 5900 },
  { name: 'Thu', sales: 3200 },
  { name: 'Fri', sales: 2500 },
  { name: 'Sat', sales: 4300 },
  { name: 'Sun', sales: 6200 },
];
