import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./Layout";
import { Home } from "./pages/home/Home";
import { Films } from "./pages/films/Films";
import { People } from "./pages/people/People";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <div className="p-8">Route error - page not found</div>,
    children: [
      { index: true, element: <Home /> },
      { path: "films", element: <Films /> },
      { path: "people", element: <People /> },
    ],
  },
]);
