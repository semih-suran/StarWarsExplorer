import { cn } from "@/utilities/cn";
import { NavLink } from "react-router-dom";

type Props = {
  mobile: boolean;
  data: NavigationItem[];
};

type NavigationItem = {
  label: string;
  url: string;
};

export const NavigationItems = ({ mobile, data }: Props) => {
  return (
    <ul
      className={cn(
        "menu",
        mobile &&
          "menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow",
        !mobile && "menu-horizontal px-1"
      )}
    >
      {data.map((item) => (
        <li key={item.url}>
          <NavLink to={item.url}>{item.label}</NavLink>
        </li>
      ))}
    </ul>
  );
};
