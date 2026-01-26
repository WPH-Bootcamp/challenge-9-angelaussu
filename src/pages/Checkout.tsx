// src/pages/Checkout.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import api from "@/services/api/axios";

// ✅ IMPORT LOGO BANK DARI ASSETS (sesuaikan nama file kamu)
import BniLogo from "@/assets/bni.png";
import BriLogo from "@/assets/bri.png";
import BcaLogo from "@/assets/bca.png";
import MandiriLogo from "@/assets/mandiri.png";

type PaymentKey = "bni" | "bri" | "bca" | "mandiri";

const PAYMENT_LABEL: Record<PaymentKey, string> = {
  bni: "BNI Bank Negara Indonesia",
  bri: "BRI Bank Rakyat Indonesia",
  bca: "BCA Bank Central Asia",
  mandiri: "Mandiri",
};

// ✅ mapping logo
const PAYMENT_LOGO: Record<PaymentKey, string> = {
  bni: BniLogo,
  bri: BriLogo,
  bca: BcaLogo,
  mandiri: MandiriLogo,
};

export default function CheckoutPage() {
  const navigate = useNavigate();

  // ✅ ambil clearCart juga
  const { cart, summary, loading, updateItem, removeItem, clearCart } =
    useCart();

  // ✅ dummy address (tampilan seperti SS)
  const [deliveryAddress, setDeliveryAddress] = useState(
    "Jl. Sudirman No. 25, Jakarta Pusat, 10220",
  );
  const [phone, setPhone] = useState("0812-3456-7890");

  // ✅ toggle edit
  const [editingAddress, setEditingAddress] = useState(false);

  const [payment, setPayment] = useState<PaymentKey>("bni");
  const [notes, setNotes] = useState("Please ring the doorbell");
  const [submitting, setSubmitting] = useState(false);

  // ✅ fee contoh (sesuaikan kalau backend yang hitung)
  const deliveryFee = 10000;
  const serviceFee = 1000;

  const itemsPrice = useMemo(() => Number(summary.totalPrice ?? 0), [summary]);
  const totalPay = useMemo(
    () => itemsPrice + deliveryFee + serviceFee,
    [itemsPrice, deliveryFee, serviceFee],
  );

  if (loading) return <div className="px-30 pt-10">Loading checkout...</div>;

  if (!cart.length) {
    return (
      <section className="px-30 pt-10 pb-20">
        <h1 className="text-2xl font-extrabold mb-6">Checkout</h1>
        <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-8">
          <p className="text-black-alt font-medium">Cart kamu kosong.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-red-alt text-white px-6 py-2 rounded-full font-bold"
            type="button"
          >
            Kembali belanja
          </button>
        </div>
      </section>
    );
  }

  const formatSuccessDate = (d: Date) => {
    return (
      d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }) +
      ", " +
      d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    );
  };

  // ✅ FIXED handleCheckout: ambil transactionId kalau ada + clearCart + navigate
  const handleCheckout = async () => {
    try {
      setSubmitting(true);

      const payload = {
        restaurants: cart.map((rc) => ({
          restaurantId: rc.restaurant.id,
          items: rc.items.map((it) => {
            const menuId =
              Number((it.menu as any)?.id) ||
              Number((it.menu as any)?.menuId) ||
              Number((it as any)?.menuId) ||
              0;

            return {
              menuId,
              quantity: it.quantity,
            };
          }),
        })),
        deliveryAddress,
        phone,
        paymentMethod: PAYMENT_LABEL[payment],
        notes,
      };

      const res = await api.post("/api/order/checkout", payload);
      console.log("Checkout success:", res.data);

      // ✅ ambil transactionId / order dari response (tergantung backend)
      const createdOrder = res?.data?.data?.order ?? res?.data?.data ?? null;
      const transactionId =
        createdOrder?.transactionId ?? res?.data?.transactionId ?? null;

      const now = new Date();
      const dateText = formatSuccessDate(now);

      // ✅ reset cart (API-based)
      await clearCart();

      // ✅ navigate ke success page + kirim detail
      navigate("/checkout-success", {
        replace: true,
        state: {
          dateText,
          transactionId, // ✅ opsional: dipakai untuk refresh/highlight my orders
          paymentMethod: PAYMENT_LABEL[payment],
          totalItems: Number(summary.totalItems ?? 0),
          itemsPrice,
          deliveryFee,
          serviceFee,
          totalPay,
        },
      });
    } catch (err: any) {
      console.error("Checkout failed:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Checkout gagal, silakan coba lagi";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="px-4 md:px-10 lg:px-20 xl:px-61.75 md:pt-32 pt-25 pb-20">
      <h1 className="md:text-[32px] text-[24px] font-extrabold mb-6">
        Checkout
      </h1>

      <div className="grid grid-cols-12 gap-8">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] md:p-6 p-4">
            <div>
              <div>
                <div className="flex items-center gap-2">
                  <PinIcon />
                  <p className="font-extrabold text-sm text-black-alt">
                    Delivery Address
                  </p>
                </div>

                {!editingAddress ? (
                  <>
                    <p className="mt-2 text-sm text-black-alt/80">
                      {deliveryAddress}
                    </p>
                    <p className="mt-1 text-sm text-black-alt/80">{phone}</p>
                  </>
                ) : (
                  <div className="mt-3 flex flex-col gap-3 w-105 max-w-full">
                    <input
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                    />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={() => setEditingAddress((v) => !v)}
                className="border border-gray-200 rounded-full px-6 py-2 text-sm font-bold text-black-alt hover:bg-gray-50 transition cursor-pointer mt-5.25"
                type="button"
              >
                {editingAddress ? "Save" : "Change"}
              </button>
            </div>
          </div>

          {/* Restaurant cards */}
          {cart.map((rc) => (
            <div
              key={rc.restaurant.id}
              className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] md:p-6 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rc.restaurant.logo}
                    alt={rc.restaurant.name}
                    className="w-8 h-8 object-contain"
                  />
                  <p className="font-extrabold text-black-alt">
                    {rc.restaurant.name}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/restaurant/${rc.restaurant.id}`)}
                  className="border border-gray-200 rounded-full px-5 py-2 text-sm font-bold text-black-alt hover:bg-gray-50 transition cursor-pointer"
                  type="button"
                >
                  Add item
                </button>
              </div>

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

                  const price = Number((it.menu as any).price ?? 0);

                  return (
                    <div
                      key={it.id}
                      className="flex items-center justify-between gap-4"
                    >
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
                            Rp {price.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>

                      {/* qty control */}
                      <div className="flex items-center gap-3 shrink-0">
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
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] md:p-6 p-4 sticky top-24">
            {/* Payment Method */}
            <h2 className="font-extrabold md:text-[18px] text-base text-black-alt mb-4">
              Payment Method
            </h2>

            <div className="flex flex-col divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
              <PaymentRow
                title="Bank Negara Indonesia"
                code="BNI"
                logoSrc={PAYMENT_LOGO.bni}
                selected={payment === "bni"}
                onClick={() => setPayment("bni")}
              />
              <PaymentRow
                title="Bank Rakyat Indonesia"
                code="BRI"
                logoSrc={PAYMENT_LOGO.bri}
                selected={payment === "bri"}
                onClick={() => setPayment("bri")}
              />
              <PaymentRow
                title="Bank Central Asia"
                code="BCA"
                logoSrc={PAYMENT_LOGO.bca}
                selected={payment === "bca"}
                onClick={() => setPayment("bca")}
              />
              <PaymentRow
                title="Mandiri"
                code="MDR"
                logoSrc={PAYMENT_LOGO.mandiri}
                selected={payment === "mandiri"}
                onClick={() => setPayment("mandiri")}
              />
            </div>

            {/* Payment Summary */}
            <div className="mt-6">
              <h3 className="font-extrabold md:text-[18px] text-base text-black-alt mb-3">
                Payment Summary
              </h3>

              <div className="flex flex-col gap-2 text-base text-black-alt">
                <Row
                  label={`Price (${summary.totalItems} items)`}
                  value={`Rp ${itemsPrice.toLocaleString("id-ID")}`}
                />
                <Row
                  label="Delivery Fee"
                  value={`Rp ${deliveryFee.toLocaleString("id-ID")}`}
                />
                <Row
                  label="Service Fee"
                  value={`Rp ${serviceFee.toLocaleString("id-ID")}`}
                />
              </div>

              <div className="my-4 border-t border-gray-100" />

              <div className="flex items-center justify-between">
                <p className="font-extrabold text-black-alt">Total</p>
                <p className="font-extrabold text-black-alt">
                  Rp {totalPay.toLocaleString("id-ID")}
                </p>
              </div>

              <button
                disabled={submitting}
                onClick={handleCheckout}
                className="mt-5 w-full bg-red-alt text-white font-extrabold py-3 rounded-full hover:opacity-95 transition disabled:opacity-50"
                type="button"
              >
                {submitting ? "Processing..." : "Buy"}
              </button>

              <p className="mt-3 text-xs text-black-alt">
                Payment:{" "}
                <span className="font-semibold">{PAYMENT_LABEL[payment]}</span>
              </p>

              {/* Notes */}
              <div className="mt-4">
                <p className="text-sm font-extrabold text-black-alt mb-2">
                  Notes
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none min-h-22.5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================
   UI helpers
========================= */

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-black-alt">{label}</p>
      <p className="font-semibold text-black-alt">{value}</p>
    </div>
  );
}

function PaymentRow({
  title,
  code,
  logoSrc,
  selected,
  onClick,
}: {
  title: string;
  code: string;
  logoSrc?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition text-left"
      type="button"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center">
          {logoSrc ? (
            <img src={logoSrc} alt={code} className="w-7 h-7 object-contain" />
          ) : (
            <span className="text-[10px] font-extrabold text-black-alt">
              {code}
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-black-alt">{title}</p>
      </div>

      <span
        className={[
          "w-4 h-4 rounded-full border-2 flex items-center justify-center",
          selected ? "border-red-alt" : "border-gray-300",
        ].join(" ")}
      >
        {selected && <span className="w-2.5 h-2.5 rounded-full bg-red-alt" />}
      </span>
    </button>
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
        "w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer",
        isPlus
          ? "bg-red-alt text-white hover:opacity-95"
          : "bg-white border border-gray-200 text-black-alt hover:bg-gray-50",
      ].join(" ")}
      aria-label={isPlus ? "Increase quantity" : "Decrease quantity"}
      type="button"
    >
      {isPlus ? (
        <span className="text-xl font-extrabold leading-none">+</span>
      ) : (
        <span className="text-xl font-extrabold leading-none">−</span>
      )}
    </button>
  );
}

function PinIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 22s7-4.5 7-12a7 7 0 10-14 0c0 7.5 7 12 7 12z"
        stroke="#D12D2D"
        strokeWidth="2"
      />
      <path d="M12 13a3 3 0 100-6 3 3 0 000 6z" fill="#D12D2D" />
    </svg>
  );
}
