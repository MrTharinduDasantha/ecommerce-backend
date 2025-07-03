import { getToken } from "../utils/auth"

export const addProductReview = async reviewData => {
  try {
    const token = getToken()
    const res = await fetch(`http://localhost:9000/api/reviews/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    })
    if (!res.ok) throw new Error(`Error: ${res.status}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error submitting review: ", error)
    throw new Error(error.response?.data?.message || "Failed to submit review")
  }
}

export const addOrderReview = async reviewData => {
  try {
    const token = getToken()
    const res = await fetch(`http://localhost:9000/api/reviews/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    })
    if (!res.ok) throw new Error(`Error: ${res.status}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error submitting review: ", error)
    throw new Error(error.response?.data?.message || "Failed to submit review")
  }
}

export const getReviewsByProductId = async productId => {
  try {
    const res = await fetch(
      `http://localhost:9000/api/reviews/product/${productId}`
    )
    if (!res.ok) throw new Error(`Error: ${res.status}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error getting product reviews: ", error)
    throw new Error(error.response?.data?.message || "Failed to get reviews")
  }
}

export const getReviewsByOrderId = async orderId => {
  try {
    const token = getToken()
    const res = await fetch(
      `http://localhost:9000/api/reviews/order/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (!res.ok) throw new Error(`Error: ${res.status}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error getting order reviews: ", error)
    throw new Error(error.response?.data?.message || "Failed to get reviews")
  }
}

export const updateOrderReview = async (orderId, review) => {
  try {
    const token = getToken()
    const res = await fetch(
      `http://localhost:9000/api/reviews/order/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(review),
      }
    )
    if (!res.ok) throw new Error(`Error: ${res.status}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error updating order review: ", error)
    throw new Error(error.response?.data?.message || "Failed to update review")
  }
}

export const deleteOrderReview = async orderId => {
  try {
    const token = getToken()
    const res = await fetch(
      `http://localhost:9000/api/reviews/order/${orderId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (!res.ok) throw new Error(`Error: ${res.status}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error deleting order review: ", error)
    throw new Error(error.response?.data?.message || "Failed to delete review")
  }
}
