# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Two independent npm projects, each with its own `package.json`, `node_modules`, `.env`, and `vercel.json`:

- `client/` — React 19 + Vite 7 + Tailwind v4 SPA
- `server/` — Express 5 + Mongoose API

There is no root `package.json`; commands must be run from inside `client/` or `server/`.

## Common commands

Client (`cd client`):
- `npm run dev` — Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the built bundle
- `npm run lint` — ESLint over the project (flat config in `eslint.config.js`)

Server (`cd server`):
- `npm run server` — nodemon (development)
- `npm start` — `node server.js` (production / Vercel entry)

No test runner is configured in either project.

## Required environment variables

`client/.env`:
- `VITE_BASE_URL` — base URL of the API; set as `axios.defaults.baseURL` in [AppContext.jsx](client/src/context/AppContext.jsx)
- `VITE_CURRENCY` — currency symbol consumed via `useAppContext().currency`

`server/.env`:
- `MONGODB_URI` — Mongo base URI; the database name `/Drivio` is appended in [db.js](server/configs/db.js)
- `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT` — image upload credentials
- `JWT_SECRET` — used by `jsonwebtoken` for signing (verification currently uses `jwt.decode`, see Auth note below)
- `PORT` — optional, defaults to 3000

## Architecture

### Server (`server/server.js`)

Express app mounts three routers under `/api`:
- `/api/user` → register, login, current-user data, public car list ([userRoutes.js](server/routes/userRoutes.js))
- `/api/owner` → role upgrade, car CRUD, dashboard, profile image ([ownerRoutes.js](server/routes/ownerRoutes.js)); uploads go through `multer.single("image")` then `protect`
- `/api/bookings` → availability check, create, list (user/owner), status change ([bookingRoutes.js](server/routes/bookingRoutes.js))

`connectDB()` is `await`ed at module top-level before the app starts, so importing `server.js` triggers a Mongo connection.

### Domain models (`server/models/`)

- `User` — `role` enum is `["user", "owner"]`; the `change-role` endpoint upgrades a user to owner.
- `Car` — owned by a `User`; `description` is required.
- `Booking` — references `car`, `user`, and `owner`; status enum is `pending | confirmed | cancelled`.

### Auth ([server/middleware/auth.js](server/middleware/auth.js))

`protect` accepts `Authorization: Bearer <token>` (or a raw token) and calls `jwt.verify` with `JWT_SECRET`. On failure it returns 401. `requireOwner` (same file) gates routes that need `role === "owner"` and is composed after `protect` on every `/api/owner/*` route except `/change-role`.

### File uploads

`multer` uses `diskStorage({})` (temp files); controllers then push the file to ImageKit via [configs/imageKit.js](server/configs/imageKit.js) and persist the returned URL on the document.

### Client (`client/src/`)

- Entry [main.jsx](client/src/main.jsx) wraps `<App>` in `BrowserRouter` → `AppProvider` → `MotionConfig` (`viewport={{ once: true }}` is the default for all `motion` components).
- `App.jsx` renders `Navbar`/`Footer` only when the path is **not** under `/owner`. Owner routes are nested under `/owner` using `Pages/owner/Layout.jsx` as the layout route.
- Global state lives in [context/AppContext.jsx](client/src/context/AppContext.jsx): the configured `axios` instance, JWT (synced to `localStorage` and `axios.defaults.headers.common.Authorization`), `user`, `isOwner`, login modal toggle, shared `pickupDate`/`returnDate`, and the `cars` list. New API calls should reuse `axios` from this context rather than importing it directly.
- Token bootstrap is two-effect: one effect reads `localStorage` into `token` state, the second reacts to `token` changes by setting the auth header and calling `fetchUser`/`fetchCars`. Preserve this ordering when modifying auth flow.
- Toasts are `react-hot-toast`; date picking uses `react-day-picker`; animations use the `motion` package (Motion for React, the Framer Motion successor).

## Deployment (Vercel)

- `client/vercel.json` rewrites every path to `/` so the SPA router can handle it.
- `server/vercel.json` builds `server.js` with `@vercel/node` and routes everything to it. The `includeFiles: ["dist/**"]` hint suggests the server may be expected to serve a co-located build in production, but `server.js` itself does not currently mount any static file middleware.
