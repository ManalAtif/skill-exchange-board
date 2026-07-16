# SkillSwap — Frontend

Frontend for the Local Skill-Exchange Board (MERN stack). Built with **React + Vite**, **React Router**, **Framer Motion**, and **Axios** — no UI kit dependency, so every screen follows one deliberate visual system instead of default Material components.

## Getting Started

```bash
npm install
cp .env.example .env.local     # then edit VITE_API_BASE_URL if needed
npm run dev
```

App runs at `http://localhost:5173`. Make sure your backend teammate's Express server is running (default expected at `http://localhost:5000/api`).

## Design System — "The Trade Board"

The whole product is one metaphor: a community corkboard where people pin index cards saying what they can teach or want to learn.

- **Colors:** deep ink (`--ink`), warm paper (`--paper`), corkboard brown (`--board`), teal for "Offer" stamps and primary actions (`--teal`), rust for "Request" stamps (`--rust`), gold for pins/focus rings (`--gold`). All defined as CSS variables in `src/styles/tokens.css`.
- **Type:** Fraunces (display/headings), IBM Plex Sans (body), IBM Plex Mono (labels, stamps, category tags).
- **Signature component:** `ListingCard` — a "pinned index card" with a pushpin, a rotated rubber-stamp badge (teal for Offer, rust for Request), and a subtle per-card tilt that straightens on hover.
- **Motion:** page transitions via `PageTransition` + `AnimatePresence`, staggered card reveals on Browse/Matches, hover/tap micro-interactions on buttons and cards. All animation respects `prefers-reduced-motion` automatically (see `tokens.css`).

To retheme, edit the CSS variables at the top of `src/styles/tokens.css` — nothing else needs to change.

## Project Structure

```
src/
  components/     # Navbar, ListingCard, Field, ProtectedRoute, PageTransition
  pages/          # Home, Login, Signup, Profile, BrowseListings, ListingDetail, CreateListing, ChatPage, MatchesPage
  context/        # AuthContext — global logged-in user state
  services/       # api.js — every backend call, in one place
  utils/          # validation.js — shared form validation + sanitization
  styles/         # tokens.css (design tokens/reset), components.css (buttons, forms, cards, badges)
```

## Security Notes

This is a frontend-only scaffold, so some of this depends on your backend teammate's choices — flagged below.

- **API base URL** comes from `VITE_API_BASE_URL` (see `.env.example`), never hardcoded. `.env*` files are git-ignored — **never commit real secrets**, and remember that any `VITE_*` variable is bundled into the public JS and is not actually secret.
- **Auth token storage:** currently in `localStorage` for MVP simplicity (`src/context/AuthContext.jsx`, `src/services/api.js`). This is readable by any script on the page, so it's vulnerable if an XSS bug ever gets introduced. **Ask your backend teammate to consider httpOnly, Secure, SameSite=strict cookies instead** — if they do, delete the `localStorage` token code and the Axios `Authorization` header interceptor; the browser will handle it automatically.
- **401 handling:** any request that comes back `401 Unauthorized` automatically clears local auth state (see the response interceptor in `api.js`), so the UI never keeps pretending someone is logged in after their session expires.
- **XSS:** nothing in this codebase uses `dangerouslySetInnerHTML` — all user content (titles, bios, messages) is rendered as plain React text, which auto-escapes. Keep it that way; don't add raw HTML rendering for user-submitted content.
- **Input validation:** every form validates client-side (`src/utils/validation.js`) — email format, password strength (8+ chars, letter + number), max lengths on every field. **This is a UX convenience only.** The backend must re-validate everything, since anyone can call the API directly and skip the frontend entirely.
- **Password fields** use `type="password"` with a show/hide toggle, `autoComplete="new-password"` / `"current-password"` so password managers work correctly, and are never logged or sent anywhere except the login/signup request body.
- **Double-submit protection:** submit buttons disable themselves while a request is in flight, preventing duplicate signups/listings/messages from a fast double-click.
- **Content-Security-Policy** meta tag is set in `index.html` as a starting point — tighten `connect-src` to your real API origin once it's deployed, and move this to a real HTTP response header on the backend/hosting layer once you can (meta-tag CSP can't cover everything, e.g. it can't set `frame-ancestors`).
- **Moderation hooks** (`reportListing`, `blockUser` in `api.js`) are wired into the UI (see the "Report listing" button in `ListingDetail`) per the PRD's basic moderation requirement — the backend needs matching endpoints and should require auth + rate-limit these.

## Connecting to the Backend

All API calls live in `src/services/api.js`. Make sure your backend's routes match these (or edit this file to match theirs):

- `POST /auth/signup`, `POST /auth/login`, `POST /auth/logout`
- `GET/POST/PUT/DELETE /listings`
- `GET /matches`
- `GET/POST /messages`
- `GET/PUT /users/me`
- `POST /listings/:id/report`, `POST /users/:id/block`

## Mock Data

`BrowseListings.jsx` and `ListingDetail.jsx` fall back to sample listings if the API call fails, so the board looks alive before the backend is ready. A banner clearly indicates when mock data is showing. Remove the fallback once real data is flowing.

## Git Workflow

```bash
git checkout main
git pull origin main
git checkout -b frontend-yourname

git add .
git commit -m "Describe what you did"
git push origin frontend-yourname
# then open a Pull Request into main on GitHub
```
