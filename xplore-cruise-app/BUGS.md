# Bug Report — XploreCruiseTravel

## Critical

_No critical bugs found._

## Major

### BUG-001: Romanian translations missing diacritics
- **Priority**: Major
- **Impact**: All Romanian text across the site appears without proper diacritics
- **Repro**: Open any page in RO mode. All text uses ASCII equivalents (e.g., "Acasa" instead of "Acasă", "Croaziere" instead of "Croaziere", "Destinatii" instead of "Destinații")
- **Affected file**: `src/i18n/translations.ts`
- **Expected**: Proper Romanian diacritics: ă, â, î, ș, ț (comma-below variants)
- **Fix**: Replace all 131 RO translation values with correct diacritics
- **Evidence**: `npx tsx scripts/i18n-audit.ts` reports 0/131 RO keys with diacritics

### BUG-002: Color contrast violations (WCAG 2 AA)
- **Priority**: Major
- **Impact**: ~60 elements across the site fail WCAG 2 AA contrast ratio (4.5:1)
- **Repro**: Run `npx playwright test e2e/a11y.spec.ts --project=chromium`
- **Primary culprits**:
  - `text-gold-600` on white background: 3.83:1 (needs 4.5:1)
  - `text-gold-500/70` on navy background: 3.95:1 (needs 4.5:1)
  - `text-navy-400` on dark navy backgrounds: 4.36:1 (needs 4.5:1)
- **Affected pages**: Homepage (25), Cruises (25), About (8), Contact (2)
- **Fix**: Darken gold-600 to ~#8B6914 or increase font sizes; lighten navy-400 for dark backgrounds
- **Evidence**: axe-core audit logged in test output

## Minor

### BUG-003: `<img>` used instead of `next/Image` for Daniela's photo
- **Priority**: Minor
- **Impact**: ESLint warnings, slightly slower image loading for Daniela's avatar
- **Repro**: Run `npx next lint`
- **Affected files**: `about/page.tsx` (line 120), `contact/page.tsx` (line 340), `cruises/[slug]/page.tsx` (line 607)
- **Fix**: Replace `<img>` with `<Image>` from `next/image`

### BUG-004: RouteMap useEffect missing dependency
- **Priority**: Minor
- **Impact**: ESLint warning, potential stale closure for translation function
- **Repro**: Run `npx next lint`
- **Affected file**: `src/components/cruise/RouteMap.tsx` (line 424)
- **Fix**: Add `t` to the useEffect dependency array

### BUG-005: Social media links are placeholder anchors
- **Priority**: Minor
- **Impact**: Footer social links (Facebook, Instagram, Twitter) point to `#facebook`, `#instagram`, `#twitter`
- **Repro**: Click any social icon in the footer
- **Affected file**: `src/components/Footer.tsx` (line 53)
- **Fix**: Replace with actual social media profile URLs

### BUG-006: Footer "Contact Person" label not translated
- **Priority**: Minor
- **Impact**: Footer shows "Contact Person" in English regardless of locale
- **Repro**: Open site in RO mode, scroll to footer contact section
- **Affected file**: `src/components/Footer.tsx` (line 109)
- **Fix**: Use i18n key for "Persoana de contact" / "Contact Person"

### BUG-007: Chatbot welcome message shows English in both locales
- **Priority**: Minor
- **Impact**: Chat widget welcome message doesn't change when switching to RO
- **Repro**: Switch to RO mode, open chat widget
- **Affected file**: `src/components/chat/ChatWidget.tsx`
- **Note**: May depend on when widget initializes vs locale change

### BUG-008: Booking modal happy path flaky on WebKit
- **Priority**: Minor
- **Impact**: E2E test for booking 3-step flow occasionally fails on Safari/WebKit
- **Repro**: `npx playwright test e2e/booking-form.spec.ts --project=webkit`
- **Root cause**: Checkbox `.check()` timing in step 3 on WebKit
- **Fix**: Added extra wait, monitor stability
