// src/pages/CheckoutSuccess.tsx
import { useLocation, useNavigate } from "react-router-dom";

type SuccessState = {
  dateText: string;
  paymentMethod: string;
  totalItems: number;
  itemsPrice: number;
  deliveryFee: number;
  serviceFee: number;
  totalPay: number;
};

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const s = state as SuccessState | null;

  // kalau user refresh page / buka langsung tanpa state
  if (!s) {
    return (
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-8 w-full max-w-md text-center">
          <p className="font-extrabold text-lg text-black-alt">
            Payment Success
          </p>
          <p className="text-sm text-black-alt/70 mt-2">
            Detail tidak tersedia. Silakan cek halaman orders.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 w-full bg-red-alt text-white font-extrabold py-3 rounded-full"
          >
            Back to Home
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[75vh] flex flex-col items-center justify-center px-6 py-14">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-full bg-red-alt/10 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-red-alt" />
        </div>
        <p className="text-2xl font-extrabold text-black-alt">Foody</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-8 w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 6L9 17l-5-5"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="mt-4 font-extrabold text-lg text-black-alt">
            Payment Success
          </p>
          <p className="mt-1 text-sm text-black-alt/70">
            Your payment has been successfully processed.
          </p>
        </div>

        <div className="my-6 border-t border-dashed border-gray-200" />

        <div className="space-y-4 text-sm">
          <Row label="Date" value={s.dateText} />
          <Row label="Payment Method" value={s.paymentMethod} />
          <Row
            label={`Price (${s.totalItems} items)`}
            value={`Rp${s.itemsPrice.toLocaleString("id-ID")}`}
          />
          <Row
            label="Delivery Fee"
            value={`Rp${s.deliveryFee.toLocaleString("id-ID")}`}
          />
          <Row
            label="Service Fee"
            value={`Rp${s.serviceFee.toLocaleString("id-ID")}`}
          />
        </div>

        <div className="my-6 border-t border-dashed border-gray-200" />

        <div className="flex items-center justify-between">
          <p className="font-extrabold text-black-alt">Total</p>
          <p className="font-extrabold text-black-alt">
            Rp{s.totalPay.toLocaleString("id-ID")}
          </p>
        </div>

        <button
          onClick={() => navigate("/my-orders")}
          className="mt-6 w-full bg-red-alt text-white font-extrabold py-3 rounded-full hover:opacity-95 transition"
        >
          See My Orders
        </button>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-black-alt/70">{label}</p>
      <p className="font-semibold text-black-alt text-right">{value}</p>
    </div>
  );
}
