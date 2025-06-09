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

export const deleteAddressById = async (customerId, addressId) => {
  try {
    const token = getToken()
    const res = await fetch(
      `http://localhost:9000/api/customer-addresses/${customerId}/addresses/${addressId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (!res.ok) throw new Error(`Error: ${res.status}`)
    return "Address deleted successfully"
  } catch (error) {
    console.error("Error deleting customer address: ", error)
    throw new Error(error.response?.data?.message || "Failed to delete address")
  }
}

export const updateAddress = async (customerId, addressId, updatedAddress) => {
  try {
    const token = getToken()
    const res = await fetch(
      `http://localhost:9000/api/customer-addresses/${customerId}/addresses/${addressId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedAddress),
      }
    )
    if (!res.ok) throw new Error(`Error: ${res.status}`)
    return "Address updated successfully"
  } catch (error) {
    console.error("Error updating customer address: ", error)
    throw new Error(error.response?.data?.message || "Failed to update address")
  }
}