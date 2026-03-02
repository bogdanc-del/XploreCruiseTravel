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
  // ── Additional Popular Cruise Ports ──────────────────────────

  'Naples': {
    name: 'Naples',
    country: 'Italy',
    country_ro: 'Italia',
    description: 'Gateway to Pompeii, the Amalfi Coast and Capri. Naples is a city of incredible history, pizza and vibrant street life, set against the dramatic backdrop of Mount Vesuvius.',
    description_ro: 'Poarta de acces catre Pompei, Coasta Amalfi si Capri. Napoli este un oras cu o istorie incredibila, pizza si viata stradala vibranta, cu Muntele Vezuviu pe fundal.',
    highlights: ['Pompeii Ruins', 'Amalfi Coast', 'Capri Island', 'Mount Vesuvius', 'Historic Center'],
    highlights_ro: ['Ruinele Pompeii', 'Coasta Amalfi', 'Insula Capri', 'Muntele Vezuviu', 'Centrul Istoric'],
    image_url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800',
    youtube_video_id: 'hBKkC0WnTzk',
    excursions: [],
  },

  'Genoa': {
    name: 'Genoa',
    country: 'Italy',
    country_ro: 'Italia',
    description: 'A major Mediterranean port city with a stunning old town, birthplace of Christopher Columbus. Famous for its palaces, beautiful harbor, and delicious pesto sauce.',
    description_ro: 'Un port important din Mediterana cu un centru vechi superb, locul nasterii lui Cristofor Columb. Celebru pentru palate, portul frumos si sosul pesto delicios.',
    highlights: ['Old Port (Porto Antico)', 'Via Garibaldi Palaces', 'Aquarium of Genoa', 'Cathedral of San Lorenzo'],
    highlights_ro: ['Portul Vechi (Porto Antico)', 'Palatele Via Garibaldi', 'Acvariul din Genova', 'Catedrala San Lorenzo'],
    image_url: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=800',
    excursions: [],
  },

  'Nice': {
    name: 'Nice',
    country: 'France',
    country_ro: 'Franta',
    description: 'The jewel of the French Riviera with its famous Promenade des Anglais, stunning blue waters, and colorful old town. A gateway to Monaco and Cannes.',
    description_ro: 'Bijuteria Rivierei Franceze cu celebra Promenade des Anglais, ape albastre superbe si centrul vechi colorat. Poarta de acces catre Monaco si Cannes.',
    highlights: ['Promenade des Anglais', 'Old Town (Vieux Nice)', 'Castle Hill', 'Matisse Museum'],
    highlights_ro: ['Promenade des Anglais', 'Centrul Vechi', 'Dealul Castelului', 'Muzeul Matisse'],
    image_url: 'https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=800',
    youtube_video_id: 'iGL4EU8uEIo',
    excursions: [],
  },

  'Monte Carlo': {
    name: 'Monte Carlo',
    country: 'Monaco',
    country_ro: 'Monaco',
    description: 'The glamorous principality of Monaco, famous for its casino, Grand Prix circuit, and stunning yachts. A playground for the rich and famous on the French Riviera.',
    description_ro: 'Glamurosul principat al Monaco, celebru pentru cazinou, circuitul de Grand Prix si iahturile spectaculoase. Un loc de recreere pentru bogati si faimosi pe Riviera Franceza.',
    highlights: ['Monte Carlo Casino', 'Prince\'s Palace', 'Oceanographic Museum', 'Grand Prix Circuit'],
    highlights_ro: ['Cazinoul Monte Carlo', 'Palatul Princiar', 'Muzeul Oceanografic', 'Circuitul Grand Prix'],
    image_url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
    excursions: [],
  },

  'Istanbul': {
    name: 'Istanbul',
    country: 'Turkey',
    country_ro: 'Turcia',
    description: 'The city where East meets West, spanning two continents. Famous for its stunning mosques, the Grand Bazaar, and the Bosphorus strait.',
    description_ro: 'Orasul unde Estul intalneste Vestul, intins pe doua continente. Celebru pentru moschei superbe, Marele Bazar si stramtoarea Bosfor.',
    highlights: ['Hagia Sophia', 'Blue Mosque', 'Grand Bazaar', 'Topkapi Palace', 'Bosphorus Cruise'],
    highlights_ro: ['Hagia Sophia', 'Moscheea Albastra', 'Marele Bazar', 'Palatul Topkapi', 'Croaziera pe Bosfor'],
    image_url: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800',
    youtube_video_id: 'hZE0GWXESYM',
    excursions: [],
  },

  'Split': {
    name: 'Split',
    country: 'Croatia',
    country_ro: 'Croatia',
    description: 'Croatia\'s second-largest city, built around the stunning Diocletian\'s Palace. A UNESCO World Heritage Site with beautiful beaches and vibrant nightlife.',
    description_ro: 'Al doilea oras ca marime din Croatia, construit in jurul uimitorului Palat al lui Diocletian. Sit UNESCO cu plaje frumoase si viata de noapte vibranta.',
    highlights: ['Diocletian\'s Palace', 'Riva Promenade', 'Marjan Hill', 'Cathedral of St. Domnius'],
    highlights_ro: ['Palatul lui Diocletian', 'Promenada Riva', 'Dealul Marjan', 'Catedrala Sf. Domnius'],
    image_url: 'https://images.unsplash.com/photo-1555990793-da11153b2473?w=800',
    youtube_video_id: '5abamRO41fE',
    excursions: [],
  },

  'Lisbon': {
    name: 'Lisbon',
    country: 'Portugal',
    country_ro: 'Portugalia',
    description: 'Portugal\'s sun-drenched capital built on seven hills, known for its colorful tiles, historic trams, and delicious pasteis de nata.',
    description_ro: 'Capitala insorita a Portugaliei construita pe sapte dealuri, cunoscuta pentru faiantele colorate, tramvaiele istorice si delicioasele pasteis de nata.',
    highlights: ['Belem Tower', 'Alfama District', 'Tram 28', 'Jeronimos Monastery', 'Time Out Market'],
    highlights_ro: ['Turnul Belem', 'Cartierul Alfama', 'Tramvaiul 28', 'Manastirea Jeronimos', 'Piata Time Out'],
    image_url: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800',
    youtube_video_id: 'VCqnQFOQaMA',
    excursions: [],
  },

  'Malaga': {
    name: 'Malaga',
    country: 'Spain',
    country_ro: 'Spania',
    description: 'Birthplace of Picasso and the vibrant gateway to the Costa del Sol. Known for its Moorish fortress, beautiful beaches, and thriving food scene.',
    description_ro: 'Locul nasterii lui Picasso si poarta de acces vibranta catre Costa del Sol. Cunoscut pentru cetatea maura, plajele frumoase si scena gastronomica infloritoare.',
    highlights: ['Alcazaba Fortress', 'Picasso Museum', 'Malaga Cathedral', 'Muelle Uno Port Area'],
    highlights_ro: ['Cetatea Alcazaba', 'Muzeul Picasso', 'Catedrala din Malaga', 'Zona Portuara Muelle Uno'],
    image_url: 'https://images.unsplash.com/photo-1592859600972-1b0834d83747?w=800',
    excursions: [],
  },

  'Cadiz': {
    name: 'Cadiz',
    country: 'Spain',
    country_ro: 'Spania',
    description: 'One of Europe\'s oldest cities, perched on a narrow peninsula jutting into the Atlantic. Known for its golden beaches, seafood, and flamenco culture.',
    description_ro: 'Unul dintre cele mai vechi orase din Europa, asezat pe o peninsula ingusta care intra in Atlantic. Cunoscut pentru plajele aurii, fructele de mare si cultura flamenco.',
    highlights: ['Cadiz Cathedral', 'Torre Tavira', 'La Caleta Beach', 'Old Town'],
    highlights_ro: ['Catedrala din Cadiz', 'Torre Tavira', 'Plaja La Caleta', 'Centrul Vechi'],
    image_url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800',
    excursions: [],
  },

  'Palma de Mallorca': {
    name: 'Palma de Mallorca',
    country: 'Spain',
    country_ro: 'Spania',
    description: 'The beautiful capital of Mallorca island with its stunning Gothic cathedral overlooking the bay. A mix of beachside relaxation and historic charm.',
    description_ro: 'Frumoasa capitala a insulei Mallorca cu superba sa catedrala gotica ce domina golful. Un mix de relaxare pe plaja si farmec istoric.',
    highlights: ['La Seu Cathedral', 'Bellver Castle', 'Old Town', 'Palma Aquarium'],
    highlights_ro: ['Catedrala La Seu', 'Castelul Bellver', 'Centrul Vechi', 'Acvariul Palma'],
    image_url: 'https://images.unsplash.com/photo-1577000747824-f6c8e1be4712?w=800',
    excursions: [],
  },

  'Corfu': {
    name: 'Corfu',
    country: 'Greece',
    country_ro: 'Grecia',
    description: 'A lush green Greek island with Venetian-era architecture, crystal-clear waters and charming old town that is a UNESCO World Heritage Site.',
    description_ro: 'O insula greceasca verde luxurianta cu arhitectura din era venetiana, ape cristaline si un centru vechi fermecator, sit UNESCO.',
    highlights: ['Old Fortress', 'Liston Promenade', 'Achilleion Palace', 'Canal d\'Amour'],
    highlights_ro: ['Fortareata Veche', 'Promenada Liston', 'Palatul Achilleion', 'Canalul Iubirii'],
    image_url: 'https://images.unsplash.com/photo-1600429991827-5e62e1a58ae6?w=800',
    excursions: [],
  },

  'Heraklion': {
    name: 'Heraklion',
    country: 'Greece',
    country_ro: 'Grecia',
    description: 'Capital of Crete and gateway to the ancient Minoan palace of Knossos. A vibrant city with rich history, traditional Cretan cuisine and nearby beaches.',
    description_ro: 'Capitala Cretei si poarta de acces catre palatul antic minoic de la Knossos. Un oras vibrant cu istorie bogata, bucatarie cretana traditionala si plaje in apropiere.',
    highlights: ['Knossos Palace', 'Heraklion Archaeological Museum', 'Venetian Fortress', 'Old Town'],
    highlights_ro: ['Palatul Knossos', 'Muzeul Arheologic Heraklion', 'Cetatea Venetiana', 'Centrul Vechi'],
    image_url: 'https://images.unsplash.com/photo-1558005137-d9619a5c539f?w=800',
    excursions: [],
  },

  'Catania': {
    name: 'Catania',
    country: 'Italy',
    country_ro: 'Italia',
    description: 'A dynamic Sicilian city at the foot of Mount Etna. Known for its baroque architecture, lively fish market, and proximity to Europe\'s most active volcano.',
    description_ro: 'Un oras sicilian dinamic la poalele Muntelui Etna. Cunoscut pentru arhitectura baroca, piata de peste animata si apropierea de cel mai activ vulcan din Europa.',
    highlights: ['Mount Etna', 'Fish Market (Pescheria)', 'Piazza Duomo', 'Roman Amphitheatre'],
    highlights_ro: ['Muntele Etna', 'Piata de Peste (Pescheria)', 'Piazza Duomo', 'Amfiteatrul Roman'],
    image_url: 'https://images.unsplash.com/photo-1523365280197-f1783db9fe62?w=800',
    excursions: [],
  },

  'Messina': {
    name: 'Messina',
    country: 'Italy',
    country_ro: 'Italia',
    description: 'Gateway to Sicily, located on the strait between the island and mainland Italy. Famous for its Norman cathedral and as a base for visiting Taormina and Mount Etna.',
    description_ro: 'Poarta de acces catre Sicilia, situata pe stramtoarea dintre insula si Italia continentala. Celebra pentru catedrala normanda si ca baza pentru vizitarea Taorminei si Muntelui Etna.',
    highlights: ['Messina Cathedral', 'Astronomical Clock', 'Taormina Day Trip', 'Strait of Messina'],
    highlights_ro: ['Catedrala din Messina', 'Ceasul Astronomic', 'Excursie la Taormina', 'Stramtoarea Messina'],
    image_url: 'https://images.unsplash.com/photo-1560703650-ef3e0f254ae0?w=800',
    excursions: [],
  },

  'La Spezia': {
    name: 'La Spezia',
    country: 'Italy',
    country_ro: 'Italia',
    description: 'Gateway to the stunning Cinque Terre, five colorful fishing villages perched on the Ligurian coast. A beautiful naval port surrounded by hills and the Mediterranean.',
    description_ro: 'Poarta de acces catre uimitoarele Cinque Terre, cinci sate de pescari colorate asezate pe coasta Liguriei. Un port naval frumos inconjurat de dealuri si Mediterana.',
    highlights: ['Cinque Terre', 'Portovenere', 'Lerici Castle', 'Naval Museum'],
    highlights_ro: ['Cinque Terre', 'Portovenere', 'Castelul Lerici', 'Muzeul Naval'],
    image_url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800',
    excursions: [],
  },

  'Savona': {
    name: 'Savona',
    country: 'Italy',
    country_ro: 'Italia',
    description: 'A charming Ligurian port city between Genoa and Nice. Known for its medieval towers, beautiful beaches, and as a popular cruise homeport for western Mediterranean itineraries.',
    description_ro: 'Un port fermecator din Liguria intre Genova si Nisa. Cunoscut pentru turnurile medievale, plajele frumoase si ca port de baza popular pentru itinerariile din Mediterana de Vest.',
    highlights: ['Priamar Fortress', 'Historic Center', 'Ligurian Beaches', 'Cathedral of Our Lady'],
    highlights_ro: ['Cetatea Priamar', 'Centrul Istoric', 'Plajele Liguriei', 'Catedrala Sfintei Fecioare'],
    image_url: 'https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=800',
    excursions: [],
  },

  'Katakolon': {
    name: 'Katakolon',
    country: 'Greece',
    country_ro: 'Grecia',
    description: 'A small Greek port town that is the gateway to Ancient Olympia, birthplace of the Olympic Games. Beautiful beaches and a charming waterfront promenade.',
    description_ro: 'Un mic port grecesc care este poarta de acces catre Olimpia Antica, locul nasterii Jocurilor Olimpice. Plaje frumoase si o promenada fermecatoare pe malul marii.',
    highlights: ['Ancient Olympia', 'Archaeological Museum', 'Agios Andreas Beach', 'Waterfront Tavernas'],
    highlights_ro: ['Olimpia Antica', 'Muzeul Arheologic', 'Plaja Agios Andreas', 'Tavernele de pe Mal'],
    image_url: 'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=800',
    excursions: [],
  },

  'Funchal': {
    name: 'Funchal',
    country: 'Portugal (Madeira)',
    country_ro: 'Portugalia (Madeira)',
    description: 'The capital of Madeira island, known as the floating garden of the Atlantic. Famous for its botanical gardens, levada walks, and Madeira wine.',
    description_ro: 'Capitala insulei Madeira, cunoscuta ca gradina plutitoare a Atlanticului. Celebra pentru gradinile botanice, plimbarile pe levade si vinul de Madeira.',
    highlights: ['Monte Palace Gardens', 'Toboggan Ride', 'Mercado dos Lavradores', 'Madeira Wine Lodge'],
    highlights_ro: ['Gradinile Palatului Monte', 'Sania de Rachita', 'Piata Lavradores', 'Pivnitele de Vin Madeira'],
    image_url: 'https://images.unsplash.com/photo-1571400832291-f41acb39f37d?w=800',
    excursions: [],
  },

  'Hvar': {
    name: 'Hvar',
    country: 'Croatia',
    country_ro: 'Croatia',
    description: 'A stunning Croatian island known as the sunniest spot in the Adriatic. Famous for its lavender fields, medieval architecture, and crystal-clear turquoise waters.',
    description_ro: 'O insula croata superba cunoscuta ca cel mai insorit loc din Adriatica. Celebra pentru campurile de lavanda, arhitectura medievala si apele turcoaz cristaline.',
    highlights: ['Hvar Fortress', 'St. Stephen\'s Square', 'Pakleni Islands', 'Lavender Fields'],
    highlights_ro: ['Cetatea Hvar', 'Piata Sf. Stefan', 'Insulele Pakleni', 'Campurile de Lavanda'],
    image_url: 'https://images.unsplash.com/photo-1555990793-da11153b2473?w=800',
    excursions: [],
  },

  'Zadar': {
    name: 'Zadar',
    country: 'Croatia',
    country_ro: 'Croatia',
    description: 'A charming Croatian city with Roman ruins, medieval churches, and the famous Sea Organ — a unique musical instrument played by the waves of the Adriatic.',
    description_ro: 'Un oras croat fermecator cu ruine romane, biserici medievale si celebrele Orgi ale Marii — un instrument muzical unic cantat de valurile Adriaticii.',
    highlights: ['Sea Organ', 'Sun Salutation', 'St. Donatus Church', 'Roman Forum'],
    highlights_ro: ['Orgile Marii', 'Salutul Soarelui', 'Biserica Sf. Donatus', 'Forumul Roman'],
    image_url: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800',
    excursions: [],
  },

  'Nassau': {
    name: 'Nassau',
    country: 'Bahamas',
    country_ro: 'Bahamas',
    description: 'The colorful capital of the Bahamas with stunning turquoise waters, colonial architecture, and world-famous Atlantis resort on nearby Paradise Island.',
    description_ro: 'Capitala colorata a Bahamelor cu ape turcoaz superbe, arhitectura coloniala si celebrul resort Atlantis pe apropiata Insula Paradis.',
    highlights: ['Atlantis Resort', 'Cable Beach', 'Queen\'s Staircase', 'Straw Market'],
    highlights_ro: ['Resort-ul Atlantis', 'Plaja Cable', 'Scara Reginei', 'Piata de Paie'],
    image_url: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800',
    excursions: [],
  },

  'Fort Lauderdale': {
    name: 'Fort Lauderdale',
    country: 'USA (Florida)',
    country_ro: 'SUA (Florida)',
    description: 'Known as the Venice of America for its extensive canal system. A major cruise homeport with beautiful beaches, upscale shopping, and vibrant nightlife.',
    description_ro: 'Cunoscut ca Venetia Americii pentru sistemul sau extins de canale. Un port de baza major pentru croaziere cu plaje frumoase, shopping de lux si viata de noapte vibranta.',
    highlights: ['Las Olas Boulevard', 'Fort Lauderdale Beach', 'Everglades', 'Riverwalk'],
    highlights_ro: ['Bulevardul Las Olas', 'Plaja Fort Lauderdale', 'Everglades', 'Riverwalk'],
    image_url: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800',
    excursions: [],
  },
}

