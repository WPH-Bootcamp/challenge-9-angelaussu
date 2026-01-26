// src/components/Header.tsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import Logo from "../assets/white-sun.svg";
import LogoBlack from "../assets/red-sun.svg";
import Cart from "../assets/bag.svg";
import CartBlack from "../assets/bag-black.svg";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";

import ProfileDropdown from "@/components/ProfileDropdown";
export const Header: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const navigate = useNavigate();
  const { user } = useAuth();
  const { summary } = useCart();
  const totalQty = summary.totalItems;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const isSolid = !isHome || scrolled;

  return (
    <header
      className={`
        fixed top-0 left-0 z-50 w-full
        flex items-center justify-between py-3 px-4 md:py-4 md:px-10 lg:py-4 lg:px-20 xl:py-4 xl:px-30 transition-all duration-300
        ${
          isSolid
            ? "bg-white shadow-[0_0_20px_0_rgba(203,202,202,0.25)]"
            : "bg-transparent"
        }
      `}
    >
      {/* Logo */}
      <nav className="flex items-center">
        <Link to="/" className="flex gap-3.75 items-center">
          <img
            src={isSolid ? LogoBlack : Logo}
            alt="Logo"
            className="h-10 w-auto transition-all duration-300"
          />
          <div
            className={`text-[32px] font-extrabold transition-colors duration-300 ${
              isSolid ? "text-black-alt" : "text-white"
            } hidden sm:block`}
          >
            Foody
          </div>
        </Link>
      </nav>

      {/* Buttons */}
      <div className="flex items-center gap-6">
        {!user ? (
          <>
            <Button
              variant="outline"
              onClick={() => navigate("/auth")}
              className={
                isSolid ? "text-black border-black" : "text-white border-white"
              }
            >
              Sign In
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate("/auth", { state: { tab: "register" } })}
            >
              Sign Up
            </Button>
          </>
        ) : (
          <>
            {/* Cart */}
            <Button
              variant="default"
              className="border-0 p-0 relative"
              onClick={() => navigate("/cart")}
            >
              <img
                src={isSolid ? CartBlack : Cart}
                alt="Cart"
                className="h-8 w-8 transition-all duration-300"
              />
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-alt text-white text-[12px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalQty}
                </span>
              )}
            </Button>

            <ProfileDropdown isSolid={isSolid} />
          </>
        )}
      </div>
    </header>
  );
};
