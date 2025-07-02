import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaSearch, FaEye } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { getEvents, deleteEvent, getEventProducts } from "../api/event";
import Pagination from "./common/Pagination";
import toast from "react-hot-toast";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal state for viewing products
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [modalProducts, setModalProducts] = useState([]);
  const [modalEventName, setModalEventName] = useState("");
  const [modalEventDiscounts, setModalEventDiscounts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const navigate = useNavigate();

  // Define items per page
  const itemsPerPage = 10;

  // Load events from API
  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data.events);
      setFilteredEvents(data.events);
      setTotalPages(Math.ceil(data.events.length / itemsPerPage));
    } catch (error) {
      toast.error(error.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Handle search: filter events based on name or description
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
      setTotalPages(Math.ceil(events.length / itemsPerPage));
      return;
    }
    const filtered = events.filter(
      (e) =>
        e.Event_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.Event_Description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

  // Reset search when search query is empty
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
      setTotalPages(Math.ceil(events.length / itemsPerPage));
    }
  }, [searchQuery, events]);

  // Calculate paginated events
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Adjust current page if it exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Delete event
  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(deleteEventId);
      toast.success("Event deleted successfully");
      setDeleteEventId(null);
      loadEvents();
    } catch (error) {
      toast.error(error.message || "Failed to delete event");
      setDeleteEventId(null);
    }
  };

  // Calculate discounted price for a product
  const calculateDiscountedPrice = (product, discount) => {
    const originalPrice = parseFloat(product.Selling_Price) || 0;
    if (!discount || !discount.Discount_Type || !discount.Discount_Value) {
      return originalPrice;
    }
    const discountValue = parseFloat(discount.Discount_Value) || 0;
    if (discount.Discount_Type === "percentage") {
      return originalPrice - (originalPrice * discountValue) / 100;
    } else if (discount.Discount_Type === "fixed") {
      return Math.max(0, originalPrice - discountValue);
    }
    return originalPrice;
  };

  // View products for an event
  const viewEventProducts = async (eventId, eventName) => {
    try {
      setLoadingProducts(true);
      setModalEventName(eventName);
      setShowProductsModal(true);

      const data = await getEventProducts(eventId);
      setModalProducts(data.products);
      setModalEventDiscounts(data.discounts || []);
    } catch (error) {
      toast.error(error.message || "Failed to load event products");
      setShowProductsModal(false);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Get discount for a specific product
  const getProductDiscount = (productId) => {
    return modalEventDiscounts.find(
      (discount) =>
        discount.productIds && discount.productIds.includes(productId)
    );
  };

  return (
    <div className="card bg-white shadow-md">
      <div className="card-body p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-[#5CAF90]"></div>
          <h2 className="text-lg md:text-xl font-bold text-[#1D372E]">
            All Events
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
              placeholder="Search by event name or description..."
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

        {/* Event Display */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="alert bg-[#1D372E] border-[#1D372E]">
            <span>No events found.</span>
          </div>
        ) : (
          <>
            {/* Table for larger screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="table table-fixed min-w-[775px] text-center border border-[#1D372E]">
                <thead className="bg-[#EAFFF7] text-[#1D372E]">
                  <tr className="border-b border-[#1D372E]">
                    <th className="font-semibold md:text-xs lg:text-sm w-[100px]">
                      Event Name
                    </th>
                    <th className="font-semibold md:text-xs lg:text-sm w-[200px]">
                      Description
                    </th>
                    <th className="font-semibold md:text-xs lg:text-sm w-[100px]">
                      Image
                    </th>
                    <th className="font-semibold md:text-xs lg:text-sm w-[175px]">
                      Products
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
                  {paginatedEvents.map((event) => (
                    <tr
                      key={event.idEvent}
                      className="border-b border-[#1D372E]"
                    >
                      <td className="text-xs lg:text-sm">
                        {event.Event_Name.length > 20
                          ? `${event.Event_Name.substring(0, 20)}...`
                          : event.Event_Name}
                      </td>
                      <td className="text-xs lg:text-sm">
                        {event.Event_Description.length > 30
                          ? `${event.Event_Description.substring(0, 30)}...`
                          : event.Event_Description}
                      </td>
                      <td>
                        <img
                          src={event.Event_Image_Url}
                          alt={event.Event_Name}
                          className="w-12 h-12 object-cover rounded-md mx-auto"
                        />
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            viewEventProducts(event.idEvent, event.Event_Name)
                          }
                          className="btn btn-outline btn-xs bg-[#5CAF90] border-[#5CAF90] text-white hover:bg-[#4a9a7d]"
                        >
                          <FaEye className="w-3 h-3 mr-1" />
                          See Products ({event.productCount})
                        </button>
                      </td>
                      <td>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            event.Status === "active"
                              ? "bg-green-100 text-green-800 border border-green-800"
                              : "bg-red-100 text-red-800 border border-red-800"
                          }`}
                        >
                          {event.Status.charAt(0).toUpperCase() +
                            event.Status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/events/add-event/${event.idEvent}`
                              )
                            }
                            className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                            title="Edit Event"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => setDeleteEventId(event.idEvent)}
                            className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                            title="Delete Event"
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

            {/* Event Cards for smaller screens */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {paginatedEvents.map((event) => (
                <div
                  key={event.idEvent}
                  className="card bg-white shadow-md border border-[#1D372E] p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-[#1D372E]">
                      {event.Event_Name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        event.Status === "active"
                          ? "bg-green-100 text-green-800 border border-green-800"
                          : "bg-red-100 text-red-800 border border-red-800"
                      }`}
                    >
                      {event.Status.charAt(0).toUpperCase() +
                        event.Status.slice(1)}
                    </span>
                  </div>

                  {event.Event_Image_Url && (
                    <img
                      src={event.Event_Image_Url}
                      alt={event.Event_Name}
                      className="w-full h-60 object-cover rounded border mb-2"
                    />
                  )}

                  <p className="text-xs text-[#1D372E] mb-3">
                    {event.Event_Description}
                  </p>

                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() =>
                        viewEventProducts(event.idEvent, event.Event_Name)
                      }
                      className="btn btn-outline btn-xs bg-[#5CAF90] border-[#5CAF90] text-white hover:bg-[#4a9a7d]"
                    >
                      <FaEye className="w-3 h-3 mr-1" />
                      See Products ({event.productCount})
                    </button>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/events/add-event/${event.idEvent}`)
                      }
                      className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                      title="Edit Event"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => setDeleteEventId(event.idEvent)}
                      className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                    >
                      <RiDeleteBin5Fill />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredEvents.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      {/* Products Modal */}
      {showProductsModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-white text-[#1D372E] max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl">
                Products in "{modalEventName}"
              </h3>
              <button
                onClick={() => setShowProductsModal(false)}
                className="absolute right-6 top-7 text-[#1D372E]"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>

            {loadingProducts ? (
              <div className="flex justify-center items-center h-40">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : modalProducts.length === 0 ? (
              <p className="text-center text-gray-500 py-16">
                No products found for this event.
              </p>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {modalProducts.map((product) => {
                  const discount = getProductDiscount(product.idProduct);
                  const originalPrice = parseFloat(product.Selling_Price);
                  const discountedPrice = discount
                    ? calculateDiscountedPrice(product, discount)
                    : null;

                  return (
                    <div
                      key={product.idProduct}
                      className="card bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="card-body p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="text-base font-bold text-[#1D372E] mb-1 line-clamp-2">
                              {product.Description}
                            </h4>
                            {discount && (
                              <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                                Discount Applied
                              </span>
                            )}
                          </div>
                        </div>

                        {product.Main_Image_Url && (
                          <div className="mb-3">
                            <img
                              src={product.Main_Image_Url}
                              alt={product.Description}
                              className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                            />
                          </div>
                        )}

                        {/* Product Description */}
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                            {product.Long_Description || product.Description}
                          </p>
                        </div>

                        {/* Price Information */}
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-gray-600">
                              Market Price:
                            </span>
                            <span className="text-sm font-bold text-gray-800">
                              Rs. {parseFloat(product.Market_Price).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-gray-600">
                              Selling Price:
                            </span>
                            <span
                              className={`text-sm font-bold ${
                                discount
                                  ? "line-through text-gray-500"
                                  : "text-[#5CAF90]"
                              }`}
                            >
                              Rs. {originalPrice.toFixed(2)}
                            </span>
                          </div>

                          {discount && (
                            <>
                              <div className="border-t border-gray-200 pt-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-medium text-red-600">
                                    Discount:
                                  </span>
                                  <span className="text-sm font-bold text-red-600">
                                    {discount.Discount_Type === "percentage"
                                      ? `${discount.Discount_Value}% OFF`
                                      : `Rs. ${parseFloat(
                                          discount.Discount_Value
                                        ).toFixed(2)} OFF`}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center mt-1 bg-green-100 rounded p-2">
                                  <span className="text-sm font-bold text-[#1D372E]">
                                    Final Price:
                                  </span>
                                  <span className="text-lg font-bold text-[#5CAF90]">
                                    Rs. {discountedPrice.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Event Confirmation Modal */}
      {deleteEventId && (
        <div className="modal modal-open">
          <div className="modal-box bg-white text-[#1D372E]">
            <h3 className="font-bold text-lg mb-4">Delete Event</h3>
            <button
              onClick={() => setDeleteEventId(null)}
              className="absolute right-6 top-7 text-[#1D372E]"
            >
              <IoClose className="w-5 h-5" />
            </button>

            <p className="mb-6">
              Are you sure you want to delete this event? This action cannot be
              undone and will also delete any associated discounts.
            </p>

            <div className="modal-action">
              <button
                onClick={() => setDeleteEventId(null)}
                className="btn btn-sm bg-[#1D372E] border-[#1D372E]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
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

export default EventList;
