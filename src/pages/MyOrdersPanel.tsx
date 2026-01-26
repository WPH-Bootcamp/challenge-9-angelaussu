// src/pages/MyOrdersPanel.tsx
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type OrderStatus =
  | "preparing"
  | "on_the_way"
  | "delivered"
  | "done"
  | "canceled";

type OrderItem = {
  menuId: number;
  menuName: string;
  price: number;
  image: string;
  quantity: number;
  itemTotal: number;
};

type OrderRestaurant = {
  restaurant: { id: number; name: string; logo: string };
  items: OrderItem[];
  subtotal: number;
};

type Order = {
  id: number;
  transactionId: string;
  status: OrderStatus;
  paymentMethod: string;
  deliveryAddress: string;
  phone: string;
  pricing: {
    subtotal: number;
    serviceFee: number;
    deliveryFee: number;
    totalPrice: number;
  };
  restaurants: OrderRestaurant[];
  createdAt: string;
};

type ReviewTarget = {
  transactionId: string;
  restaurantId: number;
  restaurantName: string;
  menuIds: number[];
};

type OrderCardReviewPayload = ReviewTarget;

const STATUS_TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "Preparing", value: "preparing" },
  { label: "On the Way", value: "on_the_way" },
  { label: "Delivered", value: "delivered" },
  { label: "Done", value: "done" },
  { label: "Canceled", value: "canceled" },
  { label: "All", value: "all" },
];

async function fetchOrders(status: OrderStatus | "all") {
  const res = await api.get("/api/order/my-order", {
    params: status === "all" ? undefined : { status },
  });

  const orders = res?.data?.data?.orders ?? res?.data?.orders ?? [];
  return orders as Order[];
}

export default function MyOrdersPanel() {
  const [status, setStatus] = useState<OrderStatus | "all">("preparing");
  const [search, setSearch] = useState("");

  // Review modal state
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["my-orders", status],
    queryFn: () => fetchOrders(status),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;

    return orders.filter((o) => {
      const restoNames = (o.restaurants ?? [])
        .map((r) => r.restaurant?.name ?? "")
        .join(" ")
        .toLowerCase();

      const menuNames = (o.restaurants ?? [])
        .flatMap((r) => (r.items ?? []).map((it) => it.menuName ?? ""))
        .join(" ")
        .toLowerCase();

      return restoNames.includes(q) || menuNames.includes(q);
    });
  }, [orders, search]);

  const openReview = (payload: OrderCardReviewPayload) => {
    setReviewTarget(payload);
    setRating(0);
    setComment("");
    setReviewOpen(true);
  };

  const submitReview = async () => {
    if (!reviewTarget) return;

    try {
      setSending(true);

      const payload = {
        transactionId: reviewTarget.transactionId,
        restaurantId: reviewTarget.restaurantId,
        star: rating,
        comment: comment.trim(),
        menuIds: reviewTarget.menuIds,
      };

      await api.post("/api/review", payload);

      setReviewOpen(false);
      setReviewTarget(null);
      setRating(0);
      setComment("");

      // refresh orders (optional)
      refetch();
    } catch (err: any) {
      console.error("Create review failed:", err);
      alert(
        err?.response?.data?.message || err?.message || "Gagal kirim review",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-black-alt mb-6">My Orders</h1>

      {/* Search + Tabs */}
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-4 md:p-6">
        {/* Search */}
        <div className="flex items-center gap-3 border border-gray-200 rounded-full px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 21l-4.3-4.3m1.3-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full outline-none text-sm"
          />
        </div>

        {/* Tabs */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <p className="text-sm font-extrabold text-black-alt mr-2">Status</p>

          {STATUS_TABS.map((t) => {
            const active = status === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setStatus(t.value)}
                className={[
                  "px-4 py-2 rounded-full text-xs font-extrabold border transition cursor-pointer",
                  active
                    ? "bg-red-alt text-white border-red-alt"
                    : "bg-white text-black-alt border-gray-200 hover:bg-gray-50",
                ].join(" ")}
                type="button"
              >
                {t.label}
              </button>
            );
          })}

          <button
            onClick={() => refetch()}
            className="ml-auto text-xs font-extrabold text-red-alt underline"
            type="button"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="mt-6 flex flex-col gap-5">
        {isLoading && <div className="text-black-alt">Loading...</div>}

        {isError && (
          <div className="bg-white rounded-2xl p-4 border border-red-200">
            <p className="font-extrabold text-black-alt">Gagal load orders</p>
            <p className="text-sm text-black-alt/70 mt-1">
              {(error as any)?.message || "Unknown error"}
            </p>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-6 text-black-alt/70">
            Order masih kosong untuk status:{" "}
            <span className="font-extrabold text-black-alt">{status}</span>
            <div className="mt-3 text-sm">
              Coba klik tab <b>All</b> atau <b>Preparing</b>.
            </div>
          </div>
        )}

        {!isLoading &&
          !isError &&
          filtered.map((order) => (
            <OrderCard
              key={order.transactionId}
              order={order}
              onGiveReview={openReview}
            />
          ))}
      </div>

      {/* Review Modal */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-109.75 rounded-2xl bg-white border-0">
          <DialogHeader>
            <DialogTitle className="text-black-alt font-extrabold text-[24px]">
              Give Review
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2">
            {/* <p className="text-xs text-black-alt/70">
              {reviewTarget?.restaurantName}
            </p> */}

            <p className="mt-4 text-base font-extrabold text-black-alt text-center">
              Give Rating
            </p>

            {/* Stars */}
            <div className="mt-3 flex justify-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const val = i + 1;
                const active = val <= rating;

                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    className="cursor-pointer"
                    aria-label={`Rate ${val}`}
                  >
                    <svg
                      width="49"
                      height="49"
                      viewBox="0 0 20 20"
                      className={
                        active ? "opacity-100" : "opacity-30 fill-gray-400"
                      }
                      fill="#FFAB0D"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.068 9.384c-.783-.57-.38-1.81.588-1.81h4.157a1 1 0 00.95-.69l1.286-3.957z" />
                    </svg>
                  </button>
                );
              })}
            </div>

            {/* Comment */}
            <div className="mt-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Please share your thoughts about our service!"
                className="w-full min-h-40 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none"
              />
            </div>

            {/* Send */}
            <button
              type="button"
              disabled={sending || rating === 0 || !reviewTarget}
              onClick={submitReview}
              className="mt-5 w-full bg-red-alt text-white font-extrabold py-3 rounded-full hover:opacity-95 transition disabled:opacity-50 cursor-pointer"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* =========================
   OrderCard
