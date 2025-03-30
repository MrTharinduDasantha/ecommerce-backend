import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaSearch } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { getProducts, deleteProduct } from "../api/product";
import toast from "react-hot-toast";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductPopup, setShowProductPopup] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);

  const navigate = useNavigate();

  // Load products from API
  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products);
      setFilteredProducts(data.products);
    } catch (error) {
      toast.error(error.message || "Failed to load products");
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
    <div className="max-w-5xl mx-auto my-5 p-10 bg-white rounded-md shadow-md">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-[#1D372E] mb-4">All Products</h2>

      {/* Search Bar - Centered */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="relative flex max-w-md w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
            <FaSearch className="text-[#1D372E]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search for product..."
            className="input input-bordered w-full pl-10 bg-white border-2 border-[#1D372E] text-[#1D372E] rounded-2xl"
          />
          <button
            onClick={handleSearch}
            className="btn bg-[#5CAF90] border-none ml-2 rounded-2xl"
          >
            Search
          </button>
        </div>
      </div>

      {/* If no products found */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-10 text-xl font-medium text-[#1D372E]">
          No product found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-center border border-[#1D372E]">
            <thead className="bg-[#5CAF90] text-[#1D372E]">
              <tr>
                <th className="border-2 p-2">Main Description</th>
                <th className="border-2 p-2">Brand</th>
                <th className="border-2 p-2">Market Price</th>
                <th className="border-2 p-2">Selling Price</th>
                <th className="border-2 p-2">Main Image</th>
                <th className="border-2 p-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-[#1D372E]">
              {filteredProducts.map((product) => (
                <tr key={product.idProduct}>
                  <td className="border-2 p-2">{product.Description}</td>
                  <td className="border-2 p-2">{product.Brand_Name}</td>
                  <td className="border-2 p-2">Rs. {product.Market_Price}</td>
                  <td className="border-2 p-2">Rs. {product.Selling_Price}</td>
                  <td className="border-2 p-2">
                    {product.Main_Image_Url ? (
                      <img
                        src={product.Main_Image_Url}
                        alt="Main"
                        className="w-16 h-16 object-cover mx-auto"
                      />
                    ) : (
                      "No image"
                    )}
                  </td>
                  <td className="border-2 p-2">
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="bg-[#5CAF90] p-1.5 cursor-pointer"
                        title="View Product"
                      >
                        <FaEye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/products/edit-product/${product.idProduct}`
                          )
                        }
                        className="bg-[#5CAF90] p-1.5 cursor-pointer"
                        title="Edit Product"
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeleteProductId(product.idProduct)}
                        className="bg-[#5CAF90] p-1.5 cursor-pointer"
                        title="Delete Product"
                      >
                        <RiDeleteBin5Fill className="w-5 h-5" />
                      </button>

                      {/* Delete Product Popup */}
                      {deleteProductId && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
                          <div className="bg-white rounded-md p-8 w-[90%] max-w-md">
                            <div className="flex justify-between items-center text-[#1D372E] mb-5">
                              <h3 className="text-lg font-bold">
                                Delete Product
                              </h3>
                              <button
                                onClick={() => setDeleteProductId(null)}
                                className="cursor-pointer"
                              >
                                <IoClose size={24} />
                              </button>
                            </div>
                            <p className="mb-6 text-left">
                              Are you sure you want to delete this product?
                            </p>

                            <div className="flex justify-end gap-4 w-full">
                              <button
                                onClick={() => setDeleteProductId(null)}
                                className="btn btn-sm bg-[#5CAF90] border-none cursor-pointer font-medium rounded-2xl"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleDeleteProduct}
                                className="btn btn-sm bg-[#5CAF90] border-none cursor-pointer font-medium rounded-2xl"
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Details Popup */}
      {showProductPopup && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-md p-8 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto relative">
            {/* Popup Header */}
            <div className="flex justify-between items-center text-[#1D372E] mb-5">
              <h3 className="text-xl font-bold">Product Details</h3>
              <button
                onClick={() => setShowProductPopup(false)}
                className="cursor-pointer"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#1D372E]">
              {/* Left Column */}
              <div>
                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-2">
                    Main Description
                  </h4>
                  <p>{selectedProduct.Description}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-2">
                    Sub Description
                  </h4>
                  <p>{selectedProduct.Long_Description || "N/A"}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-2">Brand</h4>
                  <p>{selectedProduct.Brand_Name}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-2">Prices</h4>
                  <p>Market Price: Rs. {selectedProduct.Market_Price}</p>
                  <p>Selling Price: Rs. {selectedProduct.Selling_Price}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-2">Date Created</h4>
                  <p>
                    {new Date(selectedProduct.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-2">Time Created</h4>
                  <p>
                    {new Date(selectedProduct.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-2">Main Image</h4>
                  {selectedProduct.Main_Image_Url ? (
                    <img
                      src={selectedProduct.Main_Image_Url}
                      alt="Main"
                      className="w-full max-h-64 object-contain"
                    />
                  ) : (
                    <p>No main image</p>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-2">Sub Images</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {selectedProduct.images?.length > 0 ? (
                      selectedProduct.images.map((img) => (
                        <img
                          key={img.idProduct_Images}
                          src={img.Image_Url}
                          alt="Sub"
                          className="w-24 h-24 object-cover"
                        />
                      ))
                    ) : (
                      <p>No sub images</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Variations */}
            <div className="mt-3 text-[#1D372E]">
              <h4 className="font-semibold text-lg mb-2">Variations</h4>
              {selectedProduct.variations?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-center border border-[#1D372E]">
                    <thead className="bg-[#5CAF90] text-[#1D372E]">
                      <tr>
                        <th className="border-2 p-2">Color</th>
                        <th className="border-2 p-2">Size</th>
                        <th className="border-2 p-2">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProduct.variations.map((variation) => (
                        <tr key={variation.idProduct_Variations}>
                          <td className="border-2 p-2">
                            <div className="inline-flex items-center gap-2">
                              {/* Small color box */}
                              <div
                                className="w-6 h-6 border border-gray-300"
                                style={{ backgroundColor: variation.Colour }}
                              />
                              {/* Hex value text */}
                              <span>{variation.Colour}</span>
                            </div>
                          </td>
                          <td className="border-2 p-2">
                            {variation.Size || "N/A"}
                          </td>
                          <td className="border-2 p-2">{variation.Qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No variations available</p>
              )}
            </div>

            {/* FAQs */}
            <div className="mt-6 text-[#1D372E]">
              <h4 className="font-semibold text-lg mb-2">
                Frequently Ask Questions
              </h4>
              {selectedProduct.faqs?.length > 0 ? (
                <div className="space-y-4">
                  {selectedProduct.faqs.map((faq) => (
                    <div key={faq.idFAQ} className="border-b pb-2">
                      <p>Q: {faq.Question}</p>
                      <p>A: {faq.Answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No FAQs available</p>
              )}
            </div>

            {/* Sub Categories */}
            <div className="mt-6 text-[#1D372E]">
              <h4 className="font-semibold text-lg mb-2">Sub Categories</h4>
              {selectedProduct.subcategories?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.subcategories.map((subCat) => (
                    <span
                      key={subCat.idSub_Category}
                      className="bg-[#5CAF90] text-white px-4 py-2 text-sm"
                    >
                      {subCat.Description}
                    </span>
                  ))}
                </div>
              ) : (
                <p>No sub categories assigned</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
