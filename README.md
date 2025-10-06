# Store App React Monorepo

A multi-project workspace that powers a demo commerce experience, the supporting API, a Next.js blog, and a small React testing playground. The codebase is multilingual (primarily Turkish UI copy) and showcases modern React tooling alongside a lightweight Express backend and SQLite usage.

## Table of Contents
- [Repository Layout](#repository-layout)
- [Highlights](#highlights)
  - [Storefront (`store-app/`)](#storefront-store-app)
  - [API (`server/`)](#api-server)
  - [Next.js Blog (`blog-app/`)](#nextjs-blog-blog-app)
  - [React Testing Sandbox (`react-testing/`)](#react-testing-sandbox-react-testing)
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Install Dependencies](#install-dependencies)
  - [Run the Express API](#run-the-express-api)
  - [Run the Storefront](#run-the-storefront)
  - [Run the Nextjs Blog](#run-the-nextjs-blog)
  - [React Testing Sandbox Commands](#react-testing-sandbox-commands)
- [Data & Configuration](#data--configuration)
- [Development Notes](#development-notes)
- [License](#license)

## Repository Layout

```
.
├── blog-app/        # Next.js 15 App Router blog with SQLite storage
├── react-testing/   # Vite + Vitest playground for isolated experiments
├── server/          # Express 4 API that backs the storefront
└── store-app/       # Vite React 19 storefront using Redux Toolkit & MUI
```

Each project is self-contained with its own `package.json` and tooling. Start commands are described per package below.

## Highlights

### Storefront (`store-app/`)
- React 19 + Vite (dev server on `http://localhost:3001`).
- Material UI for theming, layout, dialogs, and the checkout stepper.
- React Router v7 with nested routes (`/products`, `/cart`, `/checkout`, `/orders`, `/errors/*`).
- Redux Toolkit slices (`catalog`, `cart`, `account`, `counter`) for server-backed state; RTK async thunks wrap the Axios client.
- Authentication flow storing JWTs in `localStorage`, guarded pages via `AuthGuard`, and logout that clears client state.
- Shopping cart with quantity controls, optimistic loaders, and totals in Turkish Lira via `Intl.NumberFormat`.
- Three step checkout wizard (address, payment, review) powered by `react-hook-form`, card validation helpers, and post-order dialog.
- Orders dashboard with modal drill-down, plus dedicated error pages that exercise the backend error routes.
- Toast notifications (`react-toastify`) and reusable loader component for global async feedback.

### API (`server/`)
- Express 4 server on `http://localhost:5001` with CORS tuned for the storefront dev origin (`http://localhost:3001`).
- Persists data in `server/db.json`; includes seed products, carts, users (bcrypt-hashed), and example orders.
- Routes:
  - `GET /products` and `GET /products/:id`
  - `GET /carts`, `POST /carts`, `DELETE /carts` (cart id persisted via HTTP-only cookie)
  - `POST /users/login`, `POST /users/register`, `GET /users/getUser` (JWT based)
  - `POST /orders`, `GET /orders`, `GET /orders/:id` (JWT protected)
  - `GET /errors/*` helpers for client-side error handling demos
- Serves static product images from `public/images/`.
- Includes a placeholder Iyzico (`iyzipay`) integration stub for future payment processing experiments.

### Next.js Blog (`blog-app/`)
- Next.js 15 App Router with React 19, Material UI, and shared Roboto fonts.
- SQLite database (`blog.db`) with API routes (`app/api/blogs`) that expose blog listings and detail pages.
- Layout with client-side navigation highlighting, blog grid, detail pages, and a demo users page that fetches from `jsonplaceholder.typicode.com`.
- Utility scripts in `scripts/` (`seed-db.js`, `check-db.js`) to bootstrap or inspect the SQLite file.
- Dual README files (English & Turkish) for quick onboarding.

### React Testing Sandbox (`react-testing/`)
- Vite template pinned to the rolldown-powered Vite 7 preview (`npm:rolldown-vite`).
- Vitest + React Testing Library configured for component and utility tests.
- Simple counter demo (`src/tests/sum.js`) ready for extending with real tests.

## Getting Started

### Requirements
- Node.js 18 LTS or newer
- npm (bundled with Node). Yarn/PNPM will also work if you prefer, but scripts below assume npm.

### Install Dependencies
There is no top-level `package.json`; install per project:

```bash
# Express API
db% cd server
server% npm install

# Storefront
server% cd ../store-app
store-app% npm install

# Next.js blog
store-app% cd ../blog-app
blog-app% npm install

# React testing sandbox
blog-app% cd ../react-testing
react-testing% npm install
```

### Run the Express API
```bash
cd server
npm start
```
The API listens on `http://localhost:5001`, writes updates back to `db.json`, and serves product imagery from `public/images/`.

### Run the Storefront
```bash
cd store-app
npm run dev    # starts Vite on http://localhost:3001
```
> Tip: `npm run start` inside `store-app` attempts to start a local `server/` directory via `concurrently`. In this monorepo the API lives at the repository root, so start it manually from `../server` as shown above.

Key default accounts & behaviour:
- Sample user: `deli` / (check `server/db.json` for seeded users or register a new one).
- Tokens are stored in `localStorage`. Clearing the storage or letting `getUser` fail will redirect to the login page.

### Run the Next.js Blog
```bash
cd blog-app
npm run dev        # http://localhost:3000
# (optional) seed the SQLite file if it is empty
printf '# first run only\n'; node scripts/seed-db.js
```
`blogs/page.js` fetches from the local API (`/api/blogs`); ensure `blog.db` exists (seed script will create it).

### React Testing Sandbox Commands
```bash
cd react-testing
npm run test       # Vitest in watch mode
npm run lint       # ESLint (shared config)
npm run dev        # Optional Vite preview of the sample counter
```

## Data & Configuration
- The storefront Axios client (`store-app/src/api/apiClient.js`) defaults to `http://localhost:5001/` and forwards JWT tokens via an interceptor. Update this file if you deploy the API elsewhere.
- Carts rely on the `customerId` cookie issued by `GET /carts`. Keep `axios.defaults.withCredentials = true` enabled when moving to production domains.
- Currency formatting uses Turkish Lira; adjust `src/utils/formats.js` for other locales.
- Checkout validation utilities live in `src/utils/cartCheck.js` and centralise Luhn checks plus expiry logic.
- To reset the API state, stop the server, delete `server/db.json`, re-create it from source control, or adjust the JSON manually.
- The Next.js blog keeps persistent data in `blog-app/blog.db`. Remove the file and rerun `node scripts/seed-db.js` for a clean slate.

## Development Notes
- `store-app/DEVELOPER/` and `AGENTS.md` collect deeper implementation notes (Redux slices, MUI patterns, error handling, etc.). Review them before making large changes.
- UI copy is mainly Turkish; keep translations consistent when extending pages.
- Orders currently calculate totals client-side and store masked card details for demo purposes only; replace with a real PSP before production use.
- The repository mixes Redux and a legacy `CartContext`. New work should prefer the Redux slice approach used across the app.
- ESLint is configured across the Vite projects. Run `npm run lint` regularly.

## License
The repository is licensed under the GNU General Public License v3.0. See [`LICENSE`](LICENSE) for the full text. The `store-app/` subproject also keeps its own copy of the same license for clarity.
