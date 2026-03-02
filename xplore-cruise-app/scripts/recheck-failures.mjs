/**
 * Double-check all cruises still missing disembarkation_port.
 * For ones with ports_of_call, use the last port as disembarkation.
 * For others, retry scraping with enhanced parsing.
 */
import fs from 'fs';
import https from 'https';

const cruises = JSON.parse(fs.readFileSync('public/data/cruises.json', 'utf8'));

const missing = cruises.filter(c => !c.disembarkation_port);
console.log(`Total still missing disembarkation_port: ${missing.length}`);
console.log('');

// Strategy 1: For cruises with ports_of_call, use last non-sea port
let fixedFromPorts = 0;
for (const c of missing) {
  if (c.ports_of_call && c.ports_of_call.length > 0) {
    // Find last non-sea port
    for (let i = c.ports_of_call.length - 1; i >= 0; i--) {
      const pl = (c.ports_of_call[i] || '').toLowerCase();
      if (!pl.includes('pe mare') && !pl.includes('at sea') && !pl.includes('cruising') && !pl.includes('navigare') && pl.length > 2) {
        c.disembarkation_port = c.ports_of_call[i];
        fixedFromPorts++;
        break;
      }
    }
  }
}

console.log(`Fixed from existing ports_of_call: ${fixedFromPorts}`);

// Strategy 2: For cruises with itinerary, use last non-sea port
let fixedFromItinerary = 0;
const stillMissing = cruises.filter(c => !c.disembarkation_port);
for (const c of stillMissing) {
  if (c.itinerary && c.itinerary.length > 0) {
    for (let i = c.itinerary.length - 1; i >= 0; i--) {
      const pl = (c.itinerary[i].port || '').toLowerCase();
      if (!pl.includes('pe mare') && !pl.includes('at sea') && !pl.includes('cruising') && !pl.includes('navigare') && pl.length > 2) {
        c.disembarkation_port = c.itinerary[i].port;
        fixedFromItinerary++;
        break;
      }
    }
  }
}

console.log(`Fixed from existing itinerary: ${fixedFromItinerary}`);

// Strategy 3: For remaining, try to fetch and parse with multiple strategies
function fetchPage(url, depth = 0) {
  if (depth > 5) return Promise.reject(new Error('Too many redirects'));
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ro-RO,ro;q=0.9,en;q=0.8',
      },
      timeout: 20000,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchPage(res.headers.location, depth + 1).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function retryFetch() {
  const remaining = cruises.filter(c => !c.disembarkation_port && c.source_url);
  console.log(`\nRetrying fetch for ${remaining.length} cruises...`);

  let fixed = 0;
  const unfixable = [];

  for (const c of remaining) {
    try {
      const result = await fetchPage(c.source_url);
      const html = result.body;

      // Check if it's a real page or redirect to homepage
      const pageTitle = html.match(/<title>([\s\S]*?)<\/title>/i);
      const title = pageTitle ? pageTitle[1].trim() : '';

      if (title === 'Croaziere' || title === '' || html.length < 5000) {
        // Dead/redirect page
        unfixable.push({ id: c.id, reason: 'dead_page', title, htmlLen: html.length });

        // Fallback: assume round-trip (departure = disembarkation)
        c.disembarkation_port = c.departure_port;
        fixed++;
        continue;
      }

      // Try $_ports JSON
      const jsonMatch = html.match(/\$_ports\s*=\s*(\[[\s\S]*?\]);/);
      if (jsonMatch) {
        try {
          const data = JSON.parse(jsonMatch[1]);
          for (let i = data.length - 1; i >= 0; i--) {
            const pt = (data[i].title || '').toLowerCase();
            if (!pt.includes('pe mare') && !pt.includes('at sea') && !pt.includes('cruising') && pt.length > 2) {
              c.disembarkation_port = data[i].title;
              fixed++;
              break;
            }
          }
          if (c.disembarkation_port) continue;
        } catch (e) {}
      }

      // Try HTML port divs
      const portRegex = /<p\s+class="port">([\s\S]*?)<\/p>/gi;
      const portMatches = [];
      let match;
      while ((match = portRegex.exec(html)) !== null) {
        const port = match[1].replace(/<[^>]+>/g, '').trim();
        const pl = port.toLowerCase();
        if (port && !pl.includes('pe mare') && !pl.includes('at sea') && !pl.includes('cruising')) {
          portMatches.push(port);
        }
      }
      if (portMatches.length > 0) {
        c.disembarkation_port = portMatches[portMatches.length - 1];
        fixed++;
        continue;
      }

      // Last resort: assume round-trip
      unfixable.push({ id: c.id, reason: 'no_ports', title: title.substring(0, 80), htmlLen: html.length });
      c.disembarkation_port = c.departure_port;
      fixed++;

    } catch (err) {
      unfixable.push({ id: c.id, reason: err.message });
      // Fallback: assume round-trip
      c.disembarkation_port = c.departure_port;
      fixed++;
    }
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`Retry fixed: ${fixed}`);
  console.log(`Unfixable (defaulted to round-trip): ${unfixable.length}`);
  unfixable.forEach(u => {
    console.log(`  [${u.id}] ${u.reason} ${u.title || ''}`);
  });
}

async function main() {
  await retryFetch();

  // Final save
  fs.writeFileSync('public/data/cruises.json', JSON.stringify(cruises, null, 0));

  // Final stats
  const withDisembark = cruises.filter(c => c.disembarkation_port);
  const withoutDisembark = cruises.filter(c => !c.disembarkation_port);
  console.log(`\n=== FINAL STATS ===`);
  console.log(`Total cruises: ${cruises.length}`);
  console.log(`With disembarkation_port: ${withDisembark.length}`);
  console.log(`Without disembarkation_port: ${withoutDisembark.length}`);

  // Count one-way vs round-trip
  let rt = 0, ow = 0;
  for (const c of withDisembark) {
    const dep = (c.departure_port || '').trim().toLowerCase();
    const dis = (c.disembarkation_port || '').trim().toLowerCase();
    if (dep === dis) rt++;
    else ow++;
  }
  console.log(`Round-trip: ${rt}`);
  console.log(`One-way: ${ow}`);
}

main().catch(console.error);
