import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loading } from "./components/Loading/Loading";

const load = (importFn: () => Promise<any>, name: string) => {
  return lazy(async () => {
    const module = await importFn();
    return { default: module[name] };
  });
};

const Home = load(() => import("./pages/home/Home"), "Home");
const People = load(() => import("./pages/people/People"), "People");
const Planets = load(() => import("./pages/planets/Planets"), "Planets");
const Films = load(() => import("./pages/films/Films"), "Films");
const Species = load(() => import("./pages/species/Species"), "Species");
const Starships = load(() => import("./pages/starships/Starships"), "Starships");
const Vehicles = load(() => import("./pages/vehicles/Vehicles"), "Vehicles");
const Favorites = load(() => import("./pages/favorites/Favorites"), "Favorites");

export const prefetchRoute = (path: string) => {
  const map: Record<string, () => Promise<any>> = {
    "/people": () => import("./pages/people/People"),
    "/planets": () => import("./pages/planets/Planets"),
    "/films": () => import("./pages/films/Films"),
    "/species": () => import("./pages/species/Species"),
    "/starships": () => import("./pages/starships/Starships"),
    "/vehicles": () => import("./pages/vehicles/Vehicles"),
    "/favorites": () => import("./pages/favorites/Favorites"),
  };

  if (map[path]) {
    map[path]();
  }
};

export const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="h-[50vh] flex items-center justify-center">
          <Loading />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/people" element={<People />} />
        <Route path="/planets" element={<Planets />} />
        <Route path="/films" element={<Films />} />
        <Route path="/species" element={<Species />} />
        <Route path="/starships" element={<Starships />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};