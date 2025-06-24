import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEdit,
  FaSearch,
  FaCheckSquare,
  FaRegCheckSquare,
} from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import {
  getProducts,
  toggleProductHistoryStatus,
  toggleProductStatus,
  deleteProduct,
} from "../api/product";
import Pagination from "./common/Pagination";
import toast from "react-hot-toast";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // Define items per page
  const itemsPerPage = 10;

  // Handle page change
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  // Load products from API
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data.products);
      setFilteredProducts(data.products);
      setTotalPages(Math.ceil(data.products.length / itemsPerPage));
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
      setTotalPages(Math.ceil(products.length / itemsPerPage));
      return;
    }
    const filtered = products.filter((p) =>
      p.Description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

  // Reset search when search query is empty
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      setTotalPages(Math.ceil(products.length / itemsPerPage));
    }
  }, [searchQuery, products]);

  // Slice the filtered products for the current page
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // View product details - navigate to details page
  const handleViewProduct = (productId) => {
    navigate(`/dashboard/products/view-product/${productId}`);
  };

  // Toggle product history status
  const handleToggleHistoryStatus = async (productId, currentHistoryStatus) => {
    try {
      const newHistoryStatus =
        currentHistoryStatus === "new arrivals" ? "old" : "new arrivals";
      await toggleProductHistoryStatus(productId, newHistoryStatus);
      toast.success("Product history status updated");
      loadProducts();
    } catch (error) {
      toast.error(error.message || "Failed to update product history status");
    }
  };

  // Toggle product status
  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await toggleProductStatus(productId, newStatus);
      toast.success("Product status updated");
      loadProducts();
    } catch (error) {
      toast.error(error.message || "Failed to update product status");
    }
  };

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
          <h2 className="text-lg md:text-xl font-bold text-[#1D372E]">
            All Products
          </h2>
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
              className="input input-bordered input-sm md:input-md w-full pl-8 md:pl-10 bg-white border-[#1D372E] text-[#1D372E]"
            />
            <button
              onClick={handleSearch}
              className="btn btn-primary btn-sm md:btn-md ml-2 bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]"
            >
              Search
            </button>
          </div>
        </div>

        {/* Products Display */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="alert bg-[#1D372E] border-[#1D372E]">
            <span>No products found.</span>
          </div>
        ) : (
          <>
            {/* Table for larger screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="table table-fixed min-w-[800px] text-center border border-[#1D372E]">
                <thead className="bg-[#EAFFF7] text-[#1D372E]">
                  <tr className="border-b border-[#1D372E]">
                    <th className="font-semibold md:text-xs lg:text-sm w-[125px]">
                      Main Description
                    </th>
                    <th className="font-semibold text-xs lg:text-sm w-[100px]">
                      Brand
                    </th>
                    <th className="font-semibold text-xs lg:text-sm w-[100px]">
                      Selling Price
                    </th>
                    <th className="font-semibold text-xs lg:text-sm w-[150px]">
                      History Status
                    </th>
                    <th className="font-semibold text-xs lg:text-sm w-[100px]">
                      Main Image
                    </th>
                    <th className="font-semibold text-xs lg:text-sm w-[100px]">
                      Status
                    </th>
                    <th className="font-semibold text-xs lg:text-sm w-[125px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[#1D372E]">
                  {paginatedProducts.map((product) => (
                    <tr
                      key={product.idProduct}
                      className="border-b border-[#1D372E]"
                    >
                      <td className="text-xs lg:text-sm">
                        {product.Description.length > 15
                          ? `${product.Description.substring(0, 15)}...`
                          : product.Description}
                      </td>
                      <td className="text-xs lg:text-sm">
                        {product.Brand_Name || "Other"}
                      </td>
                      <td className="text-xs lg:text-sm">
                        Rs. {product.Selling_Price}
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs lg:text-sm">
                            New Arrivals
                          </span>
                          <button
                            onClick={() =>
                              handleToggleHistoryStatus(
                                product.idProduct,
                                product.History_Status
                              )
                            }
                            className="text-[#5CAF90]"
                          >
                            {product.History_Status === "new arrivals" ? (
                              <FaCheckSquare className="w-3 h-3 lg:w-4 lg:h-4" />
                            ) : (
                              <FaRegCheckSquare className="w-3 h-3 lg:w-4 lg:h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td>
                        {product.Main_Image_Url ? (
                          <div className="avatar">
                            <div className="w-12 h-12 rounded-md">
                              <img src={product.Main_Image_Url} alt="Main" />
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm opacity-70">No image</span>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-2">
                          <span className="md:text-xs lg:text-sm">Active</span>
                          <button
                            onClick={() =>
                              handleToggleStatus(
                                product.idProduct,
                                product.Status
                              )
                            }
                            className="text-[#5CAF90]"
                          >
                            {product.Status === "active" ? (
                              <FaCheckSquare className="w-3 h-3 lg:w-4 lg:h-4" />
                            ) : (
                              <FaRegCheckSquare className="w-3 h-3 lg:w-4 lg:h-4" />
                            )}
                          </button>
                        </div>
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
                            onClick={() =>
                              navigate(
                                `/dashboard/products/edit-product/${product.idProduct}`
                              )
                            }
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
                              } else if (product.hasCart) {
                                toast.error(
                                  "This product cannot be deleted because it's currently in someone's cart"
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

            {/* Product Cards for mobile view */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {paginatedProducts.map((product) => (
                <div
                  key={product.idProduct}
                  className="card bg-white shadow-md border border-[#1D372E] p-4"
                >
                  <div className="flex items-center gap-4">
                    {product.Main_Image_Url ? (
                      <div className="avatar">
                        <div className="w-16 h-16 rounded-md">
                          <img src={product.Main_Image_Url} alt="Main" />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm opacity-70">No image</span>
                    )}
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-[#1D372E]">
                        {product.Description}
                      </h3>
                      <p className="text-xs text-[#1D372E]">
                        Brand: {product.Brand_Name || "Other"}
                      </p>
                      <p className="text-xs text-[#1D372E]">
                        Price: Rs. {product.Selling_Price}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-[#1D372E]">
                          New Arrivals
                        </span>
                        <button
                          onClick={() =>
                            handleToggleHistoryStatus(
                              product.idProduct,
                              product.History_Status
                            )
                          }
                          className="text-[#5CAF90]"
                        >
                          {product.History_Status === "new arrivals" ? (
                            <FaCheckSquare className="w-4 h-4" />
                          ) : (
                            <FaRegCheckSquare className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-[#1D372E]">Active</span>
                        <button
                          onClick={() =>
                            handleToggleStatus(
                              product.idProduct,
                              product.Status
                            )
                          }
                          className="text-[#5CAF90]"
                        >
                          {product.Status === "active" ? (
                            <FaCheckSquare className="w-4 h-4" />
                          ) : (
                            <FaRegCheckSquare className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => handleViewProduct(product.idProduct)}
                      className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                      title="View Product"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() =>
                        navigate(
                          `/dashboard/products/edit-product/${product.idProduct}`
                        )
                      }
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
                        } else if (product.hasCart) {
                          toast.error(
                            "This product cannot be deleted because it's currently in someone's cart"
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
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredProducts.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
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
