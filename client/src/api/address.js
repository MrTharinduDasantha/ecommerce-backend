import { getToken } from "../utils/auth"

export const addAddress = async (customerId, addressData) => {
  try {
    const token = getToken()
    const res = await fetch(
      `http://localhost:9000/api/customer-addresses/${customerId}/addresses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      }
    )
    if (!res.ok) throw new Error(`Error: ${res.status}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error creating address: ", error)
    throw new Error(error.response?.data?.message || "Failed to create address")
  }
}

export const getAddressByCustomerId = async customerId => {
  try {
    const token = getToken()
    const res = await fetch(
      `http://localhost:9000/api/customer-addresses/${customerId}/addresses`,
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
    console.error("Error getting customer addresses: ", error)
    throw new Error(error.response?.data?.message || "Failed to get address")
  }
}
