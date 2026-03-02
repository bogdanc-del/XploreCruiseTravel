import fs from 'fs';
const cruises = JSON.parse(fs.readFileSync('public/data/cruises.json', 'utf8'));

const withDisembark = cruises.filter(c => c.disembarkation_port);
const withoutDisembark = cruises.filter(c => !c.disembarkation_port);

console.log('=== FINAL DATA STATS ===');
console.log(`Total cruises: ${cruises.length}`);
console.log(`With disembarkation_port: ${withDisembark.length}`);
console.log(`Without disembarkation_port: ${withoutDisembark.length}`);
console.log('');

// One-way vs round-trip
let roundTrip = 0, oneWay = 0;
for (const c of withDisembark) {
  const dep = (c.departure_port || '').trim().toLowerCase();
  const dis = (c.disembarkation_port || '').trim().toLowerCase();
  if (dep === dis) roundTrip++;
  else oneWay++;
}
console.log(`Round-trip (same port): ${roundTrip}`);
console.log(`One-way (different port): ${oneWay}`);
console.log('');

// Check for the duplicate departure/Day 1 issue
// Look at itinerary data - does day 1 = departure port?
let day1SameAsDeparture = 0;
let day1DiffFromDeparture = 0;
let day1And2Same = 0;

const samples = [];
for (const c of cruises) {
  if (!c.itinerary || c.itinerary.length < 2) continue;
  const it = c.itinerary;
  const dep = (c.departure_port || '').trim().toLowerCase();
  const day1Port = (it[0].port || '').trim().toLowerCase();
  const day2Port = (it[1].port || '').trim().toLowerCase();

  if (dep === day1Port) day1SameAsDeparture++;
  else day1DiffFromDeparture++;

  // Check if day 1 and day 2 are the same port
  if (day1Port === day2Port && day1Port.length > 0) {
    day1And2Same++;
    if (samples.length < 10) {
      samples.push({
        id: c.id,
        departure_port: c.departure_port,
        day1: `Day ${it[0].day}: ${it[0].port} (depart: ${it[0].departure || 'n/a'})`,
        day2: `Day ${it[1].day}: ${it[1].port} (arrive: ${it[1].arrival || 'n/a'}, depart: ${it[1].departure || 'n/a'})`,
        nights: c.nights,
      });
    }
  }
}

console.log('=== ITINERARY DAY 1 ANALYSIS ===');
console.log(`Day 1 port = departure_port: ${day1SameAsDeparture}`);
console.log(`Day 1 port != departure_port: ${day1DiffFromDeparture}`);
console.log(`Day 1 AND Day 2 are same port: ${day1And2Same}`);
console.log('');

if (samples.length > 0) {
  console.log('=== SAMPLES: Day 1 == Day 2 ===');
  samples.forEach((s, i) => {
    console.log(`${i+1}. [${s.id}] ${s.nights}n | departure: "${s.departure_port}"`);
    console.log(`   ${s.day1}`);
    console.log(`   ${s.day2}`);
    console.log('');
  });
}
