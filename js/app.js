// ============================================
// XploreCruiseTravel - Main Application
// ============================================

// --- Config ---
const EUR_TO_RON = 4.97;
const EMAILJS_SERVICE_ID = 'service_xplore';
const EMAILJS_TEMPLATE_BOOKING = 'template_booking';
const EMAILJS_TEMPLATE_CONTACT = 'template_contact';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your EmailJS public key

let cruiseData = null;

// --- Data Loading ---
async function loadCruiseData() {
  try {
    const resp = await fetch('/data/cruises.json');
    if (!resp.ok) throw new Error('Not found');
    cruiseData = await resp.json();
    return cruiseData;
  } catch (e) {
    try {
      const resp = await fetch('../data/cruises.json');
      if (!resp.ok) throw new Error('Not found');
      cruiseData = await resp.json();
      return cruiseData;
    } catch (e2) {
      console.error('Failed to load cruise data:', e2);
      return null;
    }
  }
}

// --- Price Formatting with RON ---
function formatPrice(eurPrice) {
  const eurStr = `€${eurPrice.toLocaleString()}`;
  if (currentLang === 'ro') {
    const ronPrice = Math.round(eurPrice * EUR_TO_RON);
    return `${eurStr} <span class="price-ron">(~${ronPrice.toLocaleString()} Lei)</span>`;
  }
  return eurStr;
}

function formatPriceText(eurPrice) {
  const eurStr = `€${eurPrice.toLocaleString()}`;
  if (currentLang === 'ro') {
    const ronPrice = Math.round(eurPrice * EUR_TO_RON);
    return `${eurStr} (~${ronPrice.toLocaleString()} Lei)`;
  }
  return eurStr;
}

// --- Header Scroll Effect ---
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', window.scrollY > 50);
  });

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

// --- Scroll Animations (FIXED with fallback) ---
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in, .reveal');
  if (elements.length === 0) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    elements.forEach(el => observer.observe(el));
  }

  // Fallback: ensure visibility after delay
  setTimeout(() => {
    elements.forEach(el => {
      if (!el.classList.contains('visible')) {
        el.classList.add('visible');
      }
    });
  }, 2000);
}

// --- Counter Animation ---
function animateCounter(el, start, end, duration) {
  const suffix = el.dataset.suffix || '';
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(easedProgress * (end - start) + start);
    el.textContent = value.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        animateCounter(el, 0, target, 2000);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));

  // Fallback
  setTimeout(() => {
    counters.forEach(el => {
      if (el.textContent === '0' || el.textContent === '') {
        el.textContent = el.dataset.target + (el.dataset.suffix || '');
      }
    });
  }, 4000);
}

