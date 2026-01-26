// src/components/Hero.tsx
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import HeroBanner from "../assets/hero_banner.png"; // path relatif Vite

export default function Hero() {
  return (
    <section
      className="relative w-full h-206.75 flex items-center justify-center py-3 px-4
  md:py-4 md:px-10
  lg:py-4 lg:px-20
  xl:py-4 xl:px-30"
    >
      {/* Background */}
      <img
        src={HeroBanner}
        alt="Hero Banner"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white w-full xl:max-w-4xl xl:mx-auto px-4">
        <h1 className="text-[36px] xl:text-[48px] font-extrabold leading-tight">
          Explore Culinary Experiences
        </h1>
        <p
          className="mt-2 text-[18px]
  md:text-[22px]
  xl:text-[28px]"
        >
          Search and refine your choice to discover the perfect restaurant.
        </p>

        {/* Search bar */}
        <div className="mt-6 flex justify-center">
          <div className="relative w-full max-w-151">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search restaurants, food and drink"
              className="w-full pl-10 pr-4 py-3.25 rounded-[40px] bg-white text-black outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
