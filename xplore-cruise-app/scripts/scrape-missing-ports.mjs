/**
 * Scrapes itinerary data from croaziere.net for cruises missing itinerary.
 * Rate-limited to 2 requests/second to be respectful.
 * Saves progress every 100 cruises.
 *
 * Usage: node scripts/scrape-missing-ports.mjs [start_index] [batch_size]
 * Default: starts at 0, processes all
 */
import fs from 'fs';
import https from 'https';

const START = parseInt(process.argv[2] || '0', 10);
const BATCH = parseInt(process.argv[3] || '99999', 10);
const DELAY_MS = 500; // 2 requests/second

const cruises = JSON.parse(fs.readFileSync('public/data/cruises.json', 'utf8'));
const toScrape = JSON.parse(fs.readFileSync('scripts/cruises-to-scrape.json', 'utf8'));

console.log(`Cruises to scrape: ${toScrape.length}`);
console.log(`Starting at index: ${START}, batch size: ${BATCH}`);
console.log('');

// ---- HTTP fetch helper ----
function fetchPage(url, depth = 0) {
  if (depth > 5) return Promise.reject(new Error('Too many redirects'));
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ro-RO,ro;q=0.9,en;q=0.8',
      },
      timeout: 15000,
    }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchPage(res.headers.location, depth + 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => reject(new Error(`HTTP ${res.statusCode}`)));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// ---- SEA DAY check ----
function isSeaDay(portName) {
  const pl = (portName || '').toLowerCase();
  return pl.includes('pe mare') || pl.includes('cruising') ||
         pl.includes('at sea') || pl.includes('navigare') ||
         pl.includes('in navigatie') || pl.length === 0;
}

// ---- Parse itinerary from HTML ----
function parseItinerary(html) {
  const itinerary = [];
  const ports = [];
  let disembarkPort = null;

  // ============================================================
  // Method 1 (PRIMARY): Extract $_ports JSON embedded in the page
  // croaziere.net embeds itinerary as: const $_ports = [{...}];
  // ============================================================
  const jsonMatch = html.match(/\$_ports\s*=\s*(\[[\s\S]*?\]);/);
  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[1]);
      for (const entry of data) {
        const day = entry.day || 0;
        const port = (entry.title || '').trim();
        const arrival = entry.from_hour || null;
        const departure = entry.till_hour || null;

        if (port && day > 0) {
          itinerary.push({ day, port, arrival, departure });
          if (!isSeaDay(port)) {
            ports.push(port);
          }
        }
      }

      // Disembark = last non-sea port
      for (let j = itinerary.length - 1; j >= 0; j--) {
        if (!isSeaDay(itinerary[j].port)) {
          disembarkPort = itinerary[j].port;
          break;
        }
      }

      return { itinerary, ports, disembarkPort, method: 'json' };
    } catch (e) {
      // JSON parse failed, fall through to Method 2
    }
  }

  // ============================================================
  // Method 2 (FALLBACK): Parse HTML div-based itinerary
  // Structure: <p class="day">...</p> + <p class="port">...</p>
  // ============================================================
  const dayRegex = /<p\s+class="day">([\s\S]*?)<\/p>/gi;
  const portRegex = /<p\s+class="port">([\s\S]*?)<\/p>/gi;

  const dayMatches = [];
  const portMatches = [];
  let match;

  while ((match = dayRegex.exec(html)) !== null) {
    dayMatches.push(match[1].replace(/<[^>]+>/g, '').trim());
  }
  while ((match = portRegex.exec(html)) !== null) {
    // Clean HTML tags and get port name; may contain links
    const portText = match[1].replace(/<[^>]+>/g, '').trim();
    portMatches.push(portText);
  }

  if (portMatches.length > 0) {
    for (let i = 0; i < portMatches.length; i++) {
      const port = portMatches[i];
      const day = i < dayMatches.length ? parseInt(dayMatches[i], 10) || (i + 1) : (i + 1);
      itinerary.push({ day, port, arrival: null, departure: null });
      if (!isSeaDay(port)) {
        ports.push(port);
      }
    }

    for (let j = itinerary.length - 1; j >= 0; j--) {
      if (!isSeaDay(itinerary[j].port)) {
        disembarkPort = itinerary[j].port;
        break;
      }
    }

    return { itinerary, ports, disembarkPort, method: 'html' };
  }

  // ============================================================
  // Method 3 (LAST RESORT): Look for embark/disembark port text
  // ============================================================
  const embarkMatch = html.match(/[Pp]ort(?:ul)?\s*(?:de\s*)?[Ii]mbarcare[^:]*:\s*(?:<[^>]*>)*\s*([^<\n]+)/i);
  const disembarkMatch = html.match(/[Pp]ort(?:ul)?\s*(?:de\s*)?[Dd]ebarcare[^:]*:\s*(?:<[^>]*>)*\s*([^<\n]+)/i);

  if (disembarkMatch) {
    disembarkPort = disembarkMatch[1].trim();
  }

  return { itinerary, ports, disembarkPort, method: disembarkPort ? 'text' : 'none' };
}

