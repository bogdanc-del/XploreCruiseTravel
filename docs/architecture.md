# Technical Architecture Document -- XploreCruiseTravel

**Version:** 1.0
**Date:** March 2026
**Author:** XploreCruiseTravel Engineering

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [File Structure and Organization](#2-file-structure-and-organization)
3. [Technology Stack](#3-technology-stack)
4. [Data Flow Architecture](#4-data-flow-architecture)
5. [Internationalization (i18n)](#5-internationalization-i18n)
6. [Booking Flow](#6-booking-flow)
7. [Email Integration](#7-email-integration)
8. [Deployment Architecture](#8-deployment-architecture)
9. [Security and Privacy](#9-security-and-privacy)
10. [External Dependencies](#10-external-dependencies)
11. [Performance Architecture](#11-performance-architecture)
12. [SEO Architecture](#12-seo-architecture)

---

## 1. System Overview

XploreCruiseTravel is a **static HTML/CSS/JavaScript website** with no backend framework or server-side rendering. The entire application runs client-side in the user's browser. There is no database server, no application server, and no API layer -- all data is loaded from a static JSON file and all rendering is performed via vanilla JavaScript DOM manipulation.

### Architecture Type
- **Static Site Architecture** (JAMstack-adjacent)
- No backend framework (no Node.js, no PHP, no Python server)
- Client-side rendering only
- Data sourced from `data/cruises.json` (static JSON file)
- Email delivery via third-party EmailJS service
- Hosted on Vercel CDN as static files

### High-Level Diagram

```
+-------------------+     +-----------------+     +------------------+
|   User Browser    | --> |  Vercel CDN     | --> |  Static Files    |
|                   |     |  (Edge Network) |     |  HTML/CSS/JS/JSON|
+-------------------+     +-----------------+     +------------------+
        |                                                  |
        |  fetch('/data/cruises.json')                     |
        |<-------------------------------------------------|
        |
        |  EmailJS API (booking/contact)
        |---> emailjs.send() --> EmailJS Cloud --> Gmail
        |
        |  WhatsApp (external link)
        |---> wa.me/40749558572
        |
        |  mailto: (fallback)
        |---> native email client
```

---

## 2. File Structure and Organization

```
XploreCruiseTravel/
|-- index.html                  # Homepage (data-page="home")
|-- css/
|   +-- style.css               # Complete design system (~1400 lines)
|-- js/
|   |-- app.js                  # Main application logic (~944 lines)
|   +-- i18n.js                 # Internationalization system (~463 lines)
|-- data/
|   +-- cruises.json            # Cruise data (6 cruises, destinations, cruise lines)
|-- pages/
|   |-- listing.html            # Cruise listing page (data-page="listing")
|   |-- detail.html             # Cruise detail page (data-page="detail")
|   |-- about.html              # About Us page (data-page="about")
|   |-- contact.html            # Contact form page (data-page="contact")
|   |-- terms.html              # Terms & Conditions (data-page="terms")
|   +-- privacy.html            # Privacy Policy (data-page="privacy")
|-- scripts/
|   +-- scraper.py              # Croaziere.Net data scraper (Python)
|-- vercel.json                 # Vercel deployment configuration
|-- robots.txt                  # Search engine directives
|-- sitemap.xml                 # XML sitemap for SEO
|-- .gitignore                  # Git ignore rules
+-- README.md                   # Project README
```

### Page Identification System

Each page uses the `data-page` attribute on `<body>` to identify itself to the shared JavaScript code:

| Page | data-page | Description |
|------|-----------|-------------|
| index.html | `home` | Homepage with hero, search, featured cruises |
| listing.html | `listing` | Full cruise listing with filters |
| detail.html | `detail` | Individual cruise detail view |
| about.html | `about` | About Us page |
| contact.html | `contact` | Contact form page |
| terms.html | `terms` | Terms & Conditions |
| privacy.html | `privacy` | Privacy Policy |

---

## 3. Technology Stack

### Frontend
| Technology | Version/Details | Purpose |
|-----------|----------------|---------|
| HTML5 | Semantic elements | Page structure, accessibility |
| CSS3 | Custom properties, Grid, Flexbox | Styling, responsive design |
| JavaScript | ES6+ (vanilla, no framework) | Application logic, DOM manipulation |
| CSS Custom Properties | ~40 design tokens | Design system (colors, spacing, typography) |
| CSS Grid | 3-column and 4-column layouts | Card layouts, page grids |
| CSS Flexbox | Header, footer, card internals | Component-level layouts |

### External Services
| Service | Purpose |
|---------|---------|
| EmailJS (CDN v4) | Email delivery for booking and contact forms |
| Google Fonts | Typography (Inter, Playfair Display) |
| Unsplash | Cruise and destination imagery |
| WhatsApp Business API | Direct customer communication (wa.me links) |

### Development/Operations
| Tool | Purpose |
|------|---------|
| Vercel | Static site hosting and CDN |
| Python 3 + BeautifulSoup4 | Data scraping from Croaziere.Net |
| Git | Version control |
| Ruby WEBrick | Local development preview server |

### CSS Design System

The CSS uses a comprehensive custom properties system defined in `:root`:

```css
/* Color Palette - Luxury Navy/Gold */
--primary: #0a1628;          /* Dark navy */
--secondary: #c9a84c;        /* Gold accent */
--accent: #2c7be5;           /* Blue interactive */

/* Typography */
--font-heading: 'Playfair Display', Georgia, serif;
--font-body: 'Inter', -apple-system, sans-serif;

/* Spacing Scale */
--space-xs through --space-4xl (0.25rem to 6rem)

/* Border Radius, Shadows, Transitions */
```

---

## 4. Data Flow Architecture

### Primary Data Flow

```
cruises.json --> fetch() --> app.js (loadCruiseData) --> cruiseData variable
                                      |
                                      +--> renderCruiseCard() --> DOM (featured grid)
                                      +--> renderDestCard() --> DOM (destinations grid)
                                      +--> populateSearchDropdowns() --> DOM (select elements)
                                      +--> applyListingFilters() --> DOM (listing grid)
                                      +--> initDetailPage() --> DOM (detail page)
```

### Data Loading Strategy

The `loadCruiseData()` function implements a two-path fetch strategy:

1. **Primary path:** `fetch('/data/cruises.json')` -- works when served from root (Vercel, local server)
2. **Fallback path:** `fetch('../data/cruises.json')` -- works when pages are in `/pages/` subdirectory

The loaded data is cached in the global `cruiseData` variable for the duration of the page session.

### cruises.json Schema

```json
{
  "lastUpdated": "ISO 8601 timestamp",
  "source": "string",
  "cruises": [
    {
      "id": "string (unique identifier)",
      "title": "string (English)",
      "titleRo": "string (Romanian)",
      "cruiseLine": "string",
      "ship": "string",
      "destination": "string (English)",
      "destinationRo": "string (Romanian)",
      "region": "string",
      "nights": "number",
      "departurePort": "string",
      "departureDate": "ISO date string",
      "returnDate": "ISO date string",
      "ports": ["string array (English)"],
      "portsRo": ["string array (Romanian)"],
      "itinerary": [
        {
          "day": "number",
          "port": "string",
          "arrival": "string (HH:MM or empty)",
          "departure": "string (HH:MM or empty)"
        }
      ],
      "cabins": [
        {
          "type": "string (English)",
          "typeRo": "string (Romanian)",
          "priceFrom": "number (EUR)",
          "currency": "EUR"
        }
      ],
      "priceFrom": "number (EUR, lowest cabin price)",
      "currency": "EUR",
      "included": ["string array (English)"],
      "includedRo": ["string array (Romanian)"],
      "excluded": ["string array (English)"],
      "excludedRo": ["string array (Romanian)"],
      "image": "string (Unsplash URL)",
      "tags": ["string array: popular, luxury, family, river, adults-only"],
      "cruiseType": "string: ocean | river | luxury",
      "advisorNote": "string (English)",
      "advisorNoteRo": "string (Romanian)"
    }
  ],
  "destinations": [
    {
      "id": "string (URL-safe slug)",
      "name": "string (English)",
      "nameRo": "string (Romanian)",
      "count": "number",
      "image": "string (URL)"
    }
  ],
  "cruiseLines": ["string array"]
}
```

---

## 5. Internationalization (i18n)

### Architecture

The i18n system is implemented in `js/i18n.js` as a client-side translation layer:

```
i18n.js
  |-- translations object { en: {...}, ro: {...} }
  |-- currentLang (from localStorage or default 'en')
  |-- t(key) function --> returns translated string
  |-- setLang(lang) function --> updates all DOM elements
  |-- toggleLang() function --> switches EN <-> RO
```

### How It Works

1. **Translation Keys:** HTML elements use `data-i18n` attributes:
   ```html
   <h2 data-i18n="featured_title">Handpicked Voyages for You</h2>
   ```

2. **Translation Function `t(key)`:** Returns the translation for the current language, falling back to English:
   ```javascript
   function t(key) {
     return translations[currentLang]?.[key] || translations['en']?.[key] || key;
   }
   ```

3. **Language Persistence:** Stored in `localStorage` under key `xct_lang`.

4. **Dynamic Content Re-rendering:** When language changes, a `langChanged` custom event is dispatched, triggering page-specific re-initialization (homepage, listing, detail page).

5. **Input Elements:** For `<input>` and `<textarea>`, the `placeholder` attribute is updated instead of `innerHTML`.

### Translation Coverage

The system includes ~130 translation keys per language covering:
- Navigation labels
- Hero section
- Search module
- Trust bar
- Section headings
- Cruise card labels
- Detail page labels
- Booking modal (all 3 steps)
- Contact form
- Footer
- Cookie banner
- Terms & Privacy page headings
- Months array

### Currency Localization

When Romanian language is active, prices display both EUR and RON:
```javascript
const EUR_TO_RON = 4.97;
// Output: "699 (~3,474 Lei)"
```

---

## 6. Booking Flow

### 3-Step Modal Architecture

```
Step 1: Personal Details          Step 2: Cruise Selection       Step 3: Review & Confirm
+-------------------------+       +-------------------------+    +-------------------------+
| First Name*             |       | Select Cruise (dropdown)|    | Summary (read-only DL)  |
| Last Name*              |       | Cabin Preference        |    | GDPR Consent Checkbox*  |
| Date of Birth*          |       | Number of Passengers    |    | Terms Checkbox*         |
| Phone Number*           |       | Special Requests        |    | Marketing Consent (opt) |
| Email Address*          |       |                         |    |                         |
+----------+--------------+       +----------+--------------+    +----------+--------------+
           | Next                            | Next                         | Submit
           v                                 v                              v
```

### Modal Lifecycle

1. **Creation:** `createBookingModal()` dynamically injects the modal HTML into the DOM
2. **Opening:** `openBookingModal(cruiseId)` shows the modal, pre-selects the cruise if ID provided
3. **Navigation:** `nextBookingStep()` / `prevBookingStep()` manage step progression with validation
4. **Submission:** `submitBooking()` sends data via three channels
5. **Closing:** `closeBookingModal()` removes the modal from DOM with fade animation
6. **Language Change:** The `langChanged` event removes the old modal so it rebuilds with new translations

### Submission Triple-Send Strategy

```
submitBooking()
  |
  |-- 1. EmailJS API (if configured)
  |     emailjs.send(service_xplore, template_booking, {...})
  |
  |-- 2. localStorage persistence
  |     xct_bookings -> JSON array of booking objects
  |
  |-- 3. mailto: link (fallback)
  |     Opens native email client with pre-filled subject and body
  |
  +-- 4. Show success step (hide form, show confirmation)
```

### Validation Rules

- **Step 1:** All fields required; email regex validation (`/\S+@\S+\.\S+/`)
- **Step 2:** No validation (cruise dropdown is pre-populated)
- **Step 3:** GDPR consent and Terms checkboxes must be checked

---

## 7. Email Integration

### EmailJS Configuration

```javascript
const EMAILJS_SERVICE_ID = 'service_xplore';
const EMAILJS_TEMPLATE_BOOKING = 'template_booking';
const EMAILJS_TEMPLATE_CONTACT = 'template_contact';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Must be configured
```

### Two Email Templates

1. **Booking Template (`template_booking`):** Receives booking form data (name, DOB, email, phone, cruise selection, cabin preference, passenger count, special requests, GDPR consent, marketing consent)

2. **Contact Template (`template_contact`):** Receives contact form data (name, email, phone, cruise interest, message)

Both templates send to: `xplorecruisetravel@gmail.com`

### Fallback Strategy

If EmailJS is not configured (`EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY'`) or fails, the system falls back to:
- `mailto:` link with pre-formatted subject and body
- `localStorage` backup of all booking data

---

## 8. Deployment Architecture

### Vercel Configuration (`vercel.json`)

```json
{
  "version": 2,
  "builds": [{ "src": "**/*", "use": "@vercel/static" }],
  "routes": [{ "src": "/(.*)", "dest": "/$1" }]
}
```

### Security Headers (Vercel)

All responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Caching Strategy

| Path | Cache-Control |
|------|--------------|
| `/css/*` | `public, max-age=31536000, immutable` (1 year) |
| `/js/*` | `public, max-age=31536000, immutable` (1 year) |
| `/data/*` | `public, max-age=3600` (1 hour) |
| Everything else | Default Vercel caching |

### Local Development

Local preview is configured via Ruby WEBrick server (see `.claude/launch.json`):
```json
{
  "name": "webrick-server",
  "runtimeExecutable": "ruby",
  "runtimeArgs": ["-run", "-e", "httpd", ".", "-p", "8000"],
  "port": 8000
}
```

---

## 9. Security and Privacy

### GDPR Compliance

- **Cookie Consent Banner:** Displayed on first visit, choice persisted in `localStorage` (`xct_cookie_consent`)
- **Booking Form GDPR:** Explicit consent checkbox required before submission
- **Terms Agreement:** Separate checkbox linking to Terms & Conditions
- **Marketing Consent:** Optional opt-in checkbox for promotional emails
- **Privacy Policy:** Comprehensive GDPR-compliant policy available at `/pages/privacy.html`
- **Data Rights:** Users can request data access, rectification, erasure via email

### Input Validation

- Email format validation via regex
- Required field validation on booking steps 1 and 3
- No server-side validation (static site limitation)

### Data Storage

- **localStorage keys used:**
  - `xct_lang` -- current language preference
  - `xct_cookie_consent` -- cookie consent decision
  - `xct_bookings` -- array of submitted booking objects
- **No server-side data storage** -- all data is client-side or sent via email

### Security Headers

Configured in `vercel.json`:
- Protection against MIME type sniffing
- Clickjacking prevention (DENY framing)
- XSS protection
- Strict referrer policy

---

## 10. External Dependencies

| Dependency | Type | URL | Purpose |
|-----------|------|-----|---------|
| Google Fonts (Inter) | CDN Font | fonts.googleapis.com | Body typography |
| Google Fonts (Playfair Display) | CDN Font | fonts.googleapis.com | Heading typography |
| EmailJS Browser v4 | CDN Script | cdn.jsdelivr.net/npm/@emailjs/browser@4 | Email delivery |
| Unsplash Images | CDN Images | images.unsplash.com | Cruise and destination photos |

### Zero NPM Dependencies

The project has no `package.json`, no `node_modules`, and no build step. All JavaScript is vanilla ES6+.

---

## 11. Performance Architecture

### Loading Strategy

- **Lazy loading images:** All cruise card images use `loading="lazy"`
- **Font preconnect:** `<link rel="preconnect">` for Google Fonts
- **Deferred rendering:** Cruise data loads asynchronously after DOMContentLoaded
- **IntersectionObserver:** Scroll animations and counter animations only trigger when elements enter viewport
- **Fallback timers:** Elements become visible after 2-4 seconds even if IntersectionObserver fails

### Parallax Performance

The hero parallax effect uses `requestAnimationFrame` with a ticking flag to prevent frame-doubling:

```javascript
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => { /* transform */ ticking = false; });
    ticking = true;
  }
});
```

---

## 12. SEO Architecture

### Structured Data (JSON-LD)

The homepage includes Schema.org `TravelAgency` structured data:

```json
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "XploreCruiseTravel",
  "telephone": "+40-749-558-572",
  "email": "xplorecruisetravel@gmail.com",
  "address": { "@type": "PostalAddress", "addressCountry": "RO" },
  "openingHours": "Mo-Fr 09:00-20:00, Sa-Su 10:00-18:00"
}
```

### Meta Tags

Each page includes:
- `<title>` with page-specific title
- `<meta name="description">` with page-specific description
- `<meta name="keywords">` (homepage)
- `<meta name="robots" content="index, follow">`
- `<link rel="canonical">`
- Open Graph tags (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`)

### Other SEO Assets

- `robots.txt` -- Allows all crawlers, blocks `/scripts/` and `/data/backups/`
- `sitemap.xml` -- Lists 4 main pages with priorities and update frequencies

---

---

# Documentatie Arhitectura Tehnica -- XploreCruiseTravel

**Versiunea:** 1.0
**Data:** Martie 2026
**Autor:** XploreCruiseTravel Engineering

---

## Cuprins

1. [Prezentare Generala a Sistemului](#1-prezentare-generala-a-sistemului)
2. [Structura Fisierelor si Organizare](#2-structura-fisierelor-si-organizare)
3. [Stiva Tehnologica](#3-stiva-tehnologica)
4. [Arhitectura Fluxului de Date](#4-arhitectura-fluxului-de-date)
5. [Internationalizare (i18n)](#5-internationalizare-i18n)
6. [Fluxul de Rezervare](#6-fluxul-de-rezervare)
7. [Integrare Email](#7-integrare-email)
8. [Arhitectura de Deployment](#8-arhitectura-de-deployment)
9. [Securitate si Confidentialitate](#9-securitate-si-confidentialitate)
10. [Dependente Externe](#10-dependente-externe)
11. [Arhitectura de Performanta](#11-arhitectura-de-performanta)
12. [Arhitectura SEO](#12-arhitectura-seo)

---

## 1. Prezentare Generala a Sistemului

XploreCruiseTravel este un **website static HTML/CSS/JavaScript** fara framework backend sau randare pe server. Intreaga aplicatie ruleaza pe partea de client in browserul utilizatorului. Nu exista server de baze de date, server de aplicatii sau strat API -- toate datele sunt incarcate dintr-un fisier JSON static, iar toata randarea se face prin manipulare DOM cu JavaScript vanilla.

### Tipul Arhitecturii
- **Arhitectura de Site Static** (adiacenta JAMstack)
- Fara framework backend (fara Node.js, fara PHP, fara server Python)
- Doar randare pe partea de client
- Date provenite din `data/cruises.json` (fisier JSON static)
- Livrare email prin serviciul tert EmailJS
- Gazduit pe CDN-ul Vercel ca fisiere statice

### Diagrama de Nivel Inalt

```
+-------------------+     +-----------------+     +------------------+
|   Browser Utiliz. | --> |  Vercel CDN     | --> |  Fisiere Statice |
|                   |     |  (Retea Edge)   |     |  HTML/CSS/JS/JSON|
+-------------------+     +-----------------+     +------------------+
        |                                                  |
        |  fetch('/data/cruises.json')                     |
        |<-------------------------------------------------|
        |
        |  EmailJS API (rezervare/contact)
        |---> emailjs.send() --> EmailJS Cloud --> Gmail
        |
        |  WhatsApp (link extern)
        |---> wa.me/40749558572
        |
        |  mailto: (alternativa)
        |---> client email nativ
```

---

## 2. Structura Fisierelor si Organizare

```
XploreCruiseTravel/
|-- index.html                  # Pagina principala (data-page="home")
|-- css/
|   +-- style.css               # Sistem de design complet (~1400 linii)
|-- js/
|   |-- app.js                  # Logica principala a aplicatiei (~944 linii)
|   +-- i18n.js                 # Sistem de internationalizare (~463 linii)
|-- data/
|   +-- cruises.json            # Date croaziere (6 croaziere, destinatii, companii)
|-- pages/
|   |-- listing.html            # Pagina listare croaziere (data-page="listing")
|   |-- detail.html             # Pagina detalii croaziera (data-page="detail")
|   |-- about.html              # Pagina Despre Noi (data-page="about")
|   |-- contact.html            # Pagina formular contact (data-page="contact")
|   |-- terms.html              # Termeni si Conditii (data-page="terms")
|   +-- privacy.html            # Politica de Confidentialitate (data-page="privacy")
|-- scripts/
|   +-- scraper.py              # Scraper date Croaziere.Net (Python)
|-- vercel.json                 # Configurare deployment Vercel
|-- robots.txt                  # Directive motoare de cautare
|-- sitemap.xml                 # Sitemap XML pentru SEO
+-- README.md                   # README proiect
```

### Sistem de Identificare a Paginilor

Fiecare pagina utilizeaza atributul `data-page` pe `<body>` pentru a se identifica fata de codul JavaScript partajat:

| Pagina | data-page | Descriere |
|--------|-----------|-----------|
| index.html | `home` | Pagina principala cu hero, cautare, croaziere recomandate |
| listing.html | `listing` | Lista completa croaziere cu filtre |
| detail.html | `detail` | Vizualizare detalii croaziera individuala |
| about.html | `about` | Pagina Despre Noi |
| contact.html | `contact` | Pagina formular de contact |
| terms.html | `terms` | Termeni si Conditii |
| privacy.html | `privacy` | Politica de Confidentialitate |

---

## 3. Stiva Tehnologica

### Frontend
| Tehnologie | Versiune/Detalii | Scop |
|-----------|-----------------|------|
| HTML5 | Elemente semantice | Structura paginii, accesibilitate |
| CSS3 | Proprietati personalizate, Grid, Flexbox | Stilizare, design responsiv |
| JavaScript | ES6+ (vanilla, fara framework) | Logica aplicatiei, manipulare DOM |
| Proprietati CSS Personalizate | ~40 token-uri de design | Sistem de design (culori, spatiere, tipografie) |
| CSS Grid | Layouturi pe 3 si 4 coloane | Layouturi carduri, grile pagini |
| CSS Flexbox | Header, footer, componente interne | Layouturi la nivel de componenta |

### Servicii Externe
| Serviciu | Scop |
|----------|------|
| EmailJS (CDN v4) | Livrare email pentru formularele de rezervare si contact |
| Google Fonts | Tipografie (Inter, Playfair Display) |
| Unsplash | Imagini croaziere si destinatii |
| WhatsApp Business API | Comunicare directa cu clientii (linkuri wa.me) |

---

## 4. Arhitectura Fluxului de Date

### Fluxul Principal de Date

```
cruises.json --> fetch() --> app.js (loadCruiseData) --> variabila cruiseData
                                      |
                                      +--> renderCruiseCard() --> DOM (grila recomandate)
                                      +--> renderDestCard() --> DOM (grila destinatii)
                                      +--> populateSearchDropdowns() --> DOM (elemente select)
                                      +--> applyListingFilters() --> DOM (grila listare)
                                      +--> initDetailPage() --> DOM (pagina detalii)
```

### Strategia de Incarcare Date

Functia `loadCruiseData()` implementeaza o strategie de fetch cu doua cai:

1. **Cale primara:** `fetch('/data/cruises.json')` -- functioneaza cand se serveste din root (Vercel, server local)
2. **Cale alternativa:** `fetch('../data/cruises.json')` -- functioneaza cand paginile sunt in subdirectorul `/pages/`

Datele incarcate sunt stocate in memoria cache in variabila globala `cruiseData` pe durata sesiunii paginii.

---

## 5. Internationalizare (i18n)

### Arhitectura

Sistemul i18n este implementat in `js/i18n.js` ca un strat de traducere pe partea de client:

1. **Chei de traducere:** Elementele HTML folosesc atribute `data-i18n`
2. **Functia de traducere `t(key)`:** Returneaza traducerea pentru limba curenta, cu fallback in engleza
3. **Persistenta limbii:** Stocata in `localStorage` sub cheia `xct_lang`
4. **Re-randare continut dinamic:** La schimbarea limbii, un eveniment personalizat `langChanged` este emis, declansand re-initializarea specifica paginii
5. **Elemente de input:** Pentru `<input>` si `<textarea>`, atributul `placeholder` este actualizat in loc de `innerHTML`

### Localizare Valuta

Cand limba romana este activa, preturile afiseaza atat EUR cat si RON:
```javascript
const EUR_TO_RON = 4.97;
// Output: "699 (~3.474 Lei)"
```

---

## 6. Fluxul de Rezervare

### Arhitectura Modala in 3 Pasi

1. **Pasul 1 - Date Personale:** Prenume, Nume, Data nasterii, Telefon, Email (toate obligatorii)
2. **Pasul 2 - Selectie Croaziera:** Dropdown croaziera, Preferinta cabina, Numar pasageri, Cerinte speciale
3. **Pasul 3 - Verificare & Confirmare:** Sumar date, Consimtamant GDPR, Acord Termeni, Consimtamant marketing (optional)

### Strategia de Trimitere Tripla

1. **EmailJS API** (daca este configurat)
2. **Persistenta localStorage** (backup local)
3. **Link mailto:** (alternativa - deschide clientul de email nativ)

---

## 7. Integrare Email

### Configurare EmailJS

- Service ID: `service_xplore`
- Template Rezervare: `template_booking`
- Template Contact: `template_contact`
- Destinatar: `xplorecruisetravel@gmail.com`

### Strategie de Alternativa

Daca EmailJS nu este configurat sau esueaza, sistemul recurge la:
- Link `mailto:` cu subiect si corp pre-formatate
- Backup `localStorage` pentru toate datele de rezervare

---

## 8. Arhitectura de Deployment

### Configurare Vercel

- Fisiere statice servite prin `@vercel/static`
- Rutare: toate cererile sunt directionate catre fisierul corespunzator

### Headere de Securitate (Vercel)

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Strategie de Cache

| Cale | Cache-Control |
|------|--------------|
| `/css/*` | `public, max-age=31536000, immutable` (1 an) |
| `/js/*` | `public, max-age=31536000, immutable` (1 an) |
| `/data/*` | `public, max-age=3600` (1 ora) |

---

## 9. Securitate si Confidentialitate

### Conformitate GDPR

- **Banner consimtamant cookie-uri:** Afisat la prima vizita, decizia persistata in `localStorage`
- **GDPR formular rezervare:** Caseta de consimtamant explicit necesara inainte de trimitere
- **Acord Termeni:** Caseta separata cu link catre Termeni si Conditii
- **Consimtamant marketing:** Caseta optionala de opt-in pentru emailuri promotionale
- **Politica de Confidentialitate:** Politica completa GDPR disponibila la `/pages/privacy.html`

### Stocare Date

- **Chei localStorage utilizate:**
  - `xct_lang` -- preferinta de limba curenta
  - `xct_cookie_consent` -- decizia de consimtamant cookie
  - `xct_bookings` -- array de obiecte de rezervare trimise
- **Nicio stocare de date pe server** -- toate datele sunt pe partea de client sau trimise prin email

---

## 10. Dependente Externe

| Dependenta | Tip | Scop |
|-----------|-----|------|
| Google Fonts (Inter) | Font CDN | Tipografie corp text |
| Google Fonts (Playfair Display) | Font CDN | Tipografie titluri |
| EmailJS Browser v4 | Script CDN | Livrare email |
| Unsplash Images | Imagini CDN | Fotografii croaziere si destinatii |

### Zero Dependente NPM

Proiectul nu are `package.json`, `node_modules` sau pas de build. Tot JavaScript-ul este vanilla ES6+.

---

## 11. Arhitectura de Performanta

- **Incarcare lenta imagini:** Toate imaginile cardurilor de croaziera folosesc `loading="lazy"`
- **Preconectare fonturi:** `<link rel="preconnect">` pentru Google Fonts
- **Randare amanata:** Datele de croaziera se incarca asincron dupa DOMContentLoaded
- **IntersectionObserver:** Animatiile de scroll si contoarele se declanseaza doar cand elementele intra in viewport
- **Timer-e de fallback:** Elementele devin vizibile dupa 2-4 secunde chiar daca IntersectionObserver esueaza

---

## 12. Arhitectura SEO

- **Date structurate JSON-LD:** Schema.org `TravelAgency` pe pagina principala
- **Meta taguri:** Titlu, descriere, cuvinte cheie, canonical, Open Graph pe fiecare pagina
- **robots.txt:** Permite toate crawlerele, blocheaza `/scripts/` si `/data/backups/`
- **sitemap.xml:** Listeaza 4 pagini principale cu prioritati si frecvente de actualizare