// --- Parallax Effect ---
function initParallax() {
  const hero = document.querySelector('.hero__bg');
  if (!hero) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
          hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

// --- Cruise Card Rendering ---
function renderCruiseCard(cruise, index = 0) {
  const lang = currentLang;
  const title = lang === 'ro' ? cruise.titleRo : cruise.title;
  const dest = lang === 'ro' ? cruise.destinationRo : cruise.destination;
  const ports = lang === 'ro' ? cruise.portsRo : cruise.ports;
  const stagger = `stagger-${(index % 6) + 1}`;
  const isHomePage = document.body.dataset.page === 'home';
  const detailUrl = isHomePage ? `pages/detail.html?id=${cruise.id}` : `detail.html?id=${cruise.id}`;

  return `
    <div class="cruise-card fade-in ${stagger}">
      <div class="cruise-card__img" onclick="window.location.href='${detailUrl}'">
        <img src="${cruise.image}" alt="${title}" loading="lazy">
        ${cruise.tags.includes('popular') ? `<span class="cruise-card__badge">Popular</span>` : ''}
        ${cruise.tags.includes('luxury') ? `<span class="cruise-card__badge" style="background:#1a2d4d;color:#c9a84c">Luxury</span>` : ''}
        <span class="cruise-card__line">${cruise.cruiseLine}</span>
      </div>
      <div class="cruise-card__body">
        <span class="cruise-card__dest">${dest}</span>
        <h3 class="cruise-card__title"><a href="${detailUrl}" style="color:inherit;text-decoration:none">${title}</a></h3>
        <div class="cruise-card__meta">
          <span>🚢 ${cruise.ship}</span>
          <span>🌙 ${cruise.nights} ${t('card_nights')}</span>
          <span>📍 ${cruise.departurePort}</span>
        </div>
        <p class="cruise-card__ports">${t('card_ports')}: ${ports.slice(0, 4).join(' → ')}${ports.length > 4 ? '...' : ''}</p>
        <div class="cruise-card__footer">
          <div class="cruise-card__price">
            <span class="cruise-card__price-label">${t('card_from')}</span>
            <span class="cruise-card__price-value">${formatPrice(cruise.priceFrom)} <small>${t('card_per_person')}</small></span>
          </div>
          <button onclick="openBookingModal('${cruise.id}')" class="btn btn--primary btn--sm">${t('booking_btn')}</button>
        </div>
      </div>
    </div>
  `;
}

// --- Destination Card Rendering ---
function renderDestCard(dest, index = 0) {
  const name = currentLang === 'ro' ? dest.nameRo : dest.name;
  const stagger = `stagger-${(index % 6) + 1}`;
  const isHomePage = document.body.dataset.page === 'home';
  const listingUrl = isHomePage ? `pages/listing.html?dest=${dest.id}` : `listing.html?dest=${dest.id}`;

  return `
    <div class="dest-card fade-in ${stagger}" onclick="window.location.href='${listingUrl}'">
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

  const featuredGrid = document.getElementById('featured-cruises');
  if (featuredGrid) {
    featuredGrid.innerHTML = data.cruises
      .filter(c => c.tags.includes('popular') || c.tags.includes('luxury'))
      .slice(0, 6)
      .map((c, i) => renderCruiseCard(c, i))
      .join('');
  }

  const destGrid = document.getElementById('destinations-grid');
  if (destGrid) {
    destGrid.innerHTML = data.destinations
      .map((d, i) => renderDestCard(d, i))
      .join('');
  }

  populateSearchDropdowns(data);
  initScrollAnimations();
  initCounters();
  initParallax();
}

// --- Search Dropdowns ---
function populateSearchDropdowns(data) {
  const destSelect = document.getElementById('search-destination');
  const lineSelect = document.getElementById('search-cruise-line');

  if (destSelect && destSelect.options.length <= 1) {
    data.destinations.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = currentLang === 'ro' ? d.nameRo : d.name;
      destSelect.appendChild(opt);
    });
  }

  if (lineSelect && lineSelect.options.length <= 1) {
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

  const destFilter = params.get('dest');
  const lineFilter = params.get('line');

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

  populateListingFilters(data);
  renderListingResults(filtered);
  initScrollAnimations();

  document.querySelectorAll('.filters-bar select').forEach(select => {
    select.addEventListener('change', () => applyListingFilters(data));
  });
  document.getElementById('sort-select')?.addEventListener('change', () => applyListingFilters(data));
}

function populateListingFilters(data) {
  const destSelect = document.getElementById('filter-destination');
  const lineSelect = document.getElementById('filter-cruise-line');

  if (destSelect && destSelect.options.length <= 1) {
    data.destinations.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = currentLang === 'ro' ? d.nameRo : d.name;
      destSelect.appendChild(opt);
    });
  }

  if (lineSelect && lineSelect.options.length <= 1) {
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
      grid.innerHTML = cruises.map((c, i) => renderCruiseCard(c, i)).join('');
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
  const titleEls = document.querySelectorAll('#detail-title');
  titleEls.forEach(el => el.textContent = title);
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

  // Cabins with RON
  const cabinBody = document.getElementById('cabin-body');
  if (cabinBody) {
    cabinBody.innerHTML = cruise.cabins.map(cab => `
      <tr>
        <td>${lang === 'ro' ? cab.typeRo : cab.type}</td>
        <td class="price">${formatPrice(cab.priceFrom)}</td>
        <td><button onclick="openBookingModal('${cruise.id}')" class="btn btn--primary btn--sm">${t('detail_request_price')}</button></td>
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

  // Sidebar price with RON
  const sidePrice = document.getElementById('sidebar-price');
  if (sidePrice) sidePrice.innerHTML = formatPrice(cruise.priceFrom);

  // Image
  const heroImg = document.getElementById('detail-hero-img');
  if (heroImg) heroImg.style.backgroundImage = `url(${cruise.image})`;

  // Update sidebar booking button
  const sideBookBtn = document.querySelector('.detail-sidebar .btn--primary');
  if (sideBookBtn) {
    sideBookBtn.setAttribute('onclick', `openBookingModal('${cruise.id}')`);
    sideBookBtn.removeAttribute('href');
    sideBookBtn.style.cursor = 'pointer';
  }
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

// =============================================
// BOOKING MODAL SYSTEM
// =============================================

let currentBookingStep = 1;
let selectedCruiseForBooking = null;

function getPrivacyUrl() {
  const isHomePage = document.body.dataset.page === 'home';
  return isHomePage ? 'pages/privacy.html' : 'privacy.html';
}

function getTermsUrl() {
  const isHomePage = document.body.dataset.page === 'home';
  return isHomePage ? 'pages/terms.html' : 'terms.html';
}

function createBookingModal() {
  if (document.getElementById('booking-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'booking-overlay';
  overlay.className = 'booking-overlay';
  overlay.innerHTML = `
    <div class="booking-modal">
      <div class="booking-modal__header">
        <h3>${t('booking_title')}</h3>
        <button class="booking-modal__close" onclick="closeBookingModal()">&times;</button>
      </div>
      <div class="booking-modal__body">
        <div class="booking-steps">
          <span class="booking-step-dot active" id="step-dot-1">1</span>
          <span class="booking-step-line" id="step-line-1"></span>
          <span class="booking-step-dot" id="step-dot-2">2</span>
          <span class="booking-step-line" id="step-line-2"></span>
          <span class="booking-step-dot" id="step-dot-3">3</span>
        </div>

        <!-- Step 1: Personal Info -->
        <div class="booking-step active" id="booking-step-1">
          <h4 style="margin-bottom:var(--space-lg)">${t('booking_step1_title')}</h4>
          <div class="booking-form-grid">
            <div class="form-group">
              <label>${t('booking_firstname')}</label>
              <input type="text" id="book-firstname" required>
            </div>
            <div class="form-group">
              <label>${t('booking_lastname')}</label>
              <input type="text" id="book-lastname" required>
            </div>
            <div class="form-group">
              <label>${t('booking_dob')}</label>
              <input type="date" id="book-dob" required>
            </div>
            <div class="form-group">
              <label>${t('booking_phone')}</label>
              <input type="tel" id="book-phone" required>
            </div>
            <div class="form-group full-width">
              <label>${t('booking_email')}</label>
              <input type="email" id="book-email" required>
            </div>
          </div>
        </div>

        <!-- Step 2: Cruise Preferences -->
        <div class="booking-step" id="booking-step-2">
          <h4 style="margin-bottom:var(--space-lg)">${t('booking_step2_title')}</h4>
          <div class="booking-form-grid">
            <div class="form-group full-width">
              <label>${t('booking_cruise_select')}</label>
              <select id="book-cruise"></select>
            </div>
            <div class="form-group">
              <label>${t('booking_cabin_pref')}</label>
              <select id="book-cabin">
                <option value="interior">${currentLang === 'ro' ? 'Cabina Interioara' : 'Interior'}</option>
                <option value="oceanview">${currentLang === 'ro' ? 'Vedere la Mare' : 'Ocean View'}</option>
                <option value="balcony">${currentLang === 'ro' ? 'Balcon' : 'Balcony'}</option>
                <option value="suite">${currentLang === 'ro' ? 'Suita' : 'Suite'}</option>
              </select>
            </div>
            <div class="form-group">
              <label>${t('booking_passengers')}</label>
              <select id="book-passengers">
                <option value="1">1</option>
                <option value="2" selected>2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6+</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label>${t('booking_special_requests')}</label>
              <textarea id="book-requests" rows="3" placeholder="${t('booking_requests_placeholder')}"></textarea>
            </div>
          </div>
        </div>

        <!-- Step 3: Review & GDPR Consent -->
        <div class="booking-step" id="booking-step-3">
          <h4 style="margin-bottom:var(--space-lg)">${t('booking_step3_title')}</h4>
          <dl class="booking-summary" id="booking-summary"></dl>
          <div class="gdpr-consent">
            <label>
              <input type="checkbox" id="book-gdpr" required>
              <span>${t('booking_gdpr_consent')}</span>
            </label>
          </div>
          <div class="gdpr-consent" style="margin-top:var(--space-sm)">
            <label>
              <input type="checkbox" id="book-terms" required>
              <span>${t('booking_terms_agree')} <a href="${getTermsUrl()}" target="_blank" style="color:var(--accent)">${t('footer_terms')}</a> & <a href="${getPrivacyUrl()}" target="_blank" style="color:var(--accent)">${t('footer_privacy')}</a>.</span>
            </label>
          </div>
          <div class="gdpr-consent" style="margin-top:var(--space-sm)">
            <label>
              <input type="checkbox" id="book-marketing">
              <span>${t('booking_marketing_consent')}</span>
            </label>
          </div>
        </div>

        <!-- Success -->
        <div class="booking-step" id="booking-step-success" style="display:none">
          <div class="booking-success">
            <div class="booking-success__icon">✓</div>
            <h3>${t('booking_success_title')}</h3>
            <p style="color:var(--gray-400);margin-top:var(--space-md)">${t('booking_success_msg')}</p>
          </div>
        </div>
      </div>
      <div class="booking-modal__footer" id="booking-footer">
        <button class="btn btn--outline" id="booking-prev" onclick="prevBookingStep()" style="display:none">${t('booking_prev')}</button>
        <div style="flex:1"></div>
        <button class="btn btn--primary" id="booking-next" onclick="nextBookingStep()">${t('booking_next')}</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeBookingModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBookingModal();
  });
}

function openBookingModal(cruiseId = null) {
  createBookingModal();
  selectedCruiseForBooking = cruiseId;
  currentBookingStep = 1;

  document.querySelectorAll('.booking-step').forEach(s => {
    s.classList.remove('active');
    s.style.display = '';
  });
  document.getElementById('booking-step-1').classList.add('active');
  document.getElementById('booking-step-success').style.display = 'none';
  document.getElementById('booking-footer').style.display = 'flex';

  updateBookingStepUI();

  // Populate cruise dropdown
  if (cruiseData) {
    const cruiseSelect = document.getElementById('book-cruise');
    cruiseSelect.innerHTML = '';
    cruiseData.cruises.forEach(c => {
      const title = currentLang === 'ro' ? c.titleRo : c.title;
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${title} (${c.cruiseLine} - ${c.ship})`;
      if (c.id === cruiseId) opt.selected = true;
      cruiseSelect.appendChild(opt);
    });
  }

  setTimeout(() => {
    document.getElementById('booking-overlay').classList.add('active');
  }, 10);
}

function closeBookingModal() {
  const overlay = document.getElementById('booking-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 300);
  }
}

function updateBookingStepUI() {
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById(`step-dot-${i}`);
    const line = document.getElementById(`step-line-${i}`);
    if (dot) {
      dot.classList.remove('active', 'completed');
      if (i < currentBookingStep) dot.classList.add('completed');
      else if (i === currentBookingStep) dot.classList.add('active');
    }
    if (line) {
      line.classList.toggle('active', i < currentBookingStep);
    }
  }

  const prevBtn = document.getElementById('booking-prev');
  const nextBtn = document.getElementById('booking-next');
  if (prevBtn) prevBtn.style.display = currentBookingStep > 1 ? '' : 'none';
  if (nextBtn) nextBtn.textContent = currentBookingStep === 3 ? t('booking_submit') : t('booking_next');
}

function nextBookingStep() {
  if (currentBookingStep === 1) {
    const fn = document.getElementById('book-firstname')?.value?.trim();
    const ln = document.getElementById('book-lastname')?.value?.trim();
    const dob = document.getElementById('book-dob')?.value;
    const phone = document.getElementById('book-phone')?.value?.trim();
    const email = document.getElementById('book-email')?.value?.trim();

    if (!fn || !ln || !dob || !phone || !email) {
      alert(t('booking_fill_required'));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert(t('booking_invalid_email'));
      return;
    }
  }

  if (currentBookingStep === 2) {
    buildBookingSummary();
  }

  if (currentBookingStep === 3) {
    if (!document.getElementById('book-gdpr')?.checked || !document.getElementById('book-terms')?.checked) {
      alert(t('booking_accept_terms'));
      return;
    }
    submitBooking();
    return;
  }

  document.getElementById(`booking-step-${currentBookingStep}`).classList.remove('active');
  currentBookingStep++;
  document.getElementById(`booking-step-${currentBookingStep}`).classList.add('active');
  updateBookingStepUI();
}

function prevBookingStep() {
  if (currentBookingStep <= 1) return;
  document.getElementById(`booking-step-${currentBookingStep}`).classList.remove('active');
  currentBookingStep--;
  document.getElementById(`booking-step-${currentBookingStep}`).classList.add('active');
  updateBookingStepUI();
}

function buildBookingSummary() {
  const summary = document.getElementById('booking-summary');
  if (!summary) return;

  const cruiseSelect = document.getElementById('book-cruise');
  const cruiseName = cruiseSelect?.options[cruiseSelect.selectedIndex]?.textContent || '';
  const cabinSelect = document.getElementById('book-cabin');
  const cabinName = cabinSelect?.options[cabinSelect.selectedIndex]?.textContent || '';

  summary.innerHTML = `
    <dt>${t('booking_firstname')}</dt><dd>${document.getElementById('book-firstname').value}</dd>
    <dt>${t('booking_lastname')}</dt><dd>${document.getElementById('book-lastname').value}</dd>
    <dt>${t('booking_dob')}</dt><dd>${document.getElementById('book-dob').value}</dd>
    <dt>${t('booking_email')}</dt><dd>${document.getElementById('book-email').value}</dd>
    <dt>${t('booking_phone')}</dt><dd>${document.getElementById('book-phone').value}</dd>
    <dt>${t('booking_cruise_select')}</dt><dd>${cruiseName}</dd>
    <dt>${t('booking_cabin_pref')}</dt><dd>${cabinName}</dd>
    <dt>${t('booking_passengers')}</dt><dd>${document.getElementById('book-passengers').value}</dd>
    ${document.getElementById('book-requests').value ? `<dt>${t('booking_special_requests')}</dt><dd>${document.getElementById('book-requests').value}</dd>` : ''}
  `;
}

async function submitBooking() {
  const bookingData = {
    firstname: document.getElementById('book-firstname').value,
    lastname: document.getElementById('book-lastname').value,
    dob: document.getElementById('book-dob').value,
    email: document.getElementById('book-email').value,
    phone: document.getElementById('book-phone').value,
    cruise: document.getElementById('book-cruise')?.options[document.getElementById('book-cruise').selectedIndex]?.textContent || '',
    cruiseId: document.getElementById('book-cruise')?.value || '',
    cabin: document.getElementById('book-cabin')?.options[document.getElementById('book-cabin').selectedIndex]?.textContent || '',
    passengers: document.getElementById('book-passengers').value,
    requests: document.getElementById('book-requests').value,
    gdprConsent: document.getElementById('book-gdpr')?.checked,
    termsConsent: document.getElementById('book-terms')?.checked,
    marketingConsent: document.getElementById('book-marketing')?.checked,
    date: new Date().toISOString(),
    lang: currentLang
  };

  // Try EmailJS
  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_BOOKING, {
        to_email: 'xplorecruisetravel@gmail.com',
        from_name: `${bookingData.firstname} ${bookingData.lastname}`,
        from_email: bookingData.email,
        phone: bookingData.phone,
        date_of_birth: bookingData.dob,
        cruise_name: bookingData.cruise,
        cabin_type: bookingData.cabin,
        passengers: bookingData.passengers,
        special_requests: bookingData.requests || 'None',
        gdpr_consent: bookingData.gdprConsent ? 'Yes' : 'No',
        marketing_consent: bookingData.marketingConsent ? 'Yes' : 'No',
        booking_date: new Date().toLocaleString()
      });
    } catch (err) {
      console.error('EmailJS error:', err);
    }
  }

  // Store booking locally
  const bookings = JSON.parse(localStorage.getItem('xct_bookings') || '[]');
  bookings.push(bookingData);
  localStorage.setItem('xct_bookings', JSON.stringify(bookings));

  // Open mailto as backup
  const subject = encodeURIComponent(`New Booking: ${bookingData.cruise}`);
  const body = encodeURIComponent(
    `NEW BOOKING REQUEST\n====================\n\n` +
    `Name: ${bookingData.firstname} ${bookingData.lastname}\n` +
    `Date of Birth: ${bookingData.dob}\n` +
    `Email: ${bookingData.email}\n` +
    `Phone: ${bookingData.phone}\n\n` +
    `CRUISE DETAILS\n--------------\n` +
    `Cruise: ${bookingData.cruise}\n` +
    `Cabin: ${bookingData.cabin}\n` +
    `Passengers: ${bookingData.passengers}\n` +
    `Requests: ${bookingData.requests || 'None'}\n\n` +
    `CONSENT\n-------\n` +
    `GDPR: ${bookingData.gdprConsent ? 'Yes' : 'No'}\n` +
    `Terms: ${bookingData.termsConsent ? 'Yes' : 'No'}\n` +
    `Marketing: ${bookingData.marketingConsent ? 'Yes' : 'No'}\n\n` +
    `Submitted: ${new Date().toLocaleString()}`
  );

  const mailtoLink = document.createElement('a');
  mailtoLink.href = `mailto:xplorecruisetravel@gmail.com?subject=${subject}&body=${body}`;
  mailtoLink.click();

  // Show success
  document.querySelectorAll('.booking-step').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  document.getElementById('booking-step-success').style.display = 'block';
  document.getElementById('booking-footer').style.display = 'none';

  console.log('Booking submitted:', bookingData);
}

// =============================================
// CONTACT FORM
// =============================================

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const cruiseParam = params.get('cruise');
  if (cruiseParam) {
    const cruiseInput = document.getElementById('cruise-interest');
    if (cruiseInput) cruiseInput.value = cruiseParam;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    if (!data.name || !data.email) {
      alert(currentLang === 'ro' ? 'Completeaza toate campurile obligatorii.' : 'Please fill in all required fields.');
      return;
    }

    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CONTACT, {
          to_email: 'xplorecruisetravel@gmail.com',
          from_name: data.name,
          from_email: data.email,
          phone: data.phone || '',
          cruise_interest: data.cruise || '',
          message: data.message || ''
        });
      } catch (err) {
        console.error('EmailJS error:', err);
      }
    }

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
  // Remove old booking modal so it rebuilds with new language
  const oldModal = document.getElementById('booking-overlay');
  if (oldModal) oldModal.remove();

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
  initScrollAnimations();

  const page = document.body.dataset.page;
  if (page === 'home') initHomepage();
  if (page === 'listing') initListingPage();
  if (page === 'detail') initDetailPage();
});