// ============================================================
// Romanian → English name aliases for port lookup
// ============================================================

const PORT_ALIASES: Record<string, string> = {
  // Romanian names → PORTS database keys
  'Roma': 'Rome',
  'Atena': 'Athens',
  'Venetia': 'Venice',
  'Marsilia': 'Marseille',
  'Lisabona': 'Lisbon',
  'Copenhaga': 'Copenhagen',
  'Viena': 'Vienna',
  'Budapesta': 'Budapest',
  'Rodos': 'Rhodes',
  'Napoli': 'Naples',
  'Genova': 'Genoa',
  // Port with alternate name patterns
  'Civitavecchia': 'Rome',
  'Piraeus': 'Athens',
  'Pireus': 'Athens',
  'Livorno': 'Florence',
  'Florenta': 'Florence',
  // Common alternate spellings
  'Valleta': 'Valletta',
  'Messine': 'Messina',
  'Kotor Bay': 'Kotor',
  'Olympia': 'Katakolon',
  'Kusadasi': 'Ephesus',
  'Ephesus': 'Kusadasi',
}

/**
 * Look up port info by port name.
 * Handles partial matches, Romanian names, and "City, Country" format.
 */
export function getPortInfo(portName: string): PortInfo | undefined {
  // Try exact match first
  if (PORTS[portName]) return PORTS[portName]

  // Try matching by extracting city name (before comma or parenthesis)
  const cityName = portName.replace(/,.*$/, '').replace(/\s*\(.*\)/, '').trim()
  if (PORTS[cityName]) return PORTS[cityName]

  // Try aliases (e.g., "Roma" → "Rome", "Civitavecchia" → "Rome")
  if (PORT_ALIASES[cityName]) return PORTS[PORT_ALIASES[cityName]]

  // Handle "City / AltName (Port), Country" patterns
  const slashParts = cityName.split('/').map(s => s.trim())
  for (const part of slashParts) {
    const clean = part.replace(/\s*\(.*\)/, '').trim()
    if (PORTS[clean]) return PORTS[clean]
    if (PORT_ALIASES[clean]) return PORTS[PORT_ALIASES[clean]]
    // Check parenthetical name too
    const parenMatch = part.match(/\(([^)]+)\)/)
    if (parenMatch) {
      const parenName = parenMatch[1].trim()
      if (PORTS[parenName]) return PORTS[parenName]
      if (PORT_ALIASES[parenName]) return PORTS[PORT_ALIASES[parenName]]
    }
  }

  // Try case-insensitive match on city name
  const lower = cityName.toLowerCase()
  for (const [key, info] of Object.entries(PORTS)) {
    if (key.toLowerCase() === lower) return info
  }

  // Try case-insensitive alias match
  for (const [alias, target] of Object.entries(PORT_ALIASES)) {
    if (alias.toLowerCase() === lower) return PORTS[target]
  }

  return undefined
}
