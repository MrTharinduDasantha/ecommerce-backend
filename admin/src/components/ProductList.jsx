import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaSearch } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { getProducts, deleteProduct } from "../api/product";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductPopup, setShowProductPopup] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Load products from API
  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products);
      setFilteredProducts(data.products);
    } catch (error) {
      toast.error(error.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Handle search: filter products based on Description
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter((p) =>
      p.Description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Reset search when search query is empty
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  // View product details
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductPopup(true);
  };

  // Hide scrollbar when popup is open, restore when closed
  useEffect(() => {
    if (showProductPopup || deleteProductId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showProductPopup, deleteProductId]);

  // Delete product
  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(deleteProductId);
      toast.success("Product deleted successfully");
      setDeleteProductId(null);
      loadProducts();
    } catch (error) {
      toast.error(error.message || "Failed to delete product");
      setDeleteProductId(null);
    }
  };
  return (
    <div className="max-w-5xl mx-auto my-5 p-6 md:p-8 bg-white rounded-md shadow-md">
      {/* Heading */}
      <h2 className="text-xl md:text-2xl font-bold text-[#1D372E] mb-3 md:mb-4">
        All Products
      </h2>

      {/* Search Bar */}
      <div className="flex items-center justify-center gap-2 mb-6 md:mb-8">
        <div className="relative flex w-full lg:max-w-xl md:max-w-md sm:max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 md:pl-3 pointer-events-none z-10">
            <FaSearch className="text-[#1D372E] text-sm md:text-base" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search for product..."
            className="input input-bordered w-full pl-8 md:pl-10 py-1 md:py-2 text-sm md:text-base bg-white border-2 border-[#1D372E] text-[#1D372E] rounded-2xl"
          />
          <button
            onClick={handleSearch}
            className="btn bg-[#5CAF90] border-none ml-2 text-xs md:text-sm py-1 px-2 md:px-4 h-auto min-h-0 rounded-2xl"
          >
            Search
          </button>
        </div>
      </div>

      {/* If no products found */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-14 md:py-16 text-base md:text-lg font-medium text-[#1D372E]">
          No product found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full min-w-[850px] text-center border border-[#1D372E]">
            <thead className="bg-[#5CAF90] text-[#1D372E]">
              <tr>
                <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                  Main Description
                </th>
                <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                  Brand
                </th>
                <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                  Market Price
                </th>
                <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                  Selling Price
                </th>
                <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                  Main Image
                </th>
                <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-[#1D372E]">
              {filteredProducts.map((product) => (
                <tr key={product.idProduct}>
                  <td className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                    {product.Description}
                  </td>
                  <td className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                    {product.Brand_Name}
                  </td>
                  <td className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                    Rs. {product.Market_Price}
                  </td>
                  <td className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                    Rs. {product.Selling_Price}
                  </td>
                  <td className="border-2 p-1 md:p-2">
                    {product.Main_Image_Url ? (
                      <img
                        src={product.Main_Image_Url}
                        alt="Main"
                        className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-cover mx-auto"
                      />
                    ) : (
                      <span className="text-xs md:text-sm lg:text-base">
                        No image
                      </span>
                    )}
                  </td>
                  <td className="border-2 p-1 md:p-2">
                    <div className="flex items-center gap-1 md:gap-2 justify-center">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="bg-[#5CAF90] p-1 md:p-1.5 cursor-pointer"
                        title="View Product"
                      >
                        <FaEye className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/products/edit-product/${product.idProduct}`
                          )
                        }
                        className="bg-[#5CAF90] p-1 md:p-1.5 cursor-pointer"
                        title="Edit Product"
                      >
                        <FaEdit className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                      </button>
                      <button
                        onClick={() => setDeleteProductId(product.idProduct)}
                        className="bg-[#5CAF90] p-1 md:p-1.5 cursor-pointer"
                        title="Delete Product"
                      >
                        <RiDeleteBin5Fill className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Product Popup */}
      {deleteProductId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-md p-4 md:p-6 lg:p-8 w-[90%] max-w-md">
            <div className="flex justify-between items-center text-[#1D372E] mb-4 md:mb-5">
              <h3 className="text-base md:text-lg font-bold">Delete Product</h3>
              <button
                onClick={() => setDeleteProductId(null)}
                className="cursor-pointer"
              >
                <IoClose size={20} className="md:w-6 md:h-6" />
              </button>
            </div>
            <p className="mb-4 md:mb-6 text-left text-sm md:text-base text-[#1D372E]">
              Are you sure you want to delete this product?
            </p>

            <div className="flex justify-end gap-3 md:gap-4 w-full">
              <button
                onClick={() => setDeleteProductId(null)}
                className="btn btn-sm bg-[#5CAF90] border-none cursor-pointer font-medium rounded-2xl text-xs md:text-sm py-1 px-2 md:px-3 h-auto min-h-0"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="btn btn-sm bg-[#5CAF90] border-none cursor-pointer font-medium rounded-2xl text-xs md:text-sm py-1 px-2 md:px-3 h-auto min-h-0"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Popup */}
      {showProductPopup && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-md p-4 md:p-6 lg:p-8 w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto relative">
            {/* Popup Header */}
            <div className="flex justify-between items-center text-[#1D372E] mb-3 md:mb-4 lg:mb-5">
              <h3 className="text-lg md:text-xl font-bold">Product Details</h3>
              <button
                onClick={() => setShowProductPopup(false)}
                className="cursor-pointer"
              >
                <IoClose className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
              </button>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6 text-[#1D372E]">
              {/* Left Column */}
              <div>
                <div className="mb-3 md:mb-4">
                  <h4 className="font-semibold text-base md:text-lg mb-1 md:mb-2">
                    Main Description
                  </h4>
                  <p className="text-sm md:text-base">
                    {selectedProduct.Description}
                  </p>
                </div>

                <div className="mb-3 md:mb-4">
                  <h4 className="font-semibold text-base md:text-lg mb-1 md:mb-2">
                    Sub Description
                  </h4>
                  <p className="text-sm md:text-base">
                    {selectedProduct.Long_Description || "N/A"}
                  </p>
                </div>

                <div className="mb-3 md:mb-4">
                  <h4 className="font-semibold text-base md:text-lg mb-1 md:mb-2">
                    Brand
                  </h4>
                  <p className="text-sm md:text-base">
                    {selectedProduct.Brand_Name}
                  </p>
                </div>

                <div className="mb-3 md:mb-4">
                  <h4 className="font-semibold text-base md:text-lg mb-1 md:mb-2">
                    Prices
                  </h4>
                  <p className="text-sm md:text-base">
                    Market Price: Rs. {selectedProduct.Market_Price}
                  </p>
                  <p className="text-sm md:text-base">
                    Selling Price: Rs. {selectedProduct.Selling_Price}
                  </p>
                </div>

                <div className="mb-3 md:mb-4">
                  <h4 className="font-semibold text-base md:text-lg mb-1 md:mb-2">
                    Date Created
                  </h4>
                  <p className="text-sm md:text-base">
                    {new Date(selectedProduct.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="mb-3 md:mb-4">
                  <h4 className="font-semibold text-base md:text-lg mb-1 md:mb-2">
                    Time Created
                  </h4>
                  <p className="text-sm md:text-base">
                    {new Date(selectedProduct.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="mb-3 md:mb-4">
                  <h4 className="font-semibold text-base md:text-lg mb-1 md:mb-2">
                    Main Image
                  </h4>
                  {selectedProduct.Main_Image_Url ? (
                    <img
                      src={selectedProduct.Main_Image_Url}
                      alt="Main"
                      className="w-full max-h-40 md:max-h-52 lg:max-h-64 object-contain"
                    />
                  ) : (
                    <p className="text-sm md:text-base">No main image</p>
                  )}
                </div>

                <div className="mb-3 md:mb-4">
                  <h4 className="font-semibold text-base md:text-lg mb-1 md:mb-2">
                    Sub Images
                  </h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {selectedProduct.images?.length > 0 ? (
                      selectedProduct.images.map((img) => (
                        <img
                          key={img.idProduct_Images}
                          src={img.Image_Url || "/placeholder.svg"}
                          alt="Sub"
                          className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-cover"
                        />
                      ))
                    ) : (
                      <p className="text-sm md:text-base">No sub images</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Variations */}
            <div className="mt-3 text-[#1D372E]">
              <h4 className="font-semibold text-base md:text-lg mb-1 md:mb-2">
                Variations
              </h4>
              {selectedProduct.variations?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-center border border-[#1D372E]">
                    <thead className="bg-[#5CAF90] text-[#1D372E]">
                      <tr>
                        <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                          Color
                        </th>
                        <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                          Size
                        </th>
                        <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProduct.variations.map((variation) => (
                        <tr key={variation.idProduct_Variations}>
                          <td className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                            <div className="inline-flex items-center gap-1 md:gap-2">
                              {variation.Colour &&
                                variation.Colour !== "No color selected" && (
                                  <div
                                    className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 border border-[#1D372E]"
                                    style={{
                                      backgroundColor: variation.Colour,
                                    }}
                                  />
                                )}
                              {/* Hex value text */}
                              <span>{variation.Colour}</span>
                            </div>
                          </td>
                          <td className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                            {variation.Size || "N/A"}
                          </td>
                          <td className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                            {variation.Qty}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm md:text-base">No variations available</p>
              )}
            </div>

            {/* FAQs */}
            <div className="mt-4 md:mt-5 lg:mt-6 text-[#1D372E]">
              <h4 className="font-semibold text-base md:text-lg mb-1 md:mb-2">
                Frequently Ask Questions
              </h4>
              {selectedProduct.faqs?.length > 0 ? (
                <div className="space-y-2 md:space-y-3 lg:space-y-4">
                  {selectedProduct.faqs.map((faq) => (
                    <div key={faq.idFAQ} className="border-b pb-2">
                      <p className="text-sm md:text-base font-medium">
                        Q: {faq.Question}
                      </p>
                      <p className="text-sm md:text-base">A: {faq.Answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm md:text-base">No FAQs available</p>
              )}
            </div>

            {/* Sub Categories */}
            <div className="mt-4 md:mt-5 lg:mt-6 text-[#1D372E]">
              <h4 className="font-semibold text-base md:text-lg mb-1 md:mb-2">
                Sub Categories
              </h4>
              {selectedProduct.subcategories?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.subcategories.map((subCat) => (
                    <span
                      key={subCat.idSub_Category}
                      className="bg-[#5CAF90] text-white px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm"
                    >
                      {subCat.Description}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm md:text-base">
                  No sub categories assigned
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
