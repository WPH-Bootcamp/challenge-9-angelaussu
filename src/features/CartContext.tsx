// import React, { createContext, useContext, useState } from "react";
// import type { ReactNode } from "react";

// export type CartItem = {
//   id: number;
//   name: string;
//   price: number;
//   qty: number;
// };

// type CartContextType = {
//   cart: CartItem[];
//   addToCart: (item: CartItem) => void;
//   decreaseQty: (id: number) => void;
//   totalQty: number;
// };

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider = ({ children }: { children: ReactNode }) => {
//   const [cart, setCart] = useState<CartItem[]>([]);

//   const addToCart = (item: CartItem) => {
//     setCart((prev) => {
//       const exist = prev.find((i) => i.id === item.id);
//       if (exist) {
//         return prev.map((i) =>
//           i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
//         );
//       }
//       return [...prev, { ...item, qty: 1 }];
//     });
//   };

//   const decreaseQty = (id: number) => {
//     setCart((prev) =>
//       prev
//         .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
//         .filter((i) => i.qty > 0),
//     );
//   };

//   const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

//   return (
//     <CartContext.Provider value={{ cart, addToCart, decreaseQty, totalQty }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) throw new Error("useCart must be used within CartProvider");
//   return context;
// };
