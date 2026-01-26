import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";

// ✅ pakai axios instance yang sama dengan service lain
import api from "@/services/api/axios"; // <-- sesuaikan path dengan file axios instance kamu

/* =====================
   TYPES
===================== */

export interface Menu {
  id: number;
  foodName: string;
  price: number;
  type: string;
  image?: string;
}

export interface CartItem {
  id: number;
  menu: Menu;
  quantity: number;
  itemTotal: number;
}

export interface RestaurantCart {
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
  items: CartItem[];
  subtotal: number;
}

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  restaurantCount: number;
}

interface CartContextType {
  cart: RestaurantCart[];
  summary: CartSummary;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (
    restaurantId: number,
    menuId: number,
    quantity?: number,
  ) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

/* =====================
   CONTEXT
===================== */

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

/* =====================
   PROVIDER
===================== */

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<RestaurantCart[]>([]);
  const [summary, setSummary] = useState<CartSummary>({
    totalItems: 0,
    totalPrice: 0,
    restaurantCount: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/cart");
      if (res.data?.success) {
        setCart(res.data.data?.cart ?? []);
        setSummary(
          res.data.data?.summary ?? {
            totalItems: 0,
            totalPrice: 0,
            restaurantCount: 0,
          },
        );
      } else {
        // fallback kalau backend beda format
        setCart(res.data?.data?.cart ?? []);
        setSummary(
          res.data?.data?.summary ?? {
            totalItems: 0,
            totalPrice: 0,
            restaurantCount: 0,
          },
        );
      }
    } catch (error) {
      console.error("Fetch cart failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = async (
    restaurantId: number,
    menuId: number,
    quantity = 1,
  ) => {
    try {
      await api.post("/api/cart", { restaurantId, menuId, quantity });
      await fetchCart();
    } catch (error) {
      console.error("Add item failed:", error);
    }
  };

  const updateItem = async (itemId: number, quantity: number) => {
    try {
      // kalau backend kamu tidak menerima 0, pakai removeItem untuk qty <= 0
      if (quantity <= 0) {
        await api.delete(`/api/cart/${itemId}`);
      } else {
        await api.put(`/api/cart/${itemId}`, { quantity });
      }
      await fetchCart();
    } catch (error) {
      console.error("Update item failed:", error);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await api.delete(`/api/cart/${itemId}`);
      await fetchCart();
    } catch (error) {
      console.error("Remove item failed:", error);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/api/cart");
      await fetchCart();
    } catch (error) {
      console.error("Clear cart failed:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        summary,
        loading,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
