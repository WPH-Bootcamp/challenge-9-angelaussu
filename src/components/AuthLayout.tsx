import type { ReactNode } from "react";
import BannerAuth from "../assets/popup_banner.png";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full bg-white shadow-lg">
        {/* LEFT */}
        <div className="bg-primary text-white flex items-center justify-center overflow-hidden">
          <img src={BannerAuth} alt="Banner Auth" className="w-full " />
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center bg-muted min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}
