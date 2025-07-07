import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getReviews, updateReviewStatus } from "../api/reviews"
import { FaSearch, FaStar } from "react-icons/fa"
import { IoClose } from "react-icons/io5"
import toast from "react-hot-toast"
import Pagination from "./common/Pagination"

const ReviewList = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const [reviewToUpdate, setReviewToUpdate] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [showReviewStatusModal, setShowReviewStatusModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchReviews()
  }, [currentPage])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Fetching reviews, page:", currentPage)
      const data = await getReviews()
      console.log("Review data received:", data)
      setReviews(data)
      const totalPagesCount = Math.ceil(data.length / 10)
      setTotalPages(totalPagesCount > 0 ? totalPagesCount : 1)
      setLoading(false)
    } catch (err) {
      console.error("Error in ReviewList.fetchReviews:", err)
      setError(err.message || "Failed to fetch reviews")
      setLoading(false)
    }
  }

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleViewReview = reviewId => {
    navigate(`/dashboard/reviews/${reviewId}`)
  }

  const handleStatusChange = reviewId => {
    const review = reviews.find(r => r.review_id === reviewId)
    if (!review) return
    setShowReviewStatusModal(true)
  }

  const searchFiltered = reviews.filter(review => {
    if (!searchTerm) return true
    return review.rating && parseInt(review.rating) === parseInt(searchTerm)
  })

  const itemsPerPage = 10
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const filteredReviews = searchFiltered.slice(startIndex, endIndex)

  useEffect(() => {
    const totalPagesCount = Math.ceil(searchFiltered.length / itemsPerPage)
    setTotalPages(totalPagesCount > 0 ? totalPagesCount : 1)
  }, [searchFiltered.length])

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-[#5CAF90]"></div>
          <h2 className="text-xl font-bold text-[#1D372E]">
            Manage Order Reviews
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
              placeholder="Search by Rating"
              className="input input-bordered w-full pl-10 bg-white border-[#1D372E] text-[#1D372E]"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary ml-2 bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]">
              Search
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={fetchReviews}
              className="mt-4 bg-[#5CAF90] text-white px-4 py-2 rounded hover:bg-opacity-90"
            >
              Try Again
            </button>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="alert bg-[#1D372E] border-[#1D372E] mt-4">
            <span>No reviews found.</span>
          </div>
        ) : (
          <div className="block w-full overflow-x-auto">
            <div className="hidden sm:block">
              <table className="table min-w-[700px] text-center border border-[#1D372E]">
                <thead className="bg-[#EAFFF7] text-[#1D372E]">
                  <tr className="border-b border-[#1D372E]">
                    <th className="font-semibold p-3 w-[10%]">Review ID</th>
                    <th className="font-semibold p-3 w-[10%]">Customer ID</th>
                    <th className="font-semibold p-3 w-[15%]">Order ID</th>
                    <th className="font-semibold p-3 w-[10%]">Rating</th>
                    <th className="font-semibold p-3 w-[10%]">Active</th>
                  </tr>
                </thead>
                <tbody className="text-[#1D372E]">
                  {filteredReviews.map(review => (
                    <tr
                      key={review.review_id}
                      className="border-b border-[#1D372E] cursor-pointer hover:bg-gray-50"
                      onClick={() => handleViewReview(review.review_id)}
                    >
                      <td className="p-3">#{review.review_id}</td>
                      <td className="p-3">{review.customer_id}</td>
                      <td className="p-3">{review.order_id}</td>
                      <td className="p-3">{parseInt(review.rating)}</td>
                      <td>
                        <input
                          onClick={e => {
                            e.stopPropagation()
                            setReviewToUpdate(review)
                            handleStatusChange(review.review_id)
                          }}
                          type="checkbox"
                          checked={review.status === "active"}
                          onChange={() => {}}
                          className="cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view */}
            <div className="sm:hidden">
              {filteredReviews.map(review => (
                <div
                  key={review.review_id}
                  className="bg-white p-4 border-b cursor-pointer hover:bg-gray-50"
                  onClick={() => handleViewReview(review.review_id)}
                >
                  <div className="text-sm text-gray-500 mb-1">
                    Review ID: #{review.review_id}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    Customer ID: {review.customer_id}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    Order ID: {review.order_id}
                  </div>
                  <div className="text-sm flex items-center gap-1 text-gray-500 mb-2">
                    <span>Rating: </span>
                    <div className="flex">
                      {[...Array(parseInt(review.rating))].map((_, index) => (
                        <FaStar key={index} className="text-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm flex items-center gap-1 text-gray-500 mb-2">
                    <span>Active: </span>
                    <input
                      type="checkbox"
                      checked={review.status === "active"}
                      onClick={e => {
                        e.stopPropagation()
                        setReviewToUpdate(review)
                        handleStatusChange(review.review_id)
                      }}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* review status Modal */}
        {showReviewStatusModal && (
          <div className="modal modal-open">
            <div className="modal-box max-h-[70vh] bg-white text-[#1D372E]">
              <h3 className="font-bold text-lg mb-4">Confirm status Change</h3>
              <button
                onClick={() => setShowReviewStatusModal(false)}
                className="absolute right-6 top-7 text-lg text-[#1D372E] cursor-pointer"
              >
                <IoClose className="w-5 h-5" />
              </button>
              <div className="text-center">
                <p className="mb-2">
                  Are you sure you want to change the review status?
                </p>
                <div className="flex justify-between items-center mb-4 mx-auto max-w-xs">
                  <div>
                    <p className="font-semibold mb-1">From:</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        reviewToUpdate.status === "active"
                          ? "bg-green-100 border border-green-800 text-green-800"
                          : "bg-red-100 border border-red-800 text-red-800"
                      }`}
                    >
                      {reviewToUpdate.status}
                    </span>
                  </div>
                  <div className="text-2xl">→</div>
                  <div>
                    <p className="font-semibold mb-1">To:</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        reviewToUpdate.status !== "active"
                          ? "bg-green-100 border border-green-800 text-green-800"
                          : "bg-red-100 border border-red-800 text-red-800"
                      }`}
                    >
                      {reviewToUpdate.status === "active"
                        ? "inactive"
                        : "active"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  This action will update the status of review #
                  {reviewToUpdate.review_id}
                </p>
              </div>
              <div className="modal-action">
                <button
                  onClick={() => setShowReviewStatusModal(false)}
                  className="btn btn-sm bg-[#1D372E] border-[#1D372E]"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      await updateReviewStatus(reviewToUpdate.review_id)
                      setReviews(prev =>
                        prev.map(review =>
                          review.review_id === reviewToUpdate.review_id
                            ? {
                                ...review,
                                status:
                                  review.status === "active"
                                    ? "inactive"
                                    : "active",
                              }
                            : review
                        )
                      )
                      toast.success("review status updated")
                      setShowReviewStatusModal(false)
                    } catch (err) {
                      console.error("Failed to update review status:", err)
                      toast.error("Failed to update review status")
                    } finally {
                      setUpdatingStatus(null)
                    }
                  }}
                  className={`btn btn-sm bg-[#5CAF90] border-[#5CAF90] ${
                    updatingStatus === reviewToUpdate.review_id ? "loading" : ""
                  }`}
                  disabled={updatingStatus === reviewToUpdate.review_id}
                >
                  {updatingStatus === reviewToUpdate.review_id
                    ? "Updating..."
                    : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewList
