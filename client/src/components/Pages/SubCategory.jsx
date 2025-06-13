import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Sidebar1 from "../Sidebar1";
import ProductCard from "../ProductCard";
import ForYouBanner from "../ForYouBanner";
import { getProductsBySubCategoryId, getCategories } from "../../api/product";

const SubCategory = () => {
  const { id } = useParams();
  const location = useLocation();
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
        if (data && data.products) {
          setProducts(data.products);

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
        setError(error.message || "Failed to load products");
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading products...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );

  const selectedCategory = categories.find(
    (c) => c.idProduct_Category === selectedCategoryId
  );

  const selectedSubCategory = selectedCategory?.subcategories?.find(
    (sub) => sub.idSub_Category === selectedSubCategoryId
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="container mx-auto px-3 xs:px-4 sm:px-5 py-4 sm:py-6 lg:py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          <div className="w-full lg:w-64 xl:w-72">
            <Sidebar1
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              selectedSubCategoryId={selectedSubCategoryId}
              onSubCategorySelect={handleSubCategorySelect}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <ForYouBanner className="mb-4 sm:mb-6" />

            {/* Display selected category and subcategory names */}
            {selectedCategory && (
              <div className="mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-[#5CAF90]">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
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
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.idProduct}
                    image={product.Main_Image_Url}
                    category={
                      subcategoryName ||
                      selectedSubCategory?.Description ||
                      "Products"
                    }
                    title={product.Description}
                    price={product.Selling_Price}
                    oldPrice={product.Market_Price}
                    weight={product.SIH || "N/A"}
                    id={product.idProduct}
                    discountName={product.Discount_Name}
                    discountAmount={product.Discount_Amount}
                    className="h-full"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
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
