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

**State Management:** Zustand (with persistence middleware)

**Data Fetching:** TanStack Query (React Query) v5

**Styling:** Tailwind CSS v4, DaisyUI

**Routing:** React Router DOM v7

**Testing:** Vitest, React Testing Library

## 📂 Folder Structure

I have organized the codebase using a Feature-First (Co-location) architecture. Note the separation of Business Logic (helpers) from UI Components to ensure testability and prevent circular dependencies.

```

src/
├── .github/workflows/       # CI/CD Pipeline Configuration
├── api/
│ └── api.ts                 # Centralized Adapter (Type-safe API integration)
├── components/              # Shared UI components (Atomic design)
│ ├── GenericResourcePage/   # The "Master" component for all list views
│ └── ...
├── hooks/                   # Reusable Logic (Render-phase optimized)
│ ├── usePagination.ts       # Self-correcting pagination logic
│ └── ...
├── pages/                   # Domain Views
│ ├── planets/
│ │ ├── Planets.tsx          # View Layer
│ │ ├── Planets.helpers.ts   # Pure Logic Layer (Predicates/Types)
│ │ ├── Planets.unit.test.ts # Logic Tests
│ └── ...
├── store/                   # Global state (Zustand)
├── types/                   # Shared TypeScript interfaces
└── utilities/               # Global Helper functions

```

## 🧠 Architectural Decisions & Trade-offs

### 1. The "Adapter" Pattern (API Abstraction)

**Decision:** The application uses `swapi.info` (a static JSON mirror) instead of the original `swapi.dev`.

**Why:** The original API suffers from latency and downtime.

**Implementation:** A custom Adapter Layer in `api.ts` fetches the full dataset once and wraps it in a standard structure. This enables **Instant Filtering** (0ms latency) and Client-Side pagination, prioritizing User Experience over initial bandwidth.

### 2. Automated Quality Control (CI/CD)

**Decision:** Implemented a GitHub Actions pipeline (`ci.yml`).

**Why:** To enforce code quality automatically. Every push triggers a workflow that:

1. Installs dependencies (Clean Install).

2. Runs ESLint (Static Analysis).

3. Checks TypeScript types (noEmit).

4. Runs the Test Suite.

5. Verifies the Production Build.

**Impact:** Prevents "it works on my machine" bugs and ensures the `main` branch is always deployable.

### 3. Strict Type Safety

**Decision:** Zero tolerance for `any`.

**Why:** While `any` is convenient, it defeats the purpose of TypeScript. I utilized Generics (e.g., `<T>`) and Type Guards to ensure that data flowing through the Generic Resource Engine is type-safe without being tightly coupled to a specific entity like `IPeople`.

### 4. Testing Strategy

**Decision:** Multi-layered testing with a Custom Provider Wrapper.

- **Unit Tests:** Focused on pure logic. Logic was extracted to `*.helpers.ts` files to isolate it from React rendering concerns, making tests faster and more reliable.

- **Hook Testing:** Verified Hook Lifecycles (e.g., `usePagination`) to ensure state self-corrects during render phases.

- **Integration Tests:** Used a custom `render` utility to wrap components in `QueryClientProvider` and `MemoryRouter`, testing the full data-to-UI flow.

### 5. Render-Phase State Management

**Decision:** Moved state corrections (like resetting pagination when filtering) from `useEffect` to the **Render Phase**.

**Why:** Using `useEffect` to correct state causes a "Double Render" (Paint -> Effect -> Paint). By checking boundaries during the render pass, React can cancel the invalid render and commit the correct one immediately, improving performance and preventing UI flicker.

### 6. Generic Resource Engine

**Decision:** A single HOC-style architecture for all 6 resource types.

**How:**

- `useGetResource.ts`: Handles caching/fetching.

- `GenericResourcePage.tsx`: Handles layout, error states, and pagination.

**Benefit:** Adding a new entity takes minutes. The UI is consistent, and bug fixes in the engine propagate to all pages instantly.

### 7. Performance Optimizations

**Decision:** Route-based code splitting with Hover Preloading.

**Optimization:** The application uses `React.lazy` to split bundles. To prevent "Loading..." waterfalls, I implemented a prefetching strategy where the next route's chunk begins downloading the moment a user hovers over a navigation card.
