import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaSearch } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { getDiscounts, deleteDiscount } from "../api/product";
import toast from "react-hot-toast";

const DiscountList = () => {
  const [discounts, setDiscounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDiscounts, setFilteredDiscounts] = useState([]);
  const [deleteDiscountId, setDeleteDiscountId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Load discounts from API
  const loadDiscounts = async () => {
    try {
      setLoading(true);
      const data = await getDiscounts();
      setDiscounts(data.discounts);
      setFilteredDiscounts(data.discounts);
    } catch (error) {
      toast.error(error.message || "Failed to load discounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiscounts();
  }, []);

  // Handle search: filter discounts based on description or product name
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredDiscounts(discounts);
      return;
    }
    const filtered = discounts.filter(
      (d) =>
        d.Description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.ProductName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDiscounts(filtered);
  };

  // Reset search when search query is empty
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDiscounts(discounts);
    }
  }, [searchQuery, discounts]);

  // Delete discount
  const handleDeleteDiscount = async () => {
    try {
      await deleteDiscount(deleteDiscountId);
      toast.success("Discount deleted successfully");
      setDeleteDiscountId(null);
      loadDiscounts();
    } catch (error) {
      toast.error(error.message || "Failed to delete discount");
      setDeleteDiscountId(null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format discount type and value
  const formatDiscountType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatDiscountValue = (value, type) => {
    if (type === "percentage") {
      // Remove decimal places for percentage
      return `${Number.parseInt(value)}%`;
    } else {
      return `Rs. ${value}`;
    }
  };

  return (
    <div className="card bg-white shadow-md">
      <div className="card-body p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-[#5CAF90]"></div>
          <h2 className="text-lg md:text-xl font-bold text-[#1D372E]">
            All Discounts
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
              placeholder="Search by discount or product..."
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

        {/* Discount Display */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredDiscounts.length === 0 ? (
          <div className="alert bg-[#1D372E] border-[#1D372E]">
            <span>No discounts found.</span>
          </div>
        ) : (
          <>
            {/* Table for larger screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="table table-fixed min-w-[1000px] text-center border border-[#1D372E]">
                <thead className="bg-[#EAFFF7] text-[#1D372E]">
                  <tr className="border-b border-[#1D372E]">
                    <th className="font-semibold md:text-xs lg:text-sm w-[175px]">
                      Product
                    </th>
                    <th className="font-semibold md:text-xs lg:text-sm w-[175px]">
                      Description
                    </th>
                    <th className="font-semibold md:text-xs lg:text-sm w-[100px]">
                      Type
                    </th>
                    <th className="font-semibold md:text-xs lg:text-sm w-[100px]">
                      Value
                    </th>
                    <th className="font-semibold md:text-xs lg:text-sm w-[125px]">
                      Start Date
                    </th>
                    <th className="font-semibold md:text-xs lg:text-sm w-[125px]">
                      End Date
                    </th>
                    <th className="font-semibold md:text-xs lg:text-sm w-[100px]">
                      Status
                    </th>
                    <th className="font-semibold md:text-xs lg:text-sm w-[100px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[#1D372E]">
                  {filteredDiscounts.map((discount) => (
                    <tr
                      key={discount.idDiscounts}
                      className="border-b border-[#1D372E]"
                    >
                      <td className="text-xs lg:text-sm">
                        {discount.ProductName}
                      </td>
                      <td className="text-xs lg:text-sm">
                        {discount.Description}
                      </td>
                      <td className="text-xs lg:text-sm">
                        {formatDiscountType(discount.Dicaunt_Type)}
                      </td>
                      <td className="text-xs lg:text-sm">
                        {formatDiscountValue(
                          discount.Discount_Value,
                          discount.Dicaunt_Type
                        )}
                      </td>
                      <td className="text-xs lg:text-sm">
                        {formatDate(discount.Start_Date)}
                      </td>
                      <td className="text-xs lg:text-sm">
                        {formatDate(discount.End_Date)}
                      </td>
                      <td>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            discount.Status === "active"
                              ? "bg-green-100 text-green-800 border border-green-800"
                              : "bg-red-100 text-red-800 border border-red-800"
                          }`}
                        >
                          {discount.Status.charAt(0).toUpperCase() +
                            discount.Status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/discounts/add-discount/${discount.idDiscounts}`
                              )
                            }
                            className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                            title="Edit Discount"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteDiscountId(discount.idDiscounts)
                            }
                            className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                            title="Delete Discount"
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

            {/* Discount Cards for smaller screens */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {filteredDiscounts.map((discount) => (
                <div
                  key={discount.idDiscounts}
                  className="card bg-white shadow-md border border-[#1D372E] p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-[#1D372E]">
                      {discount.ProductName}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        discount.Status === "active"
                          ? "bg-green-100 text-green-800 border border-green-800"
                          : "bg-red-100 text-red-800 border border-red-800"
                      }`}
                    >
                      {discount.Status.charAt(0).toUpperCase() +
                        discount.Status.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-[#1D372E] mb-2">
                    {discount.Description}
                  </p>
                  <div className="text-xs text-[#1D372E] mb-2">
                    <span className="font-medium">Type: </span>{" "}
                    <span>{formatDiscountType(discount.Dicaunt_Type)}</span>
                  </div>
                  <div className="text-xs text-[#1D372E] mb-2">
                    <span className="font-medium">Value: </span>{" "}
                    <span>
                      {formatDiscountValue(
                        discount.Discount_Value,
                        discount.Dicaunt_Type
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-[#1D372E] mb-4">
                    <div>
                      <span className="font-medium">Start: </span>{" "}
                      <span>{formatDate(discount.Start_Date)}</span>
                    </div>
                    <div>
                      <span className="font-medium">End: </span>{" "}
                      <span>{formatDate(discount.End_Date)}</span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() =>
                        navigate(
                          `/dashboard/discounts/add-discount/${discount.idDiscounts}`
                        )
                      }
                      className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                      title="Edit Discount"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => setDeleteDiscountId(discount.idDiscounts)}
                      className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                      title="Delete Discount"
                    >
                      <RiDeleteBin5Fill />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Discount Confirmation Modal */}
      {deleteDiscountId && (
        <div className="modal modal-open">
          <div className="modal-box bg-white text-[#1D372E]">
            <h3 className="font-bold text-lg mb-4">Delete Discount</h3>
            <button
              onClick={() => setDeleteDiscountId(null)}
              className="absolute right-6 top-7 text-[#1D372E]"
            >
              <IoClose className="w-5 h-5" />
            </button>

            <p className="mb-6">
              Are you sure you want to delete this discount? This action cannot
              be undone.
            </p>

            <div className="modal-action">
              <button
                onClick={() => setDeleteDiscountId(null)}
                className="btn btn-sm bg-[#1D372E] border-[#1D372E]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDiscount}
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

export default DiscountList;
