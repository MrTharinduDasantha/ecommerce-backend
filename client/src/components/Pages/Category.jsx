import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Sidebar1 from "../Sidebar1";
import ProductCard from "../ProductCard";
// import ForYouBanner from "../ForYouBanner";
import { getCategories, getProductsBySubCategoryId } from "../../api/product";
import { calculateDiscountPercentage } from "../CalculateDiscount";

const AllCategories = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const selectedCategoryId = categoryId;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productsBySubCategory, setProductsBySubCategory] = useState({});
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(
    location.state?.selectedSubCategoryId || null
  );

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleProductClick = (productId) => {
    window.scrollTo(0, 0);
    navigate(`/product-page/${productId}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (data && data.categories) {
          setCategories(
            data.categories.filter((category) => category.Status === "active")
          );
        } else {
          setError("Unexpected data structure: " + JSON.stringify(data));
        }
      } catch (error) {
        console.error("Failed to load categories:", error.message);
        setError(error.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedSubCategoryId(location.state?.selectedSubCategoryId || null);
  }, [location]);

  const selectedCategory = categories.find(
    (c) => c.idProduct_Category === parseInt(selectedCategoryId)
  );

  const selectedSubCategory = selectedCategory?.subcategories?.find(
    (sub) => sub.idSub_Category === selectedSubCategoryId
  );

  useEffect(() => {
    const fetchProducts = async (subcategories) => {
      const newProductsBySubCategory = {};
      for (const sub of subcategories) {
        try {
          const data = await getProductsBySubCategoryId(sub.idSub_Category);
          // Format products to match ProductCard expected structure
          const formattedProducts = data.products
            .filter((product) => product.Status === "active")
            .map((product) => ({
              id: product.idProduct,
              name: product.Description,
              image: product.Main_Image_Url,
              price: product.Selling_Price,
              oldPrice: product.Market_Price,
              weight: product.SIH || "N/A",
              color: product.variations?.[0]?.Colour || "N/A",
              size: product.variations?.[0]?.Size || null,
              discountName: product.Discount_Name || "",
              category: sub.Description || product.subcategories?.[0]?.Description || "",
              brand: product.Brand_Name || "",
              historyStatus: product.History_Status || ""
            }));
          newProductsBySubCategory[sub.idSub_Category] =
            formattedProducts || [];
        } catch (error) {
          console.error(
            `Failed to load products for subcategory ${sub.idSub_Category}:`,
            error.message
          );
          newProductsBySubCategory[sub.idSub_Category] = [];
        }
      }
      setProductsBySubCategory(newProductsBySubCategory);
    };

    if (selectedCategory && selectedCategory.subcategories?.length > 0) {
      fetchProducts(selectedCategory.subcategories);
    } else {
      setProductsBySubCategory({});
    }
  }, [selectedCategory]);

  const handleSubCategorySelect = (subCategoryId) => {
    setSelectedSubCategoryId(subCategoryId);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-12 h-12 border-4 border-[#5CAF90] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#1D372E]">Loading categories...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-red-500">
        <div className="p-8 text-center bg-white rounded-lg shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 mx-auto mb-4 text-red-500"
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

  // Get products to display based on selection
  const getProductsToDisplay = () => {
    if (selectedSubCategoryId && productsBySubCategory[selectedSubCategoryId]) {
      return productsBySubCategory[selectedSubCategoryId];
    }

    // Show all products from all subcategories if no specific subcategory is selected
    // Use a Map to prevent duplicates based on product ID
    const allProducts = Object.values(productsBySubCategory).flat();
    const uniqueProductsMap = new Map();

    allProducts.forEach((product) => {
      if (!uniqueProductsMap.has(product.id)) {
        uniqueProductsMap.set(product.id, product);
      }
    });

    return Array.from(uniqueProductsMap.values());
  };

  const productsToDisplay = getProductsToDisplay();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="container flex-grow px-3 py-4 mx-auto xs:px-4 sm:px-5 sm:py-6 lg:py-8">
        <div className="flex flex-col gap-4 lg:flex-row sm:gap-6 lg:gap-8">
          <div className="w-full lg:w-64 xl:w-72">
            <Sidebar1
              categories={categories}
              selectedCategoryId={parseInt(selectedCategoryId)}
              selectedSubCategoryId={selectedSubCategoryId}
              onSubCategorySelect={handleSubCategorySelect}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            {/* <ForYouBanner className="mb-4 sm:mb-6" /> */}

            {/* Display selected category and subcategory names */}
            {selectedCategory && (
              <div className="mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-[#5CAF90]">
                  <h2 className="mb-2 text-xl font-semibold text-gray-800">
                    {selectedCategory.Description}
                  </h2>
                  {selectedSubCategory && (
                    <p className="text-gray-600">
                      <span className="font-medium">Subcategory:</span>{" "}
                      {selectedSubCategory.Description}
                    </p>
                  )}
                  {!selectedSubCategory && (
                    <p className="text-gray-600">
                      All items from this category
                    </p>
                  )}
                </div>
              </div>
            )}

            {selectedCategory ? (
              <div className="space-y-4">
                {productsToDisplay.length > 0 ? (
                  <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                    {productsToDisplay.map((product) => (
                      <div
                        key={product.id}
                        className="hover:scale-[1.02] hover:shadow-md transform transition-all duration-300"
                        onClick={() => handleProductClick(product.id)}
                      >
                        <ProductCard
                          image={product.image} 
                          category={product.category}
                          title={product.name}
                          price={product.price}
                          oldPrice={product.oldPrice}
                          discountLabel={
                            product.oldPrice && product.price
                              ? `${calculateDiscountPercentage(
                                  product.oldPrice,
                                  product.price
                                )} % OFF`
                              : null
                          }
                          historyStatus={product.historyStatus}
                          id={product.id}
                          className="h-full"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-xl md:text-2xl font-bold text-gray-500">
                      No products found {" "}
                      {selectedSubCategory
                        ? "for this subcategory"
                        : "for this category"}
                      .
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-lg text-gray-500">
                  No category found. Please select a valid category.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCategories;