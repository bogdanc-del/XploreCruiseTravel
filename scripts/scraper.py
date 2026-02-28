#!/usr/bin/env python3
"""
XploreCruiseTravel — Croaziere.Net Data Scraper
================================================
This script fetches cruise data from Croaziere.Net (partner site with permission)
and updates the local cruise database (data/cruises.json).

Usage:
  python3 scripts/scraper.py

Schedule:
  Run weekly via cron or scheduled task manager.

IMPORTANT: This scraper operates under a partnership agreement with Croaziere.Net.
Do NOT run this without written permission from KEY OFFICE S.R.L.
"""

import json
import os
import sys
import time
import hashlib
from datetime import datetime, timedelta
from pathlib import Path

# Try to import requests/bs4, install if missing
try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install",
                          "requests", "beautifulsoup4", "--break-system-packages", "-q"])
    import requests
    from bs4 import BeautifulSoup


# Configuration
BASE_URL = "https://www.croaziere.net"
DATA_DIR = Path(__file__).parent.parent / "data"
OUTPUT_FILE = DATA_DIR / "cruises.json"
BACKUP_DIR = DATA_DIR / "backups"
RATE_LIMIT_SECONDS = 2  # Be respectful with requests
MAX_PAGES = 50  # Safety limit
USER_AGENT = "XploreCruiseTravel-Partner/1.0 (Authorized Partner Feed)"


class CroaziereNetScraper:
    """Scrapes cruise data from Croaziere.Net partner site."""

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "ro,en;q=0.9",
        })
        self.cruises = []
        self.errors = []

    def fetch_page(self, url):
        """Fetch a page with rate limiting and error handling."""
        time.sleep(RATE_LIMIT_SECONDS)
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            return BeautifulSoup(response.text, "html.parser")
        except requests.RequestException as e:
            self.errors.append(f"Failed to fetch {url}: {e}")
            return None

    def scrape_listing_page(self, url):
        """Parse a cruise listing page and extract cruise summaries."""
        soup = self.fetch_page(url)
        if not soup:
            return []

        cruise_items = []
        # Look for cruise listing items (adapt selectors to actual site structure)
        cards = soup.select(".cruise-item, .oferta-croaziera, .cruise-card, article.cruise")

        for card in cards:
            try:
                cruise = self._parse_listing_card(card)
                if cruise:
                    cruise_items.append(cruise)
            except Exception as e:
                self.errors.append(f"Error parsing card: {e}")

        return cruise_items

    def _parse_listing_card(self, card):
        """Extract data from a single cruise listing card."""
        # Title
        title_el = card.select_one("h2, h3, .cruise-title, .title")
        if not title_el:
            return None

        title = title_el.get_text(strip=True)

        # Link to detail page
        link_el = card.select_one("a[href]")
        detail_url = link_el["href"] if link_el else None
        if detail_url and not detail_url.startswith("http"):
            detail_url = BASE_URL + detail_url

        # Price
        price_el = card.select_one(".price, .pret, .cruise-price")
        price_text = price_el.get_text(strip=True) if price_el else ""
        price = self._extract_price(price_text)

        # Cruise line
        line_el = card.select_one(".cruise-line, .companie, .operator")
        cruise_line = line_el.get_text(strip=True) if line_el else ""

        # Nights
        nights_el = card.select_one(".nights, .nopti, .duration")
        nights_text = nights_el.get_text(strip=True) if nights_el else ""
        nights = self._extract_number(nights_text)

        # Ship
        ship_el = card.select_one(".ship, .nava, .vessel")
        ship = ship_el.get_text(strip=True) if ship_el else ""

        # Departure date
        date_el = card.select_one(".date, .data-plecare, .departure-date")
        departure_date = date_el.get_text(strip=True) if date_el else ""

        # Generate stable ID
        cruise_id = hashlib.md5(f"{title}-{departure_date}-{cruise_line}".encode()).hexdigest()[:12]

        return {
            "id": f"cnet-{cruise_id}",
            "title": title,
            "titleRo": title,  # Original is in Romanian
            "cruiseLine": cruise_line,
            "ship": ship,
            "nights": nights or 7,
            "priceFrom": price or 0,
            "currency": "EUR",
            "departureDate": departure_date,
            "detailUrl": detail_url,
            "source": "croaziere.net",
            "scrapedAt": datetime.utcnow().isoformat() + "Z"
        }

    def scrape_detail_page(self, cruise):
        """Enrich cruise data from its detail page."""
        if not cruise.get("detailUrl"):
            return cruise

        soup = self.fetch_page(cruise["detailUrl"])
        if not soup:
            return cruise

        # Ports / Itinerary
        ports = []
        itinerary_rows = soup.select(".itinerary tr, .itinerariu tr, .port-list li")
        for row in itinerary_rows:
            cols = row.select("td")
            if len(cols) >= 2:
                port_name = cols[1].get_text(strip=True) if len(cols) > 1 else cols[0].get_text(strip=True)
                if port_name and port_name.lower() not in ["port", "zi", "day"]:
                    ports.append(port_name)

        if ports:
            cruise["ports"] = ports
            cruise["portsRo"] = ports

        # Cabin prices
        cabins = []
        cabin_rows = soup.select(".cabin-price tr, .pret-cabina tr, .price-table tr")
        for row in cabin_rows:
            cols = row.select("td")
            if len(cols) >= 2:
                cabin_type = cols[0].get_text(strip=True)
                price = self._extract_price(cols[1].get_text(strip=True))
                if cabin_type and price:
                    cabins.append({
                        "type": cabin_type,
                        "typeRo": cabin_type,
                        "priceFrom": price,
                        "currency": "EUR"
                    })

        if cabins:
            cruise["cabins"] = cabins

        # Destination / Region
        dest_el = soup.select_one(".destination, .destinatie, .cruise-region")
        if dest_el:
            cruise["destination"] = dest_el.get_text(strip=True)
            cruise["destinationRo"] = dest_el.get_text(strip=True)

        # Departure port
        port_el = soup.select_one(".embarkation, .port-plecare, .departure-port")
        if port_el:
            cruise["departurePort"] = port_el.get_text(strip=True)

        # Image
        img_el = soup.select_one(".cruise-image img, .hero-image img, .main-image img")
        if img_el and img_el.get("src"):
            img_src = img_el["src"]
            if not img_src.startswith("http"):
                img_src = BASE_URL + img_src
            cruise["image"] = img_src

        # What's included
        included = []
        incl_section = soup.select(".included li, .inclus li, .ce-include li")
        for item in incl_section:
            included.append(item.get_text(strip=True))
        if included:
            cruise["included"] = included
            cruise["includedRo"] = included

        return cruise

    def _extract_price(self, text):
        """Extract numeric price from text like '€599', '599 EUR', etc."""
        import re
        numbers = re.findall(r'[\d.,]+', text.replace('.', '').replace(',', '.'))
        for num in numbers:
            try:
                val = float(num)
                if 10 < val < 100000:  # Reasonable cruise price range
                    return int(val)
            except ValueError:
                continue
        return None

    def _extract_number(self, text):
        """Extract first number from text."""
        import re
        match = re.search(r'\d+', text)
        return int(match.group()) if match else None

    def run(self):
        """Main scraping workflow."""
        print(f"[{datetime.now()}] Starting Croaziere.Net scrape...")

        # Scrape main listing pages
        listing_urls = [
            f"{BASE_URL}/croaziere",
            f"{BASE_URL}/croaziere/mediterana",
            f"{BASE_URL}/croaziere/caraibe",
            f"{BASE_URL}/croaziere/europa-de-nord",
            f"{BASE_URL}/croaziere/fluviale",
        ]

        all_cruises = []
        for url in listing_urls:
            print(f"  Scraping: {url}")
            cruises = self.scrape_listing_page(url)
            all_cruises.extend(cruises)
            print(f"    Found {len(cruises)} cruises")

        # Deduplicate by ID
        seen = set()
        unique_cruises = []
        for c in all_cruises:
            if c["id"] not in seen:
                seen.add(c["id"])
                unique_cruises.append(c)

        print(f"  Total unique cruises: {len(unique_cruises)}")

        # Enrich with detail pages (limit to avoid overloading)
        for i, cruise in enumerate(unique_cruises[:MAX_PAGES]):
            print(f"  Enriching {i+1}/{min(len(unique_cruises), MAX_PAGES)}: {cruise['title'][:50]}...")
            cruise = self.scrape_detail_page(cruise)
            unique_cruises[i] = cruise

        self.cruises = unique_cruises
        return unique_cruises

    def save(self):
        """Save scraped data to JSON, merging with existing data."""
        # Create backup
        BACKUP_DIR.mkdir(parents=True, exist_ok=True)
        if OUTPUT_FILE.exists():
            backup_name = f"cruises_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            OUTPUT_FILE.rename(BACKUP_DIR / backup_name)
            print(f"  Backup created: {backup_name}")

            # Clean old backups (keep last 4 weeks)
            backups = sorted(BACKUP_DIR.glob("cruises_backup_*.json"))
            if len(backups) > 4:
                for old in backups[:-4]:
                    old.unlink()

        # Load existing data if available
        existing_data = {"cruises": [], "destinations": [], "cruiseLines": []}
        existing_backup = BACKUP_DIR / sorted(BACKUP_DIR.glob("cruises_backup_*.json"))[-1].name if list(BACKUP_DIR.glob("cruises_backup_*.json")) else None
        if existing_backup and existing_backup.exists():
            try:
                with open(existing_backup) as f:
                    existing_data = json.load(f)
            except json.JSONDecodeError:
                pass

        # Merge: keep existing cruises that weren't in new scrape, add new ones
        existing_ids = {c["id"] for c in existing_data.get("cruises", [])}
        new_ids = {c["id"] for c in self.cruises}

        # Keep manually added cruises (not from scraper)
        manual_cruises = [c for c in existing_data.get("cruises", [])
                         if not c.get("id", "").startswith("cnet-")]

        merged = manual_cruises + self.cruises

        # Build output
        output = {
            "lastUpdated": datetime.utcnow().isoformat() + "Z",
            "source": "Croaziere.Net Partner Feed + Manual Curation",
            "cruises": merged,
            "destinations": existing_data.get("destinations", []),
            "cruiseLines": list(set(
                existing_data.get("cruiseLines", []) +
                [c.get("cruiseLine", "") for c in self.cruises if c.get("cruiseLine")]
            ))
        }

        DATA_DIR.mkdir(parents=True, exist_ok=True)
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)

        print(f"  Saved {len(merged)} cruises to {OUTPUT_FILE}")

        if self.errors:
            print(f"\n  Warnings ({len(self.errors)}):")
            for err in self.errors[:10]:
                print(f"    - {err}")


def main():
    scraper = CroaziereNetScraper()

    try:
        scraper.run()
        scraper.save()
        print(f"\n[{datetime.now()}] Scrape completed successfully!")
    except Exception as e:
        print(f"\n[{datetime.now()}] Scrape failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
