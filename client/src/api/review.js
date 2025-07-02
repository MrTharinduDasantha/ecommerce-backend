import { getToken } from "../utils/auth"

export const addReview = async reviewData => {
  try {
    const token = getToken()
    const res = await fetch(`http://localhost:9000/api/reviews`, {
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
