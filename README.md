# StarWars Explorer

A responsive, interactive React application that allows users to explore the Star Wars universe via the [[SWAPI](https://swapi.dev/)]. This project was built as a technical demonstration of modern React architecture, utilizing React 19, TypeScript, and TanStack Query for robust data management.

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

**Data Fetching:** TanStack Query (React Query)

**Styling:** Tailwind CSS v4, DaisyUI

**Routing:** React Router DOM v7

**Testing:** Vitest, React Testing Library

## 📂 Folder Structure

I have organized the codebase using a Feature-First (Co-location) architecture. Instead of grouping files by type (controllers, views), I group them by domain. This ensures the project remains scalable as new features are added.

```

src/
├── api/                # API fetchers and hooks (React Query wrappers)
│   ├── films/
│   ├── people/
│   └── ...
├── components/         # Shared / Generic UI components (Atomic design)
│   ├── Alert/
│   ├── Card/
│   ├── Navigation/
│   └── ...
├── hooks/              # Custom reusable hooks (usePagination, useFilteredList)
├── pages/              # Page views and domain-specific components
│   ├── films/
│   │   ├── components/ # Components specific ONLY to the Films page
│   │   └── Films.tsx
│   ├── people/
│   └── ...
├── store/              # Global state (Zustand)
├── types/              # TypeScript interfaces
├── utilities/          # Helper functions and test utils
└── App.tsx             # Root component

```

## 🧠 Architectural Decisions & Trade-offs

During the development of this application, several deliberate trade-offs were made to balance User Experience (UX) with the constraints of the provided API [[SWAPI](https://swapi.dev/)].

### 1. Data Fetching Strategy (Client-Side vs. Server-Side)

Decision: The application recursively fetches all pages of a resource (e.g., "People") initially to build a complete client-side dataset.

Why: The standard SWAPI endpoints do not support complex server-side filtering (e.g., filtering by "Gender" AND "Name" simultaneously). To provide the requested "interactive" experience, instant search, multi-field filtering, and sorting. I chose to load the dataset into memory.

Trade-off: This provides a superior UX for small datasets (like Star Wars, which has ~82 people).

Scalability Note: I recognize this approach is not scalable for production datasets with thousands of records. In a real-world enterprise scenario, I would architect this using Server-Side Pagination and Debounced Search, relying on the backend to filter records to prevent browser performance bottlenecks.

### 2. State Management (Zustand)

Decision: I chose Zustand over Redux or React Context.

Why: The requirements called for state management. Redux involves significant boilerplate for a project of this size. React Context can lead to unnecessary re-renders if not optimized strictly.

Persistence: I implemented Zustand's persist middleware to save filter states (e.g., if you search for "Skywalker", navigate to "Planets", and return, your search remains). This prevents the frustration of losing context during navigation.

### 3. Testing Strategy

Decision: Focused on Integration Testing for page flows and Unit Testing for complex logic.

Tests are co-located with the features they test (e.g., People.unit.test.tsx lives inside src/pages/people).

I mocked the API layer (useGetPeople) to ensure tests are deterministic and do not rely on live network calls.

### 4. CSS Architecture

Decision: Tailwind CSS combined with DaisyUI.

Why: Tailwind allows for rapid styling directly in markup, reducing context switching between CSS and JS files. DaisyUI provides semantic component classes (like btn, card, navbar) which speeds up development while maintaining a consistent design system.

Responsiveness: All layouts are mobile-first, utilizing a burger menu for mobile navigation and grid layouts that adapt from single columns to multi-columns on larger screens.