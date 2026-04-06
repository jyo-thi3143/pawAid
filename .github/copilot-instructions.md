# GitHub Copilot Instructions for PawAid

## Architecture overview
- Backend: `server/server.js` is the Express entrypoint.
- API routes: `server/routes/vets.js` exposes `GET`, `POST`, `PUT`, `DELETE` under `/api/vets`.
- Data model: `server/models/Vet.js` defines the vet listing schema and service enum.
- Frontend: static files live in `client/`, with `client/app.js` driving search, list rendering, and form submission.
- Deployment behavior: backend serves `client/` as static assets and returns `client/index.html` for non-API routes via `app.get("*splat")`.

## What to edit and why
- Change backend behavior in `server/routes/vets.js` and `server/models/Vet.js`.
- Change frontend behavior in `client/app.js` and `client/index.html`.
- Avoid moving the static client files unless you also update `server/server.js` static paths.
- `client/app.js` expects `window.location.origin + "/api/vets"`; keep API path consistent.

## Important conventions
- `GET /api/vets` filters only approved listings by default: `{ isApproved: true }`.
- Search query params are `zip` and `service`; the backend uses exact `zip` matching and `$in` for `services`.
- New listings are created with `POST /api/vets`; the schema defaults `isApproved` to `false`.
- `services` must be one of: `vaccines`, `spay`, `neuter`, `checkup`, `dental`, `emergency`.
- The frontend builds HTML cards directly in `client/app.js`; avoid refactoring to a bundle-based framework without updating the static setup.

## Local development workflow
- Install: `npm install`
- Run once: `npm start`
- Run with auto-reload: `npm run dev`
- Ensure `.env` contains `MONGO_URI` for MongoDB Atlas.

## Notes for AI edits
- The repo uses CommonJS modules (`require`, `module.exports`) not ES modules.
- There is no test suite or build step; keep changes minimal and manual if possible.
- Data flow is simple: browser -> `client/app.js` -> `/api/vets` -> Mongoose model.
- Use `server/server.js` as the convergence point for environment variables, static serving, and database connection.

## Quick file map
- `package.json` — scripts and dependencies.
- `server/server.js` — Express app setup, static hosting, Mongo connection.
- `server/routes/vets.js` — API route logic.
- `server/models/Vet.js` — schema and validation rules.
- `client/app.js` — UI logic, fetch, and submission.
- `client/index.html` — page structure and DOM ids used by `app.js`.
