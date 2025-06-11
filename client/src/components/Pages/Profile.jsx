import React, { useContext, useEffect, useState } from "react"
import EditIcon from "@mui/icons-material/Edit"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import PhoneIcon from "@mui/icons-material/Phone"
import EmailIcon from "@mui/icons-material/Email"
import CakeIcon from "@mui/icons-material/Cake"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CloseIcon from "@mui/icons-material/Close"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import DeleteIcon from "@mui/icons-material/Delete"
import CurrentOrders from "../CurrentOrders"
import OrderHistory from "../OrderHistory"
import { AuthContext } from "../../context/AuthContext"
import {
  addAddress,
  deleteAddressById,
  getAddressByCustomerId,
  updateAddress,
} from "../../api/address"
import { getCustomerById, updateCustomerDetails } from "../../api/customer"

const Profile = () => {
  const { user } = useContext(AuthContext)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false)
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] =
    React.useState(false)
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] =
    React.useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false)
  const [showAddSuccessMessage, setShowAddSuccessMessage] =
    React.useState(false)
  const [showProfileSuccessMessage, setShowProfileSuccessMessage] =
    React.useState(false)

  const [newAddressDetails, setNewAddressDetails] = React.useState({
    address: "",
    city: "",
    country: "",
    mobile_no: "",
  })

  const [formErrors, setFormErrors] = React.useState({
    address: "",
    city: "",
    country: "",
    mobile: "",
  })

  const [editingAddress, setEditingAddress] = React.useState({
    id: null,
    address: "",
    city: "",
    country: "",
    mobile_no: "",
  })

  const [addressToDelete, setAddressToDelete] = React.useState(null)

  const [addresses, setAddresses] = React.useState([])

  const [profileData, setProfileData] = React.useState({
    full_name: "",
    mobile_no: "",
    email: "",
    address: "",
    birthday: "",
    password: "************************",
  })

  const [updatedProfile, setUpdatedProfile] = useState({
    full_name: "",
    mobile_no: "",
    email: "",
    address: "",
    city: "",
    country: "",
    birthday: "",
    password: "",
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const customerData = await getCustomerById(user.id)
        // Fix for birthday date shift issue by adding one day
        let birthdayValue = customerData.Birthday || ""
        if (birthdayValue) {
          const dateParts = birthdayValue.split("T")[0].split("-")
          const year = parseInt(dateParts[0])
          const month = parseInt(dateParts[1]) - 1
          const day = parseInt(dateParts[2])
          const date = new Date(year, month, day)
          date.setDate(date.getDate() + 1) // Add one day to fix the timezone shift
          const adjustedYear = date.getFullYear()
          const adjustedMonth = (date.getMonth() + 1)
            .toString()
            .padStart(2, "0")
          const adjustedDay = date.getDate().toString().padStart(2, "0")
          birthdayValue = `${adjustedYear}-${adjustedMonth}-${adjustedDay}`
        }
        setProfileData(prev => ({
          ...prev,
          full_name: customerData.Full_Name,
          mobile_no: customerData.Mobile_No,
          email: customerData.Email,
          address: customerData.Address || "",
          birthday: birthdayValue,
        }))
      } catch (error) {
        console.error("Error fetching customer data:", error)
      }
    }
    fetchUserData()
  }, [user.id])

  const [profileErrors, setProfileErrors] = React.useState({
    name: "",
    mobile_no: "",
    email: "",
    address: "",
    birthday: "",
    password: "",
  })

  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        const customerAddresses = await getAddressByCustomerId(user.id)
        const formattedAddresses = customerAddresses.map((address, index) => ({
          id: address.idDelivery_Address,
          address: address.Address,
          city: address.City,
          country: address.Country,
          mobile_no: address.Mobile_No,
          isMain: index === 0,
        }))
        setAddresses(formattedAddresses)
      } catch (error) {
        console.error("Error fetching customer addresses: ", error)
      }
    }
    fetchUserAddresses()
  }, [user.id])

  const validateForm = () => {
    let isValid = true
    const errors = {
      address: "",
      city: "",
      country: "",
      mobile: "",
    }

    if (!newAddressDetails.address.trim()) {
      errors.address = "Address is required"
      isValid = false
    }

    if (!newAddressDetails.city.trim()) {
      errors.city = "City is required"
      isValid = false
    }

    if (!newAddressDetails.country.trim()) {
      errors.country = "Country is required"
      isValid = false
    }

    if (!newAddressDetails.mobile_no.trim()) {
      errors.mobile = "Mobile number is required"
      isValid = false
    } else if (!/^\d{10}$/.test(newAddressDetails.mobile_no.trim())) {
      errors.mobile = "Mobile number must be exactly 10 digits"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  // const handleAddAddress = () => {
  //   if (validateForm()) {
  //     const newId = Math.max(...addresses.map(a => a.id), 0) + 1
  //     setAddresses(prevAddresses => [
  //       ...prevAddresses,
  //       {
  //         id: newId,
  //         address: newAddressDetails.address.trim(),
  //         city: newAddressDetails.city.trim(),
  //         country: newAddressDetails.country.trim(),
  //         mobile: newAddressDetails.mobile.trim(),
  //         isMain: addresses.length <= 0,
  //       },
  //     ])
  //     setNewAddressDetails({
  //       address: "",
  //       city: "",
  //       country: "",
  //       mobile: "",
  //     })
  //     setFormErrors({
  //       address: "",
  //       city: "",
  //       country: "",
  //       mobile: "",
  //     })
  //     addAddress(user.id, {
  //       full_name: profileData.name,
  //       address: newAddressDetails.address,
  //       city: newAddressDetails.city,
  //       country: newAddressDetails.country,
  //       mobile_no: profileData.mobile_no,
  //     })
  //     // Show success message
  //     setShowAddSuccessMessage(true)

  //     // Close the modal after a delay
  //     setTimeout(() => {
  //       setIsAddAddressModalOpen(false)
  //       setShowAddSuccessMessage(false)
  //     }, 1500)
  //   }
  // }

  const handleAddAddress = async () => {
    if (validateForm()) {
      try {
        const res = await addAddress(user.id, profileData)
        const newAddressId = res.id || res.idDelivery_Address
        const isFirstAddress = addresses.length === 0
        const newAddress = {
          id: newAddressId,
          address: newAddressDetails.address.trim(),
          city: newAddressDetails.city.trim(),
          country: newAddressDetails.country.trim(),
          mobile_no: newAddressDetails.mobile_no.trim(),
          isMain: isFirstAddress,
        }
        setAddresses(prevAddresses => [...prevAddresses, newAddress])
        if (isFirstAddress) {
          setProfileData(prev => ({
            ...prev,
            address: newAddress,
          }))
          setUpdatedProfile(prev => ({
            ...prev,
            address: newAddress.address,
          }))
        }
        setNewAddressDetails({
          address: "",
          city: "",
          country: "",
          mobile_no: "",
        })
        setFormErrors({
          address: "",
          city: "",
          country: "",
          mobile: "",
        })
        // Show success message
        setShowAddSuccessMessage(true)

        // Close the modal after a delay
        setTimeout(() => {
          setIsAddAddressModalOpen(false)
          setShowAddSuccessMessage(false)
        }, 1500)
      } catch (error) {
        console.error("Failed to add address:", error)
        alert("Failed to add address. Please try again.")
      }
    }
  }

  const handleEditAddress = id => {
    const addressToEdit = addresses.find(addr => addr.id === id)
    if (addressToEdit) {
      setEditingAddress({
        id: addressToEdit.id,
        address: addressToEdit.address,
        city: addressToEdit.city,
        country: addressToEdit.country,
        mobile_no: addressToEdit.mobile_no,
      })
      setIsEditAddressModalOpen(true)
      setShowSuccessMessage(false)
    }
  }

  const handleDeleteAddress = id => {
    setAddressToDelete(id)
    setIsDeleteConfirmOpen(true)
  }

  const confirmDeleteAddress = async () => {
    try {
      const addressToRemove = addresses.find(
        addr => addr.id === addressToDelete
      )
      const wasMainAddress = addressToRemove?.isMain
      await deleteAddressById(user.id, addressToDelete)
      setAddresses(prev => {
        const filteredAddresses = prev.filter(
          address => address.id !== addressToDelete
        )
        if (wasMainAddress && filteredAddresses.length > 0) {
          const newAddresses = filteredAddresses.map((addr, index) => ({
            ...addr,
            isMain: index === 0,
          }))
          const newMainAddress = newAddresses[0]
          setTimeout(() => {
            setProfileData(prev => ({
              ...prev,
              address: newMainAddress.address,
            }))
            setUpdatedProfile(prev => ({
              ...prev,
              address: newMainAddress.address,
            }))
          }, 0)
          return newAddresses
        }
        return filteredAddresses
      })
      setIsDeleteConfirmOpen(false)
    } catch (error) {
      console.error("Failed to delete address:", error)
      alert("Failed to delete address.")
    }
  }

  const handleUpdateAddress = async () => {
    if (validateEditForm()) {
      setAddresses(prevAddresses =>
        prevAddresses.map(addr =>
          addr.id === editingAddress.id
            ? {
                ...addr,
                address: editingAddress.address.trim(),
                city: editingAddress.city.trim(),
                country: editingAddress.country.trim(),
                mobile_no: editingAddress.mobile_no.trim(),
              }
            : addr
        )
      )

      // If the edited address is the main address, update the profile data
      const updatedAddress = addresses.find(
        addr => addr.id === editingAddress.id
      )
      if (updatedAddress && updatedAddress.isMain) {
        setProfileData(prev => ({
          ...prev,
          address: editingAddress.address.trim(),
        }))
      }

      await updateAddress(user.id, editingAddress.id, editingAddress)

      // Show success message within the modal
      setShowSuccessMessage(true)

      // Close the modal after a delay
      setTimeout(() => {
        setIsEditAddressModalOpen(false)
        setEditingAddress({
          id: null,
          address: "",
          city: "",
          country: "",
          mobile_no: "",
        })
        setShowSuccessMessage(false)
      }, 1500)
    }
  }

  const validateEditForm = () => {
    let isValid = true
    const errors = {
      address: "",
      city: "",
      country: "",
      mobile: "",
    }

    if (!editingAddress.address.trim()) {
      errors.address = "Address is required"
      isValid = false
    }

    if (!editingAddress.city.trim()) {
      errors.city = "City is required"
      isValid = false
    }

    if (!editingAddress.country.trim()) {
      errors.country = "Country is required"
      isValid = false
    }

    if (!editingAddress.mobile_no.trim()) {
      errors.mobile = "Mobile number is required"
      isValid = false
    } else if (!/^\d{10}$/.test(editingAddress.mobile_no.trim())) {
      errors.mobile = "Mobile number must be exactly 10 digits"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSetMainAddress = id => {
    setAddresses(prevAddresses =>
      prevAddresses.map(addr => ({
        ...addr,
        isMain: addr.id === id,
      }))
    )
    // Update the main profile address
    const mainAddress = addresses.find(addr => addr.id === id)
    if (mainAddress) {
      setProfileData(prev => ({
        ...prev,
        address: mainAddress.address,
      }))
      setUpdatedProfile(prev => ({
        ...prev,
        address: mainAddress.address,
      }))
    }
  }

  const validateProfileForm = () => {
    let isValid = true
    const errors = {
      name: "",
      mobile_no: "",
      email: "",
      address: "",
      birthday: "",
      // password: "",
    }

    // Name validation
    if (!updatedProfile.full_name.trim()) {
      errors.name = "Name is required"
      isValid = false
    }

    // Contact number validation
    if (!updatedProfile.mobile_no.trim()) {
      errors.mobile_no = "Contact number is required"
      isValid = false
    } else if (!/^\d{10}$/.test(updatedProfile.mobile_no.trim())) {
      errors.mobile_no = "Mobile number must be 10 digits"
      isValid = false
    }

    // Email validation
    if (!updatedProfile.email.trim()) {
      errors.email = "Email is required"
      isValid = false
    } else if (!updatedProfile.email.includes("@")) {
      errors.email = "@ is missing in email"
      isValid = false
    }

    // Address validation
    if (!updatedProfile.address.trim()) {
      errors.address = "Address is required"
      isValid = false
    }

    // Date of birth validation
    if (!updatedProfile.birthday.trim()) {
      errors.birthday = "Date of birth is required"
      isValid = false
    }

    // Password validation
    if (
      updatedProfile.password &&
      updatedProfile.password.trim().length > 0 &&
      updatedProfile.password.trim().length < 6
    ) {
      errors.password = "Password must be at least 6 characters"
      isValid = false
    }

    setProfileErrors(errors)
    return isValid
  }

  const handleEditProfile = () => {
    setUpdatedProfile({
      full_name: profileData.full_name,
      mobile_no: profileData.mobile_no,
      email: profileData.email,
      address:
        addresses.find(addr => addr.isMain)?.address || profileData.address,
      city: addresses.find(addr => addr.isMain)?.city,
      country: addresses.find(addr => addr.isMain)?.country,
      birthday: profileData.birthday,
    })
    setIsEditProfileOpen(true)
    setShowSuccessMessage(false)
  }

  const handleProfileUpdate = async () => {
    if (validateProfileForm()) {
      const profileToUpdate = {
        ...updatedProfile,
        // Ensure the date doesn't get shifted when sending to backend
        birthday: updatedProfile.birthday.includes("T")
          ? updatedProfile.birthday
          : updatedProfile.birthday + "T00:00:00",
      }
      if (!updatedProfile.password || updatedProfile.password.trim() === "") {
        // Remove password from the object if it's empty
        delete profileToUpdate.password
      }
      // Update the main address in the addresses list
      if (profileData.address) {
        setAddresses(prevAddresses =>
          prevAddresses.map(addr =>
            addr.isMain ? { ...addr, address: profileData.address } : addr
          )
        )
      }
      try {
        await updateCustomerDetails(user.id, profileToUpdate)
        setProfileData({
          ...profileData,
          full_name: updatedProfile.full_name,
          mobile_no: updatedProfile.mobile_no,
          email: updatedProfile.email,
          address: updatedProfile.address,
          birthday: profileToUpdate.birthday,
        })
        // Show success message
        setShowProfileSuccessMessage(true)

        // Close the modal after a delay
        setTimeout(() => {
          setIsEditProfileOpen(false)
          setShowProfileSuccessMessage(false)
        }, 1500)
      } catch (error) {
        console.error("Failed to update profile:", error)
      }
    }
  }

  const handleProfileInputChange = e => {
    const { name, value } = e.target
    setUpdatedProfile(prev => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (profileErrors[name]) {
      setProfileErrors(prev => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleInputChange = (field, value) => {
    setNewAddressDetails(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <div className="flex-1 px-4 py-6 mt-[60px]">
        <div className="flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto">
          {/* Left Column - Profile */}
          <div className="space-y-6 lg:w-1/4">
            {/* Profile Card */}
            <div className="max-w-sm p-6 mb-6 bg-white rounded-lg shadow-md">
              <div className="flex items-start mb-6">
                <div className="flex items-center">
                  <div className="relative">
                    <AccountCircleIcon
                      className="text-gray-400"
                      style={{ fontSize: "52px" }}
                    />
                  </div>
                  <div className="ml-4">
                    <h1 className="text-xl font-medium text-gray-800">
                      {profileData.full_name}
                    </h1>
                    <p className="mb-2 text-sm text-gray-500">#CG1234</p>
                    <button
                      className="flex items-center justify-center bg-[#5CAF90] hover:bg-[#1D372E] hover:opacity-80 hover:scale-105 hover:shadow-lg transform transition-all duration-300 text-white rounded-full w-[94px] h-[35.46px] text-sm"
                      onClick={handleEditProfile}
                    >
                      <EditIcon className="w-3 h-3" />
                      <span className="ml-1">Edit</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Information and Address */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#D1D1D1] flex items-center justify-center mr-2">
                    <PhoneIcon
                      className="text-gray-500"
                      style={{ fontSize: "20px" }}
                    />
                  </div>
                  <span className="w-24 text-gray-600">Contact No</span>
                  <span className="text-gray-800">{profileData.mobile_no}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#D1D1D1] flex items-center justify-center mr-2">
                    <EmailIcon
                      className="text-gray-500"
                      style={{ fontSize: "20px" }}
                    />
                  </div>
                  <span className="mr-5 text-gray-600">Email</span>
                  <span className="text-gray-800">{profileData.email}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#D1D1D1] flex items-center justify-center mr-2">
                    <CakeIcon
                      className="text-gray-500"
                      style={{ fontSize: "20px" }}
                    />
                  </div>
                  <span className="w-24 text-gray-600">Birthday</span>
                  <span className="text-gray-800">
                    {profileData.birthday
                      ? profileData.birthday.split("T")[0]
                      : ""}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#D1D1D1] flex items-center justify-center mr-2">
                    <LocationOnIcon
                      className="text-gray-500"
                      style={{ fontSize: "20px" }}
                    />
                  </div>
                  <span className="w-24 text-gray-600">Address</span>
                  <div className="flex-1">
                    <span className="text-gray-800 whitespace-pre-line">
                      {(() => {
                        const mainAddress =
                          addresses.find(addr => addr.isMain)?.address ||
                          profileData.address
                        const parts = mainAddress
                          .split(/[.,/]/)
                          .map(part => part.trim())
                          .filter(part => part)

                        // If we have more than 2 parts, combine all but the first into the second line
                        if (parts.length > 2) {
                          return (
                            <>
                              {parts[0]}
                              {"\n"}
                              {parts.slice(1).join(", ")}
                            </>
                          )
                        } else if (parts.length === 2) {
                          return (
                            <>
                              {parts[0]}
                              {"\n"}
                              {parts[1]}
                            </>
                          )
                        } else {
                          // If we only have one part, display it on one line
                          return parts[0]
                        }
                      })()}
                    </span>
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    className="flex items-center group"
                    onClick={() => setIsAddAddressModalOpen(true)}
                  >
                    <AddCircleIcon
                      className="text-[#5CAF90] group-hover:text-[#1D372E] group-hover:scale-110 transition-all duration-300"
                      style={{ fontSize: "38px" }}
                    />
                    <span className="ml-1 text-black group-hover:text-[#1D372E] group-hover:font-medium transition-all duration-300">
                      Add Address
                    </span>
                  </button>
                </div>
                <div className="mt-4 space-y-2">
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      className="flex items-start p-3 space-x-2 transition-all duration-300 rounded bg-gray-50 hover:bg-gray-100"
                    >
                      <input
                        type="radio"
                        name="mainAddress"
                        checked={addr.isMain}
                        onChange={() => handleSetMainAddress(addr.id)}
                        className="mt-1 text-[#5CAF90] focus:ring-[#5CAF90]"
                      />
                      <div className="flex-grow">
                        <p className="text-gray-800">{addr.address}</p>
                        <p className="text-sm text-gray-600">
                          {addr.city}, {addr.country}
                        </p>
                        <p className="text-sm text-gray-600">
                          Mobile: {addr.mobile_no}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditAddress(addr.id)}
                          className="text-gray-500 hover:text-[#5CAF90] hover:scale-110 transition-all duration-300"
                        >
                          <EditIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-gray-500 transition-all duration-300 hover:text-red-500 hover:scale-110"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Current Orders and Order History */}
          <div className="space-y-8 lg:w-3/4">
            <CurrentOrders />
            <OrderHistory />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-medium">Edit Profile data</h2>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="text-gray-500 transition-all duration-300 hover:text-gray-700 hover:scale-110"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="space-y-4">
              {showProfileSuccessMessage ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <CheckCircleIcon className="text-[#5CAF90] text-5xl mb-3" />
                  <p className="text-lg font-medium text-gray-800">
                    Profile Successfully Updated
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={updatedProfile.full_name}
                      onChange={handleProfileInputChange}
                      className={`w-full p-3 border ${
                        profileErrors.name
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]`}
                    />
                    {profileErrors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {profileErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Contact No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobile_no"
                      value={updatedProfile.mobile_no}
                      onChange={handleProfileInputChange}
                      className={`w-full p-3 border ${
                        profileErrors.mobile_no
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]`}
                      maxLength="10"
                      pattern="\d{10}"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Mobile number must be 10 digits
                    </p>
                    {profileErrors.mobile_no && (
                      <p className="mt-1 text-sm text-red-500">
                        {profileErrors.mobile_no}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={updatedProfile.email}
                      onChange={handleProfileInputChange}
                      className={`w-full p-3 border ${
                        profileErrors.email
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]`}
                    />
                    {profileErrors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {profileErrors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={updatedProfile.address}
                      onChange={handleProfileInputChange}
                      className={`w-full p-3 border ${
                        profileErrors.address
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]`}
                    />
                    {profileErrors.address && (
                      <p className="mt-1 text-sm text-red-500">
                        {profileErrors.address}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Date of birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="birthday"
                      value={
                        updatedProfile.birthday
                          ? updatedProfile.birthday.split("T")[0]
                          : ""
                      }
                      onChange={handleProfileInputChange}
                      className={`w-full p-3 border ${
                        profileErrors.birthday
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]`}
                    />
                    {profileErrors.birthday && (
                      <p className="mt-1 text-sm text-red-500">
                        {profileErrors.birthday}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Change Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={updatedProfile.password}
                      onChange={handleProfileInputChange}
                      className={`w-full p-3 border ${
                        profileErrors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]`}
                    />
                    {profileErrors.password && (
                      <p className="mt-1 text-sm text-red-500">
                        {profileErrors.password}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-center mt-6 space-x-4">
                    <button
                      onClick={() => setIsEditProfileOpen(false)}
                      className="w-[168px] h-[43.14px] border-2 border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:scale-105 hover:shadow-md transform transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleProfileUpdate}
                      className="w-[168px] h-[43.14px] bg-[#5CAF90] text-white rounded-full hover:bg-[#1D372E] hover:opacity-80 hover:scale-105 hover:shadow-lg transform transition-all duration-300"
                    >
                      Update
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {isAddAddressModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Add New Address
              </h3>
              <button
                onClick={() => setIsAddAddressModalOpen(false)}
                className="text-gray-500 transition-all duration-300 hover:text-gray-700 hover:scale-110"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="space-y-4">
              {showAddSuccessMessage ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <CheckCircleIcon className="text-[#5CAF90] text-5xl mb-3" />
                  <p className="text-lg font-medium text-gray-800">
                    Address Successfully Added
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="newAddress"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="newAddress"
                      value={newAddressDetails.address}
                      onChange={e =>
                        handleInputChange("address", e.target.value)
                      }
                      className={`w-full px-3 py-2 border ${
                        formErrors.address
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                      rows="3"
                      placeholder="Enter your street address"
                    />
                    {formErrors.address && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.address}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="newCity"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="newCity"
                      value={newAddressDetails.city}
                      onChange={e => handleInputChange("city", e.target.value)}
                      className={`w-full px-3 py-2 border ${
                        formErrors.city ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                      placeholder="Enter your city"
                    />
                    {formErrors.city && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="newCountry"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="newCountry"
                      value={newAddressDetails.country}
                      onChange={e =>
                        handleInputChange("country", e.target.value)
                      }
                      className={`w-full px-3 py-2 border ${
                        formErrors.country
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                      placeholder="Enter your country"
                    />
                    {formErrors.country && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.country}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="newMobile"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mobile No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="newMobile"
                      value={newAddressDetails.mobile_no}
                      onChange={e =>
                        handleInputChange("mobile_no", e.target.value)
                      }
                      className={`w-full px-3 py-2 border ${
                        formErrors.mobile ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                      placeholder="Enter your mobile number"
                      maxLength="10"
                      pattern="\d{10}"
                    />
                    <p className="text-xs text-gray-500">
                      Mobile number must be 10 digits
                    </p>
                    {formErrors.mobile && (
                      <p className="text-sm text-red-500">
                        {formErrors.mobile}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end mt-6 space-x-3">
                    <button
                      onClick={() => setIsAddAddressModalOpen(false)}
                      className="px-4 py-2 text-gray-700 transition-all duration-300 rounded-md hover:text-gray-900 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAddress}
                      className="px-4 py-2 bg-[#5CAF90] text-white rounded-md hover:bg-[#1D372E] hover:opacity-80 hover:scale-105 hover:shadow-lg transform transition-all duration-300"
                    >
                      Add
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {isEditAddressModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Edit Address
              </h3>
              <button
                onClick={() => setIsEditAddressModalOpen(false)}
                className="text-gray-500 transition-all duration-300 hover:text-gray-700 hover:scale-110"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="space-y-4">
              {showSuccessMessage ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <CheckCircleIcon className="text-[#5CAF90] text-5xl mb-3" />
                  <p className="text-lg font-medium text-gray-800">
                    Address Successfully Updated
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="editAddress"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="editAddress"
                      value={editingAddress.address}
                      onChange={e =>
                        setEditingAddress(prev => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border ${
                        formErrors.address
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                      rows="3"
                      placeholder="Enter your address"
                    />
                    {formErrors.address && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.address}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="editCity"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="editCity"
                      value={editingAddress.city}
                      onChange={e =>
                        setEditingAddress(prev => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border ${
                        formErrors.city ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                      placeholder="Enter your city"
                    />
                    {formErrors.city && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="editCountry"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="editCountry"
                      value={editingAddress.country}
                      onChange={e =>
                        setEditingAddress(prev => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border ${
                        formErrors.country
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                      placeholder="Enter your country"
                    />
                    {formErrors.country && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.country}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="editMobile"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mobile No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="editMobile"
                      value={editingAddress.mobile_no}
                      onChange={e =>
                        setEditingAddress(prev => ({
                          ...prev,
                          mobile_no: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border ${
                        formErrors.mobile ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                      placeholder="Enter your mobile number"
                      maxLength="10"
                      pattern="\d{10}"
                    />
                    <p className="text-xs text-gray-500">
                      Mobile number must be 10 digits
                    </p>
                    {formErrors.mobile && (
                      <p className="text-sm text-red-500">
                        {formErrors.mobile}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end mt-6 space-x-3">
                    <button
                      onClick={() => setIsEditAddressModalOpen(false)}
                      className="px-4 py-2 text-gray-700 transition-all duration-300 rounded-md hover:text-gray-900 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateAddress}
                      className="px-4 py-2 bg-[#5CAF90] text-white rounded-md hover:bg-[#1D372E] hover:opacity-80 hover:scale-105 hover:shadow-lg transform transition-all duration-300"
                    >
                      Update
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Confirm Delete
              </h3>
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="text-gray-500 transition-all duration-300 hover:text-gray-700 hover:scale-110"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to delete this address? This action cannot
                be undone.
              </p>
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2 text-gray-700 transition-all duration-300 rounded-md hover:text-gray-900 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAddress}
                  className="px-4 py-2 text-white transition-all duration-300 transform bg-red-500 rounded-md hover:bg-red-600 hover:opacity-80 hover:scale-105 hover:shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
