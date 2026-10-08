// Default content from the MUNI-QUIP brief. Used to seed MongoDB and as a
// fallback so the public site always renders, even before the DB is seeded.

export type ServiceIcon = 'asphalt' | 'road' | 'snow' | 'signal' | 'gear';

export interface ServiceData {
  _id?: string;
  slug: string;
  titleEn: string;
  titleFr: string;
  headlineEn: string;
  headlineFr: string;
  shortDescriptionEn: string;
  shortDescriptionFr: string;
  fullContentEn: string;
  fullContentFr: string;
  image: string;
  icon: ServiceIcon | string;
  ctaEn: string;
  ctaFr: string;
  sortOrder: number;
  published: boolean;
}

export interface ProductData {
  _id?: string;
  slug: string;
  nameEn: string;
  nameFr: string;
  subtitleEn: string;
  subtitleFr: string;
  category: string; // service slug
  brand: string;
  shortDescriptionEn: string;
  shortDescriptionFr: string;
  fullDescriptionEn: string;
  fullDescriptionFr: string;
  benefitsEn: string[];
  benefitsFr: string[];
  applicationsEn: string[];
  applicationsFr: string[];
  specifications: { key: string; value: string }[];
  heroImage: string;
  galleryImages: string[];
  price?: string;
  sortOrder: number;
  featured: boolean;
  published: boolean;
  seoTitleEn?: string;
  seoTitleFr?: string;
  seoDescriptionEn?: string;
  seoDescriptionFr?: string;
}

const u = (id: string, w = 1200) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

export const IMAGES = {
  hero: '/muni-quip-hero-v1.png',
  asphalt: u('photo-1763328044351-98341e9963da'),
  road: u('photo-1760708626681-59a5373819a6'),
  winter: u('photo-1579278350462-e88ef330c943'),
  fleet: u('photo-1610647752706-3bb12232b3ab'),
  parts: u('photo-1487754180451-c456f719a1fc'),
  snowplow: u('photo-1676903826883-cbbd7703f2f4', 1600),
  city: u('photo-1504307651254-35680f356dfd', 1600),
  works: u('photo-1541888946425-d81bb19240f5', 1600),
};

