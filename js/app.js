// ============================================
// XploreCruiseTravel - Main Application
// ============================================

let cruiseData = null;

// --- Data Loading ---
async function loadCruiseData() {
  try {
    const resp = await fetch('/data/cruises.json');
    cruiseData = await resp.json();
    return cruiseData;
  } catch (e) {
    console.error('Failed to load cruise data:', e);
    return null;
  }
}

// --- Header Scroll Effect ---
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', window.scrollY > 50);
  });

  // Mobile menu toggle
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav__links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      toggle.classList.toggle('active');
    });
  }
}

// --- Cookie Banner ---
function initCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  if (!banner) return;

  const consent = localStorage.getItem('xct_cookie_consent');
  if (!consent) {
    banner.classList.add('show');
  }

  document.getElementById('cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem('xct_cookie_consent', 'accepted');
    banner.classList.remove('show');
  });

  document.getElementById('cookie-decline')?.addEventListener('click', () => {
    localStorage.setItem('xct_cookie_consent', 'declined');
    banner.classList.remove('show');
  });
}

// --- Scroll Animations ---
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// --- Cruise Card Rendering ---
function renderCruiseCard(cruise) {
  const lang = currentLang;
  const title = lang === 'ro' ? cruise.titleRo : cruise.title;
  const dest = lang === 'ro' ? cruise.destinationRo : cruise.destination;
  const ports = lang === 'ro' ? cruise.portsRo : cruise.ports;

  return `
    <div class="cruise-card fade-in" onclick="window.location.href='pages/detail.html?id=${cruise.id}'">
      <div class="cruise-card__img">
        <img src="${cruise.image}" alt="${title}" loading="lazy">
        ${cruise.tags.includes('popular') ? `<span class="cruise-card__badge">Popular</span>` : ''}
        ${cruise.tags.includes('luxury') ? `<span class="cruise-card__badge" style="background:#1a2d4d;color:#c9a84c">Luxury</span>` : ''}
        <span class="cruise-card__line">${cruise.cruiseLine}</span>
      </div>
      <div class="cruise-card__body">
        <span class="cruise-card__dest">${dest}</span>
        <h3 class="cruise-card__title">${title}</h3>
        <div class="cruise-card__meta">
          <span>🚢 ${cruise.ship}</span>
          <span>🌙 ${cruise.nights} ${t('card_nights')}</span>
          <span>📍 ${cruise.departurePort}</span>
        </div>
        <p class="cruise-card__ports">${t('card_ports')}: ${ports.slice(0, 4).join(' → ')}${ports.length > 4 ? '...' : ''}</p>
        <div class="cruise-card__footer">
          <div class="cruise-card__price">
            <span class="cruise-card__price-label">${t('card_from')}</span>
            <span class="cruise-card__price-value">€${cruise.priceFrom.toLocaleString()} <small>${t('card_per_person')}</small></span>
          </div>
          <a href="pages/detail.html?id=${cruise.id}" class="btn btn--primary btn--sm">${t('card_view')}</a>
        </div>
      </div>
    </div>
  `;
}

// --- Destination Card Rendering ---
function renderDestCard(dest) {
  const name = currentLang === 'ro' ? dest.nameRo : dest.name;
  return `
    <div class="dest-card fade-in" onclick="window.location.href='pages/listing.html?dest=${dest.id}'">
      <div class="dest-card__bg" style="background-image:url('${dest.image}')"></div>
      <div class="dest-card__overlay"></div>
      <div class="dest-card__content">
        <h3 class="dest-card__title">${name}</h3>
        <span class="dest-card__count">${dest.count} ${t('listing_cruises')}</span>
      </div>
    </div>
  `;
}

// --- Homepage Init ---
async function initHomepage() {
  const data = await loadCruiseData();
  if (!data) return;

  // Render featured cruises
  const featuredGrid = document.getElementById('featured-cruises');
  if (featuredGrid) {
    featuredGrid.innerHTML = data.cruises
      .filter(c => c.tags.includes('popular') || c.tags.includes('luxury'))
      .slice(0, 6)
      .map(renderCruiseCard)
      .join('');
  }

  // Render destinations
  const destGrid = document.getElementById('destinations-grid');
  if (destGrid) {
    destGrid.innerHTML = data.destinations
      .map(renderDestCard)
      .join('');
  }

  // Populate search dropdowns
  populateSearchDropdowns(data);

  initScrollAnimations();
}

