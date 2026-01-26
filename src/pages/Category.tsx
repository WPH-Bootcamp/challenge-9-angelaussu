// src/pages/Category.tsx
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

type Restaurant = {
  id: number;
  name: string;
  star?: number | string | null;
  place?: string | null;
  logo?: string | null;
  images?: string[];
  category?: string;
  reviewCount?: number;
  menuCount?: number;
  priceRange?: {
    min?: number | string | null;
    max?: number | string | null;
  } | null;
  distance?: number | string | null;
};

type ApiResponse = {
  success: boolean;
  data: {
    restaurants: Restaurant[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

const fetchRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const res = await fetch(
      "https://restaurant-be-400174736012.asia-southeast2.run.app/api/resto",
    );
    if (!res.ok) throw new Error("Network response not ok");

    const data: ApiResponse = await res.json();
    if (!data.success) return [];
    return data.data.restaurants ?? [];
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
};

export default function CategoryPage() {
  const {
    data: restaurants = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["restaurants"],
    queryFn: fetchRestaurants,
  });

  const [filters, setFilters] = useState({
    distance: "Nearby",
    priceMin: "",
    priceMax: "",
    rating: 0,
  });

  // Mobile drawer state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toNum = (v: unknown, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((resto) => {
      const star = toNum(resto.star, 0);
      const distance = toNum(resto.distance, 999999);

      // rating
      if (filters.rating > 0 && star < filters.rating) return false;

      // distance
      switch (filters.distance) {
        case "Within 1 km":
          if (distance > 1) return false;
          break;
        case "Within 3 km":
          if (distance > 3) return false;
          break;
        case "Within 5 km":
          if (distance > 5) return false;
          break;
        default:
          break; // Nearby = semua
      }

      // price
      const minPriceFilter = filters.priceMin ? toNum(filters.priceMin, 0) : 0;
      const maxPriceFilter = filters.priceMax
        ? toNum(filters.priceMax, Number.POSITIVE_INFINITY)
        : Number.POSITIVE_INFINITY;

      const minResto = toNum(resto.priceRange?.min, 0);
      const maxResto = toNum(resto.priceRange?.max, Number.POSITIVE_INFINITY);

      if (maxResto < minPriceFilter || minResto > maxPriceFilter) return false;

      return true;
    });
  }, [restaurants, filters]);

  if (isLoading) return <div className="p-10">Loading...</div>;
  if (error) console.error(error);

  const FilterContent = (
    <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-5">
      <p className="text-xs font-extrabold tracking-wide text-black-alt/70 mb-4">
        FILTER
      </p>

      {/* Distance */}
      <div className="pb-5 border-b border-gray-100">
        <h3 className="font-extrabold text-sm text-black-alt mb-3">Distance</h3>

        <div className="flex flex-col gap-2.5">
          {["Nearby", "Within 1 km", "Within 3 km", "Within 5 km"].map((d) => (
            <label
              key={d}
              className="flex items-center gap-3 text-sm text-black-alt"
            >
              <input
                type="radio"
                name="distance"
                value={d}
                checked={filters.distance === d}
                onChange={() =>
                  setFilters((prev) => ({ ...prev, distance: d }))
                }
                className="h-4 w-4 accent-red-500"
              />
              <span>{d}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="py-5 border-b border-gray-100">
        <h3 className="font-extrabold text-sm text-black-alt mb-3">Price</h3>

        <div className="flex flex-col gap-3">
          <PriceInput
            placeholder="Minimum Price"
            value={filters.priceMin}
            onChange={(v) => setFilters((prev) => ({ ...prev, priceMin: v }))}
          />
          <PriceInput
            placeholder="Maximum Price"
            value={filters.priceMax}
            onChange={(v) => setFilters((prev) => ({ ...prev, priceMax: v }))}
          />
        </div>
      </div>

      {/* Rating */}
      <div className="pt-5">
        <h3 className="font-extrabold text-sm text-black-alt mb-3">Rating</h3>

        <div className="flex flex-col gap-2.5">
          {[5, 4, 3, 2, 1].map((r) => (
            <label
              key={r}
              className="flex items-center gap-3 text-sm text-black-alt"
            >
              <input
                type="radio"
                name="rating"
                value={r}
                checked={filters.rating === r}
                onChange={() => setFilters((prev) => ({ ...prev, rating: r }))}
                className="h-4 w-4 accent-red-500"
              />
              <span className="flex items-center gap-2">
                <StarIcon />
                {r}
              </span>
            </label>
          ))}

          {filters.rating !== 0 && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, rating: 0 }))}
              className="mt-2 text-left text-xs font-semibold text-black-alt/60 hover:text-black-alt"
            >
              Clear rating
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="px-4 md:px-10 lg:px-30 pt-28 pb-28">
      {/* Header + Mobile Filter Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-black">All Restaurant</h1>

        {/* Mobile-only filter button (sesuai gambar: icon filter) */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          aria-label="Open filter"
        >
          <FilterIcon />
        </button>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-70 shrink-0">{FilterContent}</aside>

        {/* Mobile Drawer Filter */}
        {isFilterOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            {/* overlay */}
            <button
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsFilterOpen(false)}
              aria-label="Close filter overlay"
            />
            {/* panel */}
            <div className="absolute top-0 left-0 h-full w-[78%] max-w-90 bg-white shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="text-sm font-extrabold text-black-alt">
                  Filter
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-9 h-9 rounded-full border border-gray-200 inline-flex items-center justify-center"
                  aria-label="Close filter"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="p-4">{FilterContent}</div>
            </div>
          </div>
        )}

        {/* Grid / List */}
        <div className="flex-1">
          {filteredRestaurants.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              No restaurants match the filters
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRestaurants.map((resto) => {
                const star = toNum(resto.star, 0);
                const distance = toNum(resto.distance, 0);
                const place = resto.place ?? "-";
                const logo = resto.logo || "";

                return (
                  <Link
                    key={resto.id}
                    to={`/restaurant/${resto.id}`}
                    className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-4 flex items-center gap-4
                               hover:-translate-y-px hover:shadow-[0_14px_34px_rgba(0,0,0,0.08)] transition"
                  >
                    <div className="w-18 h-18 rounded-xl bg-[#F5EFE6] flex items-center justify-center overflow-hidden">
                      {logo ? (
                        <img
                          src={logo}
                          alt={resto.name}
                          className="w-14 h-14 object-contain"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-white/70" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-black-alt truncate">
                        {resto.name}
                      </h4>

                      <div className="mt-1 flex items-center gap-2 text-sm">
                        <StarIcon />
                        <span className="font-semibold text-black-alt">
                          {star.toFixed(1)}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-black-alt/70">
                        {place} · {distance.toFixed(1)} km
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================
   UI helpers
========================= */

function PriceInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden bg-white">
      <div className="px-3 py-2 text-xs font-bold text-black-alt/70 border-r border-gray-200">
        Rp
      </div>
      <input
        type="number"
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm outline-none placeholder:text-black-alt/40"
      />
    </div>
  );
}

function StarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M10 1.8l2.35 4.76 5.26.76-3.8 3.7.9 5.24L10 13.98 5.29 16.26l.9-5.24-3.8-3.7 5.26-.76L10 1.8z"
        fill="#FFAB0D"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
