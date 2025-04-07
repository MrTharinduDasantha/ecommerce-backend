import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./routes/Home/Home";
import Events from "./routes/Events/Events";
import Footer from "./Components/Footer/Footer";
import NavBar from "./Components/NavBar/NavBar";
import Brands from "./routes/Brands/brands";
import BrandDetails from "./routes/Brands/BrandDetails";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import ProductPage from "./Components/ProductPage";
import OrderTracking from "./Components/OrderTracking";
import Checkout from "./Components/Checkout";
import Profile from "./Components/Pages/Profile";
import AboutUs from "./Components/Pages/AboutUs";
import RushDelivery from "./Components/Pages/RushDelivery";
import SeasonalOffers from "./Components/Pages/SeasonalOffers";
import Cart from "./Components/Cart";
// import Banner from "./Components/Banner";
// import Sidebar from "./Components/Sidebar";
// import WhyChooseUs from "./Components/WhyChooseUs";
// import RushDeliveryBanner from "./Components/RushDeliveryBanner";
// import CurrentOrders from "./Components/CurrentOrders";
import { CartProvider } from "./context/CartContext";

const App = () => {
  return (
    <CartProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/brand/:name" element={<BrandDetails />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/product-page/:id" element={<ProductPage />} />
        <Route path="/order-tracking/:id" element={<OrderTracking />} />
        <Route path="/track-order/:id" element={<OrderTracking />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/rush-delivery" element={<RushDelivery />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/seasonal-offers" element={<SeasonalOffers />} />
        <Route path="/ramadan" element={<SeasonalOffers />} />
      </Routes>
      <Footer />
    </CartProvider>
  );
};

export default App;
