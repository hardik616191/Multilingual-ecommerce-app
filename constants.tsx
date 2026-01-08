
import { Language, Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: {
      [Language.ENGLISH]: 'Handwoven Silk Saree',
      [Language.HINDI]: 'हाथ से बनी रेशमी साड़ी',
      [Language.GUJARATI]: 'હાથથી વણેલી રેશમી સાડી'
    },
    description: {
      [Language.ENGLISH]: 'Pure silk handwoven traditional saree from Patan.',
      [Language.HINDI]: 'पाटन की शुद्ध रेशम की हाथ से बनी पारंपरिक साड़ी।',
      [Language.GUJARATI]: 'પાટણની શુદ્ધ રેશમની હાથથી વણેલી પરંપરાગત સાડી.'
    },
    price: 4500,
    discountPrice: 3999,
    image: 'https://picsum.photos/seed/saree/400/400',
    category: 'Clothing',
    stock: 5,
    rating: 4.8,
    reviews: [],
    merchantId: 'm1'
  },
  {
    id: '2',
    title: {
      [Language.ENGLISH]: 'Organic Peanut Oil',
      [Language.HINDI]: 'ऑर्गेनिक मूंगफली का तेल',
      [Language.GUJARATI]: 'ઓર્ગેનિક સીંગતેલ'
    },
    description: {
      [Language.ENGLISH]: 'Cold pressed organic peanut oil for healthy cooking.',
      [Language.HINDI]: 'स्वस्थ खाना पकाने के लिए कोल्ड प्रेस्ड ऑर्गेनिक मूंगफली का तेल।',
      [Language.GUJARATI]: 'સ્વસ્થ રસોઈ માટે કોલ્ડ પ્રેસ્ડ ઓર્ગેનિક સીંગતેલ.'
    },
    price: 350,
    image: 'https://picsum.photos/seed/oil/400/400',
    category: 'Grocery',
    stock: 50,
    rating: 4.5,
    reviews: [],
    merchantId: 'm1'
  },
  {
    id: '3',
    title: {
      [Language.ENGLISH]: 'Brass Handicraft Statue',
      [Language.HINDI]: 'पीतल हस्तकला मूर्ति',
      [Language.GUJARATI]: 'પિત્તળની હસ્તકલાની મૂર્તિ'
    },
    description: {
      [Language.ENGLISH]: 'Intricately designed brass idol for home decor.',
      [Language.HINDI]: 'घर की सजावट के लिए जटिल रूप से डिजाइन की गई पीतल की मूर्ति।',
      [Language.GUJARATI]: 'ઘરની સજાવટ માટે જટિલ રીતે ડિઝાઇન કરેલી પિત્તળની મૂર્તિ.'
    },
    price: 1200,
    image: 'https://picsum.photos/seed/statue/400/400',
    category: 'Decor',
    stock: 2,
    rating: 4.9,
    reviews: [],
    merchantId: 'm2'
  }
];

export const MOCK_SALES_DATA = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];
