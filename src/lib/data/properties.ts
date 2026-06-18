import type { ResidentialCategory, LocationSlug, PropertyStatus } from "@/types";

export interface StaticProperty {
  id: string;
  slug: string;
  name: string;
  category: ResidentialCategory;
  location: LocationSlug;
  locationLabel: string;
  configuration: string;
  sizeRange: string;
  status: PropertyStatus;
  coverImage: string;
  images: string[];
  isFeatured: boolean;
  price?: string;
  priceOnRequest?: boolean;
  description?: string[];
  highlights?: string[];
  builtUpArea?: string;
  plotArea?: string;
  floor?: string;
  suitableFor?: string;
  seoTitle?: string;
  seoDescription?: string;
  isActive?: boolean;
}

const ALL_STATIC_PROPERTIES: StaticProperty[] = [
  {
    id: "ikebana",
    slug: "4-5-bhk-penthouse-duplex-7300-15500-sindhu-bhavan",
    name: "Ikebana",
    category: "apartment",
    location: "sindhu-bhavan",
    locationLabel: "Sindhu Bhavan Road",
    configuration: "4 & 5 BHK · Penthouse · Duplex",
    sizeRange: "7,300 – 15,500 sq.ft.",
    status: "near-possession",
    coverImage: "/properties/ikebana/ikebana1.png",
    images: [
      "/properties/ikebana/ikebana1.png",
      "/properties/ikebana/ikebana-living2.png",
      "/properties/ikebana/ikebana-bedroom-3.png",
      "/properties/ikebana/ikebana-4.png",
    ],
    isFeatured: true,
    price: "Price on Request",
    priceOnRequest: true,
    description: [
      "This landmark of ultra-luxury residential living is situated along the premium Sindhu Bhavan Road corridor. Designed with Japanese-inspired minimalism combined with global luxury standards, it features expansive private decks and double-height ceilings.",
      "Each residence is meticulously oriented to optimize natural ventilation and panoramic views of the city skyline. Spanning across generous floor plates, these homes represent the pinnacle of architectural elegance in Ahmedabad."
    ],
    highlights: [
      "Double-height living rooms with floor-to-ceiling glazing",
      "State-of-the-art private screening theatre and clubhouse",
      "Spacious wrap-around sundecks with customizable private plunge pools",
      "Concierge services and robust multi-tiered HNI security systems"
    ],
    builtUpArea: "7,300 – 15,500 sq.ft.",
    floor: "Upper Floors (15th and above)",
    suitableFor: "HNI families looking for premium vertical estates with high privacy and security"
  },
  {
    id: "maruti-360",
    slug: "4-5-bhk-duplex-5700-7500-iskon-ambli",
    name: "Maruti 360",
    category: "apartment",
    location: "iskon-ambli",
    locationLabel: "Iskon-Ambli Road",
    configuration: "4 & 5 BHK · Duplex",
    sizeRange: "5,700 – 7,500 sq.ft.",
    status: "under-construction",
    coverImage: "/properties/maruti-360/maruti-360-view.jpg",
    images: [
      "/properties/maruti-360/maruti-360-view.jpg",
      "/properties/maruti-360/maruti-360-bedroom-2.png",
      "/properties/maruti-360/maruti-360-pool-3.png",
      "/properties/maruti-360/maruti360-play-area-4.png",
      "/properties/maruti-360/maruti-360-1.jpeg",
    ],
    isFeatured: true,
    price: "₹5.50 Cr – ₹8.25 Cr",
    priceOnRequest: false,
    description: [
      "This development redefines vertical estate living on the highly coveted Iskon-Ambli Road. Offering true 360-degree, uninterrupted views of the luxury corridor, the residences guarantee absolute privacy with single-apartment-per-floor layouts.",
      "Finished with premium imported marble, premium VRV air conditioning, and bespoke sanitary ware, every corner represents high-end craftsmanship built to endure for generations."
    ],
    highlights: [
      "Single apartment per floor layouts for ultimate privacy",
      "360-degree panoramic views of Iskon-Ambli corridor",
      "Grand entry lobby with triple-height clearance",
      "Eco-friendly building design with IGBC Gold certification"
    ],
    builtUpArea: "5,700 – 7,500 sq.ft.",
    floor: "Bespoke levels available",
    suitableFor: "Discerning owners desiring single-apartment-per-floor privacy in the prime luxury zone"
  },
  {
    id: "pashmina",
    slug: "4-5-bhk-penthouse-5200-7500-sindhu-bhavan",
    name: "Pashmina",
    category: "apartment",
    location: "sindhu-bhavan",
    locationLabel: "Sindhu Bhavan Road",
    configuration: "4 & 5 BHK · Penthouse",
    sizeRange: "5,200 – 7,500 sq.ft.",
    status: "ready-to-move",
    coverImage: "/properties/pashmina/pashmina.jpg",
    images: [
      "/properties/pashmina/pashmina.jpg",
      "/properties/pashmina/pashmina.jpeg",
      "/properties/pashmina/pashmina1.png",
    ],
    isFeatured: true,
    price: "₹6.20 Cr – ₹9.50 Cr",
    priceOnRequest: false,
    description: [
      "A sanctuary of comfort and privacy on Sindhu Bhavan Road. This development offers grand-scale apartments and bespoke penthouses meticulously crafted for HNI families seeking immediate possession.",
      "The design prioritizes vast living spaces, rich materials, and extensive natural light, creating an environment that is both relaxing and majestic."
    ],
    highlights: [
      "Ready to move in with completed luxury finishes",
      "Extremely spacious layout with dual master suites",
      "Centrally located near top dining and retail options",
      "Beautifully landscaped central gardens and walking tracks"
    ],
    builtUpArea: "5,200 – 7,500 sq.ft.",
    floor: "Mid & High levels",
    suitableFor: "Buyers seeking immediate-possession ready luxury residences in high-connectivity zones"
  },
  {
    id: "swati-senor",
    slug: "5-bhk-8000-10000-iskon-ambli",
    name: "Swati Senor",
    category: "apartment",
    location: "iskon-ambli",
    locationLabel: "Iskon-Ambli Road",
    configuration: "5 BHK",
    sizeRange: "8,000 – 10,000 sq.ft.",
    status: "ready-to-move",
    coverImage: "/properties/swati-senor/swati-senor-1.jpg",
    images: [
      "/properties/swati-senor/swati-senor-1.jpg",
      "/properties/swati-senor/swati-senor-2-hall.jpg",
      "/properties/swati-senor/swati-senor-3-daining-area.jpg",
      "/properties/swati-senor/swati-senor-4-gallery.jpg",
      "/properties/swati-senor/swati-senor-5-bedroom.jpg",
      "/properties/swati-senor/swati-senor-6-pool.jpg",
    ],
    isFeatured: true,
    price: "Price on Request",
    priceOnRequest: true,
    description: [
      "Widely recognized as one of the most premium addresses on Iskon-Ambli Road, these massive 5 BHK luxury sky mansions offer palatial room dimensions and double-deck balconies.",
      "The project boasts world-class wellness amenities, a private temperature-controlled pool, and premium concierge services catering to the most demanding luxury tastes."
    ],
    highlights: [
      "Sky mansions with massive 8,000+ sq.ft. footprints",
      "Temperature-controlled private swimming pool and deck",
      "Fully equipped fitness sanctuary and private dining room",
      "Advanced 5-tier security and dedicated valet service"
    ],
    builtUpArea: "8,000 – 10,000 sq.ft.",
    floor: "High Floor residences",
    suitableFor: "Families looking for palatial room dimensions and top-tier wellness clubhouse amenities"
  },
  {
    id: "anurita",
    slug: "4-bhk-villa-950-plot-700-built-sindhu-bhavan",
    name: "Anurita",
    category: "bungalow",
    location: "sindhu-bhavan",
    locationLabel: "Sindhu Bhavan Road",
    configuration: "4 BHK Villa",
    sizeRange: "950 sq.yd. Plot · 700 sq.yd. Built",
    status: "ready-to-move",
    coverImage: "/properties/anurita/anurita-1.jpg",
    images: [
      "/properties/anurita/anurita-1.jpg",
      "/properties/anurita/anurita-2-bungalows-img.jpg",
      "/properties/anurita/anurita-3-living-room.jpg",
      "/properties/anurita/anurita-4-bedroom.jpg",
    ],
    isFeatured: true,
    price: "₹14.50 Cr",
    priceOnRequest: false,
    description: [
      "This development presents a rare opportunity to own a bespoke luxury bungalow in the heart of Sindhu Bhavan Road. This low-density estate offers private villas surrounded by landscaped personal lawns.",
      "Every villa is designed as a standalone sanctuary, offering extensive indoor and outdoor entertaining spaces, a personal elevator, and state-of-the-art home automation systems."
    ],
    highlights: [
      "Private garden lawn and large outdoor party deck",
      "Standalone villa layout with absolute boundary privacy",
      "Dedicated personal elevator and automated security systems",
      "Private servant quarters and 4-car parking garage"
    ],
    builtUpArea: "700 sq.yd. Built",
    plotArea: "950 sq.yd. Plot",
    floor: "G + 2 Levels",
    suitableFor: "VIP buyers wanting standalone boundary privacy and dedicated personal grounds"
  },
  {
    id: "belagio",
    slug: "4-5-bhk-6100-8500-iskon-ambli",
    name: "Belagio",
    category: "apartment",
    location: "iskon-ambli",
    locationLabel: "Iskon-Ambli Road",
    configuration: "4 & 5 BHK",
    sizeRange: "6,100 – 8,500 sq.ft.",
    status: "under-construction",
    coverImage: "/properties/belagio/belagio-1.jpg",
    images: [
      "/properties/belagio/belagio-1.jpg",
      "/properties/belagio/belagio-2.jpg",
      "/properties/belagio/belagio-3.jpg",
      "/properties/belagio/belagio-pool.jpg",
    ],
    isFeatured: true,
    price: "Price on Request",
    priceOnRequest: true,
    description: [
      "This project combines classic European aesthetics with modern architectural engineering. Situated on Iskon-Ambli Road, the property features gorgeous high-arched entryways, fountains, and majestic facades.",
      "The apartments offer expansive layouts with deep balconies overlooking the central manicured gardens and recreation zones, creating a peaceful escape."
    ],
    highlights: [
      "European architectural theme with premium stone finishes",
      "Infinity-edge pool overlooking landscaped gardens",
      "Grand banqueting facility for resident celebrations",
      "Double-height sky lounges for community interaction"
    ],
    builtUpArea: "6,100 – 8,500 sq.ft.",
    floor: "All levels available",
    suitableFor: "Connoisseurs seeking classic European architectural themes and expansive sky lounge amenities"
  },
  {
    id: "anamika",
    slug: "4-5-bhk-duplex-3200-10000-sindhu-bhavan",
    name: "Anamika",
    category: "apartment",
    location: "sindhu-bhavan",
    locationLabel: "Sindhu Bhavan Road",
    configuration: "4 & 5 BHK · Duplex",
    sizeRange: "3,200 – 10,000 sq.ft.",
    status: "under-construction",
    coverImage: "/properties/anamika/anamika2.jpg",
    images: [
      "/properties/anamika/anamika2.jpg",
      "/properties/anamika/anamika.jpg",
      "/properties/anamika/anamika3-hall.png",
      "/properties/anamika/anamika4-bedroom.jpg",
    ],
    isFeatured: false,
  },
  {
    id: "triveni-84",
    slug: "4-bhk-penthouse-duplex-3700-6500-iskon-ambli",
    name: "Triveni 84",
    category: "apartment",
    location: "iskon-ambli",
    locationLabel: "Iskon-Ambli Road",
    configuration: "4 BHK · Penthouse · Duplex",
    sizeRange: "3,700 – 6,500 sq.ft.",
    status: "under-construction",
    coverImage: "/properties/triveni-84/triveni-1.jpg",
    images: [
      "/properties/triveni-84/triveni-1.jpg",
      "/properties/triveni-84/triveni2-kids-play-area.jpeg",
      "/properties/triveni-84/triveni3-yoga.jpeg",
      "/properties/triveni-84/triveni4-gym.jpeg",
      "/properties/triveni-84/triveni5-banquet-hall.jpeg",
    ],
    isFeatured: false,
  },
  {
    id: "avant",
    slug: "4-bhk-duplex-4500-8000-sindhu-bhavan",
    name: "Avant",
    category: "apartment",
    location: "sindhu-bhavan",
    locationLabel: "Sindhu Bhavan Road",
    configuration: "4 BHK · Duplex",
    sizeRange: "4,500 – 8,000 sq.ft.",
    status: "ready-to-move",
    coverImage: "/properties/avant/avant1.png",
    images: [
      "/properties/avant/avant1.png",
      "/properties/avant/avant-2-hall.jpg",
      "/properties/avant/avant-3-park.avif",
    ],
    isFeatured: false,
  },
  {
    id: "capstone",
    slug: "4-bhk-penthouse-duplex-5200-9000-thaltej",
    name: "Capstone",
    category: "apartment",
    location: "thaltej",
    locationLabel: "Thaltej",
    configuration: "4 BHK · Penthouse · Duplex",
    sizeRange: "5,200 – 9,000 sq.ft.",
    status: "under-construction",
    coverImage: "/properties/capstone/castone1.png",
    images: [
      "/properties/capstone/castone1.png",
      "/properties/capstone/capstone-2-pool.avif",
      "/properties/capstone/capstone-3-garden.avif",
    ],
    isFeatured: true,
    price: "Price on Request",
    priceOnRequest: true,
    description: [
      "A dramatic architectural statement rising in the scenic residential enclave of Thaltej. Offering a limited collection of bespoke 4 BHK duplexes and grand penthouses designed for multi-generational HNI families.",
      "Every home features high-volume living spaces, direct personal elevators, and a wide panoramic viewing deck that captures Ahmedabad's western green cover."
    ],
    highlights: [
      "Prime Thaltej location with scenic vistas and excellent connectivity",
      "Exclusive duplex layouts with high-volume double-height spaces",
      "Rooftop infinity pool, fitness club, and bespoke social lounge",
      "Advanced smart home automation and 24/7 automated private security"
    ],
    builtUpArea: "5,200 – 9,000 sq.ft.",
    floor: "Premium view floors",
    suitableFor: "VIP buyers desiring high-volume duplex living near the prime western corridor"
  },
  {
    id: "eminence-96",
    slug: "4-bhk-duplex-3800-7000-thaltej",
    name: "Eminence 96",
    category: "apartment",
    location: "thaltej",
    locationLabel: "Thaltej",
    configuration: "4 BHK · Duplex",
    sizeRange: "3,800 – 7,000 sq.ft.",
    status: "ready-to-move",
    coverImage: "/properties/eminence-96/emini96-1.png",
    images: [
      "/properties/eminence-96/emini96-1.png",
      "/properties/eminence-96/eminence-96-2-gym.webp",
      "/properties/eminence-96/eminence-96-3-pool.webp",
      "/properties/eminence-96/eminence-96-4-seting-area.webp",
    ],
    isFeatured: false,
  },
  {
    id: "belrosa",
    slug: "4-5-bhk-duplex-penthouse-5500-11000-vaishno-devi",
    name: "Belrosa",
    category: "apartment",
    location: "vaishno-devi",
    locationLabel: "Vaishno Devi",
    configuration: "4 & 5 BHK · Duplex · Penthouse",
    sizeRange: "5,500 – 11,000 sq.ft.",
    status: "pre-launch",
    coverImage: "/properties/belrosa/belrosa-1.jpg",
    images: [
      "/properties/belrosa/belrosa-1.jpg",
      "/properties/belrosa/belrosa-2-hall.jpg",
      "/properties/belrosa/belrosa-3-view.jpg",
      "/properties/belrosa/living-dining.jpg",
    ],
    isFeatured: false,
  },
  {
    id: "rashmi",
    slug: "4-bhk-penthouse-duplex-3200-6500-thaltej",
    name: "Rashmi",
    category: "apartment",
    location: "thaltej",
    locationLabel: "Thaltej",
    configuration: "4 BHK · Penthouse · Duplex",
    sizeRange: "3,200 – 6,500 sq.ft.",
    status: "pre-launch",
    coverImage: "",
    images: [],
    isFeatured: false,
  },
  {
    id: "vaikunth",
    slug: "4-bhk-villa-390-plot-440-built-shilaj",
    name: "Vaikunth",
    category: "bungalow",
    location: "shilaj",
    locationLabel: "Shilaj",
    configuration: "4 BHK Villa",
    sizeRange: "390 sq.yd. Plot · 440 sq.yd. Built",
    status: "near-possession",
    coverImage: "/properties/vaikunth/vaikunth-1.png",
    images: [
      "/properties/vaikunth/vaikunth-1.png",
      "/properties/vaikunth/vaikunth-2-pool.png",
      "/properties/vaikunth/vaikunth-3.png",
    ],
    isFeatured: false,
  },
  {
    id: "northpark",
    slug: "4-bhk-villa-500-plot-550-built-vaishno-devi",
    name: "Northpark",
    category: "bungalow",
    location: "vaishno-devi",
    locationLabel: "Vaishno Devi",
    configuration: "4 BHK Villa",
    sizeRange: "500 sq.yd. Plot · 550 sq.yd. Built",
    status: "under-construction",
    coverImage: "/properties/northpark/northpark-1.jpg",
    images: [
      "/properties/northpark/northpark-1.jpg",
      "/properties/northpark/northpark-2-bung.jpg",
      "/properties/northpark/northpark-3-hall.jpg",
      "/properties/northpark/northpark-04-dainnig.jpg",
      "/properties/northpark/northpark-5-bedroom.jpg",
    ],
    isFeatured: false,
  },
  {
    id: "kalrav-alpines",
    slug: "premium-plots-1100-2000-shilaj",
    name: "Kalrav Alpines",
    category: "plot",
    location: "shilaj",
    locationLabel: "Shilaj",
    configuration: "Premium Plots",
    sizeRange: "1,100 – 2,000 sq.yd.",
    status: "under-construction",
    coverImage: "/properties/kalrav-alpines/kalrav-alpines-1.jpg",
    images: ["/properties/kalrav-alpines/kalrav-alpines-1.jpg"],
    isFeatured: false,
  },
  {
    id: "westpark",
    slug: "premium-plots-700-2500-vaishno-devi",
    name: "Westpark",
    category: "plot",
    location: "vaishno-devi",
    locationLabel: "Vaishno Devi",
    configuration: "Premium Plots",
    sizeRange: "700 – 2,500 sq.yd.",
    status: "under-construction",
    coverImage: "/properties/westpark/westpark-1.jpeg",
    images: [
      "/properties/westpark/westpark-1.jpeg",
      "/properties/westpark/westpark-2-bun.jpg",
    ],
    isFeatured: false,
  },
  {
    id: "atman",
    slug: "4-bhk-5000-iskon-ambli",
    name: "Atman",
    category: "apartment",
    location: "iskon-ambli",
    locationLabel: "Iskon-Ambli Road",
    configuration: "4 BHK",
    sizeRange: "5,000 sq.ft.",
    status: "ready-to-move",
    coverImage: "/properties/atman/atman-1.jpg",
    images: [
      "/properties/atman/atman-1.jpg",
      "/properties/atman/atman-2.jpg",
    ],
    isFeatured: false,
  },
  {
    id: "shaligram-luxuria",
    slug: "4-bhk-penthouse-3800-7500-iskon-ambli",
    name: "Shaligram Luxuria",
    category: "apartment",
    location: "iskon-ambli",
    locationLabel: "Iskon-Ambli Road",
    configuration: "4 BHK · Penthouse",
    sizeRange: "3,800 – 7,500 sq.ft.",
    status: "near-possession",
    coverImage: "/properties/shaligram-luxuria/shaligram-luxuria-1.jpg",
    images: [
      "/properties/shaligram-luxuria/shaligram-luxuria-1.jpg",
      "/properties/shaligram-luxuria/shaligram-luxuria-2-gym.jpg",
      "/properties/shaligram-luxuria/shaligram-luxuria-3.jpg",
    ],
    isFeatured: false,
  },
  {
    id: "kimana",
    slug: "4-5-bhk-6000-8000-iskon-ambli",
    name: "Kimana",
    category: "apartment",
    location: "iskon-ambli",
    locationLabel: "Iskon-Ambli Road",
    configuration: "4 & 5 BHK",
    sizeRange: "6,000 – 8,000 sq.ft.",
    status: "near-possession",
    coverImage: "/properties/kimana/kimana.jpg",
    images: [
      "/properties/kimana/kimana.jpg",
      "/properties/kimana/kimana-2.jpg",
      "/properties/kimana/kimana-3.jpg",
    ],
    isFeatured: false,
  },
];

const SUPABASE_BASE = "https://rwtueiruyktjzvsgdcoh.supabase.co/storage/v1/object/public/media";

function getSupabaseUrl(localPath: string): string {
  if (!localPath) return "";
  if (localPath.startsWith("http")) return localPath;
  if (localPath.startsWith("/properties/")) {
    return `${SUPABASE_BASE}${localPath}`;
  }
  return localPath;
}

export const STATIC_PROPERTIES = ALL_STATIC_PROPERTIES
  .filter((p) => p.coverImage && p.coverImage !== "")
  .map((p) => ({
    ...p,
    coverImage: getSupabaseUrl(p.coverImage),
    images: p.images.map(getSupabaseUrl),
  }));

export const FEATURED_PROPERTIES = STATIC_PROPERTIES.filter((p) => p.isFeatured);
