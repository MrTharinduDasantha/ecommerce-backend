import React, { useContext, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import CurrentOrders from '../CurrentOrders';
import OrderHistory from '../OrderHistory';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false);
    const [isAddAddressModalOpen, setIsAddAddressModalOpen] = React.useState(false);
    const [isEditAddressModalOpen, setIsEditAddressModalOpen] = React.useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
    const [showAddSuccessMessage, setShowAddSuccessMessage] = React.useState(false);
    const [showProfileSuccessMessage, setShowProfileSuccessMessage] = React.useState(false);
    const [newAddress, setNewAddress] = React.useState('');
    const [newAddressDetails, setNewAddressDetails] = React.useState({
        address: '',
        city: '',
        country: '',
        mobile: ''
    });
    const [formErrors, setFormErrors] = React.useState({
        address: '',
        city: '',
        country: '',
        mobile: ''
    });
    const [editingAddress, setEditingAddress] = React.useState({ 
        id: null, 
        address: '',
        city: '',
        country: '',
        mobile: ''
    });
    const [addressToDelete, setAddressToDelete] = React.useState(null);
    const [addresses, setAddresses] = React.useState([
        { 
            id: 1, 
            address: '104/piliyandala.boralasgomuwa', 
            city: 'Colombo',
            country: 'Sri Lanka',
            mobile: '0701234567',
            isMain: true 
        }
    ]);
    const [profileData, setProfileData] = React.useState({
        name: '',
        contactNo: '',
        email: '',
        address: '104/piliyandala.boralasgomuwa',
        dateOfBirth: '2024/08/09',
        password: '************************'
    });

    useEffect(() => {
        if (user) {
            setProfileData(prevData => ({
                ...prevData,
                name: user.name || '',
                email: user.email || '',
            }));
        }
    }, [user]);

    const [profileErrors, setProfileErrors] = React.useState({
        name: '',
        contactNo: '',
        email: '',
        address: '',
        dateOfBirth: '',
        password: ''
    });

    const validateForm = () => {
        let isValid = true;
        const errors = {
            address: '',
            city: '',
            country: '',
            mobile: ''
        };

        if (!newAddressDetails.address.trim()) {
            errors.address = 'Address is required';
            isValid = false;
        }

        if (!newAddressDetails.city.trim()) {
            errors.city = 'City is required';
            isValid = false;
        }

        if (!newAddressDetails.country.trim()) {
            errors.country = 'Country is required';
            isValid = false;
        }

        if (!newAddressDetails.mobile.trim()) {
            errors.mobile = 'Mobile number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(newAddressDetails.mobile.trim())) {
            errors.mobile = 'Mobile number must be exactly 10 digits';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleAddAddress = () => {
        if (validateForm()) {
            const newId = Math.max(...addresses.map(a => a.id), 0) + 1;
            const formattedAddress = `${newAddressDetails.address.trim()}, ${newAddressDetails.city.trim()}, ${newAddressDetails.country.trim()}`;
            setAddresses(prevAddresses => [...prevAddresses, { 
                id: newId, 
                address: formattedAddress,
                city: newAddressDetails.city.trim(),
                country: newAddressDetails.country.trim(),
                mobile: newAddressDetails.mobile.trim(),
                isMain: false 
            }]);
            setNewAddressDetails({
                address: '',
                city: '',
                country: '',
                mobile: ''
            });
            setFormErrors({
                address: '',
                city: '',
                country: '',
                mobile: ''
            });

            // Show success message
            setShowAddSuccessMessage(true);

            // Close the modal after a delay
            setTimeout(() => {
                setIsAddAddressModalOpen(false);
                setShowAddSuccessMessage(false);
            }, 1500);
        }
    };

    const handleEditAddress = (id) => {
        const addressToEdit = addresses.find(addr => addr.id === id);
        if (addressToEdit) {
            setEditingAddress({
                id: addressToEdit.id,
                address: addressToEdit.address,
                city: addressToEdit.city,
                country: addressToEdit.country,
                mobile: addressToEdit.mobile
            });
            setIsEditAddressModalOpen(true);
            setShowSuccessMessage(false);
        }
    };

    const handleDeleteAddress = (id) => {
        setAddressToDelete(id);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeleteAddress = () => {
        if (addressToDelete) {
            const addressToRemove = addresses.find(addr => addr.id === addressToDelete);
            const isMainAddress = addressToRemove?.isMain;

            // Remove the address
            setAddresses(prevAddresses => prevAddresses.filter(addr => addr.id !== addressToDelete));

            // If we deleted the main address and there are other addresses, set the first one as main
            if (isMainAddress && addresses.length > 1) {
                const newMainAddress = addresses.find(addr => addr.id !== addressToDelete);
                if (newMainAddress) {
                    setAddresses(prevAddresses =>
                        prevAddresses.map(addr => ({
                            ...addr,
                            isMain: addr.id === newMainAddress.id
                        }))
                    );

                    // Update profile data with the new main address
                    setProfileData(prev => ({
                        ...prev,
                        address: newMainAddress.address
                    }));
                }
            }

            setIsDeleteConfirmOpen(false);
            setAddressToDelete(null);
        }
    };

    const handleUpdateAddress = () => {
        if (validateEditForm()) {
            setAddresses(prevAddresses =>
                prevAddresses.map(addr =>
                    addr.id === editingAddress.id
                        ? { 
                            ...addr, 
                            address: editingAddress.address.trim(),
                            city: editingAddress.city.trim(),
                            country: editingAddress.country.trim(),
                            mobile: editingAddress.mobile.trim()
                        }
                        : addr
                )
            );

            // If the edited address is the main address, update the profile data
            const updatedAddress = addresses.find(addr => addr.id === editingAddress.id);
            if (updatedAddress && updatedAddress.isMain) {
                setProfileData(prev => ({
                    ...prev,
                    address: editingAddress.address.trim()
                }));
            }

            // Show success message within the modal
            setShowSuccessMessage(true);

            // Close the modal after a delay
            setTimeout(() => {
                setIsEditAddressModalOpen(false);
                setEditingAddress({ id: null, address: '', city: '', country: '', mobile: '' });
                setShowSuccessMessage(false);
            }, 1500);
        }
    };

    const validateEditForm = () => {
        let isValid = true;
        const errors = {
            address: '',
            city: '',
            country: '',
            mobile: ''
        };

        if (!editingAddress.address.trim()) {
            errors.address = 'Address is required';
            isValid = false;
        }

        if (!editingAddress.city.trim()) {
            errors.city = 'City is required';
            isValid = false;
        }

        if (!editingAddress.country.trim()) {
            errors.country = 'Country is required';
            isValid = false;
        }

        if (!editingAddress.mobile.trim()) {
            errors.mobile = 'Mobile number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(editingAddress.mobile.trim())) {
            errors.mobile = 'Mobile number must be exactly 10 digits';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSetMainAddress = (id) => {
        setAddresses(prevAddresses =>
            prevAddresses.map(addr => ({
                ...addr,
                isMain: addr.id === id
            }))
        );
        // Update the main profile address
        const mainAddress = addresses.find(addr => addr.id === id);
        if (mainAddress) {
            setProfileData(prev => ({
                ...prev,
                address: mainAddress.address
            }));
        }
    };

    const validateProfileForm = () => {
        let isValid = true;
        const errors = {
            name: '',
            contactNo: '',
            email: '',
            address: '',
            dateOfBirth: '',
            password: ''
        };

        // Name validation
        if (!profileData.name.trim()) {
            errors.name = 'Name is required';
            isValid = false;
        }

        // Contact number validation
        if (!profileData.contactNo.trim()) {
            errors.contactNo = 'Contact number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(profileData.contactNo.trim())) {
            errors.contactNo = 'Mobile number must be 10 digits';
            isValid = false;
        }

        // Email validation
        if (!profileData.email.trim()) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!profileData.email.includes('@')) {
            errors.email = '@ is missing in email';
            isValid = false;
        }

        // Address validation
        if (!profileData.address.trim()) {
            errors.address = 'Address is required';
            isValid = false;
        }

        // Date of birth validation
        if (!profileData.dateOfBirth.trim()) {
            errors.dateOfBirth = 'Date of birth is required';
            isValid = false;
        }

        // Password validation
        if (!profileData.password.trim()) {
            errors.password = 'Password is required';
            isValid = false;
        }

        setProfileErrors(errors);
        return isValid;
    };

    const handleProfileUpdate = () => {
        if (validateProfileForm()) {
            // Update the main address in the addresses list
            if (profileData.address) {
                setAddresses(prevAddresses =>
                    prevAddresses.map(addr =>
                        addr.isMain
                            ? { ...addr, address: profileData.address }
                            : addr
                    )
                );
            }

            // Show success message
            setShowProfileSuccessMessage(true);

            // Close the modal after a delay
            setTimeout(() => {
                setIsEditProfileOpen(false);
                setShowProfileSuccessMessage(false);
            }, 1500);
        }
    };

    const handleProfileInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (profileErrors[name]) {
            setProfileErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleInputChange = (field, value) => {
        setNewAddressDetails(prev => ({...prev, [field]: value}));
        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({...prev, [field]: ''}));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 w-full flex flex-col">
            <div className="flex-1 px-4 py-6 mt-[60px]">
                <div className="flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto">
                    {/* Left Column - Profile */}
                    <div className="lg:w-1/4 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-w-sm">
                            <div className="flex items-start mb-6">
                                <div className="flex items-center">
                                    <div className="relative">
                                        <AccountCircleIcon className="text-gray-400" style={{ fontSize: '52px' }} />
                                    </div>
                                    <div className="ml-4">
                                        <h1 className="text-xl font-medium text-gray-800">{profileData.name}</h1>
                                        <p className="text-sm text-gray-500 mb-2">#CG1234</p>
                                        <button
                                            className="flex items-center justify-center bg-[#5CAF90] hover:bg-[#1D372E] hover:opacity-80 hover:scale-105 hover:shadow-lg transform transition-all duration-300 text-white rounded-full w-[94px] h-[35.46px] text-sm"
                                            onClick={() => setIsEditProfileOpen(true)}
                                        >
                                            <EditIcon className="h-3 w-3" />
                                            <span className="ml-1">Edit</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information and Address */}
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-[40px] h-[40px] rounded-full bg-[#D1D1D1] flex items-center justify-center mr-2">
                                        <PhoneIcon className="text-gray-500" style={{ fontSize: '20px' }} />
                                    </div>
                                    <span className="w-24 text-gray-600">Contact No</span>
                                    <span className="text-gray-800">{profileData.contactNo}</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-[40px] h-[40px] rounded-full bg-[#D1D1D1] flex items-center justify-center mr-2">
                                        <EmailIcon className="text-gray-500" style={{ fontSize: '20px' }} />
                                    </div>
                                    <span className="w-24 text-gray-600">Email</span>
                                    <span className="text-gray-800">{profileData.email}</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-[40px] h-[40px] rounded-full bg-[#D1D1D1] flex items-center justify-center mr-2">
                                        <CakeIcon className="text-gray-500" style={{ fontSize: '20px' }} />
                                    </div>
                                    <span className="w-24 text-gray-600">Birthday</span>
                                    <span className="text-gray-800">{profileData.dateOfBirth}</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-[40px] h-[40px] rounded-full bg-[#D1D1D1] flex items-center justify-center mr-2">
                                        <LocationOnIcon className="text-gray-500" style={{ fontSize: '20px' }} />
                                    </div>
                                    <span className="w-24 text-gray-600">Address</span>
                                    <div className="flex-1">
                                        <span className="text-gray-800 whitespace-pre-line">
                                            {(() => {
                                                const mainAddress = addresses.find(addr => addr.isMain)?.address || profileData.address;
                                                const parts = mainAddress.split(/[.,/]/).map(part => part.trim()).filter(part => part);

                                                // If we have more than 2 parts, combine all but the first into the second line
                                                if (parts.length > 2) {
                                                    return (
                                                        <>
                                                            {parts[0]}
                                                            {'\n'}
                                                            {parts.slice(1).join(', ')}
                                                        </>
                                                    );
                                                } else if (parts.length === 2) {
                                                    return (
                                                        <>
                                                            {parts[0]}
                                                            {'\n'}
                                                            {parts[1]}
                                                        </>
                                                    );
                                                } else {
                                                    // If we only have one part, display it on one line
                                                    return parts[0];
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
                                        <AddCircleIcon className="text-[#5CAF90] group-hover:text-[#1D372E] group-hover:scale-110 transition-all duration-300" style={{ fontSize: '38px' }} />
                                        <span className="ml-1 text-black group-hover:text-[#1D372E] group-hover:font-medium transition-all duration-300">Add Address</span>
                                    </button>
                                </div>
                                <div className="space-y-2 mt-4">
                                    {addresses.map((addr) => (
                                        <div key={addr.id} className="flex items-start space-x-2 bg-gray-50 p-3 rounded hover:bg-gray-100 transition-all duration-300">
                                            <input
                                                type="radio"
                                                name="mainAddress"
                                                checked={addr.isMain}
                                                onChange={() => handleSetMainAddress(addr.id)}
                                                className="mt-1 text-[#5CAF90] focus:ring-[#5CAF90]"
                                            />
                                            <div className="flex-grow">
                                                <p className="text-gray-800">{addr.address}</p>
                                                <p className="text-gray-600 text-sm">{addr.city}, {addr.country}</p>
                                                <p className="text-gray-600 text-sm">Mobile: {addr.mobile}</p>
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
                                                    className="text-gray-500 hover:text-red-500 hover:scale-110 transition-all duration-300"
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
                    <div className="lg:w-3/4 space-y-8">
                        <CurrentOrders />
                        <OrderHistory />
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditProfileOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-medium">Edit Profile data</h2>
                            <button
                                onClick={() => setIsEditProfileOpen(false)}
                                className="text-gray-500 hover:text-gray-700 hover:scale-110 transition-all duration-300"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {showProfileSuccessMessage ? (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <CheckCircleIcon className="text-[#5CAF90] text-5xl mb-3" />
                                    <p className="text-gray-800 font-medium text-lg">Profile Successfully Updated</p>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleProfileInputChange}
                                            className={`w-full p-3 border ${profileErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]`}
                                        />
                                        {profileErrors.name && (
                                            <p className="text-red-500 text-sm mt-1">{profileErrors.name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contact No <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="contactNo"
                                            value={profileData.contactNo}
                                            onChange={handleProfileInputChange}
                                            className={`w-full p-3 border ${profileErrors.contactNo ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]`}
                                            maxLength="10"
                                            pattern="\d{10}"
                                        />
                                        <p className="text-gray-500 text-xs mt-1">Mobile number must be 10 digits</p>
                                        {profileErrors.contactNo && (
                                            <p className="text-red-500 text-sm mt-1">{profileErrors.contactNo}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleProfileInputChange}
                                            className={`w-full p-3 border ${profileErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]`}
                                        />
                                        {profileErrors.email && (
                                            <p className="text-red-500 text-sm mt-1">{profileErrors.email}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={profileData.address}
                                            onChange={handleProfileInputChange}
                                            className={`w-full p-3 border ${profileErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]`}
                                        />
                                        {profileErrors.address && (
                                            <p className="text-red-500 text-sm mt-1">{profileErrors.address}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date of birth <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="dateOfBirth"
                                            value={profileData.dateOfBirth}
                                            onChange={handleProfileInputChange}
                                            className={`w-full p-3 border ${profileErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]`}
                                        />
                                        {profileErrors.dateOfBirth && (
                                            <p className="text-red-500 text-sm mt-1">{profileErrors.dateOfBirth}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Change Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={profileData.password}
                                            onChange={handleProfileInputChange}
                                            className={`w-full p-3 border ${profileErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]`}
                                        />
                                        {profileErrors.password && (
                                            <p className="text-red-500 text-sm mt-1">{profileErrors.password}</p>
                                        )}
                                    </div>
                                    <div className="flex justify-center space-x-4 mt-6">
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-800">Add New Address</h3>
                            <button
                                onClick={() => setIsAddAddressModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 hover:scale-110 transition-all duration-300"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {showAddSuccessMessage ? (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <CheckCircleIcon className="text-[#5CAF90] text-5xl mb-3" />
                                    <p className="text-gray-800 font-medium text-lg">Address Successfully Added</p>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label htmlFor="newAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                            Address <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="newAddress"
                                            value={newAddressDetails.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            className={`w-full px-3 py-2 border ${formErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                                            rows="3"
                                            placeholder="Enter your street address"
                                        />
                                        {formErrors.address && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="newCity" className="block text-sm font-medium text-gray-700 mb-1">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="newCity"
                                            value={newAddressDetails.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            className={`w-full px-3 py-2 border ${formErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                                            placeholder="Enter your city"
                                        />
                                        {formErrors.city && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="newCountry" className="block text-sm font-medium text-gray-700 mb-1">
                                            Country <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="newCountry"
                                            value={newAddressDetails.country}
                                            onChange={(e) => handleInputChange('country', e.target.value)}
                                            className={`w-full px-3 py-2 border ${formErrors.country ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                                            placeholder="Enter your country"
                                        />
                                        {formErrors.country && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="newMobile" className="block text-sm font-medium text-gray-700">
                                            Mobile No <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            id="newMobile"
                                            value={newAddressDetails.mobile}
                                            onChange={(e) => handleInputChange('mobile', e.target.value)}
                                            className={`w-full px-3 py-2 border ${formErrors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                                            placeholder="Enter your mobile number"
                                            maxLength="10"
                                            pattern="\d{10}"
                                        />
                                        <p className="text-gray-500 text-xs">Mobile number must be 10 digits</p>
                                        {formErrors.mobile && (
                                            <p className="text-red-500 text-sm">{formErrors.mobile}</p>
                                        )}
                                    </div>
                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            onClick={() => setIsAddAddressModalOpen(false)}
                                            className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all duration-300"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-800">Edit Address</h3>
                            <button
                                onClick={() => setIsEditAddressModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 hover:scale-110 transition-all duration-300"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {showSuccessMessage ? (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <CheckCircleIcon className="text-[#5CAF90] text-5xl mb-3" />
                                    <p className="text-gray-800 font-medium text-lg">Address Successfully Updated</p>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label htmlFor="editAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                            Address <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="editAddress"
                                            value={editingAddress.address}
                                            onChange={(e) => setEditingAddress(prev => ({ ...prev, address: e.target.value }))}
                                            className={`w-full px-3 py-2 border ${formErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                                            rows="3"
                                            placeholder="Enter your address"
                                        />
                                        {formErrors.address && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="editCity" className="block text-sm font-medium text-gray-700 mb-1">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="editCity"
                                            value={editingAddress.city}
                                            onChange={(e) => setEditingAddress(prev => ({ ...prev, city: e.target.value }))}
                                            className={`w-full px-3 py-2 border ${formErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                                            placeholder="Enter your city"
                                        />
                                        {formErrors.city && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="editCountry" className="block text-sm font-medium text-gray-700 mb-1">
                                            Country <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="editCountry"
                                            value={editingAddress.country}
                                            onChange={(e) => setEditingAddress(prev => ({ ...prev, country: e.target.value }))}
                                            className={`w-full px-3 py-2 border ${formErrors.country ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                                            placeholder="Enter your country"
                                        />
                                        {formErrors.country && (
                                            <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="editMobile" className="block text-sm font-medium text-gray-700">
                                            Mobile No <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            id="editMobile"
                                            value={editingAddress.mobile}
                                            onChange={(e) => setEditingAddress(prev => ({ ...prev, mobile: e.target.value }))}
                                            className={`w-full px-3 py-2 border ${formErrors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent`}
                                            placeholder="Enter your mobile number"
                                            maxLength="10"
                                            pattern="\d{10}"
                                        />
                                        <p className="text-gray-500 text-xs">Mobile number must be 10 digits</p>
                                        {formErrors.mobile && (
                                            <p className="text-red-500 text-sm">{formErrors.mobile}</p>
                                        )}
                                    </div>
                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            onClick={() => setIsEditAddressModalOpen(false)}
                                            className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all duration-300"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-800">Confirm Delete</h3>
                            <button
                                onClick={() => setIsDeleteConfirmOpen(false)}
                                className="text-gray-500 hover:text-gray-700 hover:scale-110 transition-all duration-300"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <p className="text-gray-700">
                                Are you sure you want to delete this address? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setIsDeleteConfirmOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeleteAddress}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 hover:opacity-80 hover:scale-105 hover:shadow-lg transform transition-all duration-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;