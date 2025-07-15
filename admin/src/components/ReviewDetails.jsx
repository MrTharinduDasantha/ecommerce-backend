import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"
import { IoClose } from "react-icons/io5"
import toast from "react-hot-toast"
import "react-datepicker/dist/react-datepicker.css"
import { getReviewByReviewId, updateReviewStatus } from "../api/reviews"
import { FaStar } from "react-icons/fa"

const ReviewDetails = () => {
  const { reviewId } = useParams()
  const navigate = useNavigate()
  const [reviewDetails, setReviewDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [statusError, setStatusError] = useState(null)
  const [showReviewStatusModal, setShowReviewStatusModal] = useState(false)

  useEffect(() => {
    if (reviewId) {
      if (!isNaN(Number.parseInt(reviewId, 10))) {
        fetchReviewDetails()
      } else {
        setError("Invalid review ID format. Review ID must be a number.")
        setLoading(false)
      }
    } else {
      setError("Review ID is required")
      setLoading(false)
    }
  }, [reviewId])

  const fetchReviewDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getReviewByReviewId(reviewId)
      setReviewDetails(data[0])
      setLoading(false)
    } catch (err) {
      setError(err.message || "Failed to fetch review details")
      setLoading(false)
    }
  }

  const getStatusColor = status => {
    switch (status) {
      case "active":
        return "bg-green-100 border border-green-800 text-green-800"
      case "inactive":
        return "bg-red-100 border border-red-800 text-red-800"
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <div className="card bg-white">
        <div className="card-body">
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
          <button onClick={handleBack} className="btn btn-primary mt-4">
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </div>
      </div>
    )
  }

  if (!reviewDetails) {
    return (
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="alert alert-error">
            <span>Review not found</span>
          </div>
          <button onClick={handleBack} className="btn btn-primary mt-4">
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card bg-white shadow-md">
      <div className="card-body p-4 md:p-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBack}
            className="btn btn-circle btn-sm bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]"
          >
            <FaArrowLeft className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-[#5CAF90]"></div>
            <h2 className="text-xl font-bold text-[#1D372E]">
              Review #{reviewDetails.review_id}
            </h2>
          </div>
        </div>

        {statusError && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded text-sm">
            {statusError}
          </div>
        )}

        <div className="grid gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-1 text-[#1D372E]">
                <span className="font-medium">Rating:</span>
                <div className="flex gap-1">
                  {[...Array(parseInt(reviewDetails.rating))].map(
                    (_, index) => (
                      <FaStar key={index} className="text-yellow-500" />
                    )
                  )}
                </div>
              </div>
              <p className="flex gap-1 text-[#1D372E]">
                <span className="font-medium">Comment:</span>
                <span>{reviewDetails.comment}</span>
              </p>
              <div className="flex items-center gap-1 text-[#1D372E]">
                <span className="font-medium">Status:</span>
                <button
                  className={`px-3 py-2 cursor-pointer rounded-full text-xs font-medium ${getStatusColor(
                    reviewDetails.status
                  )}`}
                  onClick={() => setShowReviewStatusModal(true)}
                >
                  {reviewDetails.status}
                </button>
                <span className="text-sm text-gray-500">
                  (Click to update the status)
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Review status Modal */}
        {showReviewStatusModal && (
          <div className="modal modal-open">
            <div className="modal-box max-h-[70vh] bg-white text-[#1D372E]">
              <h3 className="font-bold text-lg mb-4">Confirm status Change</h3>
              <button
                onClick={() => setShowReviewStatusModal(false)}
                className="absolute right-6 top-7 text-lg text-[#1D372E]"
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
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        reviewDetails.status
                      )} border border-gray-200`}
                    >
                      {reviewDetails.status}
                    </span>
                  </div>
                  <div className="text-2xl">→</div>
                  <div>
                    <p className="font-semibold mb-1">To:</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        reviewDetails.status === "active"
                          ? "inactive"
                          : "active"
                      )} border border-gray-200`}
                    >
                      {reviewDetails.status === "active"
                        ? "inactive"
                        : "active"}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  This action will update the status of review #{reviewId}
                </p>
              </div>
              <div className="modal-action">
                <button
                  onClick={() => {
                    setShowReviewStatusModal(false)
                  }}
                  className="btn btn-sm bg-[#1D372E] border-[#1D372E]"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      await updateReviewStatus(reviewDetails.review_id)
                      setShowReviewStatusModal(false)
                      toast.success("Review status updated")
                      setReviewDetails(prev => ({
                        ...prev,
                        status:
                          prev.status === "active" ? "inactive" : "active",
                      }))
                    } catch (err) {
                      setStatusError(
                        err.message || "Failed to update review status"
                      )
                      toast.error("Failed to update review status")
                    } finally {
                      setUpdatingStatus(false)
                    }
                  }}
                  className={`btn btn-sm bg-[#5CAF90] border-[#5CAF90] ${
                    updatingStatus ? "loading" : ""
                  }`}
                  disabled={updatingStatus}
                >
                  {updatingStatus ? "Updating..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewDetails
