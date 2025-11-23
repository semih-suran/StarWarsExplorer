import { Outlet } from "react-router";
import { Navigation } from "./components/Navigation/Navigation";

export const Layout = () => {
  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4">
        <Outlet />
      </div>
    </>
  );
};