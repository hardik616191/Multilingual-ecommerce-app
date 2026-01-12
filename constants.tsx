
import { Language, Product, FulfillmentMode } from './types';

// Helper to generate 100 authentic products
const generate100Products = (): Product[] => {
  const categories = ['Snacks', 'Sweets', 'Grocery', 'Pickles', 'Beverages'];
  const brands = ['Shaileshbhai Original', 'Surti Delights', 'Rajkot Special', 'Ahmedabadi Tadka', 'Kathiyawadi Swad'];
  
  const baseProducts = [
    { en: 'Bhavnagari Gathiya', hi: 'भावनगरी गाठिया', gu: 'ભાવનગરી ગાંઠિયા', cat: 'Snacks' },
    { en: 'Special Nylon Khaman', hi: 'स्पेशल नायलॉन खमन', gu: 'સ્પેશિયલ નાયલોન ખમણ', cat: 'Snacks' },
    { en: 'Methi Na Gota Mix', hi: 'मेथी के गोटा मिक्स', gu: 'મેથીના ગોટા મિક્સ', cat: 'Snacks' },
    { en: 'Masala Fafda', hi: 'मसाला फाफड़ा', gu: 'મસાલા ફાફડા', cat: 'Snacks' },
    { en: 'Vanela Gathiya', hi: 'वनेला गाठिया', gu: 'વણેલા ગાંઠિયા', cat: 'Snacks' },
    { en: 'Ratlami Sev', hi: 'रतलामी सेव', gu: 'રતલામી સેવ', cat: 'Snacks' },
    { en: 'Dry Fruit Farali Chevdo', hi: 'ड्राई फ्रूट फराली चेवड़ो', gu: 'ડ્રાયફ્રૂટ ફરાળી ચેવડો', cat: 'Snacks' },
    { en: 'Kesar Peda', hi: 'केसर पेड़ा', gu: 'કેસર પેંડા', cat: 'Sweets' },
    { en: 'Dry Fruit Halvasan', hi: 'ड्राई फ्रूट हलवासन', gu: 'ડ્રાયફ્રૂટ હલવાસન', cat: 'Sweets' },
    { en: 'Pure Desi Ghee Laddu', hi: 'शुद्ध देसी घी के लड्डू', gu: 'શુદ્ધ દેશી ઘીના લાડુ', cat: 'Sweets' },
    { en: 'Kaju Katli Special', hi: 'काजू कतली स्पेशल', gu: 'કાજુ કતરી સ્પેશિયલ', cat: 'Sweets' },
    { en: 'Mango Pickle (Athanu)', hi: 'आम का अचार', gu: 'કેરીનું અથાણું', cat: 'Pickles' },
    { en: 'Green Chilli Pickle', hi: 'हरी मिर्च का अचार', gu: 'મરચાનું અથાણું', cat: 'Pickles' },
    { en: 'Gunda Ker Pickle', hi: 'गुंदा केर का अचार', gu: 'ગુંદા કેરનું અથાણું', cat: 'Pickles' },
    { en: 'Organic Peanut Oil', hi: 'ऑर्गेनिक मूंगफली का तेल', gu: 'ઓર્ગેનિક સીંગતેલ', cat: 'Grocery' },
    { en: 'Special Tea Masala', hi: 'स्पेशल चाय मसाला', gu: 'સ્પેશિયલ ચા મસાલો', cat: 'Grocery' },
    { en: 'Strong Dust Tea', hi: 'कड़क डस्ट चाय', gu: 'કડક ડસ્ટ ચા', cat: 'Beverages' },
    { en: 'Instant Coffee Mix', hi: 'इंस्टेंट कॉफी मिक्स', gu: 'ઇન્સ્ટન્ટ કોફી મિક્સ', cat: 'Beverages' },
    { en: 'Roasted Diet Mamra', hi: 'रोस्टेड डाइट ममरा', gu: 'રોસ્ટેડ ડાયટ મમરા', cat: 'Snacks' },
    { en: 'Chana Jor Garam', hi: 'चना जोर गरम', gu: 'ચણા જોર ગરમ', cat: 'Snacks' },
  ];

  const products: Product[] = [];

  for (let i = 1; i <= 100; i++) {
    const base = baseProducts[(i - 1) % baseProducts.length];
    const brand = brands[i % brands.length];
    const price = 100 + (i * 5);
    const hasDiscount = i % 3 === 0;
    const variantSuffix = i > 20 ? ` (Batch ${Math.floor(i / 20) + 1})` : '';

    products.push({
      id: i.toString(),
      sku: `SKU-${1000 + i}`,
      brand: brand,
      status: 'active',
      fulfillmentMode: i % 10 === 0 ? 'PLATFORM_FULFILLED' : 'SELLER_FULFILLED',
      title: {
        [Language.ENGLISH]: `${base.en}${variantSuffix}`,
        [Language.HINDI]: `${base.hi}${variantSuffix}`,
        [Language.GUJARATI]: `${base.gu}${variantSuffix}`
      },
      description: {
        [Language.ENGLISH]: `Authentic ${base.en} from ${brand}. Made with premium ingredients and traditional recipes. Perfect for your tea-time cravings.`,
        [Language.HINDI]: `${brand} से प्रामाणिक ${base.hi}। प्रीमियम सामग्री और पारंपरिक व्यंजनों के साथ बनाया गया। आपके चाय के समय के लिए बिल्कुल सही।`,
        [Language.GUJARATI]: `${brand} તરફથી અસલી ${base.gu}. પ્રીમિયમ સામગ્રી અને પરંપરાગત વાનગીઓ સાથે બનાવેલ. તમારી ચાના સમય માટે એકદમ યોગ્ય.`
      },
      price: price,
      discountPrice: hasDiscount ? Math.floor(price * 0.85) : undefined,
      discountConfig: hasDiscount ? { type: 'percentage', value: 15 } : undefined,
      image: `https://picsum.photos/seed/snack-${i}/400/400`,
      category: base.cat,
      stock: 10 + (i % 50),
      rating: 4 + (Math.random() * 1),
      reviews: [],
      merchantId: i % 2 === 0 ? 'm1' : 'm2',
      variants: i % 5 === 0 ? [
        { id: `v-${i}-1`, sku: `SKU-${1000 + i}-S`, type: 'Weight', value: '250g', priceDelta: 0, stock: 20 },
        { id: `v-${i}-2`, sku: `SKU-${1000 + i}-M`, type: 'Weight', value: '500g', priceDelta: Math.floor(price * 0.8), stock: 15 },
        { id: `v-${i}-3`, sku: `SKU-${1000 + i}-L`, type: 'Weight', value: '1kg', priceDelta: Math.floor(price * 1.5), stock: 10 }
      ] : undefined
    });
  }

  return products;
};

export const MOCK_PRODUCTS: Product[] = generate100Products();

export const MOCK_SALES_DATA = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];
