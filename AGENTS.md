# CineScope — React and Next.js Migration

## Objective

Build a responsive movie discovery website where users can search by movie title or keyword, browse results on a dedicated page, and open a complete movie detail page.

Migrate the owner's existing HTML, CSS, and JavaScript CineScope project to React with the Next.js App Router. Use JavaScript (`.js` / `.jsx`) and CSS Modules with global design tokens. Preserve CineScope's identity while implementing the requested movie discovery flow. Do not perform a generic visual redesign.

Read `DESIGN_SYSTEM.md` beside this file before implementing UI. It contains the reviewed visual baseline, proposed tokens, component contracts, and migration decisions. Use `cinescope-tokens.css` as the starting token layer, copied to `styles/tokens.css` and imported once through the root stylesheet. These files are specifications; do not assume their described features are already implemented.

## Brand and Design Requirements

- Preserve the warm cream canvas (`#F7F3EA`), navy text (`#0B2545`), orange brand accent (`#F28C28`), camera wordmark, Inter typography, home-cinema illustration, and navy footer.
- Use semantic color variables throughout. Keep the existing light/dark theme concept and implement complete theme coverage. Default to light for new users and persist explicit theme preference.
- Use navy text/icons on orange buttons and the accessible accent-text token for orange-toned text on cream. Verify contrast and focus in both themes.
- Center content in a 1200px maximum container, use fluid mobile gutters, and avoid fixed card heights or widths that cause clipping.
- Use the type, spacing, radius, shadow, and responsive rules in `DESIGN_SYSTEM.md`; extend existing tokens before introducing arbitrary values.
- Keep the existing creator credit and asset attribution. Replace the unsupported “world's largest” claim with “Find your next great film.”
- Give every visible navigation/footer link a real destination; omit unfinished placeholder links rather than leaving `#` targets.

## React and Next.js Architecture

- Use `app/layout.js` for the shared header, footer, font setup, global styles, and metadata defaults.
- Implement `/`, `/catalog`, `/search?q=...&page=...&sort=...`, and `/movie/[id]` as distinct routes. The Catalog navigation opens a labeled popular-film collection without requiring a prior search.
- Render pages and fetch provider data with Server Components by default. Keep Client Components focused on interactive state: trailer dialog, theme, mobile menu, and any required client controls.
- Use React props and state rather than manual `innerHTML`, inline HTML event attributes, or document queries to render components.
- Use semantic GET search forms, Next.js Link navigation, movie-specific metadata, and remote-image configuration. Use the installed Next.js version's supported APIs, including asynchronous route values where required.
- Add appropriate loading, error, and not-found UI. Validate movie IDs and handle unknown IDs gracefully.
- Keep data fetching and normalization in server-only modules, independent of view components. Fetch independent detail sections concurrently where supported; avoid a sequential network request for every result card.
- Use URL parameters as the source of truth for query, page, and sort. Do not require localStorage to reconstruct search results.
- Preserve legacy home/catalog entry points with redirects where the chosen hosting platform supports them.
- Keep the existing version recoverable in Git while migrating; do not delete unrelated files or replace the live deployment as a side effect of implementation.

## Pages and Navigation

### Home Page

- Provide a prominent search input with a clear label and a Search button.
- Support submitting with Enter or the Search button.
- Accept movie titles and descriptive keywords. Trim whitespace and prevent empty searches.
- Submit searches to a dedicated results page such as `/search?q=space`; do not display the results solely on the home page.

### Search Results Page

- Read the query from the URL so results can be bookmarked, shared, refreshed, and revisited with browser navigation.
- Display the search term, a search input for refining it, and a responsive grid of relevant movie cards.
- Support title and keyword discovery using the chosen data provider's documented capabilities. If keywords require a separate lookup or discovery endpoint, implement that flow rather than treating every query as a title search.
- Order results by relevance and remove duplicates when combining sources.
- Restrict results to movies. Preserve A–Z, newest, and rating sort options, add relevance, and clearly state when sorting is limited to the loaded page.
- Provide pagination or a Load more control when results exceed one page.
- Include loading, empty-result, and recoverable error states. Preserve the query when a request fails.

### Movie Detail Page

- Clicking a movie card navigates to a dedicated route such as `/movie/:id`.
- Direct links and page refreshes must work without requiring a prior search.
- Place the poster, backdrop where available, title, release year, synopsis, and primary movie information in the upper section.
- Include relevant available metadata: release date, genres, runtime, audience rating or certification, user score with its source and scale, director, language, and release status. Add budget, revenue, or production details when useful and available.
- Omit unavailable optional fields or label them clearly. Never invent movie facts.
- Include a prominent Watch Trailer button when a playable trailer exists.
- Place the cast section in the lower half of the page, after the main movie information.
- Place related or recommended movies underneath the cast section.
- Provide clear navigation back to search results when applicable, preserving the search query and pagination state.

## Movie Cards

- Display the poster, movie title, release year, score when available, and a concise overview or genre summary.
- Keep card layouts consistent and avoid text overflowing their bounds.
- Use a meaningful poster placeholder when artwork is missing.
- Make the card a semantic link to its movie detail page, accessible by keyboard and pointer.
- On hover, grow the card slightly using a smooth transform, approximately `scale(1.03)`, with a transition around 150–250 ms.
- Scaling must not shift the surrounding grid or clip the card. Leave enough spacing for the effect.
- Provide a visible keyboard focus state and an equivalent emphasis for keyboard users.
- Respect `prefers-reduced-motion`; remove or minimize animated scaling for those users.
- Ensure cards remain fully usable on touch devices without hover.

## Trailer Modal

