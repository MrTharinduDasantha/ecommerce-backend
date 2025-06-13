import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBrands, getProductsByBrand } from "../../api/product";
import ProductCard from "../../components/ProductCard"; // <-- Import ProductCard

const BrandDetails = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const loadBrandData = async () => {
      try {
        const data = await getBrands();
        const brand = data.brands.find(
          (brand) => brand.Brand_Name.toUpperCase() === name.toUpperCase()
        );

        if (brand) {
          setSelectedBrand(brand);
          setLoadingProducts(true);
          try {
            // Fetch products for the brand
            const productData = await getProductsByBrand(brand.idProduct_Brand);
            const productsArray = Array.isArray(productData.products)
              ? productData.products
              : [];
            setProducts(productsArray);
          } catch (productError) {
            console.error("Error fetching products:", productError);
            setError(`Error loading products: ${productError.message}`);
          } finally {
            setLoadingProducts(false);
          }
        } else {
          setError("Brand not found");
        }
      } catch (error) {
        console.error("Error fetching brand:", error);
        setError(error.message || "Failed to load brand details");
      } finally {
        setLoading(false);
      }
    };

    loadBrandData();
  }, [name]);

  // Use useMemo to calculate top selling products based on the fetched products
  const topSellingProducts = useMemo(() => {
    // Filter out products with no sold quantity or invalid quantity
    const validProducts = products.filter(
      (product) => typeof product.Sold_Qty === "number" && product.Sold_Qty > 0
    );

    // Sort products by Sold_Qty in descending order
    const sortedProducts = [...validProducts].sort(
      (a, b) => b.Sold_Qty - a.Sold_Qty
    );

    // Take the top 5 products (or fewer if there are less than 5)
    return sortedProducts.slice(0, 5).map((product, index) => ({
      itemNo: index + 1,
      orderName: product.Description, // Use product description as order name
      price: Number(product.Selling_Price), // Use selling price
      idProduct: product.idProduct, // Keep product ID for navigation if needed
    }));
  }, [products]); // Recalculate when the 'products' state changes

  // Function to navigate to ProductPage
  const handleProductClick = (productId) => {
    navigate(`/product-page/${productId}`); // Navigate to the ProductPage with the product ID
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#5CAF90] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#1D372E]">Loading brand details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!selectedBrand) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        Brand not found!
      </div>
    );
  }

  // Format price to 2 decimal places
  const formatPrice = (price) => {
    return Number(price).toFixed(2);
  };

  // Calculate discount percentage
  const calculateDiscount = (marketPrice, sellingPrice) => {
    if (!marketPrice || !sellingPrice) return null;
    const discount = ((marketPrice - sellingPrice) / marketPrice) * 100;
    return discount > 0 ? Math.round(discount) : null;
  };

  return (
    <div className="bg-white min-h-screen px-4 py-8 md:px-16 font-poppins">
      <h2 className="text-[33.18px] text-[#1D372E] font-semibold mb-6 text-left">
        {selectedBrand.Brand_Name}
      </h2>

      <div className="bg-white rounded-md p-6 flex flex-col md:flex-row items-center max-w-3xl mx-auto md:max-w-full relative ">
        <div className="flex-shrink-0 w-40">
          <img
            src={selectedBrand.Brand_Image_Url || "/placeholder.svg"}
            alt={selectedBrand.Brand_Name}
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>

        <div className="md:flex-1 px-6 text-left">
          <p className="text-[16px] md:text-[19.2px] text-[#5E5E5E]">
            {selectedBrand.ShortDescription}
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="mt-12">
        <h3 className="text-[33.18px] text-[#1D372E] font-semibold mb-6 text-left">
          Products
        </h3>
        {loadingProducts ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 border-4 border-[#5CAF90] border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-4 text-[#1D372E]">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.idProduct}
                  image={product.Main_Image_Url || "/placeholder.svg"}
                  category={selectedBrand.Brand_Name}
                  title={product.Description}
                  price={product.Selling_Price}
                  oldPrice={product.Market_Price}
                  discountName={
                    product.Market_Price && product.Selling_Price
                      ? "Discount"
                      : null
                  }
                  discountAmount={
                    product.Market_Price && product.Selling_Price
                      ? `${Math.round(
                          ((product.Market_Price - product.Selling_Price) /
                            product.Market_Price) *
                            100
                        )}% OFF`
                      : null
                  }
                  id={product.idProduct}
                />
              ))
            ) : (
              <div className="text-center text-gray-500">
                No products available.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Top Selling Products Section */}
      {topSellingProducts.length > 0 && ( // Only show the table if there are top selling products
        <div className="mt-12 border border-[#E8E8E8] rounded-[15px] p-6">
          <h3 className="text-[33.18px] text-[#1D372E] font-semibold mb-6 text-center">
            Top Selling Products
          </h3>
          <table className="min-w-full rounded-[15px] overflow-hidden">
            <thead>
              <tr>
                <th className="bg-[#EAFFF7] py-2 px-4 text-center font-semibold h-[60px] border-b-2 border-gray-300">
                  Item No
                </th>
                <th className="bg-[#EAFFF7] py-2 px-4 text-center font-semibold h-[60px] border-b-2 border-gray-300">
                  Product Name
                </th>
                <th className="bg-[#EAFFF7] py-2 px-4 text-center font-semibold h-[60px] border-b-2 border-gray-300">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {topSellingProducts.map((product, index) => (
                <tr
                  key={product.idProduct} // Use product ID as key for better performance
                  className="text-center cursor-pointer hover:bg-gray-100 transition-colors" // Add cursor and hover effect
                  onClick={() => handleProductClick(product.idProduct)} // Make rows clickable
                >
                  <td
                    className={`py-2 px-4 h-[45px] ${
                      index !== topSellingProducts.length - 1
                        ? "border-b border-gray-300"
                        : ""
                    } bg-[#F7FDFF] border-r border-gray-300`}
                  >
                    {product.itemNo}
                  </td>
                  <td
                    className={`py-2 px-4 ${
                      index !== topSellingProducts.length - 1
                        ? "border-b border-gray-300"
                        : ""
                    } bg-[#F7FDFF] border-r border-gray-300`}
                  >
                    {product.orderName}
                  </td>
                  <td
                    className={`py-2 px-4 ${
                      index !== topSellingProducts.length - 1
                        ? "border-b border-gray-300"
                        : ""
                    } bg-[#F7FDFF]`}
                  >
                    ${formatPrice(product.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <br />
    </div>
  );
};

export default BrandDetails;
