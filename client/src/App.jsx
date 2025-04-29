import React from "react";
import { Routes, Route } from "react-router-dom";
import OnSale from "./components/Pages/OnSale";
import Home from "./routes/Home/Home";
import Events from "./routes/Events/Events";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/NavBar/NavBar";
import Brands from "./routes/Brands/brands";
import BrandDetails from "./routes/Brands/BrandDetails";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import ProductPage from "./components/ProductPage";
import OrderTracking from "./Components/OrderTracking";
import Checkout from "./components/Checkout";
import Profile from "./components/Pages/Profile";
import AboutUs from "./components/Pages/AboutUs";
import RushDelivery from "./components/Pages/RushDelivery";
import ForYou from "./components/Pages/ForYou";
import SeasonalOffers from "./components/Pages/SeasonalOffers";
import Cart from "./components/Cart";
import { CartProvider } from "./context/CartContext";
import AllCategories from "./components/Pages/Category";
import AllProducts from "./components/AllProducts"

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
        <Route path="/track-order" element={<OrderTracking />} />
        <Route path="/track-order/:id" element={<OrderTracking />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/rush-delivery" element={<RushDelivery />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/seasonal-offers" element={<SeasonalOffers />} />
        <Route path="/for-you" element={<ForYou />} />
        <Route path="/on-sale" element={<OnSale />} />
        <Route path="/AllCategories/:categoryId" element={<AllCategories />} />
        <Route path="/AllProducts" element={<AllProducts />} />
      </Routes>
      <Footer />
    </CartProvider>
  );
};

export default App;
