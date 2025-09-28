# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds all React source code. Feature areas are grouped by domain: `pages/` for routed views, `components/` for shared UI, `store/` for Redux tooling, `context/` for legacy context providers, and `api/` for axios clients.
- `public/` exposes static assets consumed by Vite at build time.
- `server/` contains the JSON Server mock backend (`db.json`) started via `npm run server` and serves product images at `http://localhost:5001/images/`.
- `DEVELOPER/` and root Markdown files provide design notes; review them before large changes.

## Build, Test, and Development Commands
- `npm run dev` launches Vite's dev server on port 5173.
- `npm run build` creates a production bundle in `dist/`.
- `npm run preview` serves the production build locally for smoke checks.
- `npm run lint` runs ESLint with the shared config.
- `npm run start` runs the client and mock API together via `concurrently`.

## Coding Style & Naming Conventions
- Prefer modern React with functional components, hooks, and co-located slices for Redux logic.
- Use PascalCase for component files (`ProductList.jsx`), camelCase for utilities, and kebab-case for route segments.
- Indent with two spaces; rely on Prettier-compatible formatting enforced by ESLint.
- Import router APIs exclusively from `react-router-dom`; JSON Server requests originate from `src/api/apiClient.js`.

## Testing Guidelines
- No automated tests are configured yet. Add Vitest + React Testing Library under `src/__tests__/` when introducing new features.
- Name spec files `<Component>.test.jsx`; keep them colocated with the feature or in the shared tests folder.
- Run `npm run lint` and, once added, `npm test` before opening a pull request.

## Commit & Pull Request Guidelines
- Follow the existing short, imperative commit style (e.g., `add product slice`, `fix navbar links`). Group related changes into a single commit.
- PRs must describe intent, list key changes, and link any tracking issues. Include screenshots or GIFs for UI alterations and note any manual testing performed.
- Ensure the mock API (`npm run server`) remains compatible; update `server/db.json` when data contracts change.

## Security & Configuration Tips
- Secrets are not stored in this repo. Use `.env.local` for local overrides if needed and document new variables in `README.md`.
- Keep dependencies updated (`npm outdated`) and avoid introducing network calls outside the API client layer.
