import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Sidebar1 from "../Sidebar1";
import ProductCard from "../ProductCard";
import ForYouBanner from "../ForYouBanner";
import { getCategories, getProductsBySubCategoryId } from "../../api/product";

const AllCategories = () => {
  const location = useLocation();
  const { categoryId } = useParams();
  const selectedCategoryId = categoryId;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productsBySubCategory, setProductsBySubCategory] = useState({});
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(
    location.state?.selectedSubCategoryId || null
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (data && data.categories) {
          setCategories(data.categories.filter(category => category.Status === "active");
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
          newProductsBySubCategory[sub.idSub_Category] = data.products.filter(product => product.Status === "active") || [];
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
      <div className="flex justify-center items-center min-h-screen">
        Loading categories...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
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
      if (!uniqueProductsMap.has(product.idProduct)) {
        uniqueProductsMap.set(product.idProduct, product);
      }
    });

    return Array.from(uniqueProductsMap.values());
  };

  const productsToDisplay = getProductsToDisplay();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="container mx-auto px-3 xs:px-4 sm:px-5 py-4 sm:py-6 lg:py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          <div className="w-full lg:w-64 xl:w-72">
            <Sidebar1
              categories={categories}
              selectedCategoryId={parseInt(selectedCategoryId)}
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
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {productsToDisplay.map((product) => (
                      <ProductCard
                        key={product.idProduct}
                        image={product.Main_Image_Url}
                        category={
                          selectedSubCategory
                            ? selectedSubCategory.Description
                            : selectedCategory.Description
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
                      No products available{" "}
                      {selectedSubCategory
                        ? "for this subcategory"
                        : "for this category"}
                      .
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
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
