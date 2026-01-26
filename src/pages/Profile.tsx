// src/pages/Profile.tsx
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ProfilePlaceholder from "../assets/profile-default.png";
import { NavLink } from "react-router-dom";
import MarkerIcon from "../assets/marker-loc.svg";
import OrdersIcon from "../assets/orders.svg";
import LogoutIcon from "../assets/logout.svg";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect ke login kalau belum login
  if (!loading && !user) {
    navigate("/auth");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <section className="min-h-screen bg-gray-50 px-4 pt-28 pb-28 md:px-10 md:pt-28 md:pb-28 lg:px-30 lg:pt-28 lg:pb-28">
      <div className="lg:flex lg:gap-10">
        {/* Sidebar Card */}
        <aside className="lg:w-70 shrink-0">
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-6">
            <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
              <img
                src={user?.avatar || ProfilePlaceholder}
                alt={user?.name || "User"}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="font-extrabold text-black-alt truncate">
                  {user?.name || "User"}
                </p>
              </div>
            </div>

            <nav className="pt-5">
              <ul className="flex flex-col gap-1">
                <li>
                  <NavLink
                    to="/profile/address"
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-3 py-3 rounded-xl transition cursor-pointer
           ${
             isActive
               ? "bg-white text-red-alt"
               : "text-black-alt hover:bg-gray-50"
           }`
                    }
                  >
                    <span className="w-5 h-5 flex items-center justify-center">
                      <img src={MarkerIcon} alt="Marker" className="w-5 h-5" />
                    </span>
                    <span className="text-sm font-semibold">
                      Delivery Address
                    </span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/profile/orders"
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-3 py-3 rounded-xl transition cursor-pointer
           ${
             isActive
               ? "bg-red-alt text-white"
               : "text-black-alt hover:bg-gray-50"
           }`
                    }
                  >
                    <span className="w-5 h-5 flex items-center justify-center">
                      <OrdersIcon />
                    </span>
                    <span className="text-sm font-semibold">My Orders</span>
                  </NavLink>
                </li>

                <li>
                  {/* logout tetap button karena ada action */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-black-alt hover:bg-gray-50 transition cursor-pointer"
                  >
                    <span className="w-5 h-5 flex items-center justify-center">
                      <LogoutIcon />
                    </span>
                    <span className="text-sm font-semibold">Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <h1 className="text-2xl font-extrabold text-black-alt mb-6">
            Profile
          </h1>

          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-8 max-w-180">
            <div className="flex items-center gap-5 mb-8">
              <img
                src={user?.avatar || ProfilePlaceholder}
                alt={user?.name || "User"}
                className="w-16 h-16 rounded-full object-cover"
              />
              {/* kosong seperti screenshot (avatar saja) */}
            </div>

            <div className="space-y-5">
              <ProfileRow label="Name" value={user?.name || "-"} />
              <ProfileRow label="Email" value={user?.email || "-"} />
              <ProfileRow label="Nomor Handphone" value={user?.phone || "-"} />
            </div>

            <button
              className="mt-8 w-full bg-red-alt text-white py-3 rounded-full font-extrabold hover:opacity-95 transition cursor-pointer"
              onClick={() => navigate("/profile/edit")}
            >
              Update Profile
            </button>
          </div>
        </main>
      </div>
    </section>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <p className="text-sm text-black-alt">{label}</p>
      <p className="text-sm font-extrabold text-black-alt text-right">
        {value}
      </p>
    </div>
  );
}
