# PlaceOS Frontend Tools

Angular/Nx workspace for small PlaceOS frontend utilities. The repo contains standalone tools for map editing, wayfinding, sensor overlays, application metadata, and initial PlaceOS setup data.

## Projects

### Applications

| Project | Purpose |
| --- | --- |
| `map-builder` | Create and edit PlaceOS map metadata. This is the default Nx project. |
| `map-regions` | Load an SVG floorplan and draw/edit map regions against it. |
| `sensor-map` | Load an SVG floorplan and place/edit environmental sensor overlays. |
| `wayfinding` | Load an SVG floorplan and configure waypoints, navigation paths, and route previews. |
| `app-settings` | Edit shared, workplace, and concierge application settings metadata. |
| `placeos-setup` | Build and export PlaceOS setup data for organisations, interfaces, floorplans, rooms, desks, lockers, zoning, parking, assets, monitoring, catering, and access control. |

Each application has a matching Playwright e2e project where available, for example `map-builder-e2e` and `placeos-setup-e2e`.

### Libraries

| Library | Purpose |
| --- | --- |
| `common` | Shared helpers, types, base classes, animations, and PlaceOS backoffice request helpers. |
| `components` | Shared UI/map components including interactive map primitives, pins, polygons, radii, counters, icons, tooltips, and map viewer support. |

## Prerequisites

- Node.js compatible with Angular 22 and Nx 22.
- npm for dependency installation.

Install dependencies:

```sh
npm install
```

The `postinstall` script decorates the Angular CLI for Nx and generates the local version file with `config/version.js`.

## Development

Run the default app, `map-builder`:

```sh
npm start
```

Run a specific app:

```sh
npm run nx -- serve map-builder
npm run nx -- serve map-regions
npm run nx -- serve sensor-map
npm run nx -- serve wayfinding
npm run nx -- serve app-settings
npm run nx -- serve placeos-setup
```

Most apps use hash routing. The SVG-based tools start with a bootstrap screen where you enter an SVG URL before opening the editor.

### Map Builder AI

AI outline and room detection are enabled only when the app is served from a
PlaceOS authority with this configuration:

```json
{
    "map_builder": {
        "llm_system_id": "sys-...",
        "llm_model": "gpt-5.1"
    }
}
```

`llm_system_id` must contain an `LLM_1` module running the PlaceOS OpenAI GPT
driver. If either setting is absent, the AI controls are not rendered.

## Build

Build one project:

```sh
npm run nx -- build map-builder
```

Build every buildable app:

```sh
npm run build-all
```

Build output is written under `dist/apps/<project>`.

## Tests

Run unit tests for one project:

```sh
npm run nx -- test map-builder
```

Run all configured unit tests:

```sh
npm run test-all
```

Run e2e tests for one project:

```sh
npm run nx -- e2e map-builder-e2e
```

Run affected checks:

```sh
npm run affected:test
npm run affected:e2e
npm run affected:lint
npm run affected:build
```

## Formatting and Linting

Format the workspace:

```sh
npm run format
```

Check formatting:

```sh
npm run format:check
```

Run lint for all projects with a lint target:

```sh
npm run lint
```

## Workspace Tools

Show the project graph:

```sh
npm run dep-graph
```

List affected apps or libraries:

```sh
npm run affected:apps
npm run affected:libs
```

Generate Angular code with Nx:

```sh
npm run nx -- generate @nx/angular:component my-component --project=map-builder
```

## Data Storage

Several tools use browser `localStorage` while editing:

- `map-builder` stores maps under `MAP.data.*`.
- `placeos-setup` stores setup sections under `PLACEOS_BUILD.*`.

Treat the browser profile as part of the local editing state when developing or debugging these tools.
