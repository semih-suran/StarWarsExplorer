import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./Layout";
import { Home } from "./pages/home/Home";
import { People } from "./pages/people/People";
import { Planets } from "./pages/planets/Planets";
import { Vehicles } from "./pages/vehicles/Vehicles";
import { Starships } from "./pages/starships/Starships";
import { Species } from "./pages/species/Species";
import { Films } from "./pages/films/Films";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <div className="p-8">Route error - page not found</div>,
    children: [
      { index: true, element: <Home /> },
      { path: "people", element: <People /> },
      { path: "planets", element: <Planets /> },
      { path: "species", element: <Species /> },
      { path: "starships", element: <Starships /> },
      { path: "vehicles", element: <Vehicles /> },
      { path: "films", element: <Films /> },
    ],
  },
]);
