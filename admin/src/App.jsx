import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./components/PrivateRoute";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import Users from "./pages/Users";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
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
        <Route path="users" element={<Users />} /> 
        <Route path="orders" element={<Orders />} /> 
        <Route path="customers" element={<Customers />} /> 
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