// --- Search Dropdowns ---
function populateSearchDropdowns(data) {
  const destSelect = document.getElementById('search-destination');
  const lineSelect = document.getElementById('search-cruise-line');

  if (destSelect) {
    data.destinations.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = currentLang === 'ro' ? d.nameRo : d.name;
      destSelect.appendChild(opt);
    });
  }

  if (lineSelect) {
    data.cruiseLines.forEach(line => {
      const opt = document.createElement('option');
      opt.value = line;
      opt.textContent = line;
      lineSelect.appendChild(opt);
    });
  }
}

// --- Listing Page ---
async function initListingPage() {
  const data = await loadCruiseData();
  if (!data) return;

  const params = new URLSearchParams(window.location.search);
  let filtered = [...data.cruises];

  // Apply URL filters
  const destFilter = params.get('dest');
  const lineFilter = params.get('line');
  const nightsFilter = params.get('nights');
  const monthFilter = params.get('month');

  if (destFilter) {
    filtered = filtered.filter(c =>
      c.destination.toLowerCase().replace(/\s+/g, '-') === destFilter ||
      c.region.toLowerCase().replace(/\s+/g, '-') === destFilter ||
      c.cruiseType === destFilter
    );
  }
  if (lineFilter) {
    filtered = filtered.filter(c => c.cruiseLine === lineFilter);
  }

  // Populate filters
  populateListingFilters(data);

  // Render
  renderListingResults(filtered);
  initScrollAnimations();

  // Filter events
  document.querySelectorAll('.filters-bar select').forEach(select => {
    select.addEventListener('change', () => applyListingFilters(data));
  });

  document.getElementById('sort-select')?.addEventListener('change', () => applyListingFilters(data));
}

function populateListingFilters(data) {
  const destSelect = document.getElementById('filter-destination');
  const lineSelect = document.getElementById('filter-cruise-line');

  if (destSelect) {
    data.destinations.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = currentLang === 'ro' ? d.nameRo : d.name;
      destSelect.appendChild(opt);
    });
  }

  if (lineSelect) {
    data.cruiseLines.forEach(line => {
      const opt = document.createElement('option');
      opt.value = line;
      opt.textContent = line;
      lineSelect.appendChild(opt);
    });
  }
}

function applyListingFilters(data) {
  let filtered = [...data.cruises];

  const dest = document.getElementById('filter-destination')?.value;
  const line = document.getElementById('filter-cruise-line')?.value;
  const nights = document.getElementById('filter-nights')?.value;
  const type = document.getElementById('filter-type')?.value;
  const sort = document.getElementById('sort-select')?.value;

  if (dest) {
    filtered = filtered.filter(c =>
      c.destination.toLowerCase().replace(/\s+/g, '-') === dest ||
      c.cruiseType === dest
    );
  }
  if (line) filtered = filtered.filter(c => c.cruiseLine === line);
  if (nights) {
    const [min, max] = nights.split('-').map(Number);
    filtered = filtered.filter(c => c.nights >= min && (max ? c.nights <= max : true));
  }
  if (type) filtered = filtered.filter(c => c.cruiseType === type);

  // Sort
  if (sort === 'price-asc') filtered.sort((a, b) => a.priceFrom - b.priceFrom);
  if (sort === 'price-desc') filtered.sort((a, b) => b.priceFrom - a.priceFrom);
  if (sort === 'nights') filtered.sort((a, b) => a.nights - b.nights);
  if (sort === 'date') filtered.sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate));

  renderListingResults(filtered);
  initScrollAnimations();
}

function renderListingResults(cruises) {
  const grid = document.getElementById('listing-grid');
  const count = document.getElementById('listing-count');

  if (count) count.textContent = `${cruises.length} ${t('listing_results')}`;

  if (grid) {
    if (cruises.length === 0) {
      grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--gray-400)">${t('listing_no_results')}</p>`;
    } else {
      grid.innerHTML = cruises.map(renderCruiseCard).join('');
    }
  }
}

