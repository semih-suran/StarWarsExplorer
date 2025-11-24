import { Link } from "react-router-dom";
import { NavigationItems } from "./NavigationItems/NavigationItems";
import { NavigationBurgerIcon } from "./NavigationBurgerIcon/NavigationBurgerIcon";

const NAVIGATION_ITEMS = [
  {
    label: "Films",
    url: "/films",
  },
  {
    label: "People",
    url: "/people",
  },
  {
    label: "Planets",
    url: "/planets",
  },
  {
    label: "Species",
    url: "/species",
  },
  {
    label: "Starships",
    url: "/starships",
  },
  {
    label: "Vehicles",
    url: "/vehicles",
  },
];

export const Navigation = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm mb-8 relative z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <NavigationBurgerIcon />
          </div>
          <NavigationItems mobile={true} data={NAVIGATION_ITEMS} />
        </div>
        <Link to="/" aria-label="Go to home" className="btn btn-ghost text-xl">
          SW Explorer
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <NavigationItems mobile={false} data={NAVIGATION_ITEMS} />
      </div>
    </div>
  );
};