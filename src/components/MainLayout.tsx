import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

export default function MainLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