- Clicking Watch Trailer opens an accessible modal on the current movie page and loads the correct movie's trailer.
- Prefer an official trailer in the user's language when the provider identifies one; use a sensible available fallback.
- Start playback when browser and video-provider policies allow. Otherwise, show an obvious play control.
- Include a clearly labeled close button. Support Escape to close and clicking the backdrop to dismiss.
- Move focus into the modal, keep keyboard focus inside while open, and return focus to the trailer button when closed.
- Prevent background scrolling and interaction while the modal is open.
- Stop playback and unload or reset the player when the modal closes or the user navigates away.
- Use a responsive video aspect ratio and a descriptive player title.
- If no playable trailer exists, show a clear unavailable state instead of a broken button.
- Handle blocked embeds or playback failures with a helpful message and a link to watch on the video provider when available.

## Cast and Recommendations

- Show cast members in billing order when available, with a portrait, actor name, and character name.
- Provide portrait placeholders and handle missing character names gracefully.
- For large casts, show an initial selection with a clear way to reveal more.
- Display recommendations using the same movie card component and hover behavior as search results.
- Prefer the data provider's recommendation or similar-movie endpoint. If a genre-based fallback is needed, label it appropriately.
- Exclude the current movie and duplicate recommendations.
- Recommended movie cards must navigate to their own detail pages and load the selected movie's information.
- Handle empty cast and recommendation sections gracefully.

## Data and Implementation

- Use a real movie data provider for production behavior. Keep data fetching separate from presentation components.
- The existing catalog uses OMDb. The proposed migration default is TMDb for movie search, keyword discovery, details, cast portraits, trailers, and recommendations. Confirm provider support and required attribution before integration; do not assume OMDb title search covers all requested features.
- Resolve matching keyword IDs and use movie discovery for keyword searches. Bound expansion, define deterministic ranking, and handle combined pagination honestly. Do not describe keyword lookup as arbitrary semantic understanding.
- Normalize identifiers and nullable fields. Label scores with their actual provider and scale; do not present TMDb scores as IMDb ratings. Add OMDb enrichment only if needed, mapped through verified external IDs.
- Check the provider's current API documentation, attribution requirements, image configuration, and supported trailer sources before integrating.
- Store secret credentials on the server in environment variables. Never commit secrets or expose secret API tokens in browser code.
- Do not reuse the credential embedded in the old public JavaScript. Configure a fresh server-side credential for the migration and document replacement of the exposed legacy credential without copying it into files or logs.
- Document required environment variables and setup steps with a safe example configuration.
- If credentials are unavailable, provide clearly identified fixture data through the same data interface and document how to enable live data.
- Encode search parameters safely and validate route identifiers.
- Cancel or disregard stale search responses so an earlier request cannot overwrite newer results.
- Handle network failures, rate limits, missing images, and incomplete records without breaking the page.
- Reuse components for search forms, movie cards, cast cards, loading states, and the trailer modal.
- Load appropriately sized images, lazy-load below-the-fold images, and reserve image space to reduce layout shifts.

## Design and Accessibility

- Use a cohesive cinematic visual style with strong typography, readable contrast, consistent spacing, and artwork as the visual focus.
- Follow CineScope's cream/navy/orange design system, using a navy backdrop treatment for the detail hero and the standard canvas for cast and recommendations.
- Adapt the card grid and detail layout for mobile, tablet, and desktop without horizontal overflow.
- Maintain a logical heading hierarchy and use semantic buttons, links, inputs, and dialog behavior.
- Give search inputs visible labels, provide visible focus indicators, and announce meaningful loading or error messages accessibly.
- Avoid relying on color or hover alone to communicate interactive states.

## Hosting and Setup

- Target a Next.js-capable server runtime for server-side data access and arbitrary movie detail routes. Document deployment requirements without creating a paid service or publishing as a side effect of development.
- The current GitHub Pages deployment is static hosting. Do not configure `output: 'export'` while relying on server-only API calls or on-demand dynamic routes. A requirement to retain Pages needs an explicit static-compatible routing plan and a separate backend.
- Document install, development, production build, production start, environment configuration, attribution, and deployment steps in README. Commit the dependency lockfile and a safe `.env.example`.
- If credentials are missing, use clearly labeled fixtures through the provider interface so the UI remains reviewable. Never call fixture results live data.

## Acceptance Checks

- A title search navigates to a separate results page and shows relevant cards.
- A descriptive keyword search returns relevant movies through the implemented keyword flow.
- An empty query is prevented, and an unmatched query produces a helpful empty state.
- Search URLs survive refresh and browser back/forward navigation.
- Movie cards grow slightly on hover without moving neighboring cards and remain keyboard accessible.
- Clicking a result or recommendation opens the correct movie's dedicated page.
- A directly opened movie URL loads the correct details.
- The trailer button opens the correct video in a modal; closing it stops playback and restores focus.
- The modal supports keyboard navigation, Escape, and reduced-motion preferences where applicable.
- Cast appears below the main details, with related recommendations underneath.
- Missing posters, portraits, trailers, metadata, cast, or recommendations do not break the layout.
- The core search-to-details-to-trailer flow works across mobile and desktop layouts.
- Verify home, catalog, search, details, and modal at 360px, 768px, and 1440px, with light/dark themes and long titles. No horizontal overflow or clipped hover states.
- Check search sort/pagination URL state, movie-only results, accurate provider labels, and direct-route reloads.
- Preserve recognizable CineScope branding while removing dead links and legacy DOM rendering.

Run the project's existing relevant checks and add focused tests for routing, search behavior, and modal interactions where appropriate. Report completed functionality, validation results, and any remaining setup requirements.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
