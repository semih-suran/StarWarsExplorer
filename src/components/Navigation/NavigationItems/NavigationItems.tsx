import { NavLink } from "react-router-dom";

const NAV_LINKS = [
  { name: "Films", to: "/films" },
  { name: "People", to: "/people" },
  { name: "Planets", to: "/planets" },
  { name: "Species", to: "/species" },
  { name: "Starships", to: "/starships" },
  { name: "Vehicles", to: "/vehicles" },
];

export const NavigationItems = () => {
  return (
    <>
      {NAV_LINKS.map((link) => (
        <li key={link.name}>
          <NavLink
            to={link.to}
            className={({ isActive }) => (isActive ? "active font-bold" : "")}
          >
            {link.name}
          </NavLink>
        </li>
      ))}
    </>
  );
};