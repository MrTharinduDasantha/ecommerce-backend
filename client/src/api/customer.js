// Fetch customer by customer id
export const getCustomerById = async customerId => {
  try {
    const token = localStorage.getItem("token")
    if (token) {
      const res = await fetch(
        `http://localhost:9000/api/customers/${customerId}`,
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
