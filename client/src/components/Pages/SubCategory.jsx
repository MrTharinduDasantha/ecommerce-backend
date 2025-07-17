import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Sidebar1 from "../Sidebar1";
import ProductCard from "../ProductCard";
// import ForYouBanner from "../ForYouBanner";
import { getProductsBySubCategoryId, getCategories } from "../../api/product";
import { calculateDiscountPercentage } from "../CalculateDiscount";

const SubCategory = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(
    parseInt(id)
  );

  const handleProductClick = (productId) => {
    window.scrollTo(0, 0);
    navigate(`/product-page/${productId}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (data && data.categories) {
          setCategories(data.categories);

          // Find the category and subcategory for the current subcategory ID
          for (const category of data.categories) {
            if (category.subcategories) {
              const subcategory = category.subcategories.find(
                (sub) => sub.idSub_Category === parseInt(id)
              );
              if (subcategory) {
                setSelectedCategoryId(category.idProduct_Category);
                setSubcategoryName(subcategory.Description);
                setCategoryName(category.Description);
                break;
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to load categories:", error.message);
        setError(error.message || "Failed to load categories");
      }
    };

    fetchCategories();
  }, [id]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsBySubCategoryId(id);
        console.log(data,'test1')
        if (data && data.products) {
          // Format products to match ProductCard expected structure
          const formattedProducts = data.products
            .filter(product => product.Status === "active")
            .map(product => ({
              id: product.idProduct,
              name: product.Description,
              image: product.Main_Image_Url,
              price: product.Selling_Price,
              oldPrice: product.Market_Price,
              weight: product.SIH || "N/A",
              color: product.variations?.[0]?.Colour || "N/A",
              size: product.variations?.[0]?.Size || null,
              discountName: product.Discount_Name || "",
              category: product.subcategories?.[0]?.Description || "",
              brand: product.Brand_Name || "",
              historyStatus: product.History_Status || "",
              activeDiscount: product.discounts?.find(d => d.Status === "active") || null,
              eventDiscounts: product.eventDiscounts || [],
              // Pass full product object for complete discount calculation
              product: {
                idProduct: product.idProduct,
                Selling_Price: product.Selling_Price,
                Market_Price: product.Market_Price,
                discounts: product.discounts || [],
                eventDiscounts: product.eventDiscounts || []
              }
            }));
          setProducts(formattedProducts); 
          // Set category and subcategory names if not already set
          if (!subcategoryName && data.products[0]?.Subcategory_Name) {
            setSubcategoryName(data.products[0].Subcategory_Name);
          }
          if (!categoryName && data.products[0]?.Category_Name) {
            setCategoryName(data.products[0].Category_Name);
          }
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error(
          `Failed to load products for subcategory ${id}:`,
          error.message
        );
        if (error.message?.includes("No products found")) {
          setProducts([]);
        } else {
          setError(error.message || "Failed to load products");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      // Try to get from location.state first
      const stateSubcategoryName = location.state?.subcategoryName;
      const stateCategoryName = location.state?.categoryName;

      if (stateSubcategoryName) setSubcategoryName(stateSubcategoryName);
      if (stateCategoryName) setCategoryName(stateCategoryName);

      fetchProducts();
    }
  }, [id, location.state, subcategoryName, categoryName]);

  const handleSubCategorySelect = (subCategoryId) => {
    setSelectedSubCategoryId(subCategoryId);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-12 h-12 border-4 border-[#5CAF90] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#1D372E]">Loading products...</p>
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

  const selectedCategory = categories.find(
    (c) => c.idProduct_Category === selectedCategoryId
  );
console.log(selectedSubCategoryId,selectedCategoryId,products,'waqas sub')
  const selectedSubCategory = selectedCategory?.subcategories?.find(
    (sub) => sub.idSub_Category === selectedSubCategoryId
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="container flex-grow px-3 py-4 mx-auto xs:px-4 sm:px-5 sm:py-6 lg:py-8">
        <div className="flex flex-col gap-4 lg:flex-row sm:gap-6 lg:gap-8">
          <div className="w-full lg:w-64 xl:w-72">
            <Sidebar1
              categories={categories}
              selectedCategoryId={selectedCategoryId}
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
                    {categoryName || selectedCategory.Description}
                  </h2>
                  {selectedSubCategory && (
                    <p className="text-gray-600">
                      <span className="font-medium">Subcategory:</span>{" "}
                      {subcategoryName || selectedSubCategory.Description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {products.length > 0 ? (
              <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {products.map((product) => (
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
                      historyStatus={product.historyStatus}
                      activeDiscount={product.activeDiscount}
                      eventDiscounts={product.eventDiscounts}
                      id={product.id}
                      product={product.product}
                      className="h-full"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-xl md:text-2xl font-bold text-gray-500">
                  No products available for this subcategory.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategory;