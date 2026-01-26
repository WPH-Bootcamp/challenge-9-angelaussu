// src/pages/Cart.tsx
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, loading, updateItem, removeItem } = useCart();

  if (loading) return <div className="px-30 pt-10">Loading cart...</div>;

  if (!cart.length) {
    return (
      <section className="px-30 pt-38.5 pb-28">
        <h1 className="text-[32px] font-extrabold mb-8">My Cart</h1>
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <p className="text-black-alt font-medium">Cart kamu masih kosong.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-red-alt text-white px-6 py-2 rounded-full font-bold"
          >
            Belanja sekarang
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="xl:px-80 xl:pt-38.5 xl:pb-28 sm:px-40 lg:pt-38.5 lg:pb-28 md:px-20 md:pt-30 md:pb-30 px-4 pt-25 pb-10">
      <h1 className="md:text-[32px] text-[24px] font-extrabold mb-8">
        My Cart
      </h1>

      <div className="flex flex-col gap-6">
        {cart.map((rc) => (
          <div
            key={rc.restaurant.id}
            className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] md:p-6 p-4"
          >
            {/* Header Restaurant */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={rc.restaurant.logo}
                  alt={rc.restaurant.name}
                  className="w-8 h-8 object-contain"
                />
                <p className="font-extrabold text-lg">{rc.restaurant.name}</p>
              </div>

              <button
                className="text-black-alt hover:text-black-alt transition cursor-pointer"
                onClick={() => navigate(`/restaurant/${rc.restaurant.id}`)}
                aria-label="Go to restaurant detail"
              >
                {/* chevron */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="translate-x-0.5"
                >
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="mt-5 flex flex-col gap-5">
              {rc.items.map((it) => {
                const name =
                  (it.menu as any).menuName ??
                  (it.menu as any).foodName ??
                  (it.menu as any).name ??
                  "Food Name";

                const image =
                  (it.menu as any).image ||
                  "https://via.placeholder.com/64x64.png?text=Food";

                return (
                  <div
                    key={it.id}
                    className="flex items-center justify-between gap-4"
                  >
                    {/* Left: image + text */}
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={image}
                        alt={name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />

                      <div className="min-w-0">
                        <p className="font-semibold text-black-alt truncate">
                          {name}
                        </p>
                        <p className="font-extrabold text-black-alt">
                          Rp {Number(it.menu.price).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>

                    {/* Right: qty control */}
                    <div className="flex items-center gap-3 shrink-0 ">
                      <QtyButton
                        variant="minus"
                        onClick={async () => {
                          if (it.quantity <= 1) {
                            await removeItem(it.id);
                          } else {
                            await updateItem(it.id, it.quantity - 1);
                          }
                        }}
                      />

                      <span className="w-5 text-center font-bold text-black-alt">
                        {it.quantity}
                      </span>

                      <QtyButton
                        variant="plus"
                        onClick={async () => {
                          await updateItem(it.id, it.quantity + 1);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-5 border-t border-dashed border-gray-200" />

            {/* Footer: Total + Checkout */}
            <div
              className="flex flex-col gap-3
  md:flex-row md:items-center md:justify-between md:gap-0"
            >
              <div>
                <p className="text-sm text-black-alt font-medium">Total</p>
                <p className="text-lg font-extrabold text-black-alt">
                  Rp {Number(rc.subtotal).toLocaleString("id-ID")}
                </p>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="bg-red-alt text-white font-extrabold px-10 py-2.5 rounded-full hover:opacity-95 transition"
              >
                Checkout
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function QtyButton({
  variant,
  onClick,
}: {
  variant: "minus" | "plus";
  onClick: () => void | Promise<void>;
}) {
  const isPlus = variant === "plus";

  return (
    <button
      onClick={onClick}
      className={[
        "w-9 h-9 rounded-full flex items-center justify-center transition",
        isPlus
          ? "bg-red-alt text-white hover:opacity-95"
          : "bg-white border border-gray-200 text-black-alt hover:bg-gray-50",
      ].join(" ")}
      aria-label={isPlus ? "Increase quantity" : "Decrease quantity"}
    >
      {isPlus ? (
        <span className="text-xl font-extrabold leading-none">+</span>
      ) : (
        <span className="text-xl font-extrabold leading-none">−</span>
      )}
    </button>
  );
}