export const DEFAULT_SERVICES: ServiceData[] = [
  {
    slug: 'asphalt-repair',
    titleEn: 'Asphalt Repair',
    titleFr: "Réparation d'asphalte",
    headlineEn: 'Recycle asphalt and produce hot mix when and where you need it.',
    headlineFr: "Recyclez l'asphalte et produisez un enrobé chaud quand et où vous en avez besoin.",
    shortDescriptionEn: 'Durable, cost-effective solutions for long-lasting road repairs.',
    shortDescriptionFr: 'Des solutions durables et rentables pour des réparations routières qui durent.',
    fullContentEn:
      'MUNI-QUIP provides durable, cost-effective asphalt repair solutions for municipal public works operations. From mobile recyclers that turn reclaimed asphalt into hot mix at your yard or job site, to hot boxes that keep material ready to use, our solutions help reduce waste, lower material costs and get roads repaired faster.',
    fullContentFr:
      "MUNI-QUIP offre des solutions de réparation d'asphalte durables et rentables pour les travaux publics municipaux. Des recycleurs mobiles qui transforment l'asphalte récupéré en enrobé chaud dans votre cour ou sur le chantier, aux boîtes chauffantes qui gardent le matériau prêt à l'emploi, nos solutions réduisent le gaspillage et les coûts de matériaux.",
    image: '/service-asphalt-repair-v1.png',
    icon: 'asphalt',
    ctaEn: 'Explore Solutions',
    ctaFr: 'Explorer les solutions',
    sortOrder: 1,
    published: true,
  },
  {
    slug: 'road-maintenance',
    titleEn: 'Road Maintenance',
    titleFr: 'Entretien routier',
    headlineEn: 'Equipment designed to help public works crews maintain roads efficiently.',
    headlineFr: 'Des équipements conçus pour aider les équipes des travaux publics à entretenir les routes efficacement.',
    shortDescriptionEn: 'Equipment and solutions for year-round roadway care and preservation.',
    shortDescriptionFr: "Équipements et solutions pour l'entretien et la préservation des routes à l'année.",
    fullContentEn:
      'Year-round road maintenance requires reliable, purpose-built equipment. MUNI-QUIP helps municipalities keep pavement in good condition, extend road life and reduce long-term rehabilitation costs with equipment proven in Canadian conditions.',
    fullContentFr:
      "L'entretien routier à l'année exige des équipements fiables et spécialisés. MUNI-QUIP aide les municipalités à garder leurs chaussées en bon état, à prolonger la durée de vie des routes et à réduire les coûts de réfection à long terme.",
    image: '/service-road-maintenance-v1.png',
    icon: 'road',
    ctaEn: 'Explore Solutions',
    ctaFr: 'Explorer les solutions',
    sortOrder: 2,
    published: true,
  },
  {
    slug: 'winter-maintenance',
    titleEn: 'Winter Maintenance',
    titleFr: 'Entretien hivernal',
    headlineEn: 'Spreader controls, calibration, parts and technical support.',
    headlineFr: "Contrôles d'épandeurs, calibration, pièces et soutien technique.",
    shortDescriptionEn: 'Reliable equipment to keep your roads safe all winter long.',
    shortDescriptionFr: "Des équipements fiables pour garder vos routes sécuritaires tout l'hiver.",
    fullContentEn:
      'Winter road maintenance is critical for public safety. MUNI-QUIP supports municipalities with spreader control systems, calibration, parts supply and technical service for winter maintenance fleets, helping crews apply material precisely and efficiently.',
    fullContentFr:
      "L'entretien hivernal est essentiel à la sécurité publique. MUNI-QUIP soutient les municipalités avec des systèmes de contrôle d'épandage, la calibration, les pièces et le service technique pour les flottes d'hiver.",
    image: '/service-winter-maintenance-v1.png',
    icon: 'snow',
    ctaEn: 'Explore Solutions',
    ctaFr: 'Explorer les solutions',
    sortOrder: 3,
    published: true,
  },
  {
    slug: 'fleet-safety',
    titleEn: 'Fleet Safety & Technology',
    titleFr: 'Sécurité et technologie de flotte',
    headlineEn: 'Cameras, sensors and technology designed to improve fleet operation and safety.',
    headlineFr: 'Caméras, capteurs et technologies conçus pour améliorer le fonctionnement et la sécurité de la flotte.',
    shortDescriptionEn: 'Smarter, safer fleets with advanced technology and visibility solutions.',
    shortDescriptionFr: 'Des flottes plus intelligentes et sécuritaires grâce à la technologie et à la visibilité.',
    fullContentEn:
      'Public works vehicles operate in busy, complex environments. MUNI-QUIP provides camera, sensor and safety systems that improve operator awareness, reduce incidents and protect workers and the public around municipal equipment.',
    fullContentFr:
      "Les véhicules des travaux publics circulent dans des environnements achalandés. MUNI-QUIP fournit des caméras, capteurs et systèmes de sécurité qui améliorent la vigilance des opérateurs et protègent les travailleurs et le public.",
    image: '/service-fleet-safety-v1.png',
    icon: 'signal',
    ctaEn: 'Explore Solutions',
    ctaFr: 'Explorer les solutions',
    sortOrder: 4,
    published: true,
  },
  {
    slug: 'parts-service',
    titleEn: 'Parts & Service',
    titleFr: 'Pièces et service',
    headlineEn: 'Keep your equipment operating with parts, calibration and technical support.',
    headlineFr: 'Gardez vos équipements en marche grâce aux pièces, à la calibration et au soutien technique.',
    shortDescriptionEn: 'Genuine parts, expert service and support to keep you up and running.',
    shortDescriptionFr: "Pièces d'origine, service expert et soutien pour rester opérationnel.",
    fullContentEn:
      'Downtime costs municipalities money. MUNI-QUIP supplies genuine parts, calibration services and expert technical support to keep your equipment performing and extend its service life.',
    fullContentFr:
      "Les temps d'arrêt coûtent cher aux municipalités. MUNI-QUIP fournit des pièces d'origine, des services de calibration et un soutien technique expert pour prolonger la vie de vos équipements.",
    image: '/service-parts-service-v1.png',
    icon: 'gear',
    ctaEn: 'Explore Solutions',
    ctaFr: 'Explorer les solutions',
    sortOrder: 5,
    published: true,
  },
];

