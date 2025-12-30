import { Link } from "react-router-dom";
import { NavigationItems } from "./NavigationItems/NavigationItems";
import { NavigationBurgerIcon } from "./NavigationBurgerIcon/NavigationBurgerIcon";
import { useFavoritesStore } from "@/store/useFavoritesStore";

export const Navigation = () => {
  const favoritesCount = useFavoritesStore((state) => state.favorites.length);

  const closeDropdown = () => {
    const elem = document.activeElement as HTMLElement;
    if (elem) {
      elem.blur();
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50 px-4">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <NavigationBurgerIcon />
          </div>
          
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            onClick={closeDropdown}
          >
            <NavigationItems />
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl text-yellow-400">
          StarWars Explorer
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <NavigationItems />
        </ul>
      </div>

      <div className="navbar-end">
        <div className="indicator">
          {favoritesCount > 0 && (
            <span className="indicator-item badge bg-red-600 text-white badge-xs border-none">
              {favoritesCount}
            </span>
          )}
          <Link to="/favorites" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};