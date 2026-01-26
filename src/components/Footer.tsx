// src/components/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo-red.svg";
import SocialIcons from "@/components/SocialIcons";

export default function Footer() {
  return (
    <footer className="bg-black-alt py-10 px-4 md:py-10 md:px-10 lg:py-20 lg:px-20 xl:py-20 xl:px-30">
      <div
        className="mx-auto grid-cols-1 md:grid-cols-3 gap-10 xl:gap-52.5 text-white-alt flex flex-row flex-wrap
  lg:grid lg:grid-cols-3 lg:gap-8"
      >
        {/* Brand */}
        <div>
          <Link to="/" className="mb-5.5 inline-block">
            <img src={Logo} alt="Footer Logo" />
          </Link>
          <p className="text-base max-w-xs leading-7.5 font-normal">
            Enjoy homemade flavors & chef’s signature dishes, freshly prepared
            every day. Order online or visit our nearest branch.
          </p>

          <p className="text-base font-extrabold  mt-10">
            Follow on Social Media
          </p>
          <SocialIcons />
        </div>

        {/* Explore */}
        <div>
          <h3 className="font-semibold mb-4 text-white">Explore</h3>
          <ul className="space-y-5 text-white text-sm">
            <FooterLink href="#">All Food</FooterLink>
            <FooterLink href="#">Nearby</FooterLink>
            <FooterLink href="#">Discount</FooterLink>
            <FooterLink href="#">Best Seller</FooterLink>
            <FooterLink href="#">Delivery</FooterLink>
            <FooterLink href="#">Lunch</FooterLink>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="font-semibold mb-4 text-white">Help</h3>
          <ul className="space-y-5 text-white text-sm">
            <FooterLink href="#">How to Order</FooterLink>
            <FooterLink href="#">Payment Methods</FooterLink>
            <FooterLink href="#">Track My Order</FooterLink>
            <FooterLink href="#">FAQ</FooterLink>
            <FooterLink href="#">Contact Us</FooterLink>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link to={href} className="hover:text-white transition-colors">
        {children}
      </Link>
    </li>
  );
}
