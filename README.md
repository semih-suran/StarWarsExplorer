# 🌌 StarWars Explorer

A production-grade, interactive React application that allows users to explore the Star Wars universe via the [[SWAPI](https://swapi.info/)]. This project demonstrates modern React architecture, featuring a custom CI/CD pipeline, strict TypeScript enforcement, and a resilient "Generic Resource" design pattern.

**Live Demo:** [[Netlify](https://starwarsexplorer-semih.netlify.app/)]

## 🚀 Quick Start

**Install dependencies:**

```
npm install
```

**Run the development server:**

```
npm run dev
```

**Run tests:**

```
npm run test
```

**Run Linting & Type Checking:**

```
npm run lint
```

**Build for production:**

```

npm run build
```

## 🛠 Tech Stack

**Core:** React 19, TypeScript, Vite

**Data Integrity:** Zod (Runtime Schema Validation)

**State Management:** Zustand (with persistence middleware)

**Data Fetching:** TanStack Query (React Query) v5

**Styling:** Tailwind CSS v4, DaisyUI

**Routing:** React Router DOM v7

**Testing:** Vitest, React Testing Library

## 📂 Folder Structure

I have organized the codebase using a Feature-First (Co-location) architecture. Note the move from rigid "Generic Pages" to a Compositional Layout pattern.

```

src/ 
├── .github/workflows/          # CI/CD Pipeline Configuration 
├── api/ 
│ └── api.ts                    # Centralized Adapter (Zod-validated) 
├── components/                 # Shared UI components 
│ ├── ResourceLayout/           # Reusable Application Shells 
│ │ └── ResourceLayout.tsx 
│ └── ... 
├── hooks/                      # Reusable Logic 
│ ├── useFavoritesData.ts       # Live-fetching logic for Favorites (SSOT) 
│ ├── usePagination.ts          # Deterministic pagination logic 
│ └── ... 
├── pages/                      # Domain Views 
│ ├── planets/ 
│ │ ├── Planets.tsx             # View Layer (Composes Layout + Filters + List) 
│ │ ├── Planets.helpers.ts 
│ │ └── ... 
├── store/                      # Global state (Zustand) 
├── types/                      # TypeScript Interfaces (Inferred from Zod) 
└── utilities/                  # Global Helper functions

```

## 🧠 Architectural Decisions & Trade-offs


### 1. The "Adapter" Pattern with Runtime Validation

**Decision:** The application uses `swapi.info` wrapped in a Zod-validated Adapter Layer.

**Why:** TypeScript interfaces disappear at runtime. If the API changes its data shape, a standard React app would crash silently.

**Implementation:** 
- `schemas.ts`: Defines strict contracts for every entity.
- `api.ts`: Validates incoming data, ensuring the app "Fails Fast" at the network layer.
- **Impact:** The app "Fails Fast" at the network layer with clear error messages, ensuring no corrupt data ever reaches the components.


### 2. Single Source of Truth (SSOT)

**Decision:** The Favorites Store (Zustand) saves **only** Resource URLs, not the full objects.

**Why:** Storing full objects in `localStorage` leads to "Stale Data" bugs (e.g., a character's details update on the server, but the user sees the old version from storage) and storage limit issues.

**Implementation:**

- **Zustand:** Acts as a lightweight list of pointers (IDs).

- **React Query:** The `useFavoritesData` hook fetches fresh data using those IDs.

- **Benefit:** Users always see the live version of their favorites.


### 3. Automated Quality Control (CI/CD)

**Decision:** Implemented a GitHub Actions pipeline (`ci.yml`).To enforce code quality automatically. 

**Why:** To enforce code quality automatically. Every push triggers a workflow that:

1. Installs dependencies (Clean Install).

2. Runs ESLint (Static Analysis).

3. Checks TypeScript types (noEmit).

4. Runs the Test Suite.

5. Verifies the Production Build.


### 4. Explicit State Orchestration

**Decision:** Decoupled Pagination state from Auto-Correction magic.

**Why:** Relying on `useEffect` or render-phase updates to "fix" pagination (e.g., when filtering) often leads to race conditions and infinite loops.

**Implementation:** The `useResourceLogic` hook explicitly orchestrates state changes. When filters are updated, it imperatively resets the pagination to Page 1.

### 5. Composition over Configuration

**Decision:** Replaced the rigid `GenericResourcePage` with a `ResourceLayout` pattern.

**Why:** The previous "One Component to Rule Them All" approach made it impossible to handle unique requirements (e.g., different caching strategies or banners) for specific resources without prop drilling.

**Implementation:** Pages like `Planets.tsx` now explicitly compose their UI using `ResourceLayout`, injecting specific Filter and List components. This increases code volume slightly but drastically improves maintainability and flexibility.


### 6. Performance Optimizations

**Decision:** Route-based code splitting with Hover Preloading.

**Optimization:** The application uses `React.lazy` to split bundles. To prevent "Loading..." waterfalls, I implemented a prefetching strategy where the next route's chunk begins downloading the moment a user hovers over a navigation card.
