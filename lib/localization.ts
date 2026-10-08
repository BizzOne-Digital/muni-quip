export type Locale = 'en' | 'fr';

export function getBilingualField<T>(
  obj: Record<string, unknown>,
  fieldEn: string,
  fieldFr: string,
  locale: Locale
): T {
  if (locale === 'fr') {
    return (obj[fieldFr] || obj[fieldEn]) as T;
  }
  return (obj[fieldEn] || obj[fieldFr]) as T;
}

export const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About Us',
      services: 'Services',
      booking: 'Booking',
      contact: 'Contact',
      requestQuote: 'REQUEST A QUOTE',
    },
    hero: {
      eyebrow: 'RELIABLE MUNICIPAL SOLUTIONS',
      headline1: 'MUNICIPAL',
      headline2: 'EQUIPMENT.',
      headline3: 'PARTS. SERVICE.',
      headline4: 'SOLUTIONS.',
      description:
        'Specialized equipment, parts, service and practical solutions for municipalities and public works departments across Quebec and Ontario.',
      cta1: 'Explore Solutions',
      cta2: 'Request a Quote',
      trust1a: 'SERVING',
      trust1b: 'QUEBEC & ONTARIO',
      trust2: 'TRUSTED BRANDS',
      trust3: 'REAL SUPPORT',
      trust4a: 'BUILT FOR',
      trust4b: 'MUNICIPALITIES',
    },
    solutions: {
      eyebrow: 'OUR SOLUTIONS',
      heading: 'A COMPLETE RANGE FOR MUNICIPAL OPERATIONS',
      description:
        'From road repair to winter maintenance, we provide the equipment, parts and support municipalities need to keep their communities safe, efficient and moving forward.',
      exploreCta: 'Explore Solutions',
    },
    products: {
      eyebrow: 'FEATURED PRODUCTS',
      heading: 'TRUSTED EQUIPMENT FOR REAL-WORLD RESULTS',
      learnMore: 'Learn More',
      requestQuote: 'Request a Quote',
    },
    about: {
      eyebrow: 'ABOUT MUNI-QUIP',
      heading: 'PRACTICAL SOLUTIONS FOR STRONGER COMMUNITIES',
      text: 'At MUNI-QUIP, we provide municipalities and public works departments across Quebec and Ontario with specialized equipment, parts, service and practical solutions that improve productivity, reduce operating costs and extend equipment life.',
      cta: 'Learn More About Us',
      benefit1Title: 'HIGHER PRODUCTIVITY',
      benefit1Text: 'Get more done, with less downtime.',
      benefit2Title: 'LOWER OPERATING COSTS',
      benefit2Text: 'Smarter solutions for better value.',
      benefit3Title: 'LONGER EQUIPMENT LIFE',
      benefit3Text: 'Protect your investment.',
    },
    strip: {
      item1Title: 'PRACTICAL SOLUTIONS',
      item1Text: 'Real-world results for municipal operations.',
      item2Title: 'PROVEN PRODUCTS',
      item2Text: 'Trusted brands that perform.',
      item3Title: 'TECHNICAL SUPPORT',
      item3Text: 'Expert guidance when you need it.',
      item4Title: 'MUNICIPAL EXPERTISE',
      item4Text: 'We understand your challenges.',
      item5Title: 'BILINGUAL SERVICE',
      item5Text: 'Proudly serving you in English and French.',
    },
    contact: {
      eyebrow: 'GET IN TOUCH',
      heading: "LET'S FIND THE RIGHT SOLUTION FOR YOUR MUNICIPALITY",
      text: "Request a quote, book a service or speak with our team. We're here to help.",
      namePlaceholder: 'Your Name *',
      orgPlaceholder: 'Municipality / Organization',
      emailPlaceholder: 'Email Address *',
      phonePlaceholder: 'Phone Number',
      messagePlaceholder: 'How can we help you?',
      sendButton: 'Send Message',
      successMessage: 'Your message has been sent. We will be in touch shortly.',
    },
    footer: {
      tagline: 'Reliable Equipment. Stronger Communities.',
      copyright: '© MUNI-QUIP. All rights reserved.',
    },
    booking: {
      title: 'BOOK SERVICE / REQUEST A CONSULTATION',
      subtitle: 'Tell us how we can help and we will be in touch within one business day.',
    },
    common: {
      readMore: 'Read More',
      viewAll: 'View All',
      loading: 'Loading...',
      error: 'An error occurred. Please try again.',
      required: 'This field is required.',
      invalidEmail: 'Please enter a valid email address.',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      about: 'À propos',
      services: 'Services',
      booking: 'Réservation',
      contact: 'Contact',
      requestQuote: 'DEMANDE DE SOUMISSION',
    },
    hero: {
      eyebrow: 'SOLUTIONS MUNICIPALES FIABLES',
      headline1: 'ÉQUIPEMENT',
      headline2: 'MUNICIPAL.',
      headline3: 'PIÈCES. SERVICE.',
      headline4: 'SOLUTIONS.',
      description:
        "Équipements spécialisés, pièces, service et solutions pratiques pour les municipalités et les services des travaux publics du Québec et de l'Ontario.",
      cta1: 'Explorer les solutions',
      cta2: 'Demander une soumission',
      trust1a: 'AU SERVICE DU',
      trust1b: "QUÉBEC ET DE L'ONTARIO",
      trust2: 'MARQUES DE CONFIANCE',
      trust3: 'SOUTIEN RÉEL',
      trust4a: 'CONÇU POUR LES',
      trust4b: 'MUNICIPALITÉS',
    },
    solutions: {
      eyebrow: 'NOS SOLUTIONS',
      heading: 'UNE GAMME COMPLÈTE POUR LES OPÉRATIONS MUNICIPALES',
      description:
        "De la réparation routière à l'entretien hivernal, nous fournissons l'équipement, les pièces et le soutien dont les municipalités ont besoin.",
      exploreCta: 'Explorer les solutions',
    },
    products: {
      eyebrow: 'PRODUITS EN VEDETTE',
      heading: "ÉQUIPEMENTS DE CONFIANCE POUR DES RÉSULTATS RÉELS",
      learnMore: 'En savoir plus',
      requestQuote: 'Demander une soumission',
    },
    about: {
      eyebrow: 'À PROPOS DE MUNI-QUIP',
      heading: 'DES SOLUTIONS PRATIQUES POUR DES COMMUNAUTÉS PLUS FORTES',
      text: "Chez MUNI-QUIP, nous fournissons aux municipalités et aux services des travaux publics du Québec et de l'Ontario des équipements spécialisés, des pièces, des services et des solutions pratiques.",
      cta: 'En savoir plus sur nous',
      benefit1Title: 'PRODUCTIVITÉ ACCRUE',
      benefit1Text: 'Faites plus avec moins de temps d\'arrêt.',
      benefit2Title: 'COÛTS RÉDUITS',
      benefit2Text: 'Des solutions plus intelligentes pour une meilleure valeur.',
      benefit3Title: 'DURÉE DE VIE PROLONGÉE',
      benefit3Text: 'Protégez votre investissement.',
    },
    strip: {
      item1Title: 'SOLUTIONS PRATIQUES',
      item1Text: 'Résultats concrets pour les opérations municipales.',
      item2Title: 'PRODUITS ÉPROUVÉS',
      item2Text: 'Des marques de confiance qui performent.',
      item3Title: 'SUPPORT TECHNIQUE',
      item3Text: "Conseils d'experts quand vous en avez besoin.",
      item4Title: 'EXPERTISE MUNICIPALE',
      item4Text: 'Nous comprenons vos défis.',
      item5Title: 'SERVICE BILINGUE',
      item5Text: 'Fiers de vous servir en français et en anglais.',
    },
    contact: {
      eyebrow: 'CONTACTEZ-NOUS',
      heading: 'TROUVONS LA BONNE SOLUTION POUR VOTRE MUNICIPALITÉ',
      text: "Demandez une soumission, réservez un service ou parlez à notre équipe. Nous sommes là pour vous aider.",
      namePlaceholder: 'Votre nom *',
      orgPlaceholder: 'Municipalité / Organisation',
      emailPlaceholder: 'Adresse courriel *',
      phonePlaceholder: 'Numéro de téléphone',
      messagePlaceholder: 'Comment pouvons-nous vous aider?',
      sendButton: 'Envoyer le message',
      successMessage: 'Votre message a été envoyé. Nous vous contacterons sous peu.',
    },
    footer: {
      tagline: 'Équipements fiables. Communautés plus fortes.',
      copyright: '© MUNI-QUIP. Tous droits réservés.',
    },
    booking: {
      title: 'RÉSERVER UN SERVICE / DEMANDER UNE CONSULTATION',
      subtitle: 'Dites-nous comment nous pouvons vous aider et nous vous contacterons dans un délai d\'un jour ouvrable.',
    },
    common: {
      readMore: 'En savoir plus',
      viewAll: 'Voir tout',
      loading: 'Chargement...',
      error: 'Une erreur est survenue. Veuillez réessayer.',
      required: 'Ce champ est obligatoire.',
      invalidEmail: 'Veuillez entrer une adresse courriel valide.',
    },
  },
};

export type Translations = typeof translations.en;

/** Pick the localized value, falling back to the other language, then to a default. */
export function pick(locale: string, en?: string, fr?: string, fallback = ''): string {
  const primary = locale === 'fr' ? fr : en;
  const secondary = locale === 'fr' ? en : fr;
  return (primary && primary.trim()) || (secondary && secondary.trim()) || fallback;
}

export function pickList(locale: string, en?: string[], fr?: string[]): string[] {
  const primary = locale === 'fr' ? fr : en;
  return primary && primary.length ? primary : (locale === 'fr' ? en : fr) ?? [];
}
