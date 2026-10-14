import type { Category, FestiveKit } from './types';

/** Ported from localMart-FE `lib/catalog/categories.ts`. Drives the categories screen. */
export const CATEGORIES: Category[] = [
  {
    slug: 'livestock-vegetables',
    title: 'Livestock & Vegetables',
    subtitle: 'From local farms and ghats',
    icon: 'leaf',
    image: 'https://images.pexels.com/photos/868110/pexels-photo-868110.jpeg?auto=compress&cs=tinysrgb&w=800',
    family: 'product',
    cta: 'Shop fresh',
    subCategories: [
      { slug: 'seasonal-vegetables', label: 'Seasonal vegetables' },
      { slug: 'leafy-greens-herbs', label: 'Leafy greens & herbs' },
      { slug: 'fresh-fish', label: 'Fresh fish' },
      { slug: 'chicken-duck-mutton', label: 'Chicken, duck & mutton' },
      { slug: 'eggs', label: 'Eggs' },
      { slug: 'fruits', label: 'Fruits' },
    ],
  },
  {
    slug: 'grocery',
    title: 'Grocery',
    subtitle: 'Kitchen staples and home needs',
    icon: 'shopping-basket',
    image: 'https://images.pexels.com/photos/5951182/pexels-photo-5951182.jpeg?auto=compress&cs=tinysrgb&w=800',
    family: 'product',
    cta: 'Shop grocery',
    subCategories: [
      { slug: 'rice-atta-dal', label: 'Rice, atta & dal' },
      { slug: 'oil-ghee-spices', label: 'Oil, ghee & spices' },
      { slug: 'assam-tea-beverages', label: 'Assam tea & beverages' },
      { slug: 'dairy-bakery', label: 'Dairy & bakery' },
      { slug: 'snacks-packaged-food', label: 'Snacks & packaged food' },
      { slug: 'cleaning-household', label: 'Cleaning & household' },
    ],
  },
  {
    slug: 'food',
    title: 'Food',
    subtitle: 'Cooked fresh by local kitchens',
    icon: 'soup',
    image: 'https://images.pexels.com/photos/29148133/pexels-photo-29148133.jpeg?auto=compress&cs=tinysrgb&w=800',
    family: 'product',
    cta: 'Order food',
    subCategories: [
      { slug: 'assamese-thali', label: 'Assamese thali' },
      { slug: 'home-style-tiffin', label: 'Home-style tiffin' },
      { slug: 'pitha-sweets', label: 'Pitha & sweets' },
      { slug: 'street-food-snacks', label: 'Street food & snacks' },
      { slug: 'cakes-bakery', label: 'Cakes & bakery' },
      { slug: 'healthy-bowls', label: 'Healthy bowls' },
    ],
  },
  {
    slug: 'medicine',
    title: 'Medicine',
    subtitle: 'Licensed pharmacies only',
    icon: 'pill',
    image: 'https://images.pexels.com/photos/8900031/pexels-photo-8900031.jpeg?auto=compress&cs=tinysrgb&w=800',
    family: 'rx',
    cta: 'Upload prescription',
    notice:
      'Rx items ship only after a pharmacist checks your valid prescription. No substitutions without consent.',
    subCategories: [
      {
        slug: 'prescription-medicines',
        label: 'Prescription medicines',
        requiresPrescription: true,
      },
      { slug: 'over-the-counter', label: 'Over-the-counter' },
      { slug: 'baby-mother-care', label: 'Baby & mother care' },
      { slug: 'health-devices', label: 'Health devices' },
    ],
  },
];

export const PRESCRIPTION_UPLOAD_ROUTE = '/prescription/upload';

export const FESTIVE_KITS: FestiveKit[] = [
  {
    slug: 'magh-bihu',
    period: 'JANUARY',
    name: 'Magh Bihu kit',
    contents: 'Bora saul, til, jaggery, coconut for pitha',
  },
  {
    slug: 'rongali-bihu',
    period: 'APRIL',
    name: 'Rongali Bihu kit',
    contents: 'Doi, chira, gur, jolpan essentials',
  },
  {
    slug: 'durga-puja',
    period: 'OCTOBER',
    name: 'Durga Puja kit',
    contents: 'Puja samagri, bhog staples, sweets',
  },
  {
    slug: 'build-your-own',
    period: 'ALL YEAR',
    name: 'Build your own',
    contents: 'Diwali, Eid, Christmas or a family function',
  },
];