// --- Detail Page ---
async function initDetailPage() {
  const data = await loadCruiseData();
  if (!data) return;

  const params = new URLSearchParams(window.location.search);
  const cruiseId = params.get('id');
  const cruise = data.cruises.find(c => c.id === cruiseId);

  if (!cruise) {
    document.getElementById('detail-main').innerHTML = '<p>Cruise not found.</p>';
    return;
  }

  const lang = currentLang;
  const title = lang === 'ro' ? cruise.titleRo : cruise.title;
  const ports = lang === 'ro' ? cruise.portsRo : cruise.ports;
  const included = lang === 'ro' ? cruise.includedRo : cruise.included;
  const excluded = lang === 'ro' ? cruise.excludedRo : cruise.excluded;
  const advisorNote = lang === 'ro' ? cruise.advisorNoteRo : cruise.advisorNote;

  // Hero
  document.getElementById('detail-title').textContent = title;
  document.getElementById('detail-ship').textContent = cruise.ship;
  document.getElementById('detail-line').textContent = cruise.cruiseLine;
  document.getElementById('detail-nights').textContent = `${cruise.nights} ${t('card_nights')}`;
  document.getElementById('detail-departure').textContent = cruise.departurePort;
  document.getElementById('detail-date').textContent = new Date(cruise.departureDate).toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Itinerary
  const itineraryBody = document.getElementById('itinerary-body');
  if (itineraryBody) {
    itineraryBody.innerHTML = cruise.itinerary.map(day => `
      <tr>
        <td><strong>${t('detail_day')} ${day.day}</strong></td>
        <td>${day.port}</td>
        <td>${day.arrival || '—'}</td>
        <td>${day.departure || '—'}</td>
      </tr>
    `).join('');
  }

  // Cabins
  const cabinBody = document.getElementById('cabin-body');
  if (cabinBody) {
    cabinBody.innerHTML = cruise.cabins.map(cab => `
      <tr>
        <td>${lang === 'ro' ? cab.typeRo : cab.type}</td>
        <td class="price">€${cab.priceFrom.toLocaleString()}</td>
        <td><a href="pages/contact.html?cruise=${cruise.id}" class="btn btn--primary btn--sm">${t('detail_request_price')}</a></td>
      </tr>
    `).join('');
  }

  // Included/Excluded
  const inclList = document.getElementById('included-list');
  const exclList = document.getElementById('excluded-list');
  if (inclList) inclList.innerHTML = included.map(i => `<li>✓ ${i}</li>`).join('');
  if (exclList) exclList.innerHTML = excluded.map(i => `<li>✗ ${i}</li>`).join('');

  // Advisor note
  const noteEl = document.getElementById('advisor-note');
  if (noteEl) noteEl.textContent = advisorNote;

  // Sidebar price
  const sidePrice = document.getElementById('sidebar-price');
  if (sidePrice) sidePrice.textContent = `€${cruise.priceFrom.toLocaleString()}`;

  // Image
  const heroImg = document.getElementById('detail-hero-img');
  if (heroImg) heroImg.style.backgroundImage = `url(${cruise.image})`;
}

// --- Search Form ---
function handleSearch(e) {
  e.preventDefault();
  const dest = document.getElementById('search-destination')?.value || '';
  const month = document.getElementById('search-month')?.value || '';
  const nights = document.getElementById('search-nights')?.value || '';
  const line = document.getElementById('search-cruise-line')?.value || '';

  const params = new URLSearchParams();
  if (dest) params.set('dest', dest);
  if (month) params.set('month', month);
  if (nights) params.set('nights', nights);
  if (line) params.set('line', line);

  window.location.href = `pages/listing.html?${params.toString()}`;
}

// --- Contact Form ---
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // In production, this would send to your backend
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validate
    if (!data.name || !data.email) {
      alert(currentLang === 'ro' ? 'Completeaza toate campurile obligatorii.' : 'Please fill in all required fields.');
      return;
    }

    // Simulate submission
    alert(currentLang === 'ro'
      ? 'Mesajul tau a fost trimis! Te vom contacta in cel mai scurt timp.'
      : 'Your message has been sent! We will contact you shortly.');
    form.reset();
  });
}

// --- Newsletter Form ---
function initNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]')?.value;
      if (!email) return;

      alert(currentLang === 'ro'
        ? 'Te-ai abonat cu succes!'
        : 'Successfully subscribed!');
      form.reset();
    });
  });
}

// --- Language Change Handler ---
document.addEventListener('langChanged', () => {
  // Re-render dynamic content
  const page = document.body.dataset.page;
  if (page === 'home') initHomepage();
  if (page === 'listing') initListingPage();
  if (page === 'detail') initDetailPage();
});

// --- Global Init ---
document.addEventListener('DOMContentLoaded', () => {
  setLang(currentLang);
  initHeader();
  initCookieBanner();
  initNewsletter();
  initContactForm();

  const page = document.body.dataset.page;
  if (page === 'home') initHomepage();
  if (page === 'listing') initListingPage();
  if (page === 'detail') initDetailPage();
});
