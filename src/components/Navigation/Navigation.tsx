import { Link } from "react-router-dom";


export const Navigation = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm mb-8">
      <div className="navbar-start">
        <Link to="/" aria-label="Go to home" className="btn btn-ghost text-xl">
          SW Explorer
        </Link>
      </div>

    </div>
  );
};
