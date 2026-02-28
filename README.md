# XploreCruiseTravel

Premium cruise travel website — official partner of Croaziere.Net.

## Features

- **Bilingual** — Romanian + English with one-click toggle
- **Fully responsive** — Desktop, tablet, and mobile (3 breakpoints)
- **Lead-based conversion** — Request Offer, Call, WhatsApp CTAs
- **SEO optimized** — Structured data, Open Graph, sitemap, robots.txt
- **Cruise catalogue** — Filterable listings with destination, cruise line, duration, type
- **Detail pages** — Itinerary, cabin prices, inclusions, advisor tips
- **GDPR-ready** — Cookie consent banner, newsletter opt-in
- **Partner data feed** — Automated weekly scraper for Croaziere.Net data

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Homepage with search, featured cruises, destinations |
| `pages/listing.html` | All cruises with filters and sorting |
| `pages/detail.html` | Cruise detail with itinerary and pricing |
| `pages/about.html` | About us, team profiles |
| `pages/contact.html` | Contact form, phone, WhatsApp, email |

## Tech Stack

- **Frontend:** Vanilla HTML5 / CSS3 / JavaScript (no framework dependencies)
- **Fonts:** Playfair Display + Inter (Google Fonts)
- **Data:** JSON-based cruise catalogue
- **Scraper:** Python 3 (requests + BeautifulSoup4)
- **Hosting:** Vercel (static deployment)

## Deployment

```bash
# Deploy to Vercel
npm i -g vercel
vercel --prod
```

Or connect this repo to [vercel.com](https://vercel.com) for automatic deployments.

## Data Updates

The Python scraper (`scripts/scraper.py`) fetches cruise data weekly from the Croaziere.Net partner feed. It runs via a scheduled task every Monday at 6:00 AM.

```bash
python3 scripts/scraper.py
```

## License

Proprietary — XploreCruiseTravel / Code-CraftX
