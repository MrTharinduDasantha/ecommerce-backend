import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./components/PrivateRoute";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import OrderList from "./components/OrderList";
import OrderDetails from "./components/OrderDetails";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      >
        <Route path="products/add" element={<ProductForm />} />
        <Route path="products/edit" element={<ProductList />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="orders/:orderId" element={<OrderDetails />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;