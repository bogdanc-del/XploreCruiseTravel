# XploreCruiseTravel — Test Cases

**Version:** 1.0
**Date:** 2026-03-01
**Total Test Cases:** 100 (TC-001 to TC-100)
**Status Legend:** 🔲 Not Tested | ✅ Pass | ❌ Fail | ⏭️ Skipped

---

## Table of Contents

1. [Navigation and Routing (TC-001 to TC-010)](#1-navigation-and-routing)
2. [Language Switching EN/RO (TC-011 to TC-020)](#2-language-switching-enro)
3. [Cruise Listing and Filtering (TC-021 to TC-030)](#3-cruise-listing-and-filtering)
4. [Booking Modal Flow (TC-031 to TC-040)](#4-booking-modal-flow)
5. [Contact Form (TC-041 to TC-050)](#5-contact-form)
6. [Responsive Design (TC-051 to TC-060)](#6-responsive-design)
7. [GDPR Consent and Cookie Banner (TC-061 to TC-070)](#7-gdpr-consent-and-cookie-banner)
8. [Price Display EUR + RON (TC-071 to TC-080)](#8-price-display-eur--ron)
9. [Email Submission (TC-081 to TC-090)](#9-email-submission)
10. [Admin Interface (TC-091 to TC-100)](#10-admin-interface)

---

## 1. Navigation and Routing

### TC-001: Homepage Load
- **Description:** Verify that the homepage loads correctly with all sections visible.
- **Preconditions:** Server is running; browser is open.
- **Steps:**
  1. Navigate to `index.html`.
  2. Wait for page to fully load.
  3. Scroll through the entire page.
- **Expected Result:** Hero section, search module, trust bar, featured cruises, destinations, "Why Cruise" section, advisor block, stats counter, CTA, and footer are all rendered. No console errors.
- **Status:** 🔲

### TC-002: Navigate to Cruises Listing
- **Description:** Verify navigation from homepage to cruise listing page.
- **Preconditions:** Homepage is loaded.
- **Steps:**
  1. Click "Cruises" link in the header navigation.
- **Expected Result:** Browser navigates to `pages/listing.html`. The listing page loads with cruise cards displayed.
- **Status:** 🔲

### TC-003: Navigate to About Us
- **Description:** Verify navigation to the About Us page.
- **Preconditions:** Any page is loaded.
- **Steps:**
  1. Click "About Us" link in the header navigation.
- **Expected Result:** Browser navigates to `pages/about.html`. The about page loads with team members and "Why Choose Us" cards.
- **Status:** 🔲

### TC-004: Navigate to Contact
- **Description:** Verify navigation to the Contact page.
- **Preconditions:** Any page is loaded.
- **Steps:**
  1. Click "Contact" link in the header navigation.
- **Expected Result:** Browser navigates to `pages/contact.html`. Contact form and sidebar info are displayed.
- **Status:** 🔲

### TC-005: Logo Navigates to Homepage
- **Description:** Verify that clicking the logo returns to the homepage.
- **Preconditions:** User is on any sub-page (e.g., listing.html).
- **Steps:**
  1. Click the XploreCruiseTravel logo in the header.
- **Expected Result:** Browser navigates to `index.html` (homepage).
- **Status:** 🔲

### TC-006: Active Navigation Link Highlighting
- **Description:** Verify the current page link is visually highlighted in the navigation.
- **Preconditions:** None.
- **Steps:**
  1. Navigate to `pages/contact.html`.
  2. Inspect the "Contact" link in the nav.
- **Expected Result:** The "Contact" link has the `nav__link--active` class applied, displaying with distinct styling (underline or color accent).
- **Status:** 🔲

### TC-007: Footer Links Work
- **Description:** Verify footer links (Terms, Privacy, Sitemap) navigate correctly.
- **Preconditions:** Homepage is loaded.
- **Steps:**
  1. Scroll to the footer.
  2. Click "Terms & Conditions" link.
  3. Go back. Click "Privacy Policy" link.
- **Expected Result:** Each link navigates to the corresponding page (`pages/terms.html`, `pages/privacy.html`).
- **Status:** 🔲

### TC-008: Cruise Card Links to Detail Page
- **Description:** Verify that clicking a cruise card navigates to the detail page with the correct cruise ID.
- **Preconditions:** Homepage or listing page is loaded with cruise cards.
- **Steps:**
  1. Click on the first cruise card's "View Details" button or card link.
- **Expected Result:** Browser navigates to `pages/detail.html?id=<cruise-id>`. The detail page loads with the correct cruise information.
- **Status:** 🔲

### TC-009: Detail Page with Invalid ID
- **Description:** Verify behavior when navigating to detail page with a non-existent cruise ID.
- **Preconditions:** None.
- **Steps:**
  1. Navigate directly to `pages/detail.html?id=nonexistent999`.
- **Expected Result:** The page handles the error gracefully, showing a "Cruise not found" message or redirecting to the listing page. No unhandled JS errors.
- **Status:** 🔲

### TC-010: WhatsApp Float Button
- **Description:** Verify the WhatsApp floating button is present and links correctly.
- **Preconditions:** Any page is loaded.
- **Steps:**
  1. Locate the green floating WhatsApp button at the bottom-right.
  2. Verify its `href` attribute.
- **Expected Result:** Button is visible on all pages. Links to `https://wa.me/40749558572`.
- **Status:** 🔲

---

## 2. Language Switching EN/RO

### TC-011: Default Language is English
- **Description:** Verify the site loads in English by default when no language preference is stored.
- **Preconditions:** Clear localStorage (`xct_lang` key removed). No prior visit.
- **Steps:**
  1. Open the homepage.
  2. Check the language toggle button text.
  3. Verify page content is in English.
- **Expected Result:** Toggle button shows "RO" (indicating switch-to option). All text content is in English.
- **Status:** 🔲

### TC-012: Switch Language to Romanian
- **Description:** Verify clicking the language toggle switches all content to Romanian.
- **Preconditions:** Site is in English.
- **Steps:**
  1. Click the "RO" language toggle button.
  2. Observe all text elements on the page.
- **Expected Result:** All elements with `data-i18n` attributes display Romanian text. Toggle button now shows "EN". Navigation links read "Croaziere", "Despre Noi", "Contact".
- **Status:** 🔲

### TC-013: Switch Language Back to English
- **Description:** Verify switching from Romanian back to English.
- **Preconditions:** Site is in Romanian.
- **Steps:**
  1. Click the "EN" language toggle button.
- **Expected Result:** All content reverts to English. Toggle button shows "RO" again.
- **Status:** 🔲

### TC-014: Language Preference Persists Across Pages
- **Description:** Verify the selected language persists when navigating between pages.
- **Preconditions:** Site is in English.
- **Steps:**
  1. Switch language to Romanian.
  2. Navigate to the Contact page.
  3. Verify the language is still Romanian.
- **Expected Result:** Contact page loads in Romanian. Toggle still shows "EN".
- **Status:** 🔲

### TC-015: Language Preference Persists Across Sessions
- **Description:** Verify language preference is saved in localStorage and persists after browser restart.
- **Preconditions:** None.
- **Steps:**
  1. Switch language to Romanian.
  2. Close the browser tab.
  3. Re-open the site.
- **Expected Result:** Site loads in Romanian. `localStorage.getItem('xct_lang')` returns `'ro'`.
- **Status:** 🔲

### TC-016: Cruise Card Content Translates
- **Description:** Verify cruise cards display translated content when switching language.
- **Preconditions:** Homepage is loaded in English with cruise cards visible.
- **Steps:**
  1. Note a cruise card's title and destination.
  2. Switch to Romanian.
  3. Check the same cruise card.
- **Expected Result:** Card title uses `titleRo` field, destination uses `destinationRo`. Ports and descriptions also translate.
- **Status:** 🔲

### TC-017: Search Dropdowns Translate
- **Description:** Verify the homepage search dropdowns translate when language changes.
- **Preconditions:** Homepage is loaded.
- **Steps:**
  1. Open the destination dropdown in English and note options.
  2. Switch to Romanian.
  3. Open the destination dropdown again.
- **Expected Result:** Dropdown labels and placeholder text are in Romanian.
- **Status:** 🔲

### TC-018: Detail Page Translates
- **Description:** Verify the cruise detail page content translates correctly.
- **Preconditions:** Detail page is loaded with a valid cruise ID.
- **Steps:**
  1. Note the cruise title, ports, included items, excluded items, and advisor note in English.
  2. Switch to Romanian.
- **Expected Result:** Title shows `titleRo`, ports show `portsRo`, included/excluded lists show Romanian equivalents, advisor note shows `advisorNoteRo`.
- **Status:** 🔲

### TC-019: Booking Modal Translates
- **Description:** Verify the booking modal content translates when language is changed.
- **Preconditions:** Booking modal is open on Step 1.
- **Steps:**
  1. Note all labels and buttons in English.
  2. Close modal. Switch to Romanian. Re-open modal.
- **Expected Result:** All modal labels, step indicators, buttons, and GDPR consent text display in Romanian.
- **Status:** 🔲

### TC-020: Translation Fallback for Missing Keys
- **Description:** Verify that missing translation keys fall back to English.
- **Preconditions:** i18n.js is loaded.
- **Steps:**
  1. In the browser console, call `t('nonexistent_key')`.
- **Expected Result:** Function returns the key string itself (`'nonexistent_key'`) as fallback. No error thrown.
- **Status:** 🔲

---

## 3. Cruise Listing and Filtering

### TC-021: Listing Page Loads All Cruises
- **Description:** Verify the listing page displays all cruises from cruises.json.
- **Preconditions:** Navigate to listing page.
- **Steps:**
  1. Open `pages/listing.html`.
  2. Count the number of cruise cards displayed.
- **Expected Result:** All 6 cruises from `data/cruises.json` are rendered as cards. Each card shows image, title, destination, duration, price, and "View Details" button.
- **Status:** 🔲

### TC-022: Filter by Destination
- **Description:** Verify filtering cruises by destination.
- **Preconditions:** Listing page is loaded.
- **Steps:**
  1. Select "Mediterranean" from the destination filter dropdown.
  2. Observe the results.
- **Expected Result:** Only cruises with destination "Mediterranean" are displayed. Other cruises are hidden. Result count updates.
- **Status:** 🔲

### TC-023: Filter by Cruise Line
- **Description:** Verify filtering cruises by cruise line.
- **Preconditions:** Listing page is loaded.
- **Steps:**
  1. Select "MSC Cruises" from the cruise line filter.
- **Expected Result:** Only MSC Cruises are displayed.
- **Status:** 🔲

### TC-024: Filter by Duration
- **Description:** Verify filtering cruises by duration.
- **Preconditions:** Listing page is loaded.
- **Steps:**
  1. Select a duration range (e.g., "7-9 nights") from the duration filter.
- **Expected Result:** Only cruises within the selected duration range are displayed.
- **Status:** 🔲

### TC-025: Combined Filters
- **Description:** Verify multiple filters work together.
- **Preconditions:** Listing page is loaded.
- **Steps:**
  1. Select "Mediterranean" destination.
  2. Select "7-9 nights" duration.
- **Expected Result:** Only cruises matching BOTH criteria are displayed. If no cruises match, a "no results" message appears.
- **Status:** 🔲

### TC-026: Sort by Price (Low to High)
- **Description:** Verify sorting cruises by price ascending.
- **Preconditions:** Listing page is loaded.
- **Steps:**
  1. Select "Price: Low to High" from the sort dropdown.
- **Expected Result:** Cruise cards reorder so that the cheapest cruise appears first and the most expensive last.
- **Status:** 🔲

### TC-027: Sort by Price (High to Low)
- **Description:** Verify sorting cruises by price descending.
- **Preconditions:** Listing page is loaded.
- **Steps:**
  1. Select "Price: High to Low" from the sort dropdown.
- **Expected Result:** Cruise cards reorder so that the most expensive cruise appears first.
- **Status:** 🔲

### TC-028: Reset Filters
- **Description:** Verify that resetting filters shows all cruises.
- **Preconditions:** Some filters are applied.
- **Steps:**
  1. Apply destination filter "Caribbean".
  2. Reset all filters (select "All" for each dropdown).
- **Expected Result:** All 6 cruises are displayed again.
- **Status:** 🔲

### TC-029: Search from Homepage Populates Listing Filters
- **Description:** Verify that using the homepage search module pre-fills the listing page filters.
- **Preconditions:** Homepage is loaded.
- **Steps:**
  1. In the homepage search module, select destination "Northern Europe" and month "June".
  2. Click "Search Cruises".
- **Expected Result:** Browser navigates to `pages/listing.html` with URL parameters (e.g., `?destination=Northern+Europe&month=June`). The listing page filters are pre-populated with the search values, and results are filtered accordingly.
- **Status:** 🔲

### TC-030: No Results Message
- **Description:** Verify appropriate message when no cruises match filters.
- **Preconditions:** Listing page is loaded.
- **Steps:**
  1. Apply filter combinations that yield zero results (e.g., "Transatlantic" + "3-5 nights" if no match).
- **Expected Result:** A user-friendly "no cruises found" message is displayed. No empty grid or blank page.
- **Status:** 🔲

---

## 4. Booking Modal Flow

### TC-031: Open Booking Modal
- **Description:** Verify the booking modal opens when clicking "Request Offer" on a cruise.
- **Preconditions:** Detail page is loaded for a valid cruise.
- **Steps:**
  1. Click the "Request Offer" / "Book Now" button on the detail page.
- **Expected Result:** A modal overlay appears with Step 1 (Personal Details) visible. Background is dimmed. Body scroll is disabled.
- **Status:** 🔲

### TC-032: Step 1 - Personal Details Validation
- **Description:** Verify Step 1 requires all mandatory fields before proceeding.
- **Preconditions:** Booking modal is open on Step 1.
- **Steps:**
  1. Leave all fields empty.
  2. Click "Next".
- **Expected Result:** Form validation prevents advancement. Error indicators appear on required fields (Full Name, Email, Phone).
- **Status:** 🔲

### TC-033: Step 1 - Email Format Validation
- **Description:** Verify email field validates format.
- **Preconditions:** Booking modal is open on Step 1.
- **Steps:**
  1. Enter "invalidemail" in the email field.
  2. Fill other required fields.
  3. Click "Next".
- **Expected Result:** Validation error shown for invalid email format. User cannot proceed to Step 2.
- **Status:** 🔲

### TC-034: Step 1 to Step 2 Transition
- **Description:** Verify progressing from Step 1 to Step 2.
- **Preconditions:** Booking modal is open on Step 1.
- **Steps:**
  1. Fill in Full Name: "John Doe".
  2. Fill in Email: "john@example.com".
  3. Fill in Phone: "+40721234567".
  4. Click "Next".
- **Expected Result:** Modal transitions to Step 2 (Cruise Selection). Step indicator updates. Step 1 data is preserved.
- **Status:** 🔲

### TC-035: Step 2 - Cruise Selection Pre-filled
- **Description:** Verify Step 2 has the cruise pre-selected when opened from a detail page.
- **Preconditions:** Booking modal opened from a specific cruise detail page.
- **Steps:**
  1. Complete Step 1 and proceed to Step 2.
  2. Check the cruise selection field.
- **Expected Result:** The cruise from the detail page is pre-selected. Cabin type options are available.
- **Status:** 🔲

### TC-036: Step 2 - Select Cabin Type and Guests
- **Description:** Verify selecting cabin type and number of guests.
- **Preconditions:** Booking modal is on Step 2.
- **Steps:**
  1. Select cabin type "Balcony".
  2. Set number of guests to 2.
  3. Add special requests: "Honeymoon celebration".
- **Expected Result:** All selections are accepted and saved. User can proceed to Step 3.
- **Status:** 🔲

### TC-037: Step 2 to Step 3 Transition
- **Description:** Verify progressing from Step 2 to Step 3 (Review).
- **Preconditions:** Step 2 is filled.
- **Steps:**
  1. Click "Next" on Step 2.
- **Expected Result:** Modal transitions to Step 3 (Review & Confirm). All previously entered data is displayed in a summary.
- **Status:** 🔲

### TC-038: Step 3 - Review Summary Accuracy
- **Description:** Verify Step 3 displays all entered data accurately.
- **Preconditions:** Booking modal is on Step 3.
- **Steps:**
  1. Review all displayed information.
- **Expected Result:** Summary shows: Full Name, Email, Phone, Selected Cruise, Cabin Type, Number of Guests, Special Requests, and estimated price. All values match what was entered.
- **Status:** 🔲

### TC-039: Step 3 - GDPR Consent Required
- **Description:** Verify submission requires GDPR consent checkbox.
- **Preconditions:** Booking modal is on Step 3.
- **Steps:**
  1. Leave the GDPR consent checkbox unchecked.
  2. Click "Submit".
- **Expected Result:** Submission is blocked. User is prompted to accept the privacy policy / GDPR consent before submitting.
- **Status:** 🔲

### TC-040: Close Booking Modal
- **Description:** Verify the booking modal can be closed at any step.
- **Preconditions:** Booking modal is open on any step.
- **Steps:**
  1. Click the close (X) button on the modal.
  2. Alternatively, click outside the modal overlay.
- **Expected Result:** Modal closes. Background scrolling is re-enabled. No data is submitted.
- **Status:** 🔲

---

## 5. Contact Form

### TC-041: Contact Form Renders Correctly
- **Description:** Verify the contact form displays all fields.
- **Preconditions:** Contact page is loaded.
- **Steps:**
  1. Navigate to `pages/contact.html`.
  2. Inspect the form fields.
- **Expected Result:** Form contains: Full Name, Email, Phone, Interested Cruise (optional), Message, Consent checkbox, and Submit button.
- **Status:** 🔲

### TC-042: Required Field Validation
- **Description:** Verify the form enforces required fields.
- **Preconditions:** Contact form is visible.
- **Steps:**
  1. Leave all fields empty.
  2. Click "Send Message".
- **Expected Result:** Browser native validation prevents submission. Required fields (Name, Email, Message) are highlighted.
- **Status:** 🔲

### TC-043: Email Validation
- **Description:** Verify email field format validation.
- **Preconditions:** Contact form is visible.
- **Steps:**
  1. Enter "notanemail" in the email field.
  2. Fill other required fields.
  3. Click "Send Message".
- **Expected Result:** Validation error for invalid email format.
- **Status:** 🔲

### TC-044: Consent Checkbox Required
- **Description:** Verify the consent checkbox must be checked to submit.
- **Preconditions:** Contact form is visible.
- **Steps:**
  1. Fill in all fields correctly.
  2. Leave the consent checkbox unchecked.
  3. Click "Send Message".
- **Expected Result:** Form submission is blocked. The consent checkbox is flagged as required.
- **Status:** 🔲

### TC-045: Successful Form Submission
- **Description:** Verify successful contact form submission flow.
- **Preconditions:** EmailJS is configured (or mock available). Contact form is visible.
- **Steps:**
  1. Fill in Name: "Test User".
  2. Fill in Email: "test@example.com".
  3. Fill in Phone: "+40700000000".
  4. Fill in Message: "Test message".
  5. Check the consent checkbox.
  6. Click "Send Message".
- **Expected Result:** Form submits successfully. A success message is displayed to the user. Form fields are cleared.
- **Status:** 🔲

### TC-046: Phone Field is Optional
- **Description:** Verify form submits without a phone number.
- **Preconditions:** Contact form is visible.
- **Steps:**
  1. Fill in Name and Email.
  2. Leave Phone empty.
  3. Fill in Message. Check consent.
  4. Click "Send Message".
- **Expected Result:** Form submits successfully without phone number.
- **Status:** 🔲

### TC-047: Cruise Interest Pre-filled from URL
- **Description:** Verify the cruise interest field is pre-filled when navigated from a cruise detail page.
- **Preconditions:** None.
- **Steps:**
  1. Navigate to `pages/contact.html?cruise=MSC+Meraviglia+Mediterranean`.
  2. Check the "Interested Cruise" field.
- **Expected Result:** The field is pre-populated with the cruise name from the URL parameter.
- **Status:** 🔲

### TC-048: Sidebar Contact Info Displayed
- **Description:** Verify the contact sidebar shows correct information.
- **Preconditions:** Contact page is loaded.
- **Steps:**
  1. Check the sidebar on the right.
- **Expected Result:** Sidebar displays: Phone (+40 749 558 572), WhatsApp (+40 749 558 572), Email (xplorecruisetravel@gmail.com), Opening Hours (Mon-Fri 09:00-20:00, Sat-Sun 10:00-18:00), Consultant name (Ceausu Daniel Antonina).
- **Status:** 🔲

### TC-049: WhatsApp Link in Sidebar
- **Description:** Verify the WhatsApp link in the sidebar works.
- **Preconditions:** Contact page is loaded.
- **Steps:**
  1. Click the WhatsApp link in the sidebar.
- **Expected Result:** Link opens `https://wa.me/40749558572` (WhatsApp chat with the correct number).
- **Status:** 🔲

### TC-050: Phone Link in Sidebar
- **Description:** Verify the phone link is callable.
- **Preconditions:** Contact page is loaded.
- **Steps:**
  1. Inspect the phone link's href.
- **Expected Result:** The `href` is `tel:+40749558572`, enabling click-to-call on mobile devices.
- **Status:** 🔲

---

## 6. Responsive Design

### TC-051: Desktop Layout (1280px+)
- **Description:** Verify the site displays correctly on desktop.
- **Preconditions:** Browser window is 1280px wide or larger.
- **Steps:**
  1. Navigate to the homepage.
  2. Check header, hero, cruise grid, footer layout.
- **Expected Result:** Full navigation bar is visible. Cruise cards display in a multi-column grid (3-4 columns). Sidebar content is adjacent to main content. No horizontal scrolling.
- **Status:** 🔲

### TC-052: Tablet Layout (768px - 991px)
- **Description:** Verify the site adapts for tablet screens.
- **Preconditions:** Browser window is 768px wide.
- **Steps:**
  1. Navigate to the homepage.
  2. Check layout adjustments.
- **Expected Result:** Cruise cards display in a 2-column grid. Navigation may begin to condense. All content remains accessible.
- **Status:** 🔲

### TC-053: Mobile Layout (below 768px)
- **Description:** Verify the site adapts for mobile screens.
- **Preconditions:** Browser window is 375px wide.
- **Steps:**
  1. Navigate to the homepage.
  2. Check layout.
- **Expected Result:** Cruise cards stack in a single column. Navigation is hidden behind a hamburger menu. Hero text adjusts for small screens. No overflow or cut-off content.
- **Status:** 🔲

### TC-054: Mobile Hamburger Menu
- **Description:** Verify the mobile hamburger menu toggles correctly.
- **Preconditions:** Browser width is below 768px.
- **Steps:**
  1. Tap the hamburger menu icon (3 lines).
  2. Observe the navigation menu.
  3. Tap a menu item.
- **Expected Result:** Menu slides open with all navigation links. Clicking a link navigates to the page and closes the menu.
- **Status:** 🔲

### TC-055: Contact Page Responsive
- **Description:** Verify the contact page stacks correctly on mobile.
- **Preconditions:** Mobile viewport (375px).
- **Steps:**
  1. Navigate to the contact page.
- **Expected Result:** Form takes full width. Sidebar cards stack below the form. All content is readable and tappable.
- **Status:** 🔲

### TC-056: Detail Page Responsive
- **Description:** Verify the cruise detail page is usable on mobile.
- **Preconditions:** Mobile viewport (375px). Detail page loaded.
- **Steps:**
  1. Navigate to a cruise detail page.
  2. Check itinerary table, pricing cards, sidebar.
- **Expected Result:** Itinerary table is scrollable horizontally or wraps. Cabin pricing cards stack vertically. Sidebar moves below main content.
- **Status:** 🔲

### TC-057: Booking Modal Responsive
- **Description:** Verify the booking modal adapts to mobile screens.
- **Preconditions:** Mobile viewport. Detail page loaded.
- **Steps:**
  1. Open the booking modal on mobile.
- **Expected Result:** Modal fills the viewport width. All form fields are accessible and properly sized. Step navigation is usable with touch.
- **Status:** 🔲

### TC-058: Images Responsive
- **Description:** Verify images scale correctly across viewports.
- **Preconditions:** None.
- **Steps:**
  1. View cruise card images at desktop (1280px), tablet (768px), and mobile (375px).
- **Expected Result:** Images scale proportionally. No distortion, overflow, or cropping of important content. Aspect ratios are maintained.
- **Status:** 🔲

### TC-059: Font Sizes Responsive
- **Description:** Verify text remains readable across viewports.
- **Preconditions:** None.
- **Steps:**
  1. Check hero heading, body text, and card text at mobile (375px).
- **Expected Result:** Text does not overflow containers. Font sizes are adjusted for readability. Minimum body text is at least 14px on mobile.
- **Status:** 🔲

### TC-060: Search Module Responsive
- **Description:** Verify the homepage search module adapts to mobile.
- **Preconditions:** Mobile viewport (375px).
- **Steps:**
  1. View the search module on the homepage.
  2. Interact with dropdowns.
- **Expected Result:** Search fields stack vertically on mobile. Dropdowns are full-width and easy to tap. Search button is accessible.
- **Status:** 🔲

---

## 7. GDPR Consent and Cookie Banner

### TC-061: Cookie Banner Appears on First Visit
- **Description:** Verify the cookie consent banner appears for first-time visitors.
- **Preconditions:** Clear localStorage (remove `xct_cookies` key). No prior visit.
- **Steps:**
  1. Open the homepage.
- **Expected Result:** Cookie consent banner appears at the bottom of the page with "Accept" and "Decline" options and a brief description.
- **Status:** 🔲

### TC-062: Accept Cookies
- **Description:** Verify accepting cookies dismisses the banner and saves preference.
- **Preconditions:** Cookie banner is visible.
- **Steps:**
  1. Click "Accept" on the cookie banner.
- **Expected Result:** Banner disappears. `localStorage` stores the cookie consent preference. Banner does not reappear on subsequent page loads.
- **Status:** 🔲

### TC-063: Decline Cookies
- **Description:** Verify declining cookies dismisses the banner.
- **Preconditions:** Cookie banner is visible.
- **Steps:**
  1. Click "Decline" on the cookie banner.
- **Expected Result:** Banner disappears. Preference is stored. Essential functionality continues to work (language, navigation).
- **Status:** 🔲

### TC-064: Cookie Banner Does Not Reappear After Decision
- **Description:** Verify the banner stays dismissed across sessions.
- **Preconditions:** Cookie preference has been set.
- **Steps:**
  1. Close the browser.
  2. Re-open the site.
- **Expected Result:** Cookie banner does not appear again.
- **Status:** 🔲

### TC-065: Terms & Conditions Page Accessible
- **Description:** Verify the Terms & Conditions page loads and is complete.
- **Preconditions:** None.
- **Steps:**
  1. Navigate to `pages/terms.html`.
- **Expected Result:** Page loads with full terms content in the current language (EN or RO). Contains sections on service description, booking conditions, liability, and governing law.
- **Status:** 🔲

### TC-066: Privacy Policy Page Accessible
- **Description:** Verify the Privacy Policy page loads and is GDPR-compliant.
- **Preconditions:** None.
- **Steps:**
  1. Navigate to `pages/privacy.html`.
- **Expected Result:** Page loads with privacy policy content. Includes data controller info, types of data collected, legal basis, data retention, user rights (access, rectification, deletion, portability), and contact for DPO.
- **Status:** 🔲

### TC-067: Booking Consent Checkbox
- **Description:** Verify the booking modal requires GDPR consent.
- **Preconditions:** Booking modal is on Step 3 (Review).
- **Steps:**
  1. Attempt to submit without checking the consent checkbox.
- **Expected Result:** Submission is blocked. Consent checkbox is marked as required.
- **Status:** 🔲

### TC-068: Contact Form Consent Checkbox
- **Description:** Verify the contact form includes and enforces GDPR consent.
- **Preconditions:** Contact page is loaded.
- **Steps:**
  1. Fill all fields. Leave consent unchecked. Submit.
- **Expected Result:** Form does not submit. Consent checkbox is required.
- **Status:** 🔲

### TC-069: Privacy Policy Link in Consent Text
- **Description:** Verify consent text contains a clickable link to the privacy policy.
- **Preconditions:** Contact form or booking modal is visible.
- **Steps:**
  1. Inspect the consent label text for a link to the privacy policy.
- **Expected Result:** Consent text includes a hyperlink to `pages/privacy.html` that opens the privacy policy.
- **Status:** 🔲

### TC-070: Cookie Banner in Both Languages
- **Description:** Verify the cookie banner translates when language is switched.
- **Preconditions:** Clear cookies. Open site.
- **Steps:**
  1. Note cookie banner text in English.
  2. Switch language to Romanian.
  3. Clear cookie preference. Reload.
- **Expected Result:** Cookie banner displays in Romanian with appropriate text.
- **Status:** 🔲

---

## 8. Price Display EUR + RON

### TC-071: Cruise Card Displays EUR Price
- **Description:** Verify cruise cards show prices in EUR.
- **Preconditions:** Homepage or listing page is loaded.
- **Steps:**
  1. Inspect a cruise card's price.
- **Expected Result:** Price is displayed with EUR currency symbol (e.g., "from 899 EUR").
- **Status:** 🔲

### TC-072: Cruise Card Displays RON Equivalent
- **Description:** Verify cruise cards also show the RON equivalent.
- **Preconditions:** Homepage or listing page is loaded.
- **Steps:**
  1. Inspect a cruise card's price display.
- **Expected Result:** Below or beside the EUR price, the RON equivalent is shown (e.g., "~4,468 RON"). Conversion uses the rate of 4.97.
- **Status:** 🔲

### TC-073: EUR to RON Conversion Accuracy
- **Description:** Verify the EUR to RON conversion is mathematically correct.
- **Preconditions:** Any page with price display.
- **Steps:**
  1. Note the EUR price of a cruise (e.g., 899 EUR).
  2. Calculate: 899 * 4.97 = 4,468.03.
  3. Compare with displayed RON value.
- **Expected Result:** Displayed RON value matches the calculation (899 * 4.97 = ~4,468 RON). Rounding is applied consistently.
- **Status:** 🔲

### TC-074: Detail Page Cabin Prices
- **Description:** Verify all cabin type prices are displayed on the detail page.
- **Preconditions:** Detail page is loaded for a cruise with multiple cabin types.
- **Steps:**
  1. Check the pricing section on the detail page.
- **Expected Result:** Each cabin type (Inside, Oceanview, Balcony, Suite) shows its EUR price and RON equivalent. Prices match `cruises.json` data.
- **Status:** 🔲

### TC-075: Price Display Format
- **Description:** Verify prices are formatted with proper thousands separators.
- **Preconditions:** Any page displaying prices.
- **Steps:**
  1. Check a price value of 1000 EUR or more.
- **Expected Result:** Prices use locale-appropriate formatting (e.g., "1,299 EUR" or "6,455 RON"). No raw unformatted numbers.
- **Status:** 🔲

### TC-076: Booking Summary Price
- **Description:** Verify the booking modal summary shows correct pricing.
- **Preconditions:** Booking modal is on Step 3 (Review).
- **Steps:**
  1. Check the price in the booking summary.
- **Expected Result:** Price reflects the selected cabin type. Both EUR and RON values are shown. Values are accurate.
- **Status:** 🔲

### TC-077: Price After Language Switch
- **Description:** Verify prices remain correct after switching language.
- **Preconditions:** Any page with prices visible.
- **Steps:**
  1. Note a price in English mode.
  2. Switch to Romanian.
  3. Check the same price.
- **Expected Result:** EUR and RON values remain identical. Only labels/text around the price change language.
- **Status:** 🔲

### TC-078: formatPrice Function
- **Description:** Verify the `formatPrice()` function returns correct output.
- **Preconditions:** Browser console is open on any page.
- **Steps:**
  1. In the console, call or inspect the `formatPrice(899)` function behavior.
- **Expected Result:** Returns a formatted string containing "899" with EUR designation and the RON equivalent (~4,468 RON).
- **Status:** 🔲

### TC-079: Zero and Null Price Handling
- **Description:** Verify the system handles edge-case prices gracefully.
- **Preconditions:** Browser console is open.
- **Steps:**
  1. Test `formatPrice(0)`.
  2. Test `formatPrice(null)`.
  3. Test `formatPrice(undefined)`.
- **Expected Result:** No JavaScript errors thrown. Displays "0 EUR" or handles gracefully. No NaN or undefined displayed.
- **Status:** 🔲

### TC-080: RON Conversion Rate Constant
- **Description:** Verify the EUR_TO_RON constant is defined and used consistently.
- **Preconditions:** Browser console is open.
- **Steps:**
  1. Check the `EUR_TO_RON` constant in app.js source code.
- **Expected Result:** Constant is defined as `4.97`. All RON calculations use this single constant (no hardcoded values elsewhere).
- **Status:** 🔲

---

## 9. Email Submission

### TC-081: EmailJS SDK Loaded
- **Description:** Verify the EmailJS SDK loads on relevant pages.
- **Preconditions:** Contact page or any page with a form is loaded.
- **Steps:**
  1. Open browser console.
  2. Check if `emailjs` is defined.
- **Expected Result:** `emailjs` object is available globally. No load errors in the console.
- **Status:** 🔲

### TC-082: Booking Submission via EmailJS
- **Description:** Verify booking form data is sent via EmailJS.
- **Preconditions:** EmailJS is configured with valid keys. Booking modal is complete.
- **Steps:**
  1. Complete all 3 steps of the booking modal.
  2. Check GDPR consent. Click Submit.
  3. Monitor network requests.
- **Expected Result:** An HTTP request is sent to EmailJS API with the booking data. Service ID is `service_xplore`, template is `template_booking`.
- **Status:** 🔲

### TC-083: Contact Form Submission via EmailJS
- **Description:** Verify contact form data is sent via EmailJS.
- **Preconditions:** EmailJS is configured. Contact form is filled.
- **Steps:**
  1. Fill and submit the contact form.
  2. Monitor network requests.
- **Expected Result:** An HTTP request is sent to EmailJS API. Service ID is `service_xplore`, template is `template_contact`.
- **Status:** 🔲

### TC-084: localStorage Backup on Submission
- **Description:** Verify form data is backed up to localStorage.
- **Preconditions:** Any form submission.
- **Steps:**
  1. Submit a booking or contact form.
  2. Check localStorage entries.
- **Expected Result:** Submission data is saved to localStorage as a backup. Entry includes timestamp and all form fields.
- **Status:** 🔲

### TC-085: Mailto Fallback
- **Description:** Verify mailto fallback triggers if EmailJS fails.
- **Preconditions:** EmailJS is not configured (PUBLIC_KEY is 'YOUR_PUBLIC_KEY') or network is offline.
- **Steps:**
  1. Attempt to submit a form.
- **Expected Result:** After EmailJS fails, a `mailto:` link is generated or the default mail client opens with pre-filled data as a fallback. User is informed of the alternative.
- **Status:** 🔲

### TC-086: Success Message After Submission
- **Description:** Verify a success confirmation is shown after form submission.
- **Preconditions:** Form is submitted successfully.
- **Steps:**
  1. Submit a contact form or booking.
- **Expected Result:** A visible success message (e.g., "Thank you! We'll contact you within 2 hours.") is displayed. Form fields are cleared.
- **Status:** 🔲

### TC-087: Error Handling on Submission Failure
- **Description:** Verify error handling when submission fails.
- **Preconditions:** Network is disconnected or EmailJS is misconfigured.
- **Steps:**
  1. Disconnect from the internet.
  2. Attempt to submit a form.
- **Expected Result:** A user-friendly error message appears (not a raw technical error). The user is informed that submission failed and given alternatives (phone, email, WhatsApp).
- **Status:** 🔲

### TC-088: Newsletter Subscription
- **Description:** Verify the newsletter form in the footer works.
- **Preconditions:** Homepage is loaded.
- **Steps:**
  1. Scroll to the footer.
  2. Enter an email in the newsletter field.
  3. Click subscribe.
- **Expected Result:** Subscription is processed. A success message is displayed.
- **Status:** 🔲

### TC-089: Duplicate Submission Prevention
- **Description:** Verify the form prevents rapid duplicate submissions.
- **Preconditions:** Contact form is filled and ready.
- **Steps:**
  1. Click "Send Message" rapidly multiple times.
- **Expected Result:** Only one submission is processed. The button is disabled after the first click or a loading state prevents re-submission.
- **Status:** 🔲

### TC-090: EmailJS Public Key Configuration Check
- **Description:** Verify the system handles unconfigured EmailJS gracefully.
- **Preconditions:** `EMAILJS_PUBLIC_KEY` is set to `'YOUR_PUBLIC_KEY'` (default placeholder).
- **Steps:**
  1. Attempt to submit a form.
- **Expected Result:** The system detects the placeholder key and falls back to the mailto method. No cryptic API errors are shown to the user.
- **Status:** 🔲

---

## 10. Admin Interface

### TC-091: Admin Page Accessible
- **Description:** Verify the admin page loads.
- **Preconditions:** Admin page file exists (admin.html).
- **Steps:**
  1. Navigate to the admin page URL.
- **Expected Result:** Admin interface loads with cruise management functionality.
- **Status:** 🔲

### TC-092: List All Cruises in Admin
- **Description:** Verify the admin panel displays all cruises from cruises.json.
- **Preconditions:** Admin page is loaded.
- **Steps:**
  1. Check the cruise list in the admin interface.
- **Expected Result:** All 6 cruises are listed with their key details (title, destination, price, status).
- **Status:** 🔲

### TC-093: Add New Cruise
- **Description:** Verify adding a new cruise via admin.
- **Preconditions:** Admin page is loaded.
- **Steps:**
  1. Click "Add New Cruise" button.
  2. Fill in all required fields (title, titleRo, destination, price, duration, etc.).
  3. Save the cruise.
- **Expected Result:** New cruise is added to the data. It appears in the admin list and on the public listing page after refresh.
- **Status:** 🔲

### TC-094: Edit Existing Cruise
- **Description:** Verify editing an existing cruise.
- **Preconditions:** Admin page is loaded. At least one cruise exists.
- **Steps:**
  1. Click "Edit" on a cruise in the admin list.
  2. Change the price from 899 to 999.
  3. Save changes.
- **Expected Result:** Price is updated. Change reflects on the public site.
- **Status:** 🔲

### TC-095: Delete Cruise
- **Description:** Verify deleting a cruise from admin.
- **Preconditions:** Admin page is loaded. Multiple cruises exist.
- **Steps:**
  1. Click "Delete" on a cruise.
  2. Confirm the deletion in the confirmation dialog.
- **Expected Result:** Cruise is removed from the data. It no longer appears on the listing page. A confirmation dialog prevents accidental deletion.
- **Status:** 🔲

### TC-096: Admin Bilingual Fields
- **Description:** Verify admin form includes both EN and RO fields for bilingual content.
- **Preconditions:** Admin add/edit form is open.
- **Steps:**
  1. Check for dual fields: title/titleRo, destination/destinationRo, ports/portsRo, etc.
- **Expected Result:** Each translatable field has both an English and Romanian input. Both are required for complete data.
- **Status:** 🔲

### TC-097: Admin Validation
- **Description:** Verify the admin form validates required fields.
- **Preconditions:** Admin add form is open.
- **Steps:**
  1. Leave required fields empty.
  2. Click "Save".
- **Expected Result:** Validation errors shown for missing required fields. Cruise is not saved with incomplete data.
- **Status:** 🔲

### TC-098: Admin Itinerary Management
- **Description:** Verify adding/editing itinerary days for a cruise.
- **Preconditions:** Admin edit form is open.
- **Steps:**
  1. Add a new day to the itinerary (Day, Port, Arrival, Departure).
  2. Save the cruise.
- **Expected Result:** Itinerary data is saved. The detail page shows the updated itinerary.
- **Status:** 🔲

### TC-099: Admin Image URL Management
- **Description:** Verify managing cruise image URLs in admin.
- **Preconditions:** Admin edit form is open.
- **Steps:**
  1. Change the image URL for a cruise.
  2. Save.
- **Expected Result:** Updated image URL is saved. The cruise card and detail page show the new image.
- **Status:** 🔲

### TC-100: Admin Data Export
- **Description:** Verify ability to view or export cruise data from admin.
- **Preconditions:** Admin page is loaded.
- **Steps:**
  1. Look for an export or data view function.
  2. Trigger the data export.
- **Expected Result:** Cruise data can be viewed as JSON or exported. Data matches what is displayed on the public site.
- **Status:** 🔲

---

## Test Execution Summary

| Category | Range | Total | Pass | Fail | Not Tested |
|---|---|---|---|---|---|
| Navigation & Routing | TC-001 to TC-010 | 10 | - | - | 10 |
| Language Switching | TC-011 to TC-020 | 10 | - | - | 10 |
| Cruise Listing & Filtering | TC-021 to TC-030 | 10 | - | - | 10 |
| Booking Modal Flow | TC-031 to TC-040 | 10 | - | - | 10 |
| Contact Form | TC-041 to TC-050 | 10 | - | - | 10 |
| Responsive Design | TC-051 to TC-060 | 10 | - | - | 10 |
| GDPR Consent & Cookies | TC-061 to TC-070 | 10 | - | - | 10 |
| Price Display EUR + RON | TC-071 to TC-080 | 10 | - | - | 10 |
| Email Submission | TC-081 to TC-090 | 10 | - | - | 10 |
| Admin Interface | TC-091 to TC-100 | 10 | - | - | 10 |
| **TOTAL** | TC-001 to TC-100 | **100** | **-** | **-** | **100** |

---
---

# Cazuri de Test — XploreCruiseTravel (RO)

**Versiune:** 1.0
**Data:** 2026-03-01
**Total Cazuri de Test:** 100 (TC-001 la TC-100)
**Legenda Status:** 🔲 Netestat | ✅ Trecut | ❌ Eșuat | ⏭️ Omis

---

## Cuprins

1. [Navigare și Rutare (TC-001 la TC-010)](#1-navigare-și-rutare)
2. [Schimbarea Limbii EN/RO (TC-011 la TC-020)](#2-schimbarea-limbii-enro)
3. [Listare și Filtrare Croaziere (TC-021 la TC-030)](#3-listare-și-filtrare-croaziere)
4. [Fluxul Modalului de Rezervare (TC-031 la TC-040)](#4-fluxul-modalului-de-rezervare)
5. [Formularul de Contact (TC-041 la TC-050)](#5-formularul-de-contact)
6. [Design Responsiv (TC-051 la TC-060)](#6-design-responsiv)
7. [Consimțământ GDPR și Banner Cookie (TC-061 la TC-070)](#7-consimțământ-gdpr-și-banner-cookie)
8. [Afișare Prețuri EUR + RON (TC-071 la TC-080)](#8-afișare-prețuri-eur--ron)
9. [Trimitere Email (TC-081 la TC-090)](#9-trimitere-email)
10. [Interfața de Administrare (TC-091 la TC-100)](#10-interfața-de-administrare)

---

## 1. Navigare și Rutare

### TC-001: Încărcare Pagină Principală
- **Descriere:** Verifică încărcarea corectă a paginii principale cu toate secțiunile vizibile.
- **Precondiții:** Serverul rulează; browserul este deschis.
- **Pași:**
  1. Navighează la `index.html`.
  2. Așteaptă încărcarea completă a paginii.
  3. Derulează prin întreaga pagină.
- **Rezultat Așteptat:** Secțiunea hero, modulul de căutare, bara de încredere, croazierele recomandate, destinațiile, secțiunea „De Ce Croazieră", blocul consultant, contorul de statistici, CTA și footer-ul sunt toate afișate. Fără erori în consolă.
- **Status:** 🔲

### TC-002: Navigare la Listarea Croazierelor
- **Descriere:** Verifică navigarea de pe pagina principală la pagina de listare croaziere.
- **Precondiții:** Pagina principală este încărcată.
- **Pași:**
  1. Click pe link-ul „Croaziere" din navigarea din header.
- **Rezultat Așteptat:** Browserul navighează la `pages/listing.html`. Pagina de listare se încarcă cu carduri de croaziere afișate.
- **Status:** 🔲

### TC-003: Navigare la Despre Noi
- **Descriere:** Verifică navigarea la pagina Despre Noi.
- **Precondiții:** Orice pagină este încărcată.
- **Pași:**
  1. Click pe link-ul „Despre Noi" din navigarea din header.
- **Rezultat Așteptat:** Browserul navighează la `pages/about.html`. Pagina se încarcă cu membrii echipei și cardurile „De Ce Să Ne Alegeți".
- **Status:** 🔲

### TC-004: Navigare la Contact
- **Descriere:** Verifică navigarea la pagina de Contact.
- **Precondiții:** Orice pagină este încărcată.
- **Pași:**
  1. Click pe link-ul „Contact" din navigarea din header.
- **Rezultat Așteptat:** Browserul navighează la `pages/contact.html`. Formularul de contact și informațiile din sidebar sunt afișate.
- **Status:** 🔲

### TC-005: Logo-ul Navighează la Pagina Principală
- **Descriere:** Verifică că apăsarea pe logo duce la pagina principală.
- **Precondiții:** Utilizatorul este pe o sub-pagină (ex. listing.html).
- **Pași:**
  1. Click pe logo-ul XploreCruiseTravel din header.
- **Rezultat Așteptat:** Browserul navighează la `index.html` (pagina principală).
- **Status:** 🔲

### TC-006: Evidențierea Link-ului de Navigare Activ
- **Descriere:** Verifică evidențierea vizuală a link-ului paginii curente în navigare.
- **Precondiții:** Niciuna.
- **Pași:**
  1. Navighează la `pages/contact.html`.
  2. Inspectează link-ul „Contact" din nav.
- **Rezultat Așteptat:** Link-ul „Contact" are clasa `nav__link--active` aplicată, afișându-se cu stil distinct (subliniere sau culoare accent).
- **Status:** 🔲

### TC-007: Link-urile din Footer Funcționează
- **Descriere:** Verifică că link-urile din footer (Termeni, Confidențialitate) navighează corect.
- **Precondiții:** Pagina principală este încărcată.
- **Pași:**
  1. Derulează la footer.
  2. Click pe link-ul „Termeni și Condiții".
  3. Înapoi. Click pe link-ul „Politica de Confidențialitate".
- **Rezultat Așteptat:** Fiecare link navighează la pagina corespunzătoare (`pages/terms.html`, `pages/privacy.html`).
- **Status:** 🔲

### TC-008: Cardurile de Croazieră Duc la Pagina de Detaliu
- **Descriere:** Verifică că apăsarea pe un card de croazieră navighează la pagina de detaliu cu ID-ul corect.
- **Precondiții:** Pagina principală sau de listare este încărcată cu carduri de croaziere.
- **Pași:**
  1. Click pe butonul „Vezi Detalii" al primului card de croazieră.
- **Rezultat Așteptat:** Browserul navighează la `pages/detail.html?id=<cruise-id>`. Pagina de detaliu se încarcă cu informațiile corecte ale croazierei.
- **Status:** 🔲

### TC-009: Pagina de Detaliu cu ID Invalid
- **Descriere:** Verifică comportamentul la navigarea la pagina de detaliu cu un ID de croazieră inexistent.
- **Precondiții:** Niciuna.
- **Pași:**
  1. Navighează direct la `pages/detail.html?id=inexistent999`.
- **Rezultat Așteptat:** Pagina gestionează eroarea elegant, afișând un mesaj „Croazieră negăsită" sau redirecționând la pagina de listare. Fără erori JS netratate.
- **Status:** 🔲

### TC-010: Butonul Flotant WhatsApp
- **Descriere:** Verifică prezența și funcționalitatea butonului flotant WhatsApp.
- **Precondiții:** Orice pagină este încărcată.
- **Pași:**
  1. Localizează butonul verde flotant WhatsApp din dreapta jos.
  2. Verifică atributul `href`.
- **Rezultat Așteptat:** Butonul este vizibil pe toate paginile. Link-ul duce la `https://wa.me/40749558572`.
- **Status:** 🔲

---

## 2. Schimbarea Limbii EN/RO

### TC-011: Limba Implicită este Engleză
- **Descriere:** Verifică că site-ul se încarcă în engleză implicit când nu există preferință salvată.
- **Precondiții:** Șterge localStorage (cheia `xct_lang`). Fără vizită anterioară.
- **Pași:**
  1. Deschide pagina principală.
  2. Verifică textul butonului de comutare a limbii.
  3. Verifică că conținutul paginii este în engleză.
- **Rezultat Așteptat:** Butonul de comutare arată „RO" (indicând opțiunea de schimbare). Tot conținutul text este în engleză.
- **Status:** 🔲

### TC-012: Comutare Limbă la Română
- **Descriere:** Verifică că apăsarea pe butonul de comutare schimbă tot conținutul în română.
- **Precondiții:** Site-ul este în engleză.
- **Pași:**
  1. Click pe butonul „RO".
  2. Observă toate elementele text de pe pagină.
- **Rezultat Așteptat:** Toate elementele cu atribute `data-i18n` afișează text în română. Butonul arată acum „EN". Link-urile de navigare afișează „Croaziere", „Despre Noi", „Contact".
- **Status:** 🔲

### TC-013: Comutare Limbă Înapoi la Engleză
- **Descriere:** Verifică comutarea din română înapoi în engleză.
- **Precondiții:** Site-ul este în română.
- **Pași:**
  1. Click pe butonul „EN".
- **Rezultat Așteptat:** Tot conținutul revine la engleză. Butonul arată din nou „RO".
- **Status:** 🔲

### TC-014: Preferința de Limbă Persistă între Pagini
- **Descriere:** Verifică că limba selectată persistă la navigarea între pagini.
- **Precondiții:** Site-ul este în engleză.
- **Pași:**
  1. Comută limba la română.
  2. Navighează la pagina de Contact.
  3. Verifică limba.
- **Rezultat Așteptat:** Pagina de contact se încarcă în română. Butonul arată „EN".
- **Status:** 🔲

### TC-015: Preferința de Limbă Persistă între Sesiuni
- **Descriere:** Verifică că preferința de limbă este salvată în localStorage și persistă după restart.
- **Precondiții:** Niciuna.
- **Pași:**
  1. Comută limba la română.
  2. Închide tab-ul browserului.
  3. Redeschide site-ul.
- **Rezultat Așteptat:** Site-ul se încarcă în română. `localStorage.getItem('xct_lang')` returnează `'ro'`.
- **Status:** 🔲

### TC-016: Conținutul Cardurilor de Croazieră se Traduce
- **Descriere:** Verifică că cardurile de croazieră afișează conținut tradus la schimbarea limbii.
- **Precondiții:** Pagina principală este încărcată în engleză cu carduri de croaziere vizibile.
- **Pași:**
  1. Notează titlul și destinația unui card.
  2. Comută la română.
  3. Verifică același card.
- **Rezultat Așteptat:** Titlul cardului folosește câmpul `titleRo`, destinația folosește `destinationRo`. Porturile și descrierile se traduc de asemenea.
- **Status:** 🔲

### TC-017: Dropdown-urile de Căutare se Traduc
- **Descriere:** Verifică traducerea dropdown-urilor de căutare de pe pagina principală.
- **Precondiții:** Pagina principală este încărcată.
- **Pași:**
  1. Deschide dropdown-ul de destinație în engleză și notează opțiunile.
  2. Comută la română.
  3. Deschide din nou dropdown-ul.
- **Rezultat Așteptat:** Etichetele dropdown-urilor și textul placeholder sunt în română.
- **Status:** 🔲

### TC-018: Pagina de Detaliu se Traduce
- **Descriere:** Verifică traducerea corectă a conținutului paginii de detaliu.
- **Precondiții:** Pagina de detaliu este încărcată cu un ID valid.
- **Pași:**
  1. Notează titlul, porturile, elementele incluse, excluse și nota consultantului în engleză.
  2. Comută la română.
- **Rezultat Așteptat:** Titlul arată `titleRo`, porturile arată `portsRo`, listele incluse/excluse arată echivalentele în română, nota consultantului arată `advisorNoteRo`.
- **Status:** 🔲

### TC-019: Modalul de Rezervare se Traduce
- **Descriere:** Verifică traducerea conținutului modalului de rezervare.
- **Precondiții:** Modalul de rezervare este deschis la Pasul 1.
- **Pași:**
  1. Notează toate etichetele și butoanele în engleză.
  2. Închide modalul. Comută la română. Redeschide modalul.
- **Rezultat Așteptat:** Toate etichetele, indicatorii de pas, butoanele și textul de consimțământ GDPR se afișează în română.
- **Status:** 🔲

### TC-020: Fallback pentru Chei de Traducere Lipsă
- **Descriere:** Verifică că cheile de traducere lipsă folosesc fallback-ul în engleză.
- **Precondiții:** i18n.js este încărcat.
- **Pași:**
  1. În consola browserului, apelează `t('cheie_inexistenta')`.
- **Rezultat Așteptat:** Funcția returnează string-ul cheii (`'cheie_inexistenta'`) ca fallback. Fără eroare aruncată.
- **Status:** 🔲

---

## 3. Listare și Filtrare Croaziere

### TC-021: Pagina de Listare Încarcă Toate Croazierele
- **Descriere:** Verifică afișarea tuturor croazierelor din cruises.json pe pagina de listare.
- **Precondiții:** Navighează la pagina de listare.
- **Pași:**
  1. Deschide `pages/listing.html`.
  2. Numără cardurile de croaziere afișate.
- **Rezultat Așteptat:** Toate cele 6 croaziere din `data/cruises.json` sunt afișate ca carduri. Fiecare card arată imagine, titlu, destinație, durată, preț și buton „Vezi Detalii".
- **Status:** 🔲

### TC-022: Filtrare după Destinație
- **Descriere:** Verifică filtrarea croazierelor după destinație.
- **Precondiții:** Pagina de listare este încărcată.
- **Pași:**
  1. Selectează „Mediterana" din dropdown-ul de filtrare destinație.
  2. Observă rezultatele.
- **Rezultat Așteptat:** Doar croazierele cu destinația „Mediterana" sunt afișate. Celelalte sunt ascunse. Numărul de rezultate se actualizează.
- **Status:** 🔲

### TC-023: Filtrare după Linie de Croazieră
- **Descriere:** Verifică filtrarea croazierelor după linie de croazieră.
- **Precondiții:** Pagina de listare este încărcată.
- **Pași:**
  1. Selectează „MSC Cruises" din filtrul de linie de croazieră.
- **Rezultat Așteptat:** Doar croazierele MSC sunt afișate.
- **Status:** 🔲

### TC-024: Filtrare după Durată
- **Descriere:** Verifică filtrarea croazierelor după durată.
- **Precondiții:** Pagina de listare este încărcată.
- **Pași:**
  1. Selectează un interval de durată (ex. „7-9 nopți") din filtrul de durată.
- **Rezultat Așteptat:** Doar croazierele în intervalul de durată selectat sunt afișate.
- **Status:** 🔲

### TC-025: Filtre Combinate
- **Descriere:** Verifică funcționarea mai multor filtre simultan.
- **Precondiții:** Pagina de listare este încărcată.
- **Pași:**
  1. Selectează destinația „Mediterana".
  2. Selectează durata „7-9 nopți".
- **Rezultat Așteptat:** Doar croazierele care corespund AMBELOR criterii sunt afișate. Dacă nicio croazieră nu se potrivește, apare un mesaj „fără rezultate".
- **Status:** 🔲

### TC-026: Sortare după Preț (Crescător)
- **Descriere:** Verifică sortarea croazierelor după preț crescător.
- **Precondiții:** Pagina de listare este încărcată.
- **Pași:**
  1. Selectează „Preț: Mic la Mare" din dropdown-ul de sortare.
- **Rezultat Așteptat:** Cardurile se reordonează astfel încât cea mai ieftină croazieră apare prima și cea mai scumpă ultima.
- **Status:** 🔲

### TC-027: Sortare după Preț (Descrescător)
- **Descriere:** Verifică sortarea croazierelor după preț descrescător.
- **Precondiții:** Pagina de listare este încărcată.
- **Pași:**
  1. Selectează „Preț: Mare la Mic" din dropdown-ul de sortare.
- **Rezultat Așteptat:** Cardurile se reordonează cu cea mai scumpă croazieră prima.
- **Status:** 🔲

### TC-028: Resetare Filtre
- **Descriere:** Verifică că resetarea filtrelor arată toate croazierele.
- **Precondiții:** Unele filtre sunt aplicate.
- **Pași:**
  1. Aplică filtrul de destinație „Caraibe".
  2. Resetează toate filtrele (selectează „Toate" pentru fiecare dropdown).
- **Rezultat Așteptat:** Toate cele 6 croaziere sunt afișate din nou.
- **Status:** 🔲

### TC-029: Căutarea din Pagina Principală Completează Filtrele din Listare
- **Descriere:** Verifică că utilizarea modulului de căutare de pe pagina principală pre-completează filtrele din listare.
- **Precondiții:** Pagina principală este încărcată.
- **Pași:**
  1. În modulul de căutare, selectează destinația „Europa de Nord" și luna „Iunie".
  2. Click „Caută Croaziere".
- **Rezultat Așteptat:** Browserul navighează la `pages/listing.html` cu parametri URL. Filtrele sunt pre-completate și rezultatele sunt filtrate corespunzător.
- **Status:** 🔲

### TC-030: Mesaj Fără Rezultate
- **Descriere:** Verifică mesajul corespunzător când nicio croazieră nu corespunde filtrelor.
- **Precondiții:** Pagina de listare este încărcată.
- **Pași:**
  1. Aplică combinații de filtre care nu produc rezultate.
- **Rezultat Așteptat:** Un mesaj prietenos „nicio croazieră găsită" este afișat. Fără grilă goală sau pagină albă.
- **Status:** 🔲

---

## 4. Fluxul Modalului de Rezervare

### TC-031: Deschidere Modal Rezervare
- **Descriere:** Verifică deschiderea modalului de rezervare la click pe „Solicită Ofertă".
- **Precondiții:** Pagina de detaliu este încărcată pentru o croazieră validă.
- **Pași:**
  1. Click pe butonul „Solicită Ofertă" / „Rezervă Acum" de pe pagina de detaliu.
- **Rezultat Așteptat:** Apare un overlay modal cu Pasul 1 (Date Personale) vizibil. Fundalul este estompat. Scroll-ul body-ului este dezactivat.
- **Status:** 🔲

### TC-032: Pasul 1 - Validare Date Personale
- **Descriere:** Verifică că Pasul 1 necesită toate câmpurile obligatorii.
- **Precondiții:** Modalul de rezervare este deschis la Pasul 1.
- **Pași:**
  1. Lasă toate câmpurile goale.
  2. Click „Următorul".
- **Rezultat Așteptat:** Validarea formularului previne avansarea. Indicatori de eroare apar pe câmpurile obligatorii (Nume Complet, Email, Telefon).
- **Status:** 🔲

### TC-033: Pasul 1 - Validare Format Email
- **Descriere:** Verifică validarea formatului câmpului email.
- **Precondiții:** Modalul de rezervare este deschis la Pasul 1.
- **Pași:**
  1. Introdu „emailinvalid" în câmpul email.
  2. Completează celelalte câmpuri obligatorii.
  3. Click „Următorul".
- **Rezultat Așteptat:** Eroare de validare pentru format email invalid. Utilizatorul nu poate avansa la Pasul 2.
- **Status:** 🔲

### TC-034: Tranziția Pasul 1 la Pasul 2
- **Descriere:** Verifică avansarea de la Pasul 1 la Pasul 2.
- **Precondiții:** Modalul de rezervare este deschis la Pasul 1.
- **Pași:**
  1. Completează Nume Complet: „Ion Popescu".
  2. Completează Email: „ion@exemplu.com".
  3. Completează Telefon: „+40721234567".
  4. Click „Următorul".
- **Rezultat Așteptat:** Modalul trece la Pasul 2 (Selectare Croazieră). Indicatorul de pas se actualizează. Datele de la Pasul 1 sunt păstrate.
- **Status:** 🔲

### TC-035: Pasul 2 - Croaziera Pre-selectată
- **Descriere:** Verifică că Pasul 2 are croaziera pre-selectată când este deschis de pe pagina de detaliu.
- **Precondiții:** Modalul deschis de pe pagina de detaliu a unei croaziere specifice.
- **Pași:**
  1. Completează Pasul 1 și avansează la Pasul 2.
  2. Verifică câmpul de selectare croazieră.
- **Rezultat Așteptat:** Croaziera de pe pagina de detaliu este pre-selectată. Opțiunile de tip cabină sunt disponibile.
- **Status:** 🔲

### TC-036: Pasul 2 - Selectare Tip Cabină și Pasageri
- **Descriere:** Verifică selectarea tipului de cabină și a numărului de pasageri.
- **Precondiții:** Modalul de rezervare este la Pasul 2.
- **Pași:**
  1. Selectează tipul cabinei „Balcon".
  2. Setează numărul de pasageri la 2.
  3. Adaugă cereri speciale: „Celebrare luna de miere".
- **Rezultat Așteptat:** Toate selecțiile sunt acceptate și salvate. Utilizatorul poate avansa la Pasul 3.
- **Status:** 🔲

### TC-037: Tranziția Pasul 2 la Pasul 3
- **Descriere:** Verifică avansarea de la Pasul 2 la Pasul 3 (Recenzie).
- **Precondiții:** Pasul 2 este completat.
- **Pași:**
  1. Click „Următorul" la Pasul 2.
- **Rezultat Așteptat:** Modalul trece la Pasul 3 (Verificare și Confirmare). Toate datele introduse anterior sunt afișate într-un rezumat.
- **Status:** 🔲

### TC-038: Pasul 3 - Acuratețea Rezumatului
- **Descriere:** Verifică afișarea corectă a tuturor datelor introduse la Pasul 3.
- **Precondiții:** Modalul de rezervare este la Pasul 3.
- **Pași:**
  1. Revizuiește toate informațiile afișate.
- **Rezultat Așteptat:** Rezumatul arată: Nume Complet, Email, Telefon, Croaziera Selectată, Tip Cabină, Număr Pasageri, Cereri Speciale și prețul estimat. Toate valorile corespund cu cele introduse.
- **Status:** 🔲

### TC-039: Pasul 3 - Consimțământ GDPR Obligatoriu
- **Descriere:** Verifică că trimiterea necesită bifa de consimțământ GDPR.
- **Precondiții:** Modalul de rezervare este la Pasul 3.
- **Pași:**
  1. Lasă checkbox-ul de consimțământ GDPR nebifat.
  2. Click „Trimite".
- **Rezultat Așteptat:** Trimiterea este blocată. Utilizatorul este notificat să accepte politica de confidențialitate / consimțământul GDPR.
- **Status:** 🔲

### TC-040: Închidere Modal Rezervare
- **Descriere:** Verifică că modalul de rezervare poate fi închis de la orice pas.
- **Precondiții:** Modalul de rezervare este deschis la orice pas.
- **Pași:**
  1. Click pe butonul de închidere (X) al modalului.
  2. Alternativ, click în afara overlay-ului modalului.
- **Rezultat Așteptat:** Modalul se închide. Scroll-ul fundal este reactivat. Nu se trimit date.
- **Status:** 🔲

---

## 5. Formularul de Contact

### TC-041: Formularul de Contact se Afișează Corect
- **Descriere:** Verifică afișarea tuturor câmpurilor formularului de contact.
- **Precondiții:** Pagina de contact este încărcată.
- **Pași:**
  1. Navighează la `pages/contact.html`.
  2. Inspectează câmpurile formularului.
- **Rezultat Așteptat:** Formularul conține: Nume Complet, Email, Telefon, Croazieră de Interes (opțional), Mesaj, Checkbox consimțământ și butonul Trimite.
- **Status:** 🔲

### TC-042: Validare Câmpuri Obligatorii
- **Descriere:** Verifică aplicarea validării câmpurilor obligatorii.
- **Precondiții:** Formularul de contact este vizibil.
- **Pași:**
  1. Lasă toate câmpurile goale.
  2. Click „Trimite Mesajul".
- **Rezultat Așteptat:** Validarea nativă a browserului previne trimiterea. Câmpurile obligatorii (Nume, Email, Mesaj) sunt evidențiate.
- **Status:** 🔲

### TC-043: Validare Email
- **Descriere:** Verifică validarea formatului câmpului email.
- **Precondiții:** Formularul de contact este vizibil.
- **Pași:**
  1. Introdu „nueemail" în câmpul email.
  2. Completează celelalte câmpuri obligatorii.
  3. Click „Trimite Mesajul".
- **Rezultat Așteptat:** Eroare de validare pentru format email invalid.
- **Status:** 🔲

### TC-044: Checkbox Consimțământ Obligatoriu
- **Descriere:** Verifică că checkbox-ul de consimțământ trebuie bifat pentru trimitere.
- **Precondiții:** Formularul de contact este vizibil.
- **Pași:**
  1. Completează toate câmpurile corect.
  2. Lasă checkbox-ul de consimțământ nebifat.
  3. Click „Trimite Mesajul".
- **Rezultat Așteptat:** Trimiterea formularului este blocată. Checkbox-ul de consimțământ este marcat ca obligatoriu.
- **Status:** 🔲

### TC-045: Trimitere Reușită a Formularului
- **Descriere:** Verifică fluxul de trimitere reușită a formularului de contact.
- **Precondiții:** EmailJS este configurat. Formularul este vizibil.
- **Pași:**
  1. Completează Nume: „Utilizator Test".
  2. Completează Email: „test@exemplu.com".
  3. Completează Telefon: „+40700000000".
  4. Completează Mesaj: „Mesaj de test".
  5. Bifează checkbox-ul de consimțământ.
  6. Click „Trimite Mesajul".
- **Rezultat Așteptat:** Formularul se trimite cu succes. Un mesaj de confirmare este afișat utilizatorului. Câmpurile formularului sunt golite.
- **Status:** 🔲

### TC-046: Câmpul Telefon este Opțional
- **Descriere:** Verifică trimiterea formularului fără număr de telefon.
- **Precondiții:** Formularul de contact este vizibil.
- **Pași:**
  1. Completează Nume și Email.
  2. Lasă Telefonul gol.
  3. Completează Mesajul. Bifează consimțământul.
  4. Click „Trimite Mesajul".
- **Rezultat Așteptat:** Formularul se trimite cu succes fără număr de telefon.
- **Status:** 🔲

### TC-047: Croaziera de Interes Pre-completată din URL
- **Descriere:** Verifică pre-completarea câmpului de interes la navigarea de pe pagina de detaliu.
- **Precondiții:** Niciuna.
- **Pași:**
  1. Navighează la `pages/contact.html?cruise=MSC+Meraviglia+Mediterana`.
  2. Verifică câmpul „Croazieră de Interes".
- **Rezultat Așteptat:** Câmpul este pre-completat cu numele croazierei din parametrul URL.
- **Status:** 🔲

### TC-048: Informații Contact în Sidebar
- **Descriere:** Verifică afișarea corectă a informațiilor din sidebar-ul de contact.
- **Precondiții:** Pagina de contact este încărcată.
- **Pași:**
  1. Verifică sidebar-ul din dreapta.
- **Rezultat Așteptat:** Sidebar-ul afișează: Telefon (+40 749 558 572), WhatsApp (+40 749 558 572), Email (xplorecruisetravel@gmail.com), Program (Luni-Vineri 09:00-20:00, Sâmbătă-Duminică 10:00-18:00), Numele consultantului (Ceausu Daniel Antonina).
- **Status:** 🔲

### TC-049: Link WhatsApp în Sidebar
- **Descriere:** Verifică funcționalitatea link-ului WhatsApp din sidebar.
- **Precondiții:** Pagina de contact este încărcată.
- **Pași:**
  1. Click pe link-ul WhatsApp din sidebar.
- **Rezultat Așteptat:** Link-ul deschide `https://wa.me/40749558572` (chat WhatsApp cu numărul corect).
- **Status:** 🔲

### TC-050: Link Telefon în Sidebar
- **Descriere:** Verifică funcționalitatea link-ului de apel telefonic.
- **Precondiții:** Pagina de contact este încărcată.
- **Pași:**
  1. Inspectează atributul href al link-ului de telefon.
- **Rezultat Așteptat:** `href` este `tel:+40749558572`, permițând apelarea prin click pe dispozitive mobile.
- **Status:** 🔲

---

## 6. Design Responsiv

### TC-051: Layout Desktop (1280px+)
- **Descriere:** Verifică afișarea corectă a site-ului pe desktop.
- **Precondiții:** Fereastra browserului are lățimea de 1280px sau mai mare.
- **Pași:**
  1. Navighează la pagina principală.
  2. Verifică layout-ul header-ului, hero-ului, grilei de croaziere, footer-ului.
- **Rezultat Așteptat:** Bara de navigare completă este vizibilă. Cardurile de croaziere se afișează într-o grilă multi-coloană (3-4 coloane). Conținutul sidebar este adiacent conținutului principal. Fără scroll orizontal.
- **Status:** 🔲

### TC-052: Layout Tabletă (768px - 991px)
- **Descriere:** Verifică adaptarea site-ului pentru ecrane de tabletă.
- **Precondiții:** Fereastra browserului are lățimea de 768px.
- **Pași:**
  1. Navighează la pagina principală.
  2. Verifică ajustările de layout.
- **Rezultat Așteptat:** Cardurile de croaziere se afișează într-o grilă cu 2 coloane. Navigarea poate începe să se condenseze. Tot conținutul rămâne accesibil.
- **Status:** 🔲

### TC-053: Layout Mobil (sub 768px)
- **Descriere:** Verifică adaptarea site-ului pentru ecrane mobile.
- **Precondiții:** Fereastra browserului are lățimea de 375px.
- **Pași:**
  1. Navighează la pagina principală.
  2. Verifică layout-ul.
- **Rezultat Așteptat:** Cardurile de croaziere se stivuiesc într-o singură coloană. Navigarea este ascunsă în spatele unui meniu hamburger. Textul hero se ajustează. Fără overflow sau conținut tăiat.
- **Status:** 🔲

### TC-054: Meniu Hamburger Mobil
- **Descriere:** Verifică comutarea corectă a meniului hamburger pe mobil.
- **Precondiții:** Lățimea browserului sub 768px.
- **Pași:**
  1. Apasă pe iconița meniului hamburger (3 linii).
  2. Observă meniul de navigare.
  3. Apasă pe un element din meniu.
- **Rezultat Așteptat:** Meniul se deschide cu toate link-urile de navigare. Apăsarea unui link navighează la pagină și închide meniul.
- **Status:** 🔲

### TC-055: Pagina de Contact Responsivă
- **Descriere:** Verifică stivuirea corectă a paginii de contact pe mobil.
- **Precondiții:** Viewport mobil (375px).
- **Pași:**
  1. Navighează la pagina de contact.
- **Rezultat Așteptat:** Formularul ocupă lățimea completă. Cardurile din sidebar se stivuiesc sub formular. Tot conținutul este lizibil și accesibil.
- **Status:** 🔲

### TC-056: Pagina de Detaliu Responsivă
- **Descriere:** Verifică utilizabilitatea paginii de detaliu pe mobil.
- **Precondiții:** Viewport mobil (375px). Pagina de detaliu încărcată.
- **Pași:**
  1. Navighează la o pagină de detaliu croazieră.
  2. Verifică tabelul itinerarului, cardurile de preț, sidebar-ul.
- **Rezultat Așteptat:** Tabelul itinerarului este derulabil orizontal sau se redistribuie. Cardurile de preț cabine se stivuiesc vertical. Sidebar-ul se mută sub conținutul principal.
- **Status:** 🔲

### TC-057: Modal Rezervare Responsiv
- **Descriere:** Verifică adaptarea modalului de rezervare pe ecrane mobile.
- **Precondiții:** Viewport mobil. Pagina de detaliu încărcată.
- **Pași:**
  1. Deschide modalul de rezervare pe mobil.
- **Rezultat Așteptat:** Modalul umple lățimea viewport-ului. Toate câmpurile sunt accesibile și dimensionate corespunzător. Navigarea pe pași este utilizabilă cu touch.
- **Status:** 🔲

### TC-058: Imagini Responsive
- **Descriere:** Verifică scalarea corectă a imaginilor pe diferite viewport-uri.
- **Precondiții:** Niciuna.
- **Pași:**
  1. Vizualizează imaginile cardurilor de croaziere la desktop (1280px), tabletă (768px) și mobil (375px).
- **Rezultat Așteptat:** Imaginile se scalează proporțional. Fără distorsiune, overflow sau decupare a conținutului important. Raporturile de aspect sunt menținute.
- **Status:** 🔲

### TC-059: Dimensiuni Font Responsive
- **Descriere:** Verifică lizibilitatea textului pe diferite viewport-uri.
- **Precondiții:** Niciuna.
- **Pași:**
  1. Verifică titlul hero, textul body și textul cardurilor la mobil (375px).
- **Rezultat Așteptat:** Textul nu depășește containerele. Dimensiunile fonturilor sunt ajustate pentru lizibilitate. Textul body minim este de cel puțin 14px pe mobil.
- **Status:** 🔲

### TC-060: Modul de Căutare Responsiv
- **Descriere:** Verifică adaptarea modulului de căutare de pe pagina principală pe mobil.
- **Precondiții:** Viewport mobil (375px).
- **Pași:**
  1. Vizualizează modulul de căutare de pe pagina principală.
  2. Interacționează cu dropdown-urile.
- **Rezultat Așteptat:** Câmpurile de căutare se stivuiesc vertical pe mobil. Dropdown-urile sunt full-width și ușor de accesat. Butonul de căutare este accesibil.
- **Status:** 🔲

---

## 7. Consimțământ GDPR și Banner Cookie

### TC-061: Banner-ul Cookie Apare la Prima Vizită
- **Descriere:** Verifică apariția banner-ului de consimțământ cookie pentru vizitatorii noi.
- **Precondiții:** Șterge localStorage (cheia `xct_cookies`). Fără vizită anterioară.
- **Pași:**
  1. Deschide pagina principală.
- **Rezultat Așteptat:** Banner-ul de consimțământ cookie apare în partea de jos a paginii cu opțiuni „Acceptă" și „Refuză" și o descriere scurtă.
- **Status:** 🔲

### TC-062: Acceptare Cookie-uri
- **Descriere:** Verifică că acceptarea cookie-urilor închide banner-ul și salvează preferința.
- **Precondiții:** Banner-ul cookie este vizibil.
- **Pași:**
  1. Click „Acceptă" pe banner-ul cookie.
- **Rezultat Așteptat:** Banner-ul dispare. `localStorage` stochează preferința de consimțământ. Banner-ul nu mai reapare la încărcările ulterioare.
- **Status:** 🔲

### TC-063: Refuzare Cookie-uri
- **Descriere:** Verifică că refuzarea cookie-urilor închide banner-ul.
- **Precondiții:** Banner-ul cookie este vizibil.
- **Pași:**
  1. Click „Refuză" pe banner-ul cookie.
- **Rezultat Așteptat:** Banner-ul dispare. Preferința este stocată. Funcționalitatea esențială continuă să funcționeze (limba, navigarea).
- **Status:** 🔲

### TC-064: Banner-ul Cookie Nu Reapare După Decizie
- **Descriere:** Verifică că banner-ul rămâne închis între sesiuni.
- **Precondiții:** Preferința cookie a fost setată.
- **Pași:**
  1. Închide browserul.
  2. Redeschide site-ul.
- **Rezultat Așteptat:** Banner-ul cookie nu mai apare.
- **Status:** 🔲

### TC-065: Pagina Termeni și Condiții Accesibilă
- **Descriere:** Verifică încărcarea și completitudinea paginii de Termeni și Condiții.
- **Precondiții:** Niciuna.
- **Pași:**
  1. Navighează la `pages/terms.html`.
- **Rezultat Așteptat:** Pagina se încarcă cu conținutul complet al termenilor în limba curentă (EN sau RO). Conține secțiuni despre descrierea serviciului, condiții de rezervare, răspundere și legislația aplicabilă.
- **Status:** 🔲

### TC-066: Pagina Politică de Confidențialitate Accesibilă
- **Descriere:** Verifică încărcarea paginii de Politică de Confidențialitate și conformitatea GDPR.
- **Precondiții:** Niciuna.
- **Pași:**
  1. Navighează la `pages/privacy.html`.
- **Rezultat Așteptat:** Pagina se încarcă cu conținutul politicii de confidențialitate. Include informații despre operatorul de date, tipurile de date colectate, baza legală, retenția datelor, drepturile utilizatorilor (acces, rectificare, ștergere, portabilitate) și contactul DPO.
- **Status:** 🔲

### TC-067: Checkbox Consimțământ în Rezervare
- **Descriere:** Verifică cerința de consimțământ GDPR în modalul de rezervare.
- **Precondiții:** Modalul de rezervare este la Pasul 3 (Verificare).
- **Pași:**
  1. Încearcă trimiterea fără a bifa checkbox-ul de consimțământ.
- **Rezultat Așteptat:** Trimiterea este blocată. Checkbox-ul de consimțământ este marcat ca obligatoriu.
- **Status:** 🔲

### TC-068: Checkbox Consimțământ în Formularul de Contact
- **Descriere:** Verifică includerea și aplicarea consimțământului GDPR în formularul de contact.
- **Precondiții:** Pagina de contact este încărcată.
- **Pași:**
  1. Completează toate câmpurile. Lasă consimțământul nebifat. Trimite.
- **Rezultat Așteptat:** Formularul nu se trimite. Checkbox-ul de consimțământ este obligatoriu.
- **Status:** 🔲

### TC-069: Link Politică de Confidențialitate în Textul de Consimțământ
- **Descriere:** Verifică prezența unui link clickabil către politica de confidențialitate în textul de consimțământ.
- **Precondiții:** Formularul de contact sau modalul de rezervare este vizibil.
- **Pași:**
  1. Inspectează textul etichetei de consimțământ pentru un link către politica de confidențialitate.
- **Rezultat Așteptat:** Textul de consimțământ include un hyperlink către `pages/privacy.html` care deschide politica de confidențialitate.
- **Status:** 🔲

### TC-070: Banner Cookie în Ambele Limbi
- **Descriere:** Verifică traducerea banner-ului cookie la schimbarea limbii.
- **Precondiții:** Șterge cookie-urile. Deschide site-ul.
- **Pași:**
  1. Notează textul banner-ului cookie în engleză.
  2. Comută limba la română.
  3. Șterge preferința cookie. Reîncarcă.
- **Rezultat Așteptat:** Banner-ul cookie se afișează în română cu textul corespunzător.
- **Status:** 🔲

---

## 8. Afișare Prețuri EUR + RON

### TC-071: Cardul de Croazieră Afișează Prețul în EUR
- **Descriere:** Verifică afișarea prețurilor în EUR pe cardurile de croazieră.
- **Precondiții:** Pagina principală sau de listare este încărcată.
- **Pași:**
  1. Inspectează prețul unui card de croazieră.
- **Rezultat Așteptat:** Prețul este afișat cu simbolul monedei EUR (ex. „de la 899 EUR").
- **Status:** 🔲

### TC-072: Cardul de Croazieră Afișează Echivalentul în RON
- **Descriere:** Verifică afișarea echivalentului în RON pe carduri.
- **Precondiții:** Pagina principală sau de listare este încărcată.
- **Pași:**
  1. Inspectează afișajul prețului pe card.
- **Rezultat Așteptat:** Sub sau lângă prețul EUR, echivalentul RON este afișat (ex. „~4.468 RON"). Conversia folosește rata de 4,97.
- **Status:** 🔲

### TC-073: Acuratețea Conversiei EUR la RON
- **Descriere:** Verifică corectitudinea matematică a conversiei EUR la RON.
- **Precondiții:** Orice pagină cu afișare de prețuri.
- **Pași:**
  1. Notează prețul EUR al unei croaziere (ex. 899 EUR).
  2. Calculează: 899 * 4,97 = 4.468,03.
  3. Compară cu valoarea RON afișată.
- **Rezultat Așteptat:** Valoarea RON afișată corespunde calculului (899 * 4,97 = ~4.468 RON). Rotunjirea este aplicată consistent.
- **Status:** 🔲

### TC-074: Prețuri Cabine pe Pagina de Detaliu
- **Descriere:** Verifică afișarea prețurilor pentru toate tipurile de cabine pe pagina de detaliu.
- **Precondiții:** Pagina de detaliu este încărcată pentru o croazieră cu mai multe tipuri de cabine.
- **Pași:**
  1. Verifică secțiunea de prețuri de pe pagina de detaliu.
- **Rezultat Așteptat:** Fiecare tip de cabină (Interior, Oceanview, Balcon, Suită) arată prețul în EUR și echivalentul în RON. Prețurile corespund datelor din `cruises.json`.
- **Status:** 🔲

### TC-075: Format Afișare Prețuri
- **Descriere:** Verifică formatarea prețurilor cu separatori de mii corespunzători.
- **Precondiții:** Orice pagină cu afișare prețuri.
- **Pași:**
  1. Verifică o valoare de preț de 1000 EUR sau mai mare.
- **Rezultat Așteptat:** Prețurile folosesc formatare corespunzătoare localului (ex. „1.299 EUR" sau „6.455 RON"). Fără numere neformatate.
- **Status:** 🔲

### TC-076: Prețul în Rezumatul Rezervării
- **Descriere:** Verifică afișarea corectă a prețului în rezumatul modalului de rezervare.
- **Precondiții:** Modalul de rezervare este la Pasul 3 (Verificare).
- **Pași:**
  1. Verifică prețul în rezumatul rezervării.
- **Rezultat Așteptat:** Prețul reflectă tipul de cabină selectat. Sunt afișate atât valorile EUR cât și RON. Valorile sunt corecte.
- **Status:** 🔲

### TC-077: Prețuri după Schimbarea Limbii
- **Descriere:** Verifică corectitudinea prețurilor după schimbarea limbii.
- **Precondiții:** Orice pagină cu prețuri vizibile.
- **Pași:**
  1. Notează un preț în modul engleză.
  2. Comută la română.
  3. Verifică același preț.
- **Rezultat Așteptat:** Valorile EUR și RON rămân identice. Doar etichetele/textul din jurul prețului își schimbă limba.
- **Status:** 🔲

### TC-078: Funcția formatPrice
- **Descriere:** Verifică ieșirea corectă a funcției `formatPrice()`.
- **Precondiții:** Consola browserului este deschisă pe orice pagină.
- **Pași:**
  1. În consolă, verifică comportamentul funcției `formatPrice(899)`.
- **Rezultat Așteptat:** Returnează un string formatat conținând „899" cu desemnarea EUR și echivalentul RON (~4.468 RON).
- **Status:** 🔲

### TC-079: Gestionare Prețuri Zero și Null
- **Descriere:** Verifică gestionarea elegantă a prețurilor de caz limită.
- **Precondiții:** Consola browserului este deschisă.
- **Pași:**
  1. Testează `formatPrice(0)`.
  2. Testează `formatPrice(null)`.
  3. Testează `formatPrice(undefined)`.
- **Rezultat Așteptat:** Fără erori JavaScript. Afișează „0 EUR" sau gestionează elegant. Fără NaN sau undefined afișat.
- **Status:** 🔲

### TC-080: Constanta Ratei de Conversie RON
- **Descriere:** Verifică definirea și utilizarea consistentă a constantei EUR_TO_RON.
- **Precondiții:** Consola browserului este deschisă.
- **Pași:**
  1. Verifică constanta `EUR_TO_RON` în codul sursă app.js.
- **Rezultat Așteptat:** Constanta este definită ca `4.97`. Toate calculele RON folosesc această singură constantă (fără valori hardcodate în altă parte).
- **Status:** 🔲

---

## 9. Trimitere Email

### TC-081: SDK-ul EmailJS Încărcat
- **Descriere:** Verifică încărcarea SDK-ului EmailJS pe paginile relevante.
- **Precondiții:** Pagina de contact sau orice pagină cu formular este încărcată.
- **Pași:**
  1. Deschide consola browserului.
  2. Verifică dacă `emailjs` este definit.
- **Rezultat Așteptat:** Obiectul `emailjs` este disponibil global. Fără erori de încărcare în consolă.
- **Status:** 🔲

### TC-082: Trimitere Rezervare prin EmailJS
- **Descriere:** Verifică trimiterea datelor de rezervare prin EmailJS.
- **Precondiții:** EmailJS este configurat cu chei valide. Modalul de rezervare este complet.
- **Pași:**
  1. Completează toți cei 3 pași ai modalului de rezervare.
  2. Bifează consimțământul GDPR. Click Trimite.
  3. Monitorizează cererile de rețea.
- **Rezultat Așteptat:** O cerere HTTP este trimisă la API-ul EmailJS cu datele de rezervare. Service ID este `service_xplore`, template-ul este `template_booking`.
- **Status:** 🔲

### TC-083: Trimitere Formular Contact prin EmailJS
- **Descriere:** Verifică trimiterea datelor formularului de contact prin EmailJS.
- **Precondiții:** EmailJS este configurat. Formularul de contact este completat.
- **Pași:**
  1. Completează și trimite formularul de contact.
  2. Monitorizează cererile de rețea.
- **Rezultat Așteptat:** O cerere HTTP este trimisă la API-ul EmailJS. Service ID este `service_xplore`, template-ul este `template_contact`.
- **Status:** 🔲

### TC-084: Backup localStorage la Trimitere
- **Descriere:** Verifică salvarea datelor formularului în localStorage ca backup.
- **Precondiții:** Orice trimitere de formular.
- **Pași:**
  1. Trimite un formular de rezervare sau contact.
  2. Verifică intrările din localStorage.
- **Rezultat Așteptat:** Datele de trimitere sunt salvate în localStorage ca backup. Intrarea include timestamp și toate câmpurile formularului.
- **Status:** 🔲

### TC-085: Fallback Mailto
- **Descriere:** Verifică activarea fallback-ului mailto dacă EmailJS eșuează.
- **Precondiții:** EmailJS nu este configurat (PUBLIC_KEY este 'YOUR_PUBLIC_KEY') sau rețeaua este offline.
- **Pași:**
  1. Încearcă trimiterea unui formular.
- **Rezultat Așteptat:** După eșecul EmailJS, un link `mailto:` este generat sau clientul de email implicit se deschide cu date pre-completate ca alternativă. Utilizatorul este informat.
- **Status:** 🔲

### TC-086: Mesaj de Succes După Trimitere
- **Descriere:** Verifică afișarea unei confirmări de succes după trimiterea formularului.
- **Precondiții:** Formularul este trimis cu succes.
- **Pași:**
  1. Trimite un formular de contact sau rezervare.
- **Rezultat Așteptat:** Un mesaj vizibil de succes (ex. „Mulțumim! Vă contactăm în maxim 2 ore.") este afișat. Câmpurile formularului sunt golite.
- **Status:** 🔲

### TC-087: Gestionarea Erorilor la Eșecul Trimiterii
- **Descriere:** Verifică gestionarea erorilor când trimiterea eșuează.
- **Precondiții:** Rețeaua este deconectată sau EmailJS este configurat greșit.
- **Pași:**
  1. Deconectează de la internet.
  2. Încearcă trimiterea unui formular.
- **Rezultat Așteptat:** Un mesaj de eroare prietenos apare (nu o eroare tehnică brută). Utilizatorul este informat că trimiterea a eșuat și i se oferă alternative (telefon, email, WhatsApp).
- **Status:** 🔲

### TC-088: Abonare Newsletter
- **Descriere:** Verifică funcționarea formularului de newsletter din footer.
- **Precondiții:** Pagina principală este încărcată.
- **Pași:**
  1. Derulează la footer.
  2. Introdu un email în câmpul de newsletter.
  3. Click abonare.
- **Rezultat Așteptat:** Abonarea este procesată. Un mesaj de succes este afișat.
- **Status:** 🔲

### TC-089: Prevenire Trimitere Duplicat
- **Descriere:** Verifică prevenirea trimiterilor duplicate rapide.
- **Precondiții:** Formularul de contact este completat și gata.
- **Pași:**
  1. Click „Trimite Mesajul" rapid de mai multe ori.
- **Rezultat Așteptat:** Doar o singură trimitere este procesată. Butonul este dezactivat după primul click sau o stare de încărcare previne re-trimiterea.
- **Status:** 🔲

### TC-090: Verificare Configurare Cheie Publică EmailJS
- **Descriere:** Verifică gestionarea elegantă a EmailJS neconfigurat.
- **Precondiții:** `EMAILJS_PUBLIC_KEY` este setat la `'YOUR_PUBLIC_KEY'` (placeholder implicit).
- **Pași:**
  1. Încearcă trimiterea unui formular.
- **Rezultat Așteptat:** Sistemul detectează cheia placeholder și trece la metoda mailto. Fără erori API criptice afișate utilizatorului.
- **Status:** 🔲

---

## 10. Interfața de Administrare

### TC-091: Pagina de Admin Accesibilă
- **Descriere:** Verifică încărcarea paginii de administrare.
- **Precondiții:** Fișierul paginii de admin există (admin.html).
- **Pași:**
  1. Navighează la URL-ul paginii de admin.
- **Rezultat Așteptat:** Interfața de administrare se încarcă cu funcționalitate de gestionare croaziere.
- **Status:** 🔲

### TC-092: Listare Toate Croazierele în Admin
- **Descriere:** Verifică afișarea tuturor croazierelor din cruises.json în panoul de admin.
- **Precondiții:** Pagina de admin este încărcată.
- **Pași:**
  1. Verifică lista de croaziere în interfața de administrare.
- **Rezultat Așteptat:** Toate cele 6 croaziere sunt listate cu detaliile cheie (titlu, destinație, preț, status).
- **Status:** 🔲

### TC-093: Adăugare Croazieră Nouă
- **Descriere:** Verifică adăugarea unei croaziere noi prin admin.
- **Precondiții:** Pagina de admin este încărcată.
- **Pași:**
  1. Click butonul „Adaugă Croazieră Nouă".
  2. Completează toate câmpurile obligatorii (titlu, titleRo, destinație, preț, durată, etc.).
  3. Salvează croaziera.
- **Rezultat Așteptat:** Croaziera nouă este adăugată la date. Apare în lista de admin și pe pagina publică de listare după refresh.
- **Status:** 🔲

### TC-094: Editare Croazieră Existentă
- **Descriere:** Verifică editarea unei croaziere existente.
- **Precondiții:** Pagina de admin este încărcată. Cel puțin o croazieră există.
- **Pași:**
  1. Click „Editează" pe o croazieră din lista de admin.
  2. Schimbă prețul de la 899 la 999.
  3. Salvează modificările.
- **Rezultat Așteptat:** Prețul este actualizat. Modificarea se reflectă pe site-ul public.
- **Status:** 🔲

### TC-095: Ștergere Croazieră
- **Descriere:** Verifică ștergerea unei croaziere din admin.
- **Precondiții:** Pagina de admin este încărcată. Mai multe croaziere există.
- **Pași:**
  1. Click „Șterge" pe o croazieră.
  2. Confirmă ștergerea în dialogul de confirmare.
- **Rezultat Așteptat:** Croaziera este eliminată din date. Nu mai apare pe pagina de listare. Un dialog de confirmare previne ștergerea accidentală.
- **Status:** 🔲

### TC-096: Câmpuri Bilingve în Admin
- **Descriere:** Verifică includerea câmpurilor EN și RO în formularul de admin.
- **Precondiții:** Formularul de adăugare/editare admin este deschis.
- **Pași:**
  1. Verifică câmpuri duble: title/titleRo, destination/destinationRo, ports/portsRo, etc.
- **Rezultat Așteptat:** Fiecare câmp traductibil are atât un input în engleză cât și unul în română. Ambele sunt necesare pentru date complete.
- **Status:** 🔲

### TC-097: Validare Admin
- **Descriere:** Verifică validarea câmpurilor obligatorii în formularul de admin.
- **Precondiții:** Formularul de adăugare admin este deschis.
- **Pași:**
  1. Lasă câmpurile obligatorii goale.
  2. Click „Salvează".
- **Rezultat Așteptat:** Erori de validare afișate pentru câmpurile obligatorii lipsă. Croaziera nu este salvată cu date incomplete.
- **Status:** 🔲

### TC-098: Gestionare Itinerariu în Admin
- **Descriere:** Verifică adăugarea/editarea zilelor de itinerariu pentru o croazieră.
- **Precondiții:** Formularul de editare admin este deschis.
- **Pași:**
  1. Adaugă o zi nouă la itinerariu (Zi, Port, Sosire, Plecare).
  2. Salvează croaziera.
- **Rezultat Așteptat:** Datele de itinerariu sunt salvate. Pagina de detaliu arată itinerarul actualizat.
- **Status:** 🔲

### TC-099: Gestionare URL Imagini în Admin
- **Descriere:** Verifică gestionarea URL-urilor imaginilor de croazieră în admin.
- **Precondiții:** Formularul de editare admin este deschis.
- **Pași:**
  1. Schimbă URL-ul imaginii pentru o croazieră.
  2. Salvează.
- **Rezultat Așteptat:** URL-ul imaginii actualizat este salvat. Cardul de croazieră și pagina de detaliu arată noua imagine.
- **Status:** 🔲

### TC-100: Export Date Admin
- **Descriere:** Verifică posibilitatea de vizualizare sau export al datelor de croaziere din admin.
- **Precondiții:** Pagina de admin este încărcată.
- **Pași:**
  1. Caută o funcție de export sau vizualizare date.
  2. Activează exportul de date.
- **Rezultat Așteptat:** Datele de croaziere pot fi vizualizate ca JSON sau exportate. Datele corespund cu ce este afișat pe site-ul public.
- **Status:** 🔲

---

## Rezumat Execuție Teste

| Categorie | Interval | Total | Trecut | Eșuat | Netestat |
|---|---|---|---|---|---|
| Navigare și Rutare | TC-001 la TC-010 | 10 | - | - | 10 |
| Schimbarea Limbii | TC-011 la TC-020 | 10 | - | - | 10 |
| Listare și Filtrare | TC-021 la TC-030 | 10 | - | - | 10 |
| Modal Rezervare | TC-031 la TC-040 | 10 | - | - | 10 |
| Formular Contact | TC-041 la TC-050 | 10 | - | - | 10 |
| Design Responsiv | TC-051 la TC-060 | 10 | - | - | 10 |
| GDPR și Cookie-uri | TC-061 la TC-070 | 10 | - | - | 10 |
| Afișare Prețuri | TC-071 la TC-080 | 10 | - | - | 10 |
| Trimitere Email | TC-081 la TC-090 | 10 | - | - | 10 |
| Interfața Admin | TC-091 la TC-100 | 10 | - | - | 10 |
| **TOTAL** | TC-001 la TC-100 | **100** | **-** | **-** | **100** |
