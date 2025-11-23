import { RouterProvider } from "react-router-dom";
import { appRouter } from "./Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={appRouter} />
  </QueryClientProvider>
);