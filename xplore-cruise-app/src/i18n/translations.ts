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
    chat_title: 'Daniela — Cruise Advisor',
    chat_subtitle: 'AI-powered cruise consultant',
    chat_placeholder: 'Ask me about cruises, destinations, prices...',
    chat_welcome: 'Hello! I\'m Daniela, your personal cruise advisor at XploreCruiseTravel. I can help you find the perfect cruise based on your preferences. What are you looking for?',
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
    map_back_to_static: 'Back to image',
    map_explore_interactive: 'Interactive map',

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

    // Guided Flow
    guided_entry_title: 'Not sure which cruise is right for you?',
    guided_entry_subtitle: 'Answer 4 questions and we\'ll recommend your ideal cruises.',
    guided_entry_cta: 'Quick Recommendation',
    guided_entry_skip: 'Or browse all cruises',
    guided_q1: 'Is this your first cruise?',
    guided_q1_yes: 'Yes, first time',
    guided_q1_no: 'No, I\'ve cruised before',
    guided_q1_follow: 'Which cruise line did you use?',
    guided_q2: 'Who are you traveling with?',
    guided_q2_solo: 'Solo',
    guided_q2_couple: 'As a couple',
    guided_q2_family: 'With family',
    guided_q2_friends: 'With friends',
    guided_q2_group: 'Organized group',
    guided_q3: 'What matters most to you?',
    guided_q3_budget: 'Best price',
    guided_q3_luxury: 'Premium experience',
    guided_q3_family: 'Family activities',
    guided_q3_adventure: 'Exotic destinations',
    guided_q3_relaxation: 'Relaxation & spa',
    guided_q4: 'When would you like to travel?',
    guided_q4_3m: 'Next 3 months',
    guided_q4_6m: 'Next 6 months',
    guided_q4_year: 'Next year',
    guided_q4_flex: 'I\'m flexible',
    guided_q5: 'Additional preferences (optional)',
    guided_q5_budget_label: 'Budget per person',
    guided_q5_dest_label: 'Preferred destination',
    guided_results_title: 'Cruises recommended for you',
    guided_results_browse: 'Browse all with applied filters',
    guided_results_why: 'Why this cruise?',
    guided_skip: 'Skip',
    guided_next: 'Next step',
    guided_back: 'Back',
    guided_close: 'Close',
    guided_step_of: 'of',
    guided_browse_all: 'Browse all cruises',

    // CTA — Lead-based
    cta_request_offer: 'Request an offer',
    cta_check_availability: 'Check availability',
    // CTA Variant B
    cta_get_price: 'Get personalized price',
    cta_limited_spots: 'Limited spots — check now',
    // CTA Variant C
    cta_talk_expert: 'Talk to an expert',
    cta_free_consultation: 'Free consultation — no commitment',

    // Lead Capture Form
    lead_form_title: 'Request an offer',
    lead_form_subtitle: 'A consultant will contact you within 24h.',
    lead_form_name: 'Full name',
    lead_form_email: 'Email',
    lead_form_phone: 'Phone',
    lead_form_message: 'Message',
    lead_form_submit: 'Send request',
    lead_form_success_title: 'Request Sent!',
    lead_form_success: 'Your request has been sent! We\'ll contact you soon.',
    lead_form_gdpr: 'I consent to the processing of my personal data in accordance with GDPR regulations and our Privacy Policy.',
    lead_form_fill_required: 'Please fill in all required fields.',
    lead_form_invalid_email: 'Please enter a valid email address.',

    // Budget ranges
    budget_under_500: 'Under €500',
    budget_500_1000: '€500 – €1,000',
    budget_1000_2000: '€1,000 – €2,000',
    budget_over_2000: 'Over €2,000',
    budget_any: 'Any budget',

    // Persistent guided CTA
    guided_persistent_cta: 'Need help choosing?',

    // Lead form contextual heading
    lead_form_title_for: 'Request an offer for:',

    // Price freshness & urgency
    price_updated: 'Price updated',
    price_updated_today: 'Updated today',
    price_recently_changed: 'Price recently changed',
    price_decreased: 'Price dropped',
    price_increased: 'Price increased',
    price_was: 'was',

    // Departure date filter
    filter_departure: 'Departure Date',
    filter_departure_any: 'Any date',
    filter_departure_3m: 'Next 3 months',
    filter_departure_6m: 'Next 6 months',
    filter_departure_year: 'Next year',

    // Reviews
    review_page_title: 'Share Your Experience',
    review_page_subtitle: 'Your feedback helps us improve and helps other travelers make informed decisions.',
    review_rating_label: 'Your rating',
    review_name_label: 'Name',
    review_city_label: 'City',
    review_cruise_type_label: 'Cruise type',
    review_message_label: 'Your experience',
    review_message_placeholder: 'Tell us about your cruise experience...',
    review_consent_label: 'I consent to the publication of this review on the XploreCruiseTravel website.',
    review_submit_button: 'Submit review',
    review_success_title: 'Thank you!',
    review_success_message: 'Your review has been submitted and will be published after moderation.',
    review_error_rating: 'Please select a rating.',
    review_error_message: 'Please write at least 10 characters.',
    review_error_consent: 'You must consent to publication.',
    review_error_rate_limit: 'Too many submissions. Please try again later.',
    reviews_section_title: 'What Our Clients Say',
    reviews_section_subtitle: 'Real experiences from travelers who trusted us with their cruise vacations.',

    // Testimonials (C2)
    testimonials_section_title: 'Trusted by Travelers Across Romania',
    testimonials_section_subtitle: 'Curated testimonials from clients who experienced unforgettable cruise vacations with us.',

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
    chat_title: 'Daniela — Consilier Croaziere',
    chat_subtitle: 'Consultant AI pentru croaziere',
    chat_placeholder: 'Întreabă-mă despre croaziere, destinații, prețuri...',
    chat_welcome: 'Bună! Sunt Daniela, consilierul tău personal de croaziere la XploreCruiseTravel. Te pot ajuta să găsești croaziera perfectă în funcție de preferințele tale. Ce cauți?',
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
    map_back_to_static: 'Înapoi la imagine',
    map_explore_interactive: 'Hartă interactivă',

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

    // Guided Flow
    guided_entry_title: 'Nu știi ce croazieră ți se potrivește?',
    guided_entry_subtitle: 'Răspunde la 4 întrebări și îți recomandăm croazierele ideale.',
    guided_entry_cta: 'Recomandare rapidă',
    guided_entry_skip: 'Sau explorează toate croazierele',
    guided_q1: 'Este prima ta croazieră?',
    guided_q1_yes: 'Da, este prima',
    guided_q1_no: 'Nu, am mai fost',
    guided_q1_follow: 'Ce linie de croazieră ai folosit?',
    guided_q2: 'Cu cine călătorești?',
    guided_q2_solo: 'Singur(ă)',
    guided_q2_couple: 'În cuplu',
    guided_q2_family: 'Cu familia',
    guided_q2_friends: 'Cu prietenii',
    guided_q2_group: 'Grup organizat',
    guided_q3: 'Ce contează cel mai mult?',
    guided_q3_budget: 'Cel mai bun preț',
    guided_q3_luxury: 'Experiență premium',
    guided_q3_family: 'Activități pentru familie',
    guided_q3_adventure: 'Destinații exotice',
    guided_q3_relaxation: 'Relaxare și spa',
    guided_q4: 'Când ai vrea să pleci?',
    guided_q4_3m: 'În următoarele 3 luni',
    guided_q4_6m: 'În următoarele 6 luni',
    guided_q4_year: 'Anul viitor',
    guided_q4_flex: 'Sunt flexibil(ă)',
    guided_q5: 'Preferințe suplimentare (opțional)',
    guided_q5_budget_label: 'Buget per persoană',
    guided_q5_dest_label: 'Destinație preferată',
    guided_results_title: 'Croazierele recomandate pentru tine',
    guided_results_browse: 'Explorează toate cu filtre aplicate',
    guided_results_why: 'De ce această croazieră?',
    guided_skip: 'Sari peste',
    guided_next: 'Următorul pas',
    guided_back: 'Înapoi',
    guided_close: 'Închide',
    guided_step_of: 'din',
    guided_browse_all: 'Explorează toate croazierele',

    // CTA — Lead-based
    cta_request_offer: 'Solicită ofertă',
    cta_check_availability: 'Verifică disponibilitatea',
    // CTA Variant B
    cta_get_price: 'Obține preț personalizat',
    cta_limited_spots: 'Locuri limitate — verifică acum',
    // CTA Variant C
    cta_talk_expert: 'Vorbește cu un expert',
    cta_free_consultation: 'Consultanță gratuită — fără obligații',

    // Lead Capture Form
    lead_form_title: 'Solicită ofertă',
    lead_form_subtitle: 'Un consultant te va contacta în maxim 24h.',
    lead_form_name: 'Nume complet',
    lead_form_email: 'Email',
    lead_form_phone: 'Telefon',
    lead_form_message: 'Mesaj',
    lead_form_submit: 'Trimite cererea',
    lead_form_success_title: 'Cerere Trimisă!',
    lead_form_success: 'Cererea ta a fost trimisă! Te vom contacta în curând.',
    lead_form_gdpr: 'Consimt la prelucrarea datelor mele personale conform reglementărilor GDPR și Politicii de Confidențialitate.',
    lead_form_fill_required: 'Vă rugăm completați toate câmpurile obligatorii.',
    lead_form_invalid_email: 'Vă rugăm introduceți o adresă de email validă.',

    // Budget ranges
    budget_under_500: 'Sub €500',
    budget_500_1000: '€500 – €1.000',
    budget_1000_2000: '€1.000 – €2.000',
    budget_over_2000: 'Peste €2.000',
    budget_any: 'Orice buget',

    // Persistent guided CTA
    guided_persistent_cta: 'Ai nevoie de ajutor?',

    // Lead form contextual heading
    lead_form_title_for: 'Solicită ofertă pentru:',

    // Price freshness & urgency
    price_updated: 'Preț actualizat',
    price_updated_today: 'Actualizat azi',
    price_recently_changed: 'Preț schimbat recent',
    price_decreased: 'Preț scăzut',
    price_increased: 'Preț crescut',
    price_was: 'era',

    // Departure date filter
    filter_departure: 'Data Plecării',
    filter_departure_any: 'Orice dată',
    filter_departure_3m: 'Următoarele 3 luni',
    filter_departure_6m: 'Următoarele 6 luni',
    filter_departure_year: 'Anul viitor',

    // Reviews
    review_page_title: 'Împărtășește experiența ta',
    review_page_subtitle: 'Feedback-ul tău ne ajută să ne îmbunătățim și ajută alți călători să ia decizii informate.',
    review_rating_label: 'Nota ta',
    review_name_label: 'Nume',
    review_city_label: 'Oraș',
    review_cruise_type_label: 'Tip croazieră',
    review_message_label: 'Experiența ta',
    review_message_placeholder: 'Spune-ne despre experiența ta cu croaziera...',
    review_consent_label: 'Sunt de acord cu publicarea acestei recenzii pe site-ul XploreCruiseTravel.',
    review_submit_button: 'Trimite recenzia',
    review_success_title: 'Mulțumim!',
    review_success_message: 'Recenzia ta a fost trimisă și va fi publicată după moderare.',
    review_error_rating: 'Te rugăm selectează o notă.',
    review_error_message: 'Te rugăm scrie cel puțin 10 caractere.',
    review_error_consent: 'Trebuie să fii de acord cu publicarea.',
    review_error_rate_limit: 'Prea multe trimiteri. Încearcă mai târziu.',
    reviews_section_title: 'Ce spun clienții noștri',
    reviews_section_subtitle: 'Experiențe reale de la călători care ne-au acordat încrederea pentru vacanțele lor pe croazieră.',

    // Testimonials (C2)
    testimonials_section_title: 'Apreciat de călători din toată România',
    testimonials_section_subtitle: 'Testimoniale verificate de la clienți care au trăit vacanțe de croazieră de neuitat alături de noi.',

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
