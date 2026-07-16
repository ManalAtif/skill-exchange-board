# SkillSwap — Frontend

This is the frontend for our Skill-Exchange Board project (MERN stack). It's a place where people can post what they can teach and what they want to learn, then connect with others nearby.

Built with React + Vite, React Router for navigation, Axios for talking to the backend, and Framer Motion for animations. Didn't use a UI kit like Bootstrap or Material UI — wanted the design to feel like our own thing instead of a template.

## Running it locally

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
npm run dev
```

Opens at `http://localhost:5173`. You'll also need the backend running (expected at `http://localhost:5000/api` by default) for real data — otherwise you'll just see sample listings.

## The design

The whole thing is built around one idea: a community corkboard where people pin index cards for what they're offering or looking for. That's why listings show up as little pinned cards with a slight tilt, and each one has a stamped "Offering" or "Looking for" badge (teal or rust colored).

Fonts are Fraunces for headings and IBM Plex Sans for body text — wanted something with a bit more personality than the usual Inter/Roboto combo everyone uses.

Colors and other design values are all in `src/styles/tokens.css` if anyone wants to tweak them.

## What's in here

```
src/
  components/   → Navbar, ListingCard, Field, ProtectedRoute, PageTransition
  pages/        → Home, Login, Signup, Profile, Browse, Listing Detail, Create Listing, Chat, Matches
  context/      → keeps track of who's logged in
  services/     → api.js, all the backend calls in one place
  utils/        → form validation helpers
  styles/       → design tokens + shared component styles
```

## Backend routes it expects

If you're working on the backend, these are the endpoints the frontend is already calling — either build these or update `src/services/api.js` to match what you build:

- `POST /auth/signup`, `POST /auth/login`, `POST /auth/logout`
- `GET / POST / PUT / DELETE /listings`
- `GET /matches`
- `GET / POST /messages`
- `GET / PUT /users/me`
- `POST /listings/:id/report`, `POST /users/:id/block`

## A few things worth knowing

- Right now there's no backend, so Browse and Listing Detail fall back to sample data so the app doesn't look empty. There's a small banner that shows when you're looking at sample data instead of real listings.
- The auth token is stored in localStorage for now, which is fine for a student project, but if we wanted to make this production-ready later, cookies would be a safer option — worth discussing with whoever's on backend.
- Every form has basic validation (email format, password needs a letter + number, etc.) but that's just for a better user experience — the backend should never trust the frontend and should validate everything again on its end.

## Git workflow

```bash
git checkout main
git pull origin main
git checkout -b your-name-feature

git add .
git commit -m "what you did"
git push origin your-name-feature
# then open a PR into main
```