// ---- Sleep helper ----
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ---- Validate port name (basic sanity check) ----
function isValidPort(name) {
  if (!name || name.length < 3 || name.length > 100) return false;
  // Must not contain obvious non-port text
  const lower = name.toLowerCase();
  if (lower.includes('piscin') || lower.includes('inclus') || lower.includes('cancelar') ||
      lower.includes('persoana') || lower.includes('taxe') || lower.includes('asigur') ||
      lower.includes('restaurant') || lower.includes('cabina') || lower.includes('bautur') ||
      name.includes('%') || name.includes('€') || name.includes('$')) {
    return false;
  }
  return true;
}

// ---- Main ----
async function main() {
  const end = Math.min(START + BATCH, toScrape.length);
  let enriched = 0;
  let failed = 0;
  let oneWayFound = 0;
  let methodStats = { json: 0, html: 0, text: 0, none: 0 };
  const failures = [];
  const oneWays = [];

  for (let i = START; i < end; i++) {
    const item = toScrape[i];
    const cruiseIdx = cruises.findIndex(c => c.id === item.id);
    if (cruiseIdx === -1) { failed++; failures.push({ id: item.id, url: item.url, reason: 'id_not_found' }); continue; }

    try {
      const html = await fetchPage(item.url);
      const result = parseItinerary(html);
      methodStats[result.method] = (methodStats[result.method] || 0) + 1;

      let disembark = result.disembarkPort;

      // Validate the extracted port name
      if (disembark && !isValidPort(disembark)) {
        failed++;
        failures.push({ id: item.id, url: item.url, reason: `invalid_port: ${disembark.substring(0, 50)}` });
        continue;
      }

      if (disembark) {
        cruises[cruiseIdx].disembarkation_port = disembark;

        // Also save itinerary + ports_of_call if we got them
        if (result.itinerary.length > 0) {
          cruises[cruiseIdx].itinerary = result.itinerary;
        }
        if (result.ports.length > 0) {
          cruises[cruiseIdx].ports_of_call = result.ports;
        }

        enriched++;

        // Check if one-way
        const departPort = cruises[cruiseIdx].departure_port || '';
        if (departPort.trim().toLowerCase() !== disembark.trim().toLowerCase()) {
          oneWayFound++;
          oneWays.push({
            id: item.id,
            departure: departPort,
            disembark,
            nights: item.nights,
            line: item.line,
          });
        }
      } else {
        failed++;
        failures.push({ id: item.id, url: item.url, reason: 'no_port_found' });
      }

      if ((i - START + 1) % 10 === 0) {
        process.stdout.write(`  [${i - START + 1}/${end - START}] enriched=${enriched} oneWay=${oneWayFound} failed=${failed}\r`);
      }

      // Save progress every 100 items
      if ((i - START + 1) % 100 === 0) {
        fs.writeFileSync('public/data/cruises.json', JSON.stringify(cruises, null, 0));
        console.log(`\n  [SAVE] Progress saved at index ${i}`);
      }

    } catch (err) {
      failed++;
      failures.push({ id: item.id, url: item.url, reason: err.message });
    }

    await sleep(DELAY_MS);
  }

  // Final save
  fs.writeFileSync('public/data/cruises.json', JSON.stringify(cruises, null, 0));

  console.log('');
  console.log('=== SCRAPING COMPLETE ===');
  console.log(`Processed: ${end - START}`);
  console.log(`Enriched: ${enriched}`);
  console.log(`One-way found: ${oneWayFound}`);
  console.log(`Failed: ${failed}`);
  console.log(`Methods used: json=${methodStats.json} html=${methodStats.html} text=${methodStats.text} none=${methodStats.none}`);

  if (oneWays.length > 0) {
    console.log('');
    console.log('=== ONE-WAY CRUISES FOUND ===');
    oneWays.slice(0, 50).forEach((ow, i) => {
      console.log(`${i + 1}. [${ow.id}] ${ow.departure} → ${ow.disembark} (${ow.nights}n, ${ow.line})`);
    });
    if (oneWays.length > 50) {
      console.log(`  ... and ${oneWays.length - 50} more`);
    }
  }

  if (failures.length > 0) {
    fs.writeFileSync('scripts/scrape-failures.json', JSON.stringify(failures, null, 2));
    console.log(`\nFailures saved to scripts/scrape-failures.json`);
  }

  fs.writeFileSync('scripts/scraped-one-ways.json', JSON.stringify(oneWays, null, 2));
}

main().catch(console.error);
