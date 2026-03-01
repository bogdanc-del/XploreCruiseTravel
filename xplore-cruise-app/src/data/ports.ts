// ============================================================
// Port Database — descriptions, photos, videos, excursions
// Top cruise ports with curated content (EN/RO)
// ============================================================

export interface PortExcursion {
  name: string
  name_ro: string
  description: string
  description_ro: string
  duration: string
  price_from: string
  provider: 'GetYourGuide' | 'Viator'
  url: string
  image_url: string
}

export interface PortInfo {
  name: string
  country: string
  country_ro: string
  description: string
  description_ro: string
  highlights: string[]
  highlights_ro: string[]
  image_url: string
  youtube_video_id?: string
  excursions: PortExcursion[]
}

export const PORTS: Record<string, PortInfo> = {
  // ── Western Mediterranean ──────────────────────────────────
  'Barcelona': {
    name: 'Barcelona',
    country: 'Spain',
    country_ro: 'Spania',
    description: 'A vibrant Mediterranean city famous for Gaudi\'s masterpieces, stunning beaches, and world-class cuisine. The cruise port is conveniently located near the historic Las Ramblas boulevard.',
    description_ro: 'Un oras mediteranean vibrant celebru pentru capodoperele lui Gaudi, plajele superbe si bucataria de clasa mondiala. Portul de croaziere este convenabil situat langa celebrul bulevard Las Ramblas.',
    highlights: ['Sagrada Familia', 'Park Guell', 'Las Ramblas', 'Gothic Quarter', 'La Boqueria Market'],
    highlights_ro: ['Sagrada Familia', 'Parcul Guell', 'Las Ramblas', 'Cartierul Gotic', 'Piata La Boqueria'],
    image_url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
    youtube_video_id: 'jVAHQKIhFbo',
    excursions: [
      {
        name: 'Sagrada Familia Fast Track Tour',
        name_ro: 'Tur Sagrada Familia Acces Rapid',
        description: 'Skip the line and explore Gaudi\'s unfinished masterpiece with an expert guide.',
        description_ro: 'Ocoliti coada si explorati capodopera neterminata a lui Gaudi cu un ghid expert.',
        duration: '1.5h',
        price_from: '47 EUR',
        provider: 'GetYourGuide',
        url: 'https://www.getyourguide.com/barcelona-l45/sagrada-familia-fast-track-guided-tour-t395729/',
        image_url: 'https://images.unsplash.com/photo-1583779457711-ab081a886e32?w=400',
      },
      {
        name: 'Barcelona Highlights Bike Tour',
        name_ro: 'Tur Barcelona pe Bicicleta',
        description: 'Discover Barcelona\'s highlights on a 3-hour guided bike tour through the city.',
        description_ro: 'Descoperiti atractiile Barcelonei intr-un tur ghidat de 3 ore pe bicicleta prin oras.',
        duration: '3h',
        price_from: '28 EUR',
        provider: 'Viator',
        url: 'https://www.viator.com/tours/Barcelona/Barcelona-Bike-Tour/d562-5452BIKE',
        image_url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400',
      },
    ],
  },

  'Marseille': {
    name: 'Marseille',
    country: 'France',
    country_ro: 'Franta',
    description: 'France\'s oldest city and the gateway to Provence. A bustling port city with a rich maritime heritage, colorful Old Port, and the stunning Calanques coastline nearby.',
    description_ro: 'Cel mai vechi oras al Frantei si poarta de intrare in Provence. Un oras portuar aglomerat cu un bogat patrimoniu maritim, Portul Vechi colorat si spectaculoasa coasta Calanques in apropiere.',
    highlights: ['Old Port (Vieux-Port)', 'Notre-Dame de la Garde', 'Calanques National Park', 'MuCEM Museum', 'Le Panier Quarter'],
    highlights_ro: ['Portul Vechi (Vieux-Port)', 'Notre-Dame de la Garde', 'Parcul National Calanques', 'Muzeul MuCEM', 'Cartierul Le Panier'],
    image_url: 'https://images.unsplash.com/photo-1590080876401-45b4d3c93282?w=800',
    youtube_video_id: 'Qs8_pGkNvhA',
    excursions: [
      {
        name: 'Calanques Boat Trip',
        name_ro: 'Excursie cu Barca in Calanques',
        description: 'Cruise along the stunning limestone cliffs and turquoise waters of the Calanques.',
        description_ro: 'Navigati de-a lungul falezelor spectaculoase de calcar si apelor turcoaz din Calanques.',
        duration: '3h',
        price_from: '30 EUR',
        provider: 'GetYourGuide',
        url: 'https://www.getyourguide.com/marseille-l136/calanques-boat-trip-t199540/',
        image_url: 'https://images.unsplash.com/photo-1596394723269-e1e8e3fe5728?w=400',
      },
    ],
  },

  'Rome': {
    name: 'Rome',
    country: 'Italy',
    country_ro: 'Italia',
    description: 'The Eternal City, a treasure trove of ancient ruins, Renaissance art, and vibrant street life. Cruise ships dock at Civitavecchia, about 80 minutes from central Rome.',
    description_ro: 'Orasul Etern, o comoara de ruine antice, arta renascentista si viata stradala vibranta. Navele de croaziera acosta la Civitavecchia, la aproximativ 80 de minute de centrul Romei.',
    highlights: ['Colosseum', 'Vatican Museums & Sistine Chapel', 'Trevi Fountain', 'Roman Forum', 'Pantheon'],
    highlights_ro: ['Colosseum', 'Muzeele Vaticanului si Capela Sixtina', 'Fontana di Trevi', 'Forumul Roman', 'Pantheon'],
    image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    youtube_video_id: 'FkEa8LZJoIg',
    excursions: [
      {
        name: 'Colosseum, Forum & Palatine Hill Tour',
        name_ro: 'Tur Colosseum, Forum si Palatin',
        description: 'Explore ancient Rome\'s most iconic landmarks with skip-the-line access.',
        description_ro: 'Explorati cele mai iconice repere ale Romei antice cu acces fara coada.',
        duration: '3h',
        price_from: '52 EUR',
        provider: 'GetYourGuide',
        url: 'https://www.getyourguide.com/rome-l33/colosseum-roman-forum-palatine-hill-fast-track-tour-t67029/',
        image_url: 'https://images.unsplash.com/photo-1552432552-06c0b0a94dda?w=400',
      },
      {
        name: 'Vatican Museums & Sistine Chapel',
        name_ro: 'Muzeele Vaticanului si Capela Sixtina',
        description: 'Skip-the-line guided tour of one of the world\'s greatest art collections.',
        description_ro: 'Tur ghidat fara coada al uneia dintre cele mai mari colectii de arta din lume.',
        duration: '3h',
        price_from: '59 EUR',
        provider: 'Viator',
        url: 'https://www.viator.com/tours/Rome/Skip-the-Line-Vatican-Museums-Sistine-Chapel/d511-2916ROME1',
        image_url: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=400',
      },
    ],
  },

  'Palermo': {
    name: 'Palermo',
    country: 'Italy',
    country_ro: 'Italia',
    description: 'Sicily\'s vibrant capital blends Arab, Norman, and Baroque architecture with legendary street food. A cultural melting pot where ancient history meets modern energy.',
    description_ro: 'Capitala vibranta a Siciliei imbina arhitectura araba, normanda si baroca cu legendarul street food. Un melting pot cultural unde istoria antica intalneste energia moderna.',
    highlights: ['Palermo Cathedral', 'Monreale', 'Street Food Markets', 'Teatro Massimo', 'Quattro Canti'],
    highlights_ro: ['Catedrala din Palermo', 'Monreale', 'Piete de Street Food', 'Teatro Massimo', 'Quattro Canti'],
    image_url: 'https://images.unsplash.com/photo-1523365280197-f1783db9fe62?w=800',
    youtube_video_id: 'oHJLMdsS_0w',
    excursions: [
      {
        name: 'Palermo Street Food Walking Tour',
        name_ro: 'Tur Pietonal Street Food Palermo',
        description: 'Taste authentic Sicilian street food with a local guide through historic markets.',
        description_ro: 'Gustati street food sicilian autentic cu un ghid local prin pietele istorice.',
        duration: '3h',
        price_from: '39 EUR',
        provider: 'GetYourGuide',
        url: 'https://www.getyourguide.com/palermo-l187/palermo-street-food-walking-tour-t48839/',
        image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
      },
    ],
  },

  'Valletta': {
    name: 'Valletta',
    country: 'Malta',
    country_ro: 'Malta',
    description: 'A UNESCO World Heritage city built by the Knights of St. John. Tiny but packed with history, Valletta offers stunning harbors, Baroque architecture, and Mediterranean charm.',
    description_ro: 'Un oras UNESCO construit de Cavalerii Sfantului Ioan. Mic dar plin de istorie, Valletta ofera porturi impresionante, arhitectura baroca si farmec mediteranean.',
    highlights: ['St. John\'s Co-Cathedral', 'Upper Barrakka Gardens', 'Grand Harbour', 'Mdina (The Silent City)', 'Blue Grotto'],
    highlights_ro: ['Co-Catedrala Sf. Ioan', 'Gradinile Upper Barrakka', 'Marele Port', 'Mdina (Orasul Tacut)', 'Grota Albastra'],
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
    youtube_video_id: 'JIf8OULbFGU',
    excursions: [
      {
        name: 'Valletta Walking Tour',
        name_ro: 'Tur Pietonal Valletta',
        description: 'Discover Valletta\'s 450-year history on a guided walking tour of the capital.',
        description_ro: 'Descoperiti istoria de 450 de ani a Vallettei intr-un tur pietonal ghidat al capitalei.',
        duration: '2h',
        price_from: '25 EUR',
        provider: 'Viator',
        url: 'https://www.viator.com/tours/Valletta/Valletta-Walking-Tour/d4152-5522VALLETTA',
        image_url: 'https://images.unsplash.com/photo-1568797629192-33756a0c6e7d?w=400',
      },
    ],
  },

  // ── Greek Islands & Turkey ─────────────────────────────────
  'Mykonos': {
    name: 'Mykonos',
    country: 'Greece',
    country_ro: 'Grecia',
    description: 'The jewel of the Cyclades, famous for its white-washed buildings, windmills, and vibrant nightlife. A perfect blend of cosmopolitan energy and traditional Greek charm.',
    description_ro: 'Bijuteria Cicladelor, celebra pentru cladirile albe, morile de vant si viata de noapte vibranta. Un amestec perfect de energie cosmopolita si farmec grecesc traditional.',
    highlights: ['Little Venice', 'Windmills', 'Delos Island', 'Paradise Beach', 'Chora Old Town'],
    highlights_ro: ['Mica Venetie', 'Morile de Vant', 'Insula Delos', 'Plaja Paradise', 'Orasul Vechi Chora'],
    image_url: 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=800',
    youtube_video_id: '8xMjBGT-sHY',
    excursions: [
      {
        name: 'Delos Island Half-Day Tour',
        name_ro: 'Tur Insula Delos Jumatate de Zi',
        description: 'Visit the sacred birthplace of Apollo on this guided archaeological tour.',
        description_ro: 'Vizitati locul sacru de nastere al lui Apollo in acest tur arheologic ghidat.',
        duration: '4h',
        price_from: '55 EUR',
        provider: 'GetYourGuide',
        url: 'https://www.getyourguide.com/mykonos-l1025/delos-island-guided-tour-t42283/',
        image_url: 'https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?w=400',
      },
    ],
  },

  'Santorini': {
    name: 'Santorini',
    country: 'Greece',
    country_ro: 'Grecia',
    description: 'The most iconic Greek island with dramatic caldera views, blue-domed churches, and unforgettable sunsets. Tender boats bring you to the base of the cliff-top towns.',
    description_ro: 'Cea mai emblematica insula greceasca cu vederi dramatice ale calderei, biserici cu cupole albastre si apusuri de neuitat. Barcile tender va aduc la baza oraselor de pe stanci.',
    highlights: ['Oia Sunset', 'Fira Town', 'Red Beach', 'Akrotiri Archaeological Site', 'Wine Tasting'],
    highlights_ro: ['Apus in Oia', 'Orasul Fira', 'Plaja Rosie', 'Situl Arheologic Akrotiri', 'Degustare de Vin'],
    image_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
    youtube_video_id: 'RBxWNtCMb5g',
    excursions: [
      {
        name: 'Santorini Wine Tasting Tour',
        name_ro: 'Tur Degustare Vinuri Santorini',
        description: 'Visit three wineries and taste unique volcanic wines with stunning caldera views.',
        description_ro: 'Vizitati trei crame si gustati vinuri vulcanice unice cu vederi impresionante ale calderei.',
        duration: '5h',
        price_from: '85 EUR',
        provider: 'Viator',
        url: 'https://www.viator.com/tours/Santorini/Santorini-Wine-Tour/d801-5077WINETOUR',
        image_url: 'https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=400',
      },
    ],
  },

  'Rhodes': {
    name: 'Rhodes',
    country: 'Greece',
    country_ro: 'Grecia',
    description: 'The largest Dodecanese island with a medieval Old Town (UNESCO), ancient ruins, and beautiful beaches. The cruise port is right next to the historic walled city.',
    description_ro: 'Cea mai mare insula din Dodecanes cu un Oras Vechi medieval (UNESCO), ruine antice si plaje frumoase. Portul de croaziere este chiar langa orasul istoric fortificat.',
    highlights: ['Medieval Old Town', 'Palace of the Grand Master', 'Lindos Acropolis', 'Street of the Knights', 'Anthony Quinn Bay'],
    highlights_ro: ['Orasul Vechi Medieval', 'Palatul Marelui Maestru', 'Acropola din Lindos', 'Strada Cavalerilor', 'Golful Anthony Quinn'],
    image_url: 'https://images.unsplash.com/photo-1555990793-da11153b2473?w=800',
    youtube_video_id: 'BHxcAIwqUgM',
    excursions: [
      {
        name: 'Lindos & Old Town Tour',
        name_ro: 'Tur Lindos si Orasul Vechi',
        description: 'Visit the ancient Acropolis of Lindos and explore the medieval Old Town.',
        description_ro: 'Vizitati Acropola antica din Lindos si explorati Orasul Vechi medieval.',
        duration: '6h',
        price_from: '45 EUR',
        provider: 'GetYourGuide',
        url: 'https://www.getyourguide.com/rhodes-l1015/lindos-old-town-tour-t117744/',
        image_url: 'https://images.unsplash.com/photo-1600185042891-83ccc44e42b1?w=400',
      },
    ],
  },

  // ── Norwegian Fjords ───────────────────────────────────────
  'Bergen': {
    name: 'Bergen',
    country: 'Norway',
    country_ro: 'Norvegia',
    description: 'Norway\'s second city and the gateway to the fjords. Famous for its colorful Bryggen wharf (UNESCO), vibrant fish market, and surrounded by seven mountains.',
    description_ro: 'Al doilea oras al Norvegiei si poarta de intrare in fiorduri. Celebru pentru cheiul colorat Bryggen (UNESCO), piata de peste vibranta si inconjurat de sapte munti.',
    highlights: ['Bryggen Wharf', 'Fish Market', 'Mount Floyen Funicular', 'Bergenhus Fortress', 'Troldhaugen (Grieg Museum)'],
    highlights_ro: ['Cheiul Bryggen', 'Piata de Peste', 'Funicularul Floyen', 'Fortareata Bergenhus', 'Troldhaugen (Muzeul Grieg)'],
    image_url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
    youtube_video_id: 'eJpGOkfReMo',
    excursions: [
      {
        name: 'Bergen City Walk & Floyen',
        name_ro: 'Plimbare Bergen si Floyen',
        description: 'Walk through colorful Bryggen and ride the funicular to Mount Floyen for panoramic views.',
        description_ro: 'Plimbati-va prin coloratul Bryggen si urcati cu funicularul pe Muntele Floyen pentru vederi panoramice.',
        duration: '3h',
        price_from: '35 EUR',
        provider: 'Viator',
        url: 'https://www.viator.com/tours/Bergen/Bergen-City-Walk/d4426-21082P1',
        image_url: 'https://images.unsplash.com/photo-1513836279014-a89567cfa168?w=400',
      },
    ],
  },

  'Geiranger': {
    name: 'Geiranger',
    country: 'Norway',
    country_ro: 'Norvegia',
    description: 'A tiny village at the head of the UNESCO-listed Geirangerfjord, one of the most spectacular fjords in the world. Dramatic waterfalls cascade down steep mountainsides.',
    description_ro: 'Un sat mic la capatul Fiordului Geiranger, listat UNESCO, unul dintre cele mai spectaculoase fiorduri din lume. Cascade dramatice se revarsa pe versantii abrupti.',
    highlights: ['Seven Sisters Waterfall', 'Eagle Road Viewpoint', 'Dalsnibba Sky Platform', 'Fjord Kayaking', 'Norwegian Fjord Centre'],
    highlights_ro: ['Cascada Cele Sapte Surori', 'Punctul de Belvedere Eagle Road', 'Platforma Dalsnibba', 'Kayaking in Fiord', 'Centrul Fiordului Norvegian'],
    image_url: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=800',
    youtube_video_id: '6Y6MsEePmIg',
    excursions: [
      {
        name: 'Geiranger Fjord Sightseeing',
        name_ro: 'Vizitarea Fiordului Geiranger',
        description: 'See the famous waterfalls and mountain viewpoints from a panoramic bus tour.',
        description_ro: 'Vedeti cascadele celebre si punctele de belvedere montane dintr-un tur panoramic cu autobuzul.',
        duration: '3h',
        price_from: '50 EUR',
        provider: 'GetYourGuide',
        url: 'https://www.getyourguide.com/geiranger-l2526/geirangerfjord-sightseeing-t48928/',
        image_url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400',
      },
    ],
  },

  // ── Adriatic ───────────────────────────────────────────────
  'Dubrovnik': {
    name: 'Dubrovnik',
    country: 'Croatia',
    country_ro: 'Croatia',
    description: 'The "Pearl of the Adriatic", a stunning walled city with marble streets, baroque buildings, and breathtaking sea views. Famous worldwide as a filming location for Game of Thrones.',
    description_ro: '"Perla Adriaticii", un oras fortificat superb cu strazi de marmura, cladiri baroce si vederi marii impresionante. Celebru in toata lumea ca locatie de filmare pentru Game of Thrones.',
    highlights: ['City Walls Walk', 'Old Town (Stari Grad)', 'Cable Car', 'Lokrum Island', 'Game of Thrones Tour'],
    highlights_ro: ['Plimbare pe Zidurile Cetatii', 'Orasul Vechi (Stari Grad)', 'Telefericul', 'Insula Lokrum', 'Tur Game of Thrones'],
    image_url: 'https://images.unsplash.com/photo-1555990538-1e3a8dd21fca?w=800',
    youtube_video_id: 'VcqKLjU8jhY',
    excursions: [
      {
        name: 'Dubrovnik City Walls Walking Tour',
        name_ro: 'Tur Pietonal Zidurile Dubrovnik',
        description: 'Walk the complete circuit of the famous city walls with stunning Adriatic views.',
        description_ro: 'Parcurgeti circuitul complet al celebrelor ziduri cu vederi superbe ale Adriaticii.',
        duration: '2h',
        price_from: '40 EUR',
        provider: 'GetYourGuide',
        url: 'https://www.getyourguide.com/dubrovnik-l88/dubrovnik-city-walls-walking-tour-t58493/',
        image_url: 'https://images.unsplash.com/photo-1580316326755-5b0c50acee3e?w=400',
      },
    ],
  },

  'Kotor': {
    name: 'Kotor',
    country: 'Montenegro',
    country_ro: 'Muntenegru',
    description: 'A hidden gem at the end of Europe\'s southernmost fjord. The medieval walled town is a UNESCO site with Venetian architecture, winding streets, and dramatic mountain backdrop.',
    description_ro: 'O bijuterie ascunsa la capatul fiordului cel mai sudic al Europei. Orasul medieval fortificat este sit UNESCO cu arhitectura venetiana, strazi sinuoase si fundal montan dramatic.',
    highlights: ['Kotor Old Town', 'Fortress Hike', 'Bay of Kotor Cruise', 'Our Lady of the Rocks', 'Perast Village'],
    highlights_ro: ['Orasul Vechi Kotor', 'Escursiune la Fortareata', 'Croaziera in Golful Kotor', 'Gospa od Skrpjela', 'Satul Perast'],
    image_url: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800',
    youtube_video_id: 'dNsAMOjVYms',
    excursions: [
      {
        name: 'Bay of Kotor Boat Tour',
        name_ro: 'Tur cu Barca in Golful Kotor',
        description: 'Cruise through the stunning Bay of Kotor with stops at Perast and Our Lady of the Rocks.',
        description_ro: 'Navigati prin superbuul Golf Kotor cu opriri la Perast si Gospa od Skrpjela.',
        duration: '3h',
        price_from: '30 EUR',
        provider: 'Viator',
        url: 'https://www.viator.com/tours/Kotor/Bay-of-Kotor-Boat-Tour/d21363-47583P1',
        image_url: 'https://images.unsplash.com/photo-1600460849828-e2de2129faf8?w=400',
      },
    ],
  },

  'Venice': {
    name: 'Venice',
    country: 'Italy',
    country_ro: 'Italia',
    description: 'The floating city of canals, gondolas, and Renaissance palaces. A UNESCO World Heritage site and one of the most unique cities on Earth.',
    description_ro: 'Orasul plutitor al canalelor, gondolelor si palatelor renascentiste. Un sit UNESCO si unul dintre cele mai unice orase de pe Pamant.',
    highlights: ['St. Mark\'s Square & Basilica', 'Doge\'s Palace', 'Rialto Bridge', 'Grand Canal', 'Murano Glass Island'],
    highlights_ro: ['Piata si Bazilica San Marco', 'Palatul Dogilor', 'Podul Rialto', 'Marele Canal', 'Insula Murano'],
    image_url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800',
    youtube_video_id: 'XOoKhc0w1Gs',
    excursions: [
      {
        name: 'Venice Grand Canal Gondola Ride',
        name_ro: 'Plimbare cu Gondola pe Marele Canal',
        description: 'Experience Venice from the water on a classic shared gondola ride.',
        description_ro: 'Experimentati Venetia de pe apa intr-o plimbare clasica cu gondola.',
        duration: '30min',
        price_from: '33 EUR',
        provider: 'GetYourGuide',
        url: 'https://www.getyourguide.com/venice-l35/venice-grand-canal-gondola-ride-t12136/',
        image_url: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=400',
      },
    ],
  },

  // ── Caribbean ──────────────────────────────────────────────
  'Cozumel': {
    name: 'Cozumel',
    country: 'Mexico',
    country_ro: 'Mexic',
    description: 'A Caribbean island off Mexico\'s Yucatan Peninsula, famous for world-class snorkeling and diving. The crystal-clear waters and coral reefs are part of the Mesoamerican Reef.',
    description_ro: 'O insula caraibiana in largul Peninsulei Yucatan din Mexic, celebra pentru snorkeling si scufundari de clasa mondiala. Apele cristaline si recifele de coral fac parte din Reciful Mezoamerican.',
    highlights: ['Chankanaab Park', 'El Cedral Ruins', 'Palancar Reef', 'San Gervasio Archaeological Site', 'Downtown Shopping'],
    highlights_ro: ['Parcul Chankanaab', 'Ruinele El Cedral', 'Reciful Palancar', 'Situl Arheologic San Gervasio', 'Cumparaturi in Centru'],
    image_url: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=800',
    youtube_video_id: 'DeMEO9f_P-g',
    excursions: [
      {
        name: 'Cozumel Snorkeling Adventure',
        name_ro: 'Aventura Snorkeling Cozumel',
        description: 'Snorkel in three different reef locations with a catamaran cruise and lunch.',
        description_ro: 'Snorkeling in trei locatii diferite de recif cu o croaziera cu catamaran si pranz.',
        duration: '5h',
        price_from: '55 USD',
        provider: 'Viator',
        url: 'https://www.viator.com/tours/Cozumel/Cozumel-Snorkeling-Tour/d801-2140COZSNORK',
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
      },
    ],
  },

  // ── Danube River ───────────────────────────────────────────
  'Vienna': {
    name: 'Vienna',
    country: 'Austria',
    country_ro: 'Austria',
    description: 'The imperial capital of Austria, a city of music, art, and grand architecture. From palaces to coffee houses, Vienna offers a refined cultural experience.',
    description_ro: 'Capitala imperiala a Austriei, un oras al muzicii, artei si arhitecturii grandioase. De la palate la cafenele, Viena ofera o experienta culturala rafinata.',
    highlights: ['Schonbrunn Palace', 'St. Stephen\'s Cathedral', 'Belvedere Palace', 'Vienna State Opera', 'Naschmarkt'],
    highlights_ro: ['Palatul Schonbrunn', 'Catedrala Sf. Stefan', 'Palatul Belvedere', 'Opera de Stat din Viena', 'Naschmarkt'],
    image_url: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800',
    youtube_video_id: 'dKCYB6Lq1k8',
    excursions: [
      {
        name: 'Schonbrunn Palace Tour',
        name_ro: 'Tur Palatul Schonbrunn',
        description: 'Skip-the-line tour of the Habsburg imperial summer residence and its gardens.',
        description_ro: 'Tur fara coada al resedintei imperiale de vara a Habsburgilor si gradinilor sale.',
        duration: '3h',
        price_from: '45 EUR',
        provider: 'GetYourGuide',
        url: 'https://www.getyourguide.com/vienna-l37/schonbrunn-palace-skip-the-line-tour-t45629/',
        image_url: 'https://images.unsplash.com/photo-1609856878074-cf31e21ccb6b?w=400',
      },
    ],
  },

  'Budapest': {
    name: 'Budapest',
    country: 'Hungary',
    country_ro: 'Ungaria',
    description: 'The "Pearl of the Danube", a stunning city split by the river into historic Buda and vibrant Pest. Famous for its thermal baths, ruin bars, and grand Parliament building.',
    description_ro: '"Perla Dunarii", un oras superb despartit de rau in istoricul Buda si vibrantul Pest. Celebru pentru baile termale, barurile in ruina si grandiosul Parlament.',
    highlights: ['Hungarian Parliament', 'Fisherman\'s Bastion', 'Szechenyi Thermal Bath', 'Buda Castle', 'Ruin Bars District'],
    highlights_ro: ['Parlamentul Ungar', 'Bastionul Pescarilor', 'Baia Termala Szechenyi', 'Castelul Buda', 'Cartierul Barurilor in Ruina'],
    image_url: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=800',
    youtube_video_id: 'FzZ_KhxSyaA',
    excursions: [
      {
        name: 'Budapest Evening Danube Cruise',
        name_ro: 'Croaziera Seara pe Dunare Budapesta',
        description: 'See Budapest\'s illuminated landmarks from the Danube on an evening cruise.',
        description_ro: 'Vedeti reperele iluminate ale Budapestei de pe Dunare intr-o croaziera de seara.',
        duration: '1.5h',
        price_from: '22 EUR',
        provider: 'GetYourGuide',
        url: 'https://www.getyourguide.com/budapest-l47/budapest-evening-cruise-t49291/',
        image_url: 'https://images.unsplash.com/photo-1565426873118-a17ed65d74b9?w=400',
      },
    ],
  },
}

/**
 * Look up port info by port name.
 * Handles partial matches (e.g. "Barcelona, Spain" → "Barcelona")
 */
export function getPortInfo(portName: string): PortInfo | undefined {
  // Try exact match first
  if (PORTS[portName]) return PORTS[portName]

  // Try matching by extracting city name (before comma or parenthesis)
  const cityName = portName.replace(/,.*$/, '').replace(/\s*\(.*\)/, '').trim()
  if (PORTS[cityName]) return PORTS[cityName]

  // Try case-insensitive match
  const lower = cityName.toLowerCase()
  for (const [key, info] of Object.entries(PORTS)) {
    if (key.toLowerCase() === lower) return info
  }

  return undefined
}
