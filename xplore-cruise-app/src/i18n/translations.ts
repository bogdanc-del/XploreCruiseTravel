export type Locale = 'en' | 'ro'

export const translations = {
  en: {
    // Navigation
    nav_home: 'Home',
    nav_cruises: 'Cruises',
    nav_about: 'About',
    nav_contact: 'Contact',
    nav_admin: 'Admin',
    lang_switch: 'RO',

    // Hero
    hero_title: 'Discover the World by Sea',
    hero_subtitle: 'Premium cruise experiences curated for unforgettable journeys across the most beautiful destinations on Earth.',
    hero_cta: 'Explore Cruises',
    hero_cta2: 'Contact Us',

    // Stats
    stats_cruises: 'Cruise Offers',
    stats_destinations: 'Destinations',
    stats_clients: 'Happy Clients',
    stats_years: 'Years Experience',

    // Cruise Cards
    cruise_from: 'from',
    cruise_nights: 'nights',
    cruise_night: 'night',
    cruise_departure: 'Departure',
    cruise_ports: 'Ports of Call',
    cruise_view_details: 'View Details',
    cruise_book_now: 'Book Now',
    cruise_featured: 'Featured',
    cruise_per_person: '/person',
    cruise_lei: 'Lei',

    // Filters
    filter_all: 'All',
    filter_destination: 'Destination',
    filter_type: 'Cruise Type',
    filter_price: 'Price Range',
    filter_nights: 'Duration',
    filter_search: 'Search cruises...',
    filter_sort: 'Sort by',
    filter_sort_price_asc: 'Price: Low to High',
    filter_sort_price_desc: 'Price: High to Low',
    filter_sort_date: 'Departure Date',
    filter_sort_nights: 'Duration',
    filter_no_results: 'No cruises found matching your criteria.',

    // Cruise Types
    type_ocean: 'Ocean',
    type_river: 'River',
    type_luxury: 'Luxury',
    type_expedition: 'Expedition',

    // Detail Page
    detail_overview: 'Overview',
    detail_itinerary: 'Itinerary',
    detail_cabins: 'Cabin Options',
    detail_included: "What's Included",
    detail_excluded: 'Not Included',
    detail_advisor: 'Advisor Notes',
    detail_similar: 'Similar Cruises',
    detail_cabin_from: 'from',
    detail_cancellation: 'Cancellation Policy',
    detail_cancellation_period: 'Period before departure',
    detail_cancellation_penalty: 'Penalty',
    detail_cancellation_source: 'Based on standard cruise industry cancellation policies. Penalties are calculated as % of total package price. Conditions may vary — contact us for details.',

    // Booking Modal
    booking_title: 'Book Your Cruise',
    booking_step1_title: 'Personal Details',
    booking_step2_title: 'Cruise Selection',
    booking_step3_title: 'Review & Confirm',
    booking_firstname: 'First Name',
    booking_lastname: 'Last Name',
    booking_dob: 'Date of Birth',
    booking_email: 'Email Address',
    booking_phone: 'Phone Number',
    booking_cabin_pref: 'Cabin Preference',
    booking_passengers: 'Number of Passengers',
    booking_special_requests: 'Special Requests',
    booking_requests_placeholder: 'Dietary needs, accessibility, celebrations...',
    booking_next: 'Next Step',
    booking_prev: 'Previous',
    booking_submit: 'Submit Reservation',
    booking_fill_required: 'Please fill in all required fields.',
    booking_invalid_email: 'Please enter a valid email address.',
    booking_accept_terms: 'Please accept the required consents to proceed.',
    booking_success_title: 'Reservation Received!',
    booking_success_msg: 'Thank you! Our cruise consultant will contact you within 2 hours to confirm your reservation and discuss payment options.',
    booking_gdpr_consent: 'I consent to the processing of my personal data for booking purposes, in accordance with GDPR regulations and our Privacy Policy.',
    booking_terms_agree: 'I agree to the Terms & Conditions and cancellation policy.',
    booking_marketing_consent: 'I agree to receive promotional offers and cruise deals via email (optional).',

    // Contact
    contact_title: 'Get in Touch',
    contact_subtitle: 'Ready to plan your dream cruise? We\'re here to help!',
    contact_name: 'Your Name',
    contact_email: 'Email Address',
    contact_phone: 'Phone Number',
    contact_cruise_interest: 'Cruise Interest',
    contact_message: 'Your Message',
    contact_send: 'Send Message',
    contact_success: 'Message sent successfully! We\'ll get back to you soon.',
    contact_quick_title: 'Quick Contact',
    contact_office: 'Our Office',
    contact_hours: 'Working Hours',
    contact_hours_value: 'Mon - Fri: 09:00 - 18:00\nSat: 10:00 - 14:00',

    // About
    about_title: 'About XploreCruiseTravel',
    about_subtitle: 'Your trusted partner for premium cruise experiences',
    about_mission_title: 'Our Mission',
    about_mission: 'We curate the finest cruise experiences from world-renowned cruise lines, making luxury ocean and river travel accessible to everyone. Since 2016, we bring you exclusive deals and personalized service.',
    about_why_title: 'Why Choose Us?',
    about_why_1: 'Licensed cruise consultant with access to exclusive deals',
    about_why_2: 'Personalized cruise consulting',
    about_why_3: 'Competitive prices with exclusive cruise deals',
    about_why_4: 'Complete GDPR-compliant booking process',
    about_why_5: '24/7 support during your voyage',

    // Footer
    footer_company: 'XploreCruiseTravel',
    footer_tagline: 'Premium cruise experiences, curated for you.',
    footer_quick_links: 'Quick Links',
    footer_legal: 'Legal',
    footer_terms: 'Terms & Conditions',
    footer_privacy: 'Privacy Policy',
    footer_cookies: 'Cookie Policy',
    footer_gdpr: 'GDPR',
    footer_contact: 'Contact',
    footer_copyright: '© 2026 XploreCruiseTravel. All rights reserved.',
    footer_partner: 'Licensed Cruise Consultant — CUI 36785800',

    // Chat
    chat_title: 'Cruise Advisor',
    chat_subtitle: 'AI-powered cruise consultant',
    chat_placeholder: 'Ask me about cruises, destinations, prices...',
    chat_welcome: 'Hello! I\'m your personal cruise advisor. I can help you find the perfect cruise based on your preferences. What are you looking for?',
    chat_sending: 'Thinking...',

    // GDPR/Cookie
    cookie_title: 'We use cookies',
    cookie_text: 'This website uses cookies to ensure you get the best experience.',
    cookie_accept: 'Accept All',
    cookie_reject: 'Reject Optional',
    cookie_settings: 'Cookie Settings',

    // Route Map
    map_title: 'Cruise Route',
    map_departure: 'Departure port',
    map_port: 'Port of call',
    map_route: 'Route',
    map_departure_label: 'Departure',

    // Beverages Tab
    detail_beverages: 'Beverages',
    beverages_title: 'Beverage Packages',
    beverages_drinks_included: 'Drinks Included',
    beverages_per_day: '/day',
    beverages_whats_included: "What's included",
    beverages_price_note: 'Prices may vary by itinerary and booking date. Contact us for updated pricing.',

    // Terms Tab
    detail_terms: 'Terms & Conditions',
    terms_general: 'General Terms',
    terms_may_vary: 'Terms may vary. Contact us for updated information and conditions specific to your booking.',

    // Port Drawer
    port_explore: 'Explore',
    port_highlights: 'Top Highlights',
    port_video: 'Video',
    port_excursions: 'Recommended Excursions',
    port_book_on: 'Book on',
    port_coming_soon: 'Information about this port will be available soon.',
    port_arrival: 'Arrival',
    port_departure_time: 'Departure',

    // Itinerary
    itinerary_day: 'Day',
    itinerary_departure: 'Departure',
    itinerary_return: 'Return',

    // Gallery
    gallery_view: 'View full image gallery',
    gallery_close: 'Close lightbox',
    gallery_prev: 'Previous image',
    gallery_next: 'Next image',
    gallery_more: 'more photos',

    // Excursions
    excursion_from: 'from',
    excursion_duration: 'Duration',

    // Cruise Line Info
    cruise_line_label: 'Cruise Line',
    ship_label: 'Ship',
    destination_label: 'Destination',
    duration_label: 'Duration',
    departure_port_label: 'Departure Port',

    // Common
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Try Again',
    close: 'Close',
    back: 'Back',
    see_all: 'See All',
  },

  ro: {
    // Navigation
    nav_home: 'Acasă',
    nav_cruises: 'Croaziere',
    nav_about: 'Despre',
    nav_contact: 'Contact',
    nav_admin: 'Admin',
    lang_switch: 'EN',

    // Hero
    hero_title: 'Descoperă Lumea pe Mare',
    hero_subtitle: 'Experiențe premium de croazieră selectate pentru călătorii de neuitat în cele mai frumoase destinații de pe Pământ.',
    hero_cta: 'Explorează Croazierele',
    hero_cta2: 'Contactează-ne',

    // Stats
    stats_cruises: 'Oferte Croaziere',
    stats_destinations: 'Destinații',
    stats_clients: 'Clienți Mulțumiți',
    stats_years: 'Ani Experiență',

    // Cruise Cards
    cruise_from: 'de la',
    cruise_nights: 'nopți',
    cruise_night: 'noapte',
    cruise_departure: 'Plecare',
    cruise_ports: 'Porturi de escală',
    cruise_view_details: 'Vezi Detalii',
    cruise_book_now: 'Rezervă Acum',
    cruise_featured: 'Recomandat',
    cruise_per_person: '/persoană',
    cruise_lei: 'Lei',

    // Filters
    filter_all: 'Toate',
    filter_destination: 'Destinație',
    filter_type: 'Tip Croazieră',
    filter_price: 'Interval Preț',
    filter_nights: 'Durată',
    filter_search: 'Caută croaziere...',
    filter_sort: 'Sortează după',
    filter_sort_price_asc: 'Preț: Mic la Mare',
    filter_sort_price_desc: 'Preț: Mare la Mic',
    filter_sort_date: 'Data Plecării',
    filter_sort_nights: 'Durată',
    filter_no_results: 'Nu s-au găsit croaziere care să corespundă criteriilor.',

    // Cruise Types
    type_ocean: 'Ocean',
    type_river: 'Fluvial',
    type_luxury: 'Lux',
    type_expedition: 'Expediție',

    // Detail Page
    detail_overview: 'Prezentare',
    detail_itinerary: 'Itinerariu',
    detail_cabins: 'Opțiuni Cabine',
    detail_included: 'Ce este inclus',
    detail_excluded: 'Nu este inclus',
    detail_advisor: 'Nota Consultantului',
    detail_similar: 'Croaziere Similare',
    detail_cabin_from: 'de la',
    detail_cancellation: 'Politica de Anulare',
    detail_cancellation_period: 'Perioada înainte de plecare',
    detail_cancellation_penalty: 'Penalitate',
    detail_cancellation_source: 'Conform politicilor standard de anulare din industria croazierelor. Penalitățile sunt calculate ca % din prețul total al pachetului. Condițiile pot varia — contactați-ne pentru detalii.',

    // Booking Modal
    booking_title: 'Rezervă Croaziera',
    booking_step1_title: 'Date Personale',
    booking_step2_title: 'Selecție Croazieră',
    booking_step3_title: 'Verificare & Confirmare',
    booking_firstname: 'Prenume',
    booking_lastname: 'Nume',
    booking_dob: 'Data Nașterii',
    booking_email: 'Adresă Email',
    booking_phone: 'Număr Telefon',
    booking_cabin_pref: 'Preferință Cabină',
    booking_passengers: 'Număr Pasageri',
    booking_special_requests: 'Cereri Speciale',
    booking_requests_placeholder: 'Cerințe alimentare, accesibilitate, sărbători...',
    booking_next: 'Pasul Următor',
    booking_prev: 'Înapoi',
    booking_submit: 'Trimite Rezervarea',
    booking_fill_required: 'Vă rugăm completați toate câmpurile obligatorii.',
    booking_invalid_email: 'Vă rugăm introduceți o adresă de email validă.',
    booking_accept_terms: 'Vă rugăm acceptați consimțămintele obligatorii.',
    booking_success_title: 'Rezervare Primită!',
    booking_success_msg: 'Vă mulțumim! Consultantul nostru de croaziere vă va contacta în maxim 2 ore pentru confirmarea rezervării și discutarea opțiunilor de plată.',
    booking_gdpr_consent: 'Consimt la prelucrarea datelor mele personale în scopul rezervării, conform reglementărilor GDPR și Politicii de Confidențialitate.',
    booking_terms_agree: 'Sunt de acord cu Termenii & Condițiile și politica de anulare.',
    booking_marketing_consent: 'Sunt de acord să primesc oferte promoționale și oferte de croaziere prin email (opțional).',

    // Contact
    contact_title: 'Ia Legătura',
    contact_subtitle: 'Pregătit să planifici croaziera visurilor tale? Suntem aici să te ajutăm!',
    contact_name: 'Numele Tău',
    contact_email: 'Adresă Email',
    contact_phone: 'Număr Telefon',
    contact_cruise_interest: 'Interes Croazieră',
    contact_message: 'Mesajul Tău',
    contact_send: 'Trimite Mesajul',
    contact_success: 'Mesaj trimis cu succes! Revenim în curând.',
    contact_quick_title: 'Contact Rapid',
    contact_office: 'Biroul Nostru',
    contact_hours: 'Program Lucru',
    contact_hours_value: 'Luni - Vineri: 09:00 - 18:00\nSâmbătă: 10:00 - 14:00',

    // About
    about_title: 'Despre XploreCruiseTravel',
    about_subtitle: 'Partenerul tău de încredere pentru experiențe premium de croazieră',
    about_mission_title: 'Misiunea Noastră',
    about_mission: 'Selectăm cele mai bune experiențe de croazieră de la companii de renume mondial, făcând călătoriile de lux pe ocean și râu accesibile tuturor. Din 2016, vă aducem oferte exclusive și servicii personalizate.',
    about_why_title: 'De Ce Să Ne Alegi?',
    about_why_1: 'Consilier de croaziere autorizat cu acces la oferte exclusive',
    about_why_2: 'Consultanță personalizată pentru croaziere',
    about_why_3: 'Prețuri competitive cu oferte exclusive de croaziere',
    about_why_4: 'Proces de rezervare complet conform GDPR',
    about_why_5: 'Suport 24/7 pe durata călătoriei',

    // Footer
    footer_company: 'XploreCruiseTravel',
    footer_tagline: 'Experiențe premium de croazieră, selectate pentru tine.',
    footer_quick_links: 'Linkuri Rapide',
    footer_legal: 'Legal',
    footer_terms: 'Termeni & Condiții',
    footer_privacy: 'Politica de Confidențialitate',
    footer_cookies: 'Politica Cookie',
    footer_gdpr: 'GDPR',
    footer_contact: 'Contact',
    footer_copyright: '© 2026 XploreCruiseTravel. Toate drepturile rezervate.',
    footer_partner: 'Consilier de Croaziere Autorizat — CUI 36785800',

    // Chat
    chat_title: 'Consilier Croaziere',
    chat_subtitle: 'Consultant AI pentru croaziere',
    chat_placeholder: 'Întreabă-mă despre croaziere, destinații, prețuri...',
    chat_welcome: 'Bună! Sunt consilierul tău personal de croaziere. Te pot ajuta să găsești croaziera perfectă în funcție de preferințele tale. Ce cauți?',
    chat_sending: 'Se gândește...',

    // GDPR/Cookie
    cookie_title: 'Folosim cookie-uri',
    cookie_text: 'Acest site folosește cookie-uri pentru a vă asigura cea mai bună experiență.',
    cookie_accept: 'Acceptă Tot',
    cookie_reject: 'Respinge Opționale',
    cookie_settings: 'Setări Cookie',

    // Route Map
    map_title: 'Traseu Croazieră',
    map_departure: 'Port plecare',
    map_port: 'Escală',
    map_route: 'Traseu',
    map_departure_label: 'Plecare',

    // Beverages Tab
    detail_beverages: 'Băuturi',
    beverages_title: 'Pachete de Băuturi',
    beverages_drinks_included: 'Băuturi Incluse',
    beverages_per_day: '/zi',
    beverages_whats_included: 'Ce include',
    beverages_price_note: 'Prețurile pot varia în funcție de itinerariu și data rezervării. Contactați-ne pentru prețuri actualizate.',

    // Terms Tab
    detail_terms: 'Termeni și Condiții',
    terms_general: 'Termeni Generali',
    terms_may_vary: 'Termenii pot varia. Contactați-ne pentru informații actualizate și condiții specifice rezervării dumneavoastră.',

    // Port Drawer
    port_explore: 'Explorează',
    port_highlights: 'Atracții Principale',
    port_video: 'Video',
    port_excursions: 'Excursii Recomandate',
    port_book_on: 'Rezervă pe',
    port_coming_soon: 'Informații despre acest port vor fi disponibile în curând.',
    port_arrival: 'Sosire',
    port_departure_time: 'Plecare',

    // Itinerary
    itinerary_day: 'Ziua',
    itinerary_departure: 'Plecare',
    itinerary_return: 'Întoarcere',

    // Gallery
    gallery_view: 'Vezi galeria completă de imagini',
    gallery_close: 'Închide galeria',
    gallery_prev: 'Imaginea anterioară',
    gallery_next: 'Următoarea imagine',
    gallery_more: 'mai multe fotografii',

    // Excursions
    excursion_from: 'de la',
    excursion_duration: 'Durată',

    // Cruise Line Info
    cruise_line_label: 'Companie',
    ship_label: 'Navă',
    destination_label: 'Destinație',
    duration_label: 'Durată',
    departure_port_label: 'Port Plecare',

    // Common
    loading: 'Se încarcă...',
    error: 'Ceva nu a funcționat',
    retry: 'Încearcă Din Nou',
    close: 'Închide',
    back: 'Înapoi',
    see_all: 'Vezi Toate',
  }
} as const

export type TranslationKey = keyof typeof translations.en

export function t(key: TranslationKey, locale: Locale = 'en'): string {
  return translations[locale][key] || translations.en[key] || key
}