export const DEFAULT_PRODUCTS: ProductData[] = [
  {
    slug: 'bagela-ba-10000',
    nameEn: 'BAGELA BA 10000',
    nameFr: 'BAGELA BA 10000',
    subtitleEn: 'Mobile Asphalt Recycling',
    subtitleFr: "Recyclage d'asphalte mobile",
    category: 'asphalt-repair',
    brand: 'BAGELA',
    shortDescriptionEn: 'Turn reclaimed asphalt into hot, reusable material directly at your yard or job site.',
    shortDescriptionFr: "Transformez l'asphalte récupéré en matériau chaud et réutilisable, directement dans votre cour ou sur le chantier.",
    fullDescriptionEn:
      'The BAGELA BA 10000 is a mobile asphalt recycler that lets municipalities produce hot mix on demand. Turn reclaimed asphalt pavement into hot, reusable material at your yard or job site, reducing material costs, hauling and waste.',
    fullDescriptionFr:
      "Le BAGELA BA 10000 est un recycleur d'asphalte mobile qui permet aux municipalités de produire de l'enrobé chaud à la demande. Transformez l'asphalte récupéré en matériau chaud et réutilisable, en réduisant les coûts de matériaux, le transport et le gaspillage.",
    benefitsEn: ['Produces hot mix on site, on demand', 'Reduces material purchase and hauling costs', 'Recycles reclaimed asphalt instead of landfilling it', 'Extends the patching season', 'Supported by MUNI-QUIP service and parts'],
    benefitsFr: ["Produit de l'enrobé chaud sur place, à la demande", "Réduit les coûts d'achat et de transport des matériaux", "Recycle l'asphalte récupéré au lieu de l'enfouir", 'Prolonge la saison de rapiéçage', 'Soutenu par le service et les pièces MUNI-QUIP'],
    applicationsEn: ['Pothole repair', 'Utility cut reinstatement', 'Sidewalk and driveway repair', 'Emergency road repair', 'Yard stockpile recycling'],
    applicationsFr: ['Réparation de nids-de-poule', 'Remise en état de tranchées', "Réparation de trottoirs et d'entrées", 'Réparations routières d\'urgence', 'Recyclage des réserves en cour'],
    specifications: [
      { key: 'Type', value: 'Mobile asphalt recycler' },
      { key: 'Input material', value: 'Reclaimed asphalt pavement (RAP)' },
      { key: 'Configuration', value: 'Trailer-mounted' },
    ],
    heroImage: IMAGES.asphalt,
    galleryImages: [],
    sortOrder: 1,
    featured: true,
    published: true,
  },
  {
    slug: 'novilco-hot-boxes',
    nameEn: 'NOVILCO ASPHALT HOT BOXES',
    nameFr: 'BOÎTES CHAUFFANTES NOVILCO',
    subtitleEn: 'Asphalt Hot Boxes',
    subtitleFr: "Boîtes chauffantes d'asphalte",
    category: 'asphalt-repair',
    brand: 'NOVILCO',
    shortDescriptionEn: 'Keep asphalt hot, usable and ready when your crew needs it.',
    shortDescriptionFr: "Gardez l'asphalte chaud, utilisable et prêt quand votre équipe en a besoin.",
    fullDescriptionEn:
      'NOVILCO asphalt hot boxes keep asphalt hot, workable and ready when your crew needs it. Built for municipal public works operations, they hold material temperature from the plant to the job site.',
    fullDescriptionFr:
      "Les boîtes chauffantes NOVILCO gardent l'asphalte chaud, maniable et prêt quand votre équipe en a besoin. Conçues pour les travaux publics municipaux, elles maintiennent la température du matériau de l'usine au chantier.",
    benefitsEn: ['Keeps asphalt at working temperature', 'Reduces wasted material', 'Several sizes and configurations', 'Built for Canadian conditions', 'Simple to operate and maintain'],
    benefitsFr: ["Maintient l'asphalte à température de travail", 'Réduit le gaspillage de matériau', 'Plusieurs formats et configurations', 'Conçues pour les conditions canadiennes', 'Simples à utiliser et à entretenir'],
    applicationsEn: ['Pothole repair crews', 'Road maintenance operations', 'Emergency repairs', 'Remote job sites'],
    applicationsFr: ['Équipes de réparation de nids-de-poule', "Opérations d'entretien routier", "Réparations d'urgence", 'Chantiers éloignés'],
    specifications: [
      { key: 'Sizes', value: 'Multiple capacities available' },
      { key: 'Mounting', value: 'Truck or trailer' },
    ],
    heroImage: IMAGES.road,
    galleryImages: [],
    sortOrder: 2,
    featured: true,
    published: true,
  },
  {
    slug: 'dickey-john-genesis',
    nameEn: 'DICKEY-john / GENESIS',
    nameFr: 'DICKEY-john / GENESIS',
    subtitleEn: 'Precision Spreading Technology',
    subtitleFr: "Technologie d'épandage de précision",
    category: 'winter-maintenance',
    brand: 'DICKEY-john',
    shortDescriptionEn: 'Precision spreading technology backed by calibration and service support.',
    shortDescriptionFr: "Technologie d'épandage de précision appuyée par la calibration et le service.",
    fullDescriptionEn:
      'DICKEY-john and GENESIS spreader controls give winter maintenance fleets precise control over salt, sand and liquid application. MUNI-QUIP provides sales, calibration, parts and service support.',
    fullDescriptionFr:
      "Les contrôles d'épandage DICKEY-john et GENESIS offrent aux flottes d'hiver un contrôle précis de l'application de sel, de sable et de liquides. MUNI-QUIP offre la vente, la calibration, les pièces et le service.",
    benefitsEn: ['Accurate application rates', 'Less material overuse', 'Consistent results across the fleet', 'Data logging and reporting', 'Calibration and service from MUNI-QUIP'],
    benefitsFr: ["Taux d'application précis", 'Moins de surconsommation de matériaux', 'Résultats constants dans toute la flotte', 'Journalisation et rapports de données', 'Calibration et service par MUNI-QUIP'],
    applicationsEn: ['Salt and sand spreading', 'Liquid anti-icing', 'Pre-wetting systems', 'Municipal winter fleets'],
    applicationsFr: ['Épandage de sel et de sable', 'Antigivrage liquide', 'Systèmes de prémouillage', "Flottes municipales d'hiver"],
    specifications: [
      { key: 'Application', value: 'Granular and liquid spreading' },
      { key: 'Support', value: 'Calibration, parts and service' },
    ],
    heroImage: IMAGES.winter,
    galleryImages: [],
    sortOrder: 3,
    featured: true,
    published: true,
  },
  {
    slug: 'camera-safety-systems',
    nameEn: 'CAMERA & SAFETY SYSTEMS',
    nameFr: 'SYSTÈMES DE CAMÉRAS ET DE SÉCURITÉ',
    subtitleEn: 'Fleet Visibility & Safety',
    subtitleFr: 'Visibilité et sécurité de la flotte',
    category: 'fleet-safety',
    brand: '',
    shortDescriptionEn: 'Improve visibility and awareness around municipal vehicles and equipment.',
    shortDescriptionFr: 'Améliorez la visibilité et la vigilance autour des véhicules et équipements municipaux.',
    fullDescriptionEn:
      'Camera and safety systems designed for municipal vehicles and equipment. Improve operator visibility, reduce blind spots and help protect workers and the public.',
    fullDescriptionFr:
      'Des systèmes de caméras et de sécurité conçus pour les véhicules et équipements municipaux. Améliorez la visibilité des opérateurs, réduisez les angles morts et protégez les travailleurs et le public.',
    benefitsEn: ['Reduces blind spots', 'Protects workers and the public', 'Improves operator awareness', 'Recorded footage for incident review', 'Configurations for any vehicle'],
    benefitsFr: ['Réduit les angles morts', 'Protège les travailleurs et le public', 'Améliore la vigilance des opérateurs', "Enregistrements pour l'analyse d'incidents", 'Configurations pour tout véhicule'],
    applicationsEn: ['Plow trucks', 'Refuse collection vehicles', 'Utility vehicles', 'Heavy equipment'],
    applicationsFr: ['Camions de déneigement', 'Véhicules de collecte', 'Véhicules utilitaires', 'Équipement lourd'],
    specifications: [
      { key: 'Components', value: 'Cameras, monitor, recorder, sensors' },
      { key: 'Vehicles', value: 'Trucks, plows and heavy equipment' },
    ],
    heroImage: IMAGES.fleet,
    galleryImages: [],
    sortOrder: 4,
    featured: true,
    published: true,
  },
];

