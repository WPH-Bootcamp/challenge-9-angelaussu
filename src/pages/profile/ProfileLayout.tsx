import { useAuth } from "@/hooks/useAuth";
import { NavLink, Outlet, useNavigate, Navigate } from "react-router-dom";

import ProfilePlaceholder from "@/assets/profile-default.png";
import MarkerIcon from "@/assets/marker-loc.svg";
import OrdersIcon from "@/assets/orders.svg";
import LogoutIcon from "@/assets/logout.svg";

export default function ProfileLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="p-10">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <section className="min-h-screen bg-gray-50 px-4 pt-28 pb-28 md:px-10 lg:px-30">
      <div className="lg:flex lg:gap-10">
        {/* Sidebar */}
        <aside className="lg:w-70 shrink-0">
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-6">
            {/* User */}
            <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
              <img
                src={user.avatar || ProfilePlaceholder}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <p className="font-extrabold text-black-alt truncate">
                {user.name}
              </p>
            </div>

            {/* Menu */}
            <nav className="pt-5">
              <ul className="flex flex-col gap-2">
                {/* Delivery Address */}
                <li>
                  <NavLink
                    to="/profile/address"
                    className="w-full flex items-center gap-3 px-3 py-2 transition"
                  >
                    {({ isActive }) => (
                      <>
                        <img
                          src={MarkerIcon}
                          alt="Address"
                          className={`w-5 h-5 ${isActive ? "icon-red" : ""}`}
                        />
                        <span
                          className={`text-sm font-semibold ${
                            isActive ? "text-red-alt" : "text-black-alt"
                          }`}
                        >
                          Delivery Address
                        </span>
                      </>
                    )}
                  </NavLink>
                </li>

                {/* My Orders */}
                <li>
                  <NavLink
                    to="/profile/orders"
                    className="w-full flex items-center gap-3 px-3 py-2 transition"
                  >
                    {({ isActive }) => (
                      <>
                        <img
                          src={OrdersIcon}
                          alt="Orders"
                          className={`w-5 h-5 ${isActive ? "icon-red" : ""}`}
                        />
                        <span
                          className={`text-sm font-semibold ${
                            isActive ? "text-red-alt" : "text-black-alt"
                          }`}
                        >
                          My Orders
                        </span>
                      </>
                    )}
                  </NavLink>
                </li>

                {/* Logout */}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-black-alt hover:text-red-alt transition"
                    type="button"
                  >
                    <img src={LogoutIcon} alt="Logout" className="w-5 h-5" />
                    <span className="text-sm font-semibold">Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 mt-6 lg:mt-0">
          <Outlet />
        </main>
      </div>
    </section>
  );
}
