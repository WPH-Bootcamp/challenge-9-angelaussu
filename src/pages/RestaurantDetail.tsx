// src/pages/RestaurantDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRestaurantDetail } from "@/services/api/restaurant.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Profile from "../assets/profile-default.png";
import Rating from "../assets/star.svg";
import CartBlack from "../assets/bag-black.svg";

import { useCart } from "@/context/CartContext";

// Auth
import { useAuth } from "@/hooks/useAuth";
// NOTE: kalau yang kamu pakai adalah AuthContext versi lain,
// ganti jadi: import { useAuth } from "@/context/AuthContext";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type Menu = {
  menuId: number;
  menuName: string;
  price: number;
  type: "food" | "drink" | string;
  image?: string;
  quantity?: number;
};

type Review = {
  id: number;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  date: string;
  comment: string;
  createdAt: string;
};

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatDateTime = (isoString: string) => {
    const d = new Date(isoString);
    return (
      d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }) +
      `, ${d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    );
  };

  // Auth (login check)
  const { user, token, loading: authLoading } = useAuth();
  const isLoggedIn = !!user && !!token;

  // Cart Context
  const { cart, summary, addItem, updateItem, removeItem } = useCart();

  // Load More state
  const [reviewVisibleCount, setReviewVisibleCount] = useState(4);
  const [menuVisibleCount, setMenuVisibleCount] = useState({
    all: 8,
    food: 8,
    drink: 8,
  });

  const handleLoadMoreReview = () => {
    setReviewVisibleCount((prev) => prev + 4);
  };

  const handleLoadMoreMenu = (type: "all" | "food" | "drink") => {
    setMenuVisibleCount((prev) => ({
      ...prev,
      [type]: prev[type] + 4,
    }));
  };

  // Carousel API for dots (Embla)
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselCount, setCarouselCount] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => setCarouselIndex(carouselApi.selectedScrollSnap());
    setCarouselCount(carouselApi.scrollSnapList().length);
    onSelect();

    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // Fetch detail
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    getRestaurantDetail(id)
      .then((data) => setRestaurant(data))
      .catch((err) => {
        console.error("getRestaurantDetail error:", err);
        setRestaurant(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!restaurant) return <p className="p-10">Data tidak ditemukan</p>;

  // Images safe
  const images: string[] = Array.isArray(restaurant.images)
    ? restaurant.images
    : [];
  const heroImg = images?.[0] || Profile;
  const topRightImg = images?.[3] || images?.[1] || heroImg;

  const carouselImages = images.length ? images : [heroImg];

  // Menus normalize (biar menuName selalu kebaca)
  const menus: Menu[] = (restaurant.menus ?? []).map((m: any) => {
    const src = m?.menu ?? m;

    return {
      menuId: src?.menuId ?? src?.id ?? m?.menuId ?? m?.id ?? 0,
      menuName:
        src?.menuName ?? src?.name ?? src?.foodName ?? m?.menuName ?? "Menu",
      price: Number(src?.price ?? m?.price ?? 0),
      type: src?.type ?? m?.type ?? "",
      image: src?.image ?? m?.image,
      quantity: m?.quantity ?? src?.quantity,
    };
  });

  const foodMenus = menus.filter((m) => m.type === "food");
  const drinkMenus = menus.filter((m) => m.type === "drink");
  const reviews: Review[] = restaurant.reviews ?? [];

  const visibleReviews = reviews.slice(0, reviewVisibleCount);
  const visibleMenus = {
    all: menus.slice(0, menuVisibleCount.all),
    food: foodMenus.slice(0, menuVisibleCount.food),
    drink: drinkMenus.slice(0, menuVisibleCount.drink),
  };

  const currentRestoCart =
    cart.find((c) => c.restaurant.id === restaurant?.id) ?? null;

  const getQty = (menuId: number) => {
    const item = currentRestoCart?.items.find((it) => it.menu.id === menuId);
    return item?.quantity ?? 0;
  };

  const addToCart = async (menu: Menu) => {
    if (!restaurant?.id) return;

    const item = currentRestoCart?.items.find(
      (it) => it.menu.id === menu.menuId,
    );

    try {
      if (!item) {
        await addItem(restaurant.id, menu.menuId, 1);
      } else {
        await updateItem(item.id, item.quantity + 1);
      }
    } catch (e) {
      console.error("addToCart failed:", e);
    }
  };

  const decreaseQty = async (menuId: number) => {
    const item = currentRestoCart?.items.find((it) => it.menu.id === menuId);
    if (!item) return;

    try {
      if (item.quantity <= 1) {
        await removeItem(item.id);
      } else {
        await updateItem(item.id, item.quantity - 1);
      }
    } catch (e) {
      console.error("decreaseQty failed:", e);
    }
  };

  return (
    <section
      className="px-4 pt-20 pb-20
      md:px-10 md:pt-30 md:pb-20
      lg:px-20 lg:pt-38.5 lg:pb-20
      xl:px-30 xl:pb-28"
    >
      {/* =====================
          GALERI GAMBAR
          Mobile: Carousel + dots
          Tablet+: Layout lama
      ====================== */}
      <div className="pb-8">
        {/* Mobile Slider */}
        <div className="md:hidden">
          <Carousel className="w-full" setApi={setCarouselApi}>
            <CarouselContent>
              {carouselImages.map((img: string, idx: number) => (
                <CarouselItem key={idx}>
                  <img
                    src={img || heroImg}
                    className="w-full h-72 rounded-2xl object-cover"
                    alt={`restaurant-${idx}`}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <CarouselDots
            count={carouselCount || carouselImages.length}
            selected={carouselIndex}
            onDotClick={(i) => carouselApi?.scrollTo(i)}
          />
        </div>

        {/*  Tablet+ Desktop Layout lama */}
        <div className="hidden md:flex gap-5">
          <div className="w-1/2">
            <img
              src={heroImg}
              className="h-117.5 w-full rounded-2xl object-cover"
              alt="restaurant"
            />
          </div>

          <div className="w-1/2 flex flex-col gap-5">
            <img
              src={topRightImg}
              className="h-56.25 w-full rounded-2xl object-cover"
              alt="restaurant"
            />
            <div className="flex gap-5">
              {images.slice(1, 3).map((img: string, i: number) => (
                <img
                  key={i}
                  src={img || heroImg}
                  className="h-56.25 w-1/2 rounded-2xl object-cover"
                  alt="restaurant"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LOGO & INFO */}
      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-border">
        <img
          src={restaurant.logo || Profile}
          className="h-30 w-30 object-contain"
          alt="logo"
        />
        <div>
          <h1 className="text-[32px] font-extrabold">{restaurant.name}</h1>
          <p className="gap-1 text-black-alt text-[18px] font-semibold flex items-center">
            <img src={Rating} alt="Rating" className="h-6 w-6" />{" "}
            {restaurant.star}
          </p>
          <p className="mt-1 text-black-alt text-[18px] font-medium">
            {restaurant.place}
          </p>
        </div>
      </div>

      {/* TABS MENU */}
      <h2 className="md:text-[36px] text-[32px] font-extrabold mb-3">Menu</h2>
      <Tabs defaultValue="all">
        <TabsList className="mb-6 h-11.5! gap-3">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-red-soft data-[state=active]:border-red-alt border rounded-full py-2 px-4 text-red-alt font-base font-bold cursor-pointer"
          >
            All Menu
          </TabsTrigger>
          <TabsTrigger
            value="food"
            className="border-neutral bg-white text-black-alt rounded-full py-2 px-4 font-semibold cursor-pointer hover:bg-red-soft hover:border-red-alt hover:text-red-alt"
          >
            Food
          </TabsTrigger>
          <TabsTrigger
            value="drink"
            className="border-neutral bg-white text-black-alt rounded-full py-2 px-4 font-semibold cursor-pointer hover:bg-red-soft hover:border-red-alt hover:text-red-alt"
          >
            Drink
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <MenuGrid
            menus={visibleMenus.all}
            onAdd={addToCart}
            onDecrease={decreaseQty}
            getQty={getQty}
          />
          {menus.length > menuVisibleCount.all && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => handleLoadMoreMenu("all")}
                className="bg-white text-black-alt font-bold px-6 py-2 rounded-full border border-[#D5D7DA] hover:bg-red-alt hover:border-red-alt hover:text-white transition cursor-pointer"
              >
                Show More
              </button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="food">
          <MenuGrid
            menus={visibleMenus.food}
            onAdd={addToCart}
            onDecrease={decreaseQty}
            getQty={getQty}
          />
          {foodMenus.length > menuVisibleCount.food && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => handleLoadMoreMenu("food")}
                className="bg-white text-black-alt font-bold px-6 py-2 rounded-full border border-[#D5D7DA] hover:bg-red-alt hover:border-red-alt hover:text-white transition cursor-pointer"
              >
                Show More
              </button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="drink">
          <MenuGrid
            menus={visibleMenus.drink}
            onAdd={addToCart}
            onDecrease={decreaseQty}
            getQty={getQty}
          />
          {drinkMenus.length > menuVisibleCount.drink && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => handleLoadMoreMenu("drink")}
                className="bg-white text-black-alt font-bold px-6 py-2 rounded-full border border-[#D5D7DA] hover:bg-red-alt hover:border-red-alt hover:text-white transition cursor-pointer"
              >
                Show More
              </button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* REVIEW */}
      <div className="mt-10 border-t border-gray-border pt-8">
        <h2 className="md:text-[36px] text-[32px] font-extrabold mb-3">
          Review
        </h2>
        <p className="gap-1 text-black-alt text-[18px] font-semibold flex items-center mb-6">
          <img src={Rating} alt="Rating" className="h-6 w-6" />{" "}
          {restaurant.star} <span>({reviews.length} Ulasan)</span>
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {visibleReviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col gap-4 bg-white rounded-3xl shadow-[0_0_20px_0_rgba(203,202,202,0.25)] p-4"
            >
              <div className="flex gap-3 items-center">
                <img
                  src={review.user.avatar || Profile}
                  className="h-16 w-16 rounded-full"
                  alt="avatar"
                />
                <div>
                  <h3 className="font-extrabold text-[18px]">
                    {review.user.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {formatDateTime(review.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-6 h-6 ${
                        i < review.rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                      fill="#FFAB0D"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.068 9.384c-.783-.57-.38-1.81.588-1.81h4.157a1 1 0 00.95-.69l1.286-3.957z" />
                    </svg>
                  ))}
                </div>
                <p className="leading-7.5 font-normal">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>

        {reviews.length > reviewVisibleCount && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLoadMoreReview}
              className="bg-white text-black-alt font-bold px-6 py-2 rounded-full border border-[#D5D7DA] hover:bg-red-alt hover:border-red-alt hover:text-white transition cursor-pointer"
            >
              Show More
            </button>
          </div>
        )}
      </div>

      {/*BOTTOM CART BAR (LOGIN ONLY) */}
      {!authLoading && isLoggedIn && summary.totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_0_20px_0_rgba(203,202,202,0.25)] lg:px-30 lg:py-1.75 px-4 py-1.75">
          <div className="mx-auto flex justify-between items-center">
            <div>
              <div className="flex gap-2">
                <img src={CartBlack} alt="Cart Icon" className="w-6 h-6" />
                <p className="font-medium">{summary.totalItems} item</p>
              </div>
              <p className="text-black-alt font-extrabold text-5 leadeing-[34px]">
                Rp {summary.totalPrice.toLocaleString("id-ID")}
              </p>
            </div>
            <button
              onClick={() => navigate("/cart")}
              className="bg-red-alt text-white lg:px-20.25 lg:py-1.75 md:px-14 md:py-1.75 px-12.5 py-1.75 rounded-full font-bold cursor-pointer leading-7.5"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================
   DOTS (Pagination)
========================= */
function CarouselDots({
  count,
  selected,
  onDotClick,
}: {
  count: number;
  selected: number;
  onDotClick: (i: number) => void;
}) {
  if (!count || count <= 1) return null;

  return (
    <div className="mt-4 flex justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          className={`h-2 rounded-full transition-all ${
            selected === i ? "w-2 bg-red-alt" : "w-2 bg-gray-300"
          }`}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

// =========================
// MENU GRID
// =========================
function MenuGrid({
  menus,
  onAdd,
  onDecrease,
  getQty,
}: {
  menus: Menu[];
  onAdd: (menu: Menu) => void | Promise<void>;
  onDecrease: (id: number) => void | Promise<void>;
  getQty: (id: number) => number;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-6 md:grid-cols-2 xl:grid-cols-4">
      {menus.map((menu) => {
        const qty = getQty(menu.menuId);

        return (
          <div key={menu.menuId} className="rounded-xl">
            {menu.image && (
              <img
                src={menu.image}
                className="h-43 md:h-60 lg:h-70 xl:h-71.25 w-full object-cover rounded-t-lg"
                alt={menu.menuName || "menu"}
              />
            )}

            <div className="flex flex-col p-3 md:flex-row md:justify-between md:p-4">
              <div className="flex flex-col">
                <h3 className="font-medium">{menu.menuName || "Menu"}</h3>
                <p className="font-extrabold">
                  Rp {menu.price.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="mt-3">
                {qty === 0 ? (
                  <button
                    onClick={() => onAdd(menu)}
                    className="w-full bg-red-alt text-white py-1.25 px-6 rounded-full font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => onDecrease(menu.menuId)}
                      className="border-gray-border border cursor-pointer h-10 w-10 rounded-full text-2xl font-extrabold text-black-alt"
                    >
                      -
                    </button>
                    <span>{qty}</span>
                    <button
                      onClick={() => onAdd(menu)}
                      className="bg-red-alt cursor-pointer h-10 w-10 rounded-full text-2xl font-extrabold text-white"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
