import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
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
import UsersManagedForm from "./components/UsersManagedForm";
import CustomerManagedForm from "./components/CustomerManagedForm";
import ProfilePage from "./components/ProfilePage";
import DashboardPrivate from "./components/DashboardPrivate";
import Settings from "./components/Settings";
import OrderList from "./components/OrderList";
import OrderDetails from "./components/OrderDetails";
import AdminLogs from "./components/AdminLogs";
 
const App = () => {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#5CAF90",
            color: "#fff",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp/:email" element={<VerifyOtpPage />} />
        <Route
          path="/reset-password/:email/:otp"
          element={<ResetPasswordPage />}
        />
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
          <Route path="users_managed-form" element={<UsersManagedForm />} />
          <Route path="admin-logs" element={<AdminLogs />} />
          <Route
            path="customer-managed-form"
            element={<CustomerManagedForm />}
          />
          <Route path="settings" element={<Settings />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
