import { NavLink, Link, useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import { publicNavLinks } from "../constants";
import Cart from "./Cart";
import { MdMenuBook, MdMenu } from "react-icons/md";

const Navbar = () => {
  const token = localStorage.getItem("access-token");
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const navigate = useNavigate();

  const initial = userInfo?.name?.charAt(0)?.toUpperCase() || "?";

  const handleLogout = async () => {
    if (token) {
      try {
        await logout({ token });
      } catch (error) {
        console.log(error);
      }
      localStorage.removeItem("user-info");
    }
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100/80 backdrop-blur-md shadow-sm sticky top-0 z-50 px-4 lg:px-8">
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-square"
            aria-label="Open menu"
          >
            <MdMenu className="h-5 w-5" />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-md dropdown-content bg-base-200 rounded-box z-50 mt-3 w-56 p-3 shadow-lg gap-0.5"
          >
            {publicNavLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => document.activeElement?.blur()}
                  className={({ isActive }) =>
                    isActive ? "font-semibold text-primary" : ""
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            {!token && (
              <>
                <div className="divider my-1" />
                <li>
                  <Link to="/login" className="font-medium text-primary">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="font-medium">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <Link
          to="/"
          className="btn btn-ghost gap-2 text-xl font-bold normal-case"
        >
          <MdMenuBook className="text-2xl text-primary" />
          <span className="hidden sm:inline">Bookstore</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1 px-1 text-sm">
          {publicNavLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                onClick={() => document.activeElement?.blur()}
                className={({ isActive }) =>
                  isActive ? "font-semibold text-primary" : ""
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end gap-1 sm:gap-4">
        {token ? (
          <>
            <Cart token={token} />

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="avatar placeholder btn btn-ghost btn-circle"
                aria-label="Open user menu"
              >
                <div className="w-10 flex items-center justify-center rounded-full bg-primary text-base-100">
                  <span className="text-lg">{initial}</span>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-200 rounded-box z-50 mt-3 w-48 p-2 shadow-lg"
              >
                <li className="menu-title px-3 py-1">
                  <Link
                    to="/transaction-history"
                    className="text-xs text-base-content/60"
                  >
                    Riyawat Transaksi
                  </Link>
                </li>
                {userInfo?.role === "admin" && (
                  <li>
                    <Link to="/admin">Admin Panel</Link>
                  </li>
                )}
                <div className="divider my-0" />
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-error hover:bg-error/10"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-primary btn-sm sm:btn-md">
              Login
            </Link>
            <Link
              to="/register"
              className="btn btn-outline btn-secondary btn-sm sm:btn-md hidden sm:inline-flex"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
