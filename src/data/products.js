// MadurFresh Centralized Product & Brand Data
// Tagline: The Quality Choice

export const BRAND_INFO = {
  name: 'MadurFresh',
  tagline: 'The Quality Choice',
  owner: 'Sindhusha G',
  phone: '+91 98765 43210',
  whatsapp: '919876543210',
  email: 'care@madurfresh.in',
  deliveryTime: 'Express Delivery',
  freeDeliveryThreshold: 499,
  deliveryFee: 39,
};

export const CATEGORIES = [
  {
    id: 'chicken',
    name: 'Fresh Chicken',
    tagline: 'Fresh cuts',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80',
    description: '100% antibiotic-free, naturally raised poultry cuts cleaned with RO water and vacuum sealed.'
  },
  {
    id: 'mutton',
    name: 'Prime Mutton',
    tagline: 'Premium cuts',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80',
    description: 'Pasture-raised, hormone-free tender goat meat expertly hand-trimmed for optimum flavor and texture.'
  },
  {
    id: 'seafood',
    name: 'Fresh Seafood',
    tagline: 'Fresh catch',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
    description: 'Fresh day-catch seafood, thoroughly cleaned and deveined with zero chemical preservatives.'
  }
];

export const PRODUCTS = [
  {
    id: 'mf-chk-01',
    slug: 'farm-fresh-chicken-curry-cut',
    name: 'Fresh Chicken Curry Cut',
    category: 'chicken',
    categoryName: 'Fresh Chicken',
    rating: 4.8,
    reviewCount: 142,
    shortDescription: 'Tender farm-raised chicken cut into curry-sized pieces. 100% antibiotic-free.',
    description: 'Our Farm Fresh Chicken Curry Cut is crafted for everyday culinary perfection. Sourced from biosecure farms without antibiotics or growth promoters. Every piece is cleaned with purified RO water and pre-cut into bone-in and tender boneless pieces, vacuum sealed at 0-4°C.',
    images: [
      'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=80'
    ],
    weights: [
      { id: 'w-500g', label: '500 g', price: 175, originalPrice: 220, discount: 20, netWeight: '500g (Net 480-500g)', serves: '2-3 people' },
      { id: 'w-1kg', label: '1 kg', price: 330, originalPrice: 420, discount: 21, netWeight: '1000g (Net 980-1000g)', serves: '4-5 people' }
    ],
    freshnessInfo: 'Chilled at 0-4°C, Never Frozen, Daily Farm Sourced',
    handling: 'Cleaned with RO water, vacuum sealed for peak freshness',
    cookingRecommendation: 'Ideal for rich homestyle curries, pepper chicken, and slow stews.',
    availability: true
  },
  {
    id: 'mf-chk-02',
    slug: 'tender-boneless-chicken-breast',
    name: 'Tender Boneless Chicken Breast',
    category: 'chicken',
    categoryName: 'Fresh Chicken',
    rating: 4.9,
    reviewCount: 98,
    shortDescription: 'Trimmed, skinless chicken breast fillets packed with lean protein. Juicy and tender.',
    description: 'Pure, lean protein fillets expertly trimmed to remove all excess fat. Sourced from young, tender chickens for that juicy, melt-in-mouth texture when cooked. Perfect for health enthusiasts, fitness regimes, and gourmet pan-seared preparations.',
    images: [
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=900&q=80'
    ],
    weights: [
      { id: 'w-500g', label: '500 g', price: 230, originalPrice: 280, discount: 18, netWeight: '500g (2-3 fillets)', serves: '2-3 people' },
      { id: 'w-1kg', label: '1 kg', price: 440, originalPrice: 550, discount: 20, netWeight: '1000g (4-6 fillets)', serves: '4-5 people' }
    ],
    freshnessInfo: 'Antibiotic-residue free, 100% vegetarian-fed poultry',
    handling: 'Hand-filleted by master butchers, vacuum packed',
    cookingRecommendation: 'Best for pan-searing, grilling, meal-prep bowls, salads, and stir-fries.',
    availability: true
  },
  {
    id: 'mf-mut-01',
    slug: 'rich-mutton-curry-cut',
    name: 'Rich Mutton Curry Cut',
    category: 'mutton',
    categoryName: 'Prime Mutton',
    rating: 4.9,
    reviewCount: 184,
    shortDescription: 'Prime cuts of pasture-raised tender goat meat including ribs, shoulder, and shank.',
    description: 'Experience authentic flavor with our Premium Mutton Curry Cut. We select only naturally grazed, young, healthy goats to ensure that tender, sweet meat profile. Evenly apportioned with bone-in cuts and marrow pieces that impart rich depth to traditional gravies.',
    images: [
      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80'
    ],
    weights: [
      { id: 'w-500g', label: '500 g', price: 490, originalPrice: 580, discount: 15, netWeight: '500g (10-12 pieces)', serves: '2-3 people' },
      { id: 'w-1kg', label: '1 kg', price: 950, originalPrice: 1150, discount: 17, netWeight: '1000g (20-24 pieces)', serves: '4-6 people' }
    ],
    freshnessInfo: 'Naturally grazed, hormone-free, ethically sourced',
    handling: 'Artisanal hand-cut, fat-trimmed, washed in RO water',
    cookingRecommendation: 'Best for slow-simmered Rogan Josh, Nihari, and rich biryanis.',
    availability: true
  },
  {
    id: 'mf-mut-02',
    slug: 'prime-boneless-mutton-boti',
    name: 'Prime Boneless Mutton Boti',
    category: 'mutton',
    categoryName: 'Prime Mutton',
    rating: 4.8,
    reviewCount: 76,
    shortDescription: 'Hand-trimmed, bite-sized boneless goat meat pieces without excess fat or sinew.',
    description: 'Our artisanal Boneless Mutton Boti is carefully carved from the prime leg and shoulder portions of tender goats. Completely boneless, free of tough tendon tissue, and diced into uniform morsels that absorb marinades and spices with ease.',
    images: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=80'
    ],
    weights: [
      { id: 'w-500g', label: '500 g', price: 580, originalPrice: 690, discount: 16, netWeight: '500g (Boneless)', serves: '2-3 people' },
      { id: 'w-1kg', label: '1 kg', price: 1120, originalPrice: 1350, discount: 17, netWeight: '1000g (Boneless)', serves: '4-5 people' }
    ],
    freshnessInfo: 'Strictly selected younger goats for maximum tenderness',
    handling: '100% boneless, clean-cut, zero water weight added',
    cookingRecommendation: 'Ideal for Lucknowi Dum Biryani, Mutton Sukka, and Boti Kebabs.',
    availability: true
  },
  {
    id: 'mf-sea-01',
    slug: 'fresh-white-prawns-cleaned-deveined',
    name: 'Fresh White Prawns (Cleaned)',
    category: 'seafood',
    categoryName: 'Fresh Seafood',
    rating: 4.9,
    reviewCount: 115,
    shortDescription: 'Coastal white prawns with tail-on, peeled, cleaned, and deveined. Naturally sweet.',
    description: 'Sourced directly from daily coastal catches, our medium-large White Prawns arrive fresh at your doorstep. Each prawn is carefully peeled and deveined by hand, leaving the tail-on for elegant presentation. We weigh after cleaning so you pay only for pure, cookable seafood.',
    images: [
      'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=900&q=80'
    ],
    weights: [
      { id: 'w-250g', label: '250 g', price: 260, originalPrice: 320, discount: 19, netWeight: '250g (15-20 pcs)', serves: '1-2 people' },
      { id: 'w-500g', label: '500 g', price: 499, originalPrice: 620, discount: 20, netWeight: '500g (30-40 pcs)', serves: '2-3 people' },
      { id: 'w-1kg', label: '1 kg', price: 960, originalPrice: 1200, discount: 20, netWeight: '1000g (60-80 pcs)', serves: '4-6 people' }
    ],
    freshnessInfo: 'Direct from coastal harbors, zero formalin or chemicals',
    handling: 'Net weight guaranteed after 100% deveining and peeling',
    cookingRecommendation: 'Cooks in under 5 minutes! Outstanding for butter garlic prawns and Goan curry.',
    availability: true
  }
];

export const HERO_BANNERS = [
  {
    id: 1,
    title: 'Farm Fresh Chicken',
    category: 'chicken',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 2,
    title: 'Prime Pasture Mutton',
    category: 'mutton',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 3,
    title: 'Fresh Coastal Seafood',
    category: 'seafood',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=80'
  }
];

export const TRUST_BENEFITS = [
  {
    id: 1,
    title: 'Farm Sourced',
    description: '100% antibiotic-free, ethically raised livestock.',
    icon: 'ShieldCheck'
  },
  {
    id: 2,
    title: 'Artisanal Cuts',
    description: 'Expertly portioned by master butchers.',
    icon: 'Award'
  },
  {
    id: 3,
    title: 'Hygienic Prep',
    description: 'Washed in RO water, 0-4°C temperature controlled.',
    icon: 'Sparkles'
  },
  {
    id: 4,
    title: 'Cold Chain',
    description: 'Delivered in insulated packs fresh, never frozen.',
    icon: 'Truck'
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Priya Narayanan',
    location: 'Indiranagar',
    comment: 'The chicken curry cut is noticeably fresher than local shops. Clean packaging and zero smell.',
    rating: 5
  },
  {
    id: 2,
    name: 'Karthik Raman',
    location: 'Koramangala',
    comment: 'Mutton was tender and succulent. Perfect meat-to-bone ratio.',
    rating: 5
  },
  {
    id: 3,
    name: 'Deepa Hegde',
    location: 'Whitefield',
    comment: 'The cleaned prawns saved prep time. Sweet, fresh and exact net weight.',
    rating: 5
  }
];

export const POPULAR_SEARCH_TAGS = [
  'Chicken Curry Cut',
  'Boneless Chicken',
  'Mutton Curry Cut',
  'Boneless Mutton',
  'White Prawns'
];
