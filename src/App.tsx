import { Routes, Route, useLocation } from "react-router-dom";

import { Header } from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import CategoryMenu from "./components/CategoryMenu";
import Recommended from "./components/Recommended";
import RestaurantDetail from "./pages/RestaurantDetail";
import AuthPage from "@/pages/AuthPage";
import ProfilePage from "@/pages/Profile";
import CategoryPage from "@/pages/Category";
import CartPage from "@/pages/Cart";
import CheckoutPage from "@/pages/Checkout";
import MyOrders from "@/pages/MyOrders";
import CheckoutSuccessPage from "@/pages/CheckoutSuccess";
import ProfileLayout from "@/pages/profile/ProfileLayout";
import ProfileInfo from "@/pages/profile/ProfileInfo";
import ProfileOrders from "@/pages/profile/ProfileOrders";

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");

  return (
    <>
      {!isAuthPage && <Header />}

      <main className={isAuthPage ? "min-h-screen" : ""}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <CategoryMenu />
                <Recommended />
              </>
            }
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/profile" element={<ProfileLayout />}>
            <Route index element={<ProfileInfo />} />
            <Route path="orders" element={<ProfileOrders />} />
          </Route>
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </>
  );
}

export default App;
