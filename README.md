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
