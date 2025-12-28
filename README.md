# 🌌 StarWars Explorer

A responsive, interactive React application that allows users to explore the Star Wars universe via the [[SWAPI](https://swapi.info/)]. This project was built as a technical demonstration of modern React architecture, utilizing React 19, TypeScript, and TanStack Query for robust data management.

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

I have organized the codebase using a Feature-First (Co-location) architecture. Instead of grouping files by type (controllers, views), I group them by domain. This ensures the project remains scalable as new features are added.

```

src/
├── api/
│   └── api.ts          # Centralized API adapter (Swapi.info integration)
├── components/         # Shared UI components (Atomic design)
│   ├── Alert/
│   ├── Card/
│   ├── Navigation/
│   └── GenericResourcePage/ # The "Master" component for all list views
├── hooks/              # Reusable Logic
│   ├── useGetResource.ts    # ONE generic hook to fetch any entity
│   ├── usePagination.ts
│   └── useFilteredList.ts
├── pages/              # Domain Views
│   ├── films/
│   ├── people/
│   ├── planets/
│   └── ...
├── store/              # Global state (Zustand)
├── types/              # TypeScript interfaces
└── utilities/          # Helper functions

```

## 🧠 Architectural Decisions & Trade-offs

During the development of this application, several deliberate trade-offs were made to balance User Experience (UX) with the constraints of the provided API.

### 1. The "Adapter" Pattern (API Abstraction)

Decision: The application uses `swapi.info` (a static JSON mirror of SWAPI) instead of the original `swapi.dev`.

Why: The original API is often slow or down. `swapi.info` provides extreme speed but returns flat arrays (no pagination).

Implementation: I built a custom Adapter Layer in `api.ts` that:

1. Fetches the full dataset once.

2. Wraps it in a standard structure (`{ count, results: [] }`).

3. Passes it to the UI, which handles Client-Side Pagination and Instant Filtering.

Trade-off: Initial load might be slightly heavier (loading 80 people at once), but subsequent interactions (sorting, filtering, paging) are instant (0ms latency) because the data is in memory.



### 2. State Management (Zustand)

Decision: I chose Zustand over Redux or Context API.

Why: Redux requires too much boilerplate for this scope. Context API often leads to unnecessary re-renders. Zustand provides a lightweight, atomic state model.

- Persistence: I implemented `persist` middleware so that users don't lose their active filters if they refresh the page or navigate away.

### 3. Testing Strategy

Decision: Co-located Integration Tests.

- Unit Tests: For complex utilities (e.g., filter-utils.ts).

- Integration Tests: I mocked the API layer (msw or vitest) to test the full flow: User lands on page -> Data Loads -> User Filters -> List Updates.

### 4. CSS Architecture

Decision: Tailwind CSS combined with DaisyUI.

Why: Tailwind allows for rapid styling directly in markup, reducing context switching between CSS and JS files. DaisyUI provides semantic component classes (like btn, card, navbar) which speeds up development while maintaining a consistent design system.

Responsiveness: All layouts are mobile-first, utilizing a burger menu for mobile navigation and grid layouts that adapt from single columns to multi-columns on larger screens.

### 5. Performance Optimizations

Decision: Implemented route-based code splitting using `React.lazy` and `Suspense`.

Why: To improve initial load time (FCP) by ensuring users only download the JavaScript for the page they are currently viewing.

Optimization: Added "Hover Preloading" on navigation links. The application begins downloading the chunk for the next route the moment the user hovers over a link, ensuring the page is ready by the time they click (reducing Time to Interactive).

### 6. Generic Resource Engine

Decision: Instead of duplicating logic for People, Planets, and Starships, I implemented a Generic Resource Pattern.

How:

- `useGetResource.ts`: A single hook that handles caching and data fetching for any entity type.

- `GenericResourcePage.tsx`: A generic HOC-style component that handles the layout, error states, loading states, and pagination for all pages.

- Benefit: Adding a new entity (e.g., "Species") takes minutes, not hours.