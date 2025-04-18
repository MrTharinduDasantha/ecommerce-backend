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
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Load products from API
  const loadProducts = async () => {
    try {
      setLoading(true);
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

  // View product details - navigate to details page
  const handleViewProduct = (productId) => {
    navigate(`/dashboard/products/view-product/${productId}`);
  };

  // Hide scrollbar when popup is open, restore when closed
  useEffect(() => {
    if (deleteProductId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [deleteProductId]);

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
    <div className="card bg-white shadow-md">
      <div className="card-body p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-[#5CAF90]"></div>
          <h2 className="text-xl font-bold text-[#1D372E]">All Products</h2>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="relative flex w-full md:max-w-xl md:mx-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
              <FaSearch className="text-muted-foreground text-[#1D372E]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by product..."
              className="input input-bordered w-full pl-10 bg-white border-[#1D372E] text-[#1D372E]"
            />
            <button
              onClick={handleSearch}
              className="btn btn-primary ml-2 bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]"
            >
              Search
            </button>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="alert bg-[#1D372E] border-[#1D372E]">
            <span>No products found.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table min-w-[700px] text-center border border-[#1D372E]">
              <thead className="bg-[#EAFFF7] text-[#1D372E]">
                <tr className="border-b border-[#1D372E]">
                  <th className="font-semibold">Main Description</th>
                  <th className="font-semibold">Brand</th>
                  <th className="font-semibold">Market Price</th>
                  <th className="font-semibold">Selling Price</th>
                  <th className="font-semibold">Main Image</th>
                  <th className="font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[#1D372E]">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.idProduct}
                    className="border-b border-[#1D372E]"
                  >
                    <td>{product.Description}</td>
                    <td>{product.Brand_Name}</td>
                    <td>Rs. {product.Market_Price}</td>
                    <td>Rs. {product.Selling_Price}</td>
                    <td>
                      {product.Main_Image_Url ? (
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-md">
                            <img
                              src={product.Main_Image_Url || "/placeholder.svg"}
                              alt="Main"
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm opacity-70">No image</span>
                      )}
                    </td>
                    <td>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewProduct(product.idProduct)}
                          className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                          title="View Product"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => {
                            if (product.hasOrders) {
                              toast.error(
                                "This product cannot be edited since it has already been ordered"
                              );
                            } else {
                              navigate(
                                `/dashboard/products/edit-product/${product.idProduct}`
                              );
                            }
                          }}
                          className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                          title="Edit Product"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            if (product.hasOrders) {
                              toast.error(
                                "This product cannot be deleted since it has already been ordered"
                              );
                            } else {
                              setDeleteProductId(product.idProduct);
                            }
                          }}
                          className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                          title="Delete Product"
                        >
                          <RiDeleteBin5Fill />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Product Confirmation Modal */}
      {deleteProductId && (
        <div className="modal modal-open">
          <div className="modal-box bg-white text-[#1D372E]">
            <h3 className="font-bold text-lg mb-4">Delete Product</h3>
            <button
              onClick={() => setDeleteProductId(null)}
              className="absolute right-6 top-7 text-[#1D372E]"
            >
              <IoClose className="w-5 h-5" />
            </button>

            <p className="mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>

            <div className="modal-action">
              <button
                onClick={() => setDeleteProductId(null)}
                className="btn btn-sm bg-[#1D372E] border-[#1D372E]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="btn btn-sm bg-[#5CAF90] border-[#5CAF90]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
