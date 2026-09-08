# CineScope Design System

Status: migration specification, September 8, 2026. Preserve the existing brand while rebuilding in React and Next.js. This document defines the intended implementation; it does not indicate that the migration has already been built.

## Basis and direction

Reviewed the [live home page](https://jmedal14-lab.github.io/CineScope/) and its catalog with a Batman search, plus the public repository's HTML, stylesheet, and catalog logic. The live results included posters, titles, years, scores, and a missing-poster fallback. They also included a TV series; the new movie-only search should filter media type explicitly. Repository files fetched through web indexing may lag the deployed site.

Keep the warm cream canvas, navy type, orange camera mark, Inter typography, home-cinema illustration, rounded search controls, poster-led cards, and navy footer. These establish a welcoming film-library identity. Extend that identity to new pages rather than switching to an unrelated streaming-service aesthetic.

The original stylesheet uses cream `#F7F3EA`, navy `#0B2545`, orange `#F28C28`, dark gray `#242424`, and gold stars `#FABF2A`. It uses a 1200px container, a 36px wordmark, a 50px hero heading, rounded cards, and hover scaling. All other tokens and layout rules below are proposed refinements. [Source stylesheet](https://raw.githubusercontent.com/jmedal14-lab/CineScope/main/styles.css)

## Color roles

| Role | Light | Dark | Usage |
| --- | --- | --- | --- |
| Canvas | `#F7F3EA` | `#242424` | Page background |
| Surface | `#FFFCF6` | `#303030` | Cards, inputs, dialogs |
| Subtle surface | `#EEE7D9` | `#393939` | Placeholders and chips |
| Primary text | `#0B2545` | `#F7F3EA` | Headings and body |
| Secondary text | `#526176` | `#CAC4BA` | Metadata and supporting copy |
| Brand orange | `#F28C28` | `#F28C28` | Camera mark, fills, decorative highlights |
| Accent text | `#A44908` | `#FFAD5C` | Text links and highlighted words |
| Border | `#CFD2D5` | `#626262` | Card separators |
| Control border | `#657386` | `#AAA397` | Inputs and outlined controls |
| Focus | `#0B2545` | `#FFAD5C` | Keyboard focus outline |
| Rating star | `#FABF2A` | `#FABF2A` | Decorative star beside a textual score |
| Error text | `#B42318` | `#FFB4AB` | Error messages with an icon or label |

Use navy text/icons on orange buttons; avoid small white text on orange. Keep the brighter brand orange for shapes and use the darker accent-text token for text on cream. Verify all final text and control combinations for contrast. Use a 3px focus outline with a 3px offset; adapt the outline to dark hero/footer surfaces.

Light is the default. Retain the existing theme-switch concept with complete semantic token overrides. Theme preference may persist locally, but search state belongs in the URL. The switch must be a labeled button, work in both desktop and mobile navigation, and avoid hydration warnings and a conspicuous theme flash.

## Typography

Use Inter with a system sans-serif fallback. Load one font family with Next.js font support; avoid importing unused Roboto or applying font declarations separately to every element.

| Role | Size | Weight | Line height |
| --- | --- | --- | --- |
| Wordmark | 28px mobile / 36px desktop | 500 | 1.1 |
| Home headline | fluid 32–50px | 700 | 1.2 |
| Movie title / page heading | fluid 28–40px | 700 | 1.2 |
| Section heading | 24px | 700 | 1.3 |
| Lead copy | 18–22px | 500 | 1.5 |
| Body / form controls | 16px | 400–500 | 1.6 |
| Card title | 16px | 600 | 1.35 |
| Metadata / labels | 14px | 400–600 | 1.5 |

Use one h1 per page. Keep uppercase to short eyebrows such as “Find your next watch.” Limit long synopsis lines to approximately 65 characters. Reserve two lines for card titles and expose the full title through the link's accessible name.

## Spacing and layout

- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px.
- Maximum content width: 1200px, centered. Page gutters: 16px mobile, 24px tablet, 32px desktop.
- Header: roughly 80px mobile and 100px desktop; content determines the minimum height.
- Section gaps: 32px mobile, 48–64px desktop. Card gaps: 16px mobile, 24px desktop.
- Breakpoints: 480, 768, 1024, and 1280px. Use fluid sizing between them.
- Movie grid: one column below 360px, two at 360px, three at 640px, four at 960px, five at 1200px. Use `minmax(0, 1fr)`; never assign a fixed 160px mobile card width.
- Card radius: 12px. Button/input radius: 12px. Search-pill radius: 999px. Modal radius: 16px.
- Default card shadow: `0 8px 24px rgb(11 37 69 / 12%)`. Hover shadow: `0 12px 30px rgb(11 37 69 / 20%)`.
- Do not constrain whole cards to a fixed height. Fix artwork aspect ratio and align the information area instead.

## Page compositions

### Home

Header: linked camera wordmark on the left; Home, Catalog, theme control on the right. Use an accessible mobile menu when the links no longer fit. Keep the supplied home-cinema illustration, preserve its proportions, and retain its source/license information.

Desktop hero: introduction and search beside the illustration. Mobile: stack copy, search, then illustration. Keep all content inside the viewport. Use the proposed headline “Find your next great film” in place of the unsupported “world's largest” claim. Preserve “Find your next watch with CineScope” as optional supporting brand copy.

Search has a visible label, descriptive placeholder, and orange submit control. At least 48px tall; max-width around 560px; full width when narrow. The footer uses navy with cream links and the existing creator credit. Only render links with implemented destinations; do not retain inactive `#` links as functioning navigation.

### Catalog and results

`/catalog` is a discoverable film-browsing page, using a clearly labeled popular collection when no query exists. `/search?q=...&page=1&sort=relevance` is the separate search results page. Both share the same grid and search components.

Place a compact search field near the top, then the page heading and sort control, then results. Stack controls on narrow screens. Preserve the familiar A–Z, newest, and rating sort choices and add relevance for searches. Define whether sorting affects the current page or the full result set; label current-page sorting honestly. Pagination changes should retain query and sort.

### Movie detail — new design

Desktop top section: 240–300px poster beside title, year, rating, genre chips, synopsis, metadata, and Watch Trailer. Use a backdrop image only when available, with a navy overlay strong enough to keep cream text readable. With no backdrop, use the solid navy surface. On mobile, stack the poster and content with readable gutters.

Below the hero, return to the standard canvas. Show an optional expanded information section, then Cast, then “More like this.” Cast belongs in the lower portion of the document, not at an arbitrary percentage of the viewport. This keeps the intended order reliable for movies with short or long descriptions.

## Component contracts

| Component | Content and behavior |
| --- | --- |
| SiteHeader | Home-linked logo, real navigation, theme toggle, responsive menu; `aria-current` on the active destination |
| SearchForm | GET navigation; visible label; Enter and button submission; trim query; prevent empty submission |
| MovieCard | One semantic link; 2:3 poster; title, year, source-labeled score, short genre line; optional short summary in roomy layouts |
| ScoreBadge | Decorative star plus e.g. “TMDb 7.8/10”; show “Not rated” for unavailable scores; never relabel TMDb as IMDb |
| SortSelect | Visible label; URL-backed selection; explain sorting scope |
| Pagination | Labeled previous/next controls and current page; disabled edge states; retain all search parameters |
| MovieHero | Poster/backdrop fallbacks, h1, essential metadata, synopsis, trailer trigger |
| CastCard | 2:3 portrait, actor name, character; no misleading clickable styling without an actor destination |
| TrailerModal | Accessible dialog; 16:9 player; heading and close button; roughly 960px maximum width; viewport gutters |
| EmptyState / ErrorState | Short explanation, retained query, actionable retry or refine-search control |
| SkeletonGrid | Match final card geometry and reserve poster space; avoid flashing animation in reduced-motion mode |

MovieCard interaction: use `scale(1.03)` over 200ms with `ease-out` on devices supporting hover, plus a stronger shadow. Apply equivalent focus-visible emphasis. Keep outside grid containers from clipping the enlarged card; clip only the poster inside its own wrapper. Restrict transitions to transform and shadow. Disable scaling and nonessential animation for reduced motion.

Trailer dialog: open only from user action, trap focus, make the background inert, lock background scrolling, close on Escape/backdrop/close button, and restore focus. Unmount the player on close so audio stops. If autoplay is blocked, expose play controls. If embedding fails, offer the verified provider link. If no trailer exists, show “Trailer unavailable.”

Cast: show up to 12 initially, then “Show all cast” when more exist. Use 2 columns on narrow screens, 4 on tablets, up to 6 on desktop, with 16–24px gaps. Recommendations reuse MovieCard, exclude the current movie, and handle absent data without fake suggestions.

## Next.js implementation mapping

Use React with the Next.js App Router and JavaScript (`.js` / `.jsx`) to match the owner's existing language. Use CSS Modules for component styles and global CSS variables for design tokens. TypeScript can be adopted later if requested; no CSS framework is required.

Suggested structure:

```text
app/
  layout.js
  globals.css
  page.js
  catalog/page.js
  search/page.js
  search/loading.js
  search/error.js
  movie/[id]/page.js
  movie/[id]/loading.js
  movie/[id]/error.js
  movie/[id]/not-found.js
components/
  SiteHeader.jsx
  SiteFooter.jsx
  SearchForm.jsx
  MovieCard.jsx
  MovieGrid.jsx
  MovieHero.jsx
  CastSection.jsx
  TrailerModal.jsx
  ThemeProvider.jsx
lib/
  movies.js
  movie-mappers.js
styles/
  tokens.css
public/
  illustrations/
```

Server Components should fetch movie data and render page content. Use small Client Components for trailer state, theme preference, mobile navigation, and any required browser interactions. A native GET search form does not require client state. Pass serializable view models across component boundaries. Do not carry over manual `innerHTML`, inline onclick handlers, or document queries for rendering React-owned UI. [Next.js component guidance](https://nextjs.org/docs/app/getting-started/server-and-client-components)

Use Next.js Link for movie navigation, configured image handling for remote posters, explicit loading/error/not-found routes, and movie-specific metadata. Keep provider credentials in server-only modules and never in `NEXT_PUBLIC_*` variables. Cache appropriate stable movie details with an explicit policy rather than assuming framework defaults.

## Data and hosting decisions

The inspected catalog source searches OMDb and then fetches each result's rating sequentially. It also stores the query in localStorage. Replace this with URL-driven search and a provider adapter that avoids serial requests per card. [Catalog source](https://raw.githubusercontent.com/jmedal14-lab/CineScope/main/catalog.js)

Proposed default: use TMDb for movie search, keyword discovery, movie details, credits, videos, and recommendations. Confirm current endpoints and attribution requirements during implementation. Keep IMDb enrichment optional, using external IDs rather than confusing provider identifiers. A movie record should carry its provider, ID, title, poster, year, genres, and nullable score with source and scale.

Keyword search is not semantic search: search movie titles and keyword names, use relevant keyword IDs for movie discovery, then merge and deduplicate by movie ID. Bound the keyword expansion and keep ranking deterministic, prioritizing exact title matches. Do not claim arbitrary natural-language understanding. Track pagination consistently across sources; do not show one provider's total as the combined total. The simplest first implementation can offer explicit Title / Keyword modes alongside an All mode if combined results need clearer controls. [Keyword search](https://developer.themoviedb.org/reference/search-keyword), [movie discovery](https://developer.themoviedb.org/reference/discover-movie), [movie videos](https://developer.themoviedb.org/reference/movie-videos)

The target architecture requires a deployment with a Next.js server runtime for protected provider access and arbitrary movie URLs. GitHub Pages can host a static export, but that alone cannot run this backend. If retaining Pages becomes a requirement, revisit architecture: use an external backend and a static-compatible routing plan; dynamic paths cannot simply be assumed available on demand. Do not set `output: 'export'` for the proposed server-based build. [Next.js static export limits](https://nextjs.org/docs/app/guides/static-exports)

## Verification for the migration

Review home, results, detail, modal, dark theme, and empty/error states at 360, 768, and 1440px widths. Verify no horizontal overflow, readable long titles, stable image geometry, visible keyboard focus, and touch access. Test a title query, a keyword query, missing artwork, missing trailer, unknown movie ID, slow request, and failed provider request.

Acceptance requires dedicated results and detail URLs; correct movie/trailer identity; cast before recommendations; hover growth without reflow; no audio after closing the modal; meaningful browser history; complete theme colors; and a successful production build with relevant route and interaction checks.