========================= */

function OrderCard({
  order,
  onGiveReview,
}: {
  order: Order;
  onGiveReview: (payload: OrderCardReviewPayload) => void;
}) {
  const firstResto = order.restaurants?.[0];
  const firstItem = firstResto?.items?.[0];

  const totalPrice = Number(order.pricing?.totalPrice ?? 0);

  return (
    <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={firstResto?.restaurant?.logo}
              alt={firstResto?.restaurant?.name}
              className="w-8 h-8 object-contain"
            />
            <p className="font-extrabold text-black-alt truncate">
              {firstResto?.restaurant?.name ?? "Restaurant"}
            </p>
          </div>

          <span className="text-xs font-extrabold text-black-alt/70">
            {order.status}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <img
            src={firstItem?.image}
            alt={firstItem?.menuName}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-black-alt truncate">
              {firstItem?.menuName ?? "Food Name"}
            </p>
            <p className="text-xs text-black-alt/70">
              {firstItem
                ? `${firstItem.quantity} x Rp${Number(firstItem.price).toLocaleString("id-ID")}`
                : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 p-4 md:p-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-black-alt/70">Total</p>
          <p className="font-extrabold text-black-alt">
            Rp {totalPrice.toLocaleString("id-ID")}
          </p>
        </div>

        <button
          className="bg-red-alt text-white font-extrabold px-8 py-3 rounded-full hover:opacity-95 transition cursor-pointer"
          type="button"
          onClick={() => {
            // NOTE: Review per transaction + per restaurant
            // Di UI card ini kita pakai restoran pertama (sesuai desain kamu).
            const r = order.restaurants?.[0];
            const restaurantId = r?.restaurant?.id ?? 0;
            const restaurantName = r?.restaurant?.name ?? "Restaurant";

            const menuIds = (r?.items ?? [])
              .map((it) => Number(it.menuId))
              .filter((n) => Number.isFinite(n) && n > 0);

            onGiveReview({
              transactionId: order.transactionId,
              restaurantId,
              restaurantName,
              menuIds,
            });
          }}
        >
          Give Review
        </button>
      </div>
    </div>
  );
}
