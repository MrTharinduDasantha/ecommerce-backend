import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./components/PrivateRoute";
import ProductForm from "./components/ProductForm";
import ProductCategorySubCategoryForm from "./components/ProductCategorySubCategoryForm";
import ProductList from "./components/ProductList";

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
        <Route path="products/add-product" element={<ProductForm />} />
        <Route
          path="products/add-category-subcategory"
          element={<ProductCategorySubCategoryForm />}
        />
        <Route path="products/edit-product" element={<ProductList />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
