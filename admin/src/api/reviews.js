import { getToken } from "../utils/auth"

const API_URL = "http://localhost:9000/api/admin/reviews"

// Get all reviews
export const getReviews = async () => {
  try {
    const token = getToken()
    const res = await fetch(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error(`Error: ${res.status}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error getting order reviews: ", error)
    throw new Error(error.response?.data?.message || "Failed to get reviews")
  }
}

export const getReviewByReviewId = async reviewId => {
  try {
    const token = getToken()
    const res = await fetch(`${API_URL}/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error(`Error: ${res.status}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error getting review details: ", error)
    throw new Error(
      error.response?.data?.message || "Failed to get review details"
    )
  }
}

export const updateReviewStatus = async reviewId => {
  try {
    const token = getToken()
    const res = await fetch(`${API_URL}/${reviewId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error(`Error: ${res.status}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error updating review status: ", error)
    throw new Error(
      error.response?.data?.message || "Failed to update review status"
    )
  }
}
