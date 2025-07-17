import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TbPackage } from "react-icons/tb";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./components/PrivateRoute";
import ProductForm from "./components/ProductForm";
import ProductCategorySubCategoryForm from "./components/ProductCategorySubCategoryForm";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import EventList from "./components/EventList";
import EventForm from "./components/EventForm";
import DiscountList from "./components/DiscountList";
import DiscountForm from "./components/DiscountForm";
import UsersManagedForm from "./components/UsersManagedForm";
import CustomerManagedForm from "./components/CustomerManagedForm";
import ProfilePage from "./components/ProfilePage";
import DashboardPrivate from "./components/DashboardPrivate";
import AboutUsSettings from "./components/AboutUsSettings";
import NewAboutUsSettings from "./components/NewAboutUsSettings";
import HeaderFooterSettings from "./components/HeaderFooterSettings";
import OrderList from "./components/OrderList";
import OrderDetails from "./components/OrderDetails";
import AdminLogs from "./components/AdminLogs";
import CustomerDetails from "./components/CustomerDetails";
import LogDetails from "./components/LogDetails";
import CustomerorderDetailsPage from "./components/CustomerorderDetailsPage";
import NotificationPage from "./components/NotificationPage";
import ReviewList from "./components/ReviewList"
import ReviewDetails from "./components/ReviewDetails"
import Timeline from "./components/Timeline";
import NewHomePageSettings from "./components/NewHomePageSettings";
import NewPolicyDetailsSettings from "./components/NewPolicyDetailsSettings";


const App = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Only show loading animation on the login route
    if (location.pathname === "/") {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [location]);
  return (
    <>
      {/* Display toast notifications on top of the page */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#5CAF90",
            color: "#fff",
          },
        }}
      />

      {/* Display loading animation only on login route  */}
      {location.pathname === "/" && loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-[#1D372E] via-[#5CAF90] to-[#1D372E] z-50">
          <TbPackage className="w-12 h-12 md:h-16 md:w-16 text-white animate-spin-3d" />
        </div>
      )}

      {/* Render routes only when loading animation is not active */}
      {!loading && (
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp/:email" element={<VerifyOtpPage />} />
          <Route path="/reset-password/:email/:otp" element={<ResetPasswordPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          >
            <Route path="profile" element={<ProfilePage />} />
            <Route path="dashboard-private" element={<DashboardPrivate />} />
            <Route path="products/add-product" element={<ProductForm />} />
            <Route
              path="products/add-category-subcategory"
              element={<ProductCategorySubCategoryForm />}
            />
            <Route path="products/edit-product" element={<ProductList />} />
            <Route path="products/edit-product/:id" element={<ProductForm />} />
            <Route
              path="products/view-product/:id"
              element={<ProductDetails />}
            />
            <Route path="events/add-event" element={<EventForm />} />
            <Route path="events/add-event/:id" element={<EventForm />} />
            <Route path="events/all-events" element={<EventList />} />
            <Route path="discounts/add-discount" element={<DiscountForm />} />
            <Route
              path="discounts/add-discount/:id"
              element={<DiscountForm />}
            />
            <Route path="discounts/all-discounts" element={<DiscountList />} />
            <Route path="users_managed-form" element={<UsersManagedForm />} />
            <Route path="admin-logs" element={<AdminLogs />} />
            <Route
              path="customer-managed-form"
              element={<CustomerManagedForm />}
            />
            <Route path="settings/about-us" element={<AboutUsSettings />} />
            <Route
              path="settings/header-footer"
              element={<HeaderFooterSettings />}
            />
            <Route path="orders" element={<OrderList />} />
            <Route path="orders/:orderId" element={<OrderDetails />} />
            <Route
              path="customer/view-customer/:id"
              element={<CustomerDetails />}
            />
            <Route
              path="customer/order-details/:orderId"
              element={<CustomerorderDetailsPage />}
            />
            <Route path="log/view-adminlogs/:id" element={<LogDetails />} />
            <Route path="order/view-adminlogs/:id" element={<LogDetails />} />
            <Route path="notifications" element={<NotificationPage />} />
            <Route path="reviews" element={<ReviewList />} />
            <Route path="reviews/:reviewId" element={<ReviewDetails />} />
          </Route>
          <Route path="/newaboutUssetting" element={<NewAboutUsSettings />} />
          <Route path="Timeline" element={<Timeline />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/NewHomePageSettings" element={<NewHomePageSettings />} />
          <Route path="/NewPolicyDetailsSettings" element={<NewPolicyDetailsSettings />} />
          <Route path="Timeline" element={<Timeline />} />
        </Routes>
      )}
    </>
  );
};

export default App;