import { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { logout, useDecodeToken } from "../services/auth";
import { MdLogout, MdMenuBook } from "react-icons/md";
import { adminMenu } from "../constants";

const AdminLayout = () => {
  const token = localStorage.getItem("access-token");
  const userInfo = JSON.parse(localStorage.getItem("user-info"));
  const decodedData = useDecodeToken(token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !decodedData || !decodedData.success) {
      navigate("/login");
    }
    const role = userInfo?.role;
    if (role !== "admin" || !role) {
      navigate("/");
    }
  }, [token, decodedData, navigate, userInfo]);

  const handleLogout = async () => {
    if (token) {
      await logout({ token });
      localStorage.removeItem("user-info");
    }
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-base-200">
      <aside
        className="
				flex flex-col
					group
					w-18 hover:w-40 sm:hover:w-52 lg:hover:w-72
					transition-all duration-300 ease-in-out
					bg-base-100 border-r border-base-300
					h-screen sticky top-0
					overflow-hidden z-40
				"
      >
        {/* Brand / logo area */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-base-300 shrink-0">
          <MdMenuBook className="text-2xl text-primary shrink-0" />
          <span className="text-xs lg:text-lg font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            BookStore Admin Panel
          </span>
        </div>

        {/* Navigation — icons-only when collapsed, full labels when hovered */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
          <ul className="menu gap-1 p-2 w-full">
            {adminMenu.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${isActive ? "bg-primary text-primary-content" : "hover:bg-base-300"}`
                  }
                >
                  <div className="tooltip tooltip-right" data-tip={item.label}>
                    <item.icon className=" text-lg lg:text-xl shrink-0" />
                  </div>
                  <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout button at bottom */}
        <div className="border-t border-base-300 p-2 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-error hover:bg-error/10 transition-colors w-full"
          >
            <div className="tooltip tooltip-right" data-tip="Logout">
              <MdLogout className="text-xl shrink-0" />
            </div>
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* ========== Main Content ========== */}
      <main className="flex-1 overflow-y-auto lg:pt-0 pt-16">
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
