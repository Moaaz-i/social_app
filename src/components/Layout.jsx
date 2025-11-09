import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar.jsx";
import Footer from "./Footer/footer.jsx";
import useAuth from "../hooks/useAuth";
import useLoading from "../hooks/useLoading";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const Layout = () => {
  const { isAuthenticatedFn: isAuthenticated } = useAuth();
  const { loading } = useLoading();
  const isUserAuthenticated = isAuthenticated();

  return (
    <div className="min-h-screen bg-yellow-200">
      <Navbar hide={!isUserAuthenticated || loading} />

      <Outlet />

      <Footer />
      <ReactQueryDevtools />
    </div>
  );
};

export default Layout;