export interface PageContentData {
  pageKey: string;
  heroHeadingEn?: string;
  heroHeadingFr?: string;
  heroDescriptionEn?: string;
  heroDescriptionFr?: string;
  heroCta1En?: string;
  heroCta1Fr?: string;
  heroCta2En?: string;
  heroCta2Fr?: string;
  heroImage?: string;
  section1HeadingEn?: string;
  section1HeadingFr?: string;
  section1TextEn?: string;
  section1TextFr?: string;
  seoTitleEn?: string;
  seoTitleFr?: string;
  seoDescriptionEn?: string;
  seoDescriptionFr?: string;
  blocks?: Record<string, string>;
}

export interface SettingsData {
  siteName: string;
  taglineEn: string;
  taglineFr: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  serviceAreaEn: string;
  serviceAreaFr: string;
  footerTextEn: string;
  footerTextFr: string;
}

export const DEFAULT_SETTINGS: SettingsData = {
  siteName: 'MUNI-QUIP',
  taglineEn: 'Reliable Municipal Solutions',
  taglineFr: 'Solutions municipales fiables',
  phone: '613-930-6924',
  email: 'matt@muni-quip.ca',
  address: '841 Sydney Street, Suite 7-313',
  city: 'Cornwall',
  province: 'ON',
  postalCode: 'K6H 7L2',
  serviceAreaEn: 'Ontario and Quebec',
  serviceAreaFr: 'Ontario et Québec',
  footerTextEn: 'Reliable Equipment. Stronger Communities.',
  footerTextFr: 'Équipements fiables. Communautés plus fortes.',
};

export const FALLBACK_IMAGE = IMAGES.road;
