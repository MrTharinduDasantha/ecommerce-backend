import { getToken } from "../utils/auth"

const API_URL = "http://localhost:9000/api"

// Fetch customer by customer id
export const getCustomerById = async customerId => {
  try {
    const token = getToken()
    if (token) {
      const res = await fetch(
        `${API_URL}/customers/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (!res.ok) throw new Error(`Error: ${res.status}`)
      const data = await res.json()
      return data
    }
  } catch (error) {
    console.error("Error fetching customer data: ", error)
  }
}

export const updateCustomerDetails = async (customerId, data) => {
  try {
    const token = getToken()
    if (token) {
      const res = await fetch(
        `${API_URL}/customers/${customerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization:`Bearer ${token}`
          },
          body:JSON.stringify(data)
        }
      )
      if (!res.ok) throw new Error(`Error: ${res.status}`)
      return "Customer updated successfully"
    }
  } catch (error) {
    console.error("Error updating customer data: ", error)
  }
}