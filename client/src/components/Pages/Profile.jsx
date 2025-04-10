import React from 'react';
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

const Profile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false);
    const [isAddAddressModalOpen, setIsAddAddressModalOpen] = React.useState(false);
    const [isEditAddressModalOpen, setIsEditAddressModalOpen] = React.useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
    const [showAddSuccessMessage, setShowAddSuccessMessage] = React.useState(false);
    const [showProfileSuccessMessage, setShowProfileSuccessMessage] = React.useState(false);
    const [newAddress, setNewAddress] = React.useState('');
    const [editingAddress, setEditingAddress] = React.useState({ id: null, address: '' });
    const [addressToDelete, setAddressToDelete] = React.useState(null);
    const [addresses, setAddresses] = React.useState([
        { id: 1, address: '104/piliyandala.boralasgomuwa', isMain: true }
    ]);
    const [profileData, setProfileData] = React.useState({
        name: 'Sarah Jasmine',
        contactNo: '07032219923',
        email: 'sarah@gmail.com',
        address: '104/piliyandala.boralasgomuwa',
        dateOfBirth: '2024/08/09',
        password: '************************'
    });

    const handleAddAddress = () => {
        if (newAddress.trim()) {
            const newId = Math.max(...addresses.map(a => a.id), 0) + 1;
            setAddresses(prevAddresses => [...prevAddresses, { id: newId, address: newAddress.trim(), isMain: false }]);
            setNewAddress('');

            // Show success message
            setShowAddSuccessMessage(true);

            // Close the modal after a delay
            setTimeout(() => {
                setIsAddAddressModalOpen(false);
                setShowAddSuccessMessage(false);
            }, 1500);
        }
    };

    const handleEditAddress = (id, address) => {
        setEditingAddress({ id, address });
        setIsEditAddressModalOpen(true);
        setShowSuccessMessage(false);
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
        if (editingAddress.address.trim()) {
            setAddresses(prevAddresses =>
                prevAddresses.map(addr =>
                    addr.id === editingAddress.id
                        ? { ...addr, address: editingAddress.address.trim() }
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
                setEditingAddress({ id: null, address: '' });
                setShowSuccessMessage(false);
            }, 1500);
        }
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

    const handleProfileUpdate = () => {
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
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
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
                                    <span className="w-20 mr-2 text-gray-600">Address</span>
                                    <span className="text-gray-800 pr-4 whitespace-pre-line pl-0">
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
                                        <div key={addr.id} className="flex items-center space-x-2 bg-gray-50 p-3 rounded hover:bg-gray-100 transition-all duration-300">
                                            <input
                                                type="radio"
                                                name="mainAddress"
                                                checked={addr.isMain}
                                                onChange={() => handleSetMainAddress(addr.id)}
                                                className="text-[#5CAF90] focus:ring-[#5CAF90]"
                                            />
                                            <span className="text-gray-800 whitespace-pre-line flex-grow">
                                                {addr.address.split(/[.,/]/).map((part, index, array) => (
                                                    <React.Fragment key={index}>
                                                        {part.trim()}
                                                        {index < array.length - 1 && '\n'}
                                                    </React.Fragment>
                                                ))}
                                            </span>
                                            <button
                                                onClick={() => handleEditAddress(addr.id, addr.address)}
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
                                        <label className="block text-gray-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Contact No</label>
                                        <input
                                            type="text"
                                            name="contactNo"
                                            value={profileData.contactNo}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]"
                                        />
                                    </div>
                                    <div>
                                            <label className="block text-gray-700 mb-2">Email</label> {/* Added email input */}
                                            <input
                                                type="email"
                                                name="email"
                                                value={profileData.email}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]"
                                            />
                                        </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={profileData.address}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Date of birth</label>
                                        <input
                                            type="text"
                                            name="dateOfBirth"
                                            value={profileData.dateOfBirth}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Change Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={profileData.password}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]"
                                        />
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
                                            Address
                                        </label>
                                        <textarea
                                            id="newAddress"
                                            value={newAddress}
                                            onChange={(e) => setNewAddress(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent"
                                            rows="3"
                                            placeholder="Enter your address"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-3">
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
                                            Address
                                        </label>
                                        <textarea
                                            id="editAddress"
                                            value={editingAddress.address}
                                            onChange={(e) => setEditingAddress(prev => ({ ...prev, address: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B2E83] focus:border-transparent"
                                            rows="3"
                                            placeholder="Enter your address"
                                        />
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