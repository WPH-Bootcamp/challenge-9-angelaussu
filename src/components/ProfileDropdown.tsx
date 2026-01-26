import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePlaceholder from "@/assets/profile-default.png";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
// src/components/IconExample.tsx
import MarkerIcon from "../assets/marker-loc.svg";
import OrdersIcon from "../assets/orders.svg";
import LogoutIcon from "../assets/logout.svg";

export default function ProfileDropdown({ isSolid }: { isSolid: boolean }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  // close when click outside
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (!user) return null;

  const avatarSrc = user.avatar || ProfilePlaceholder;

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/auth");
  };

  return (
    <div ref={boxRef} className="relative flex items-center gap-3">
      {/* Trigger: avatar + name */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 cursor-pointer select-none"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <img
          src={avatarSrc}
          alt={user.name || "User"}
          className="h-12 w-12 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = ProfilePlaceholder;
          }}
        />
        {/* Hide mobile */}
        <span
          className={`hidden md:inline text-[18px] font-medium transition-colors duration-300 ${
            isSolid ? "text-black-alt" : "text-white"
          }`}
        >
          {user.name}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-15 w-70 rounded-2xl bg-white
                     shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-gray-100 overflow-hidden z-50"
          role="menu"
        >
          {/* Header user */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
            <Link
              to="/profile"
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src={avatarSrc}
                alt={user.name || "User"}
                className="h-10 w-10 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = ProfilePlaceholder;
                }}
              />
              <p className="font-extrabold text-black-alt truncate">
                {user.name}
              </p>
            </Link>
          </div>

          {/* Menu list */}
          <ul className="py-2">
            <li>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate("/profile/address");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-black-alt hover:bg-gray-50 transition cursor-pointer"
                role="menuitem"
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  <img src={MarkerIcon} alt="Marker" className="w-5 h-5" />
                </span>
                <span className="text-sm font-semibold">Delivery Address</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate("/profile/orders"); // sementara: my orders ke cart
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-black-alt hover:bg-gray-50 transition cursor-pointer"
                role="menuitem"
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  <img src={OrdersIcon} alt="Orders" className="w-5 h-5" />
                </span>
                <span className="text-sm font-semibold">My Orders</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-black-alt hover:bg-gray-50 transition cursor-pointer"
                role="menuitem"
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  <img src={LogoutIcon} alt="Logout" className="w-5 h-5" />
                </span>
                <span className="text-sm font-semibold">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
