import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CurrentOrders from '../components/CurrentOrders';
import OrderHistory from '../components/OrderHistory';
//Update profile page 
const Profile = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false);
    const [isAddAddressModalOpen, setIsAddAddressModalOpen] = React.useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
    const [showProfileUpdateSuccess, setShowProfileUpdateSuccess] = React.useState(false);
    const [newAddress, setNewAddress] = React.useState('');
    const [isEditAddressModalOpen, setIsEditAddressModalOpen] = React.useState(false);
    const [editingAddress, setEditingAddress] = React.useState(null);
    const [addresses, setAddresses] = React.useState([
        { id: 1, address: '104/piliyandala.boralasgomuwa', isMain: true }
    ]);
    const [profileData, setProfileData] = React.useState({
        name: 'Sarah Jasmine',
        contactNo: '07032219923',
        address: '104/piliyandala.boralasgomuwa',
        dateOfBirth: '2024/08/09',
        password: '************************'
    });

    const handleAddAddress = () => {
        if (newAddress.trim()) {
            const newId = Math.max(...addresses.map(a => a.id), 0) + 1;
            setAddresses(prevAddresses => [...prevAddresses, { id: newId, address: newAddress.trim(), isMain: false }]);
            setNewAddress('');
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
                setIsAddAddressModalOpen(false);
            }, 2000);
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

    const handleDeleteAddress = (id) => {
        setAddresses(prevAddresses => prevAddresses.filter(addr => addr.id !== id));
    };

    const handleProfileUpdate = () => {
        // Handle profile update logic here
        setShowProfileUpdateSuccess(true);
        setTimeout(() => {
            setShowProfileUpdateSuccess(false);
            setIsEditProfileOpen(false);
        }, 2000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setIsEditAddressModalOpen(true);
    };

    const handleUpdateAddress = () => {
        if (editingAddress && editingAddress.address.trim()) {
            setAddresses(prevAddresses => 
                prevAddresses.map(addr => 
                    addr.id === editingAddress.id 
                        ? { ...addr, address: editingAddress.address.trim() }
                        : addr
                )
            );
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
                setIsEditAddressModalOpen(false);
                setEditingAddress(null);
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 w-full flex flex-col">
            <Header />
            <div className="flex-1 px-4 py-8 mt-[20px]">
                <div className="flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto">
                    {/* Left Column - Profile */}
                    <div className="lg:w-1/4 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 max-w-sm mx-auto lg:mx-0">
                            <div className="flex items-start mb-6">
                                <div className="flex items-center">
                                    <div className="relative">
                                        <AccountCircleIcon className="text-gray-400" style={{ fontSize: '52px' }} />
                                    </div>
                                    <div className="ml-4">
                                        <h1 className="text-lg md:text-xl font-medium text-gray-800">{profileData.name}</h1>
                                        <p className="text-sm text-gray-500 mb-2">#CG1234</p>
                                        <button 
                                            className="flex items-center justify-center bg-[#5CAF90] hover:bg-[#1D372E] text-white rounded-full w-[94px] h-[35.46px] text-sm"
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
                                    <span className="text-gray-800">sarah@gmail.com</span>
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
                                    <div className="flex flex-col">
                                        {addresses.find(addr => addr.isMain)?.address.split('.').map((part, index) => (
                                            <span key={index} className="text-gray-800 pr-4">{part.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button 
                                        className="flex items-center group"
                                        onClick={() => setIsAddAddressModalOpen(true)}
                                    >
                                        <AddCircleIcon className="text-[#5CAF90] group-hover:text-[#1D372E]" style={{ fontSize: '38px' }} />
                                        <span className="ml-1 text-black group-hover:text-[#1D372E]">Add Address</span>
                                    </button>
                                </div>
                                <div className="space-y-2 mt-4">
                                    {addresses.map((addr) => (
                                        <div key={addr.id} className="flex items-center justify-between bg-gray-50 p-3 rounded -ml-[15px]">
                                            <div className="flex items-center space-x-2 flex-1">
                                                <input
                                                    type="radio"
                                                    name="mainAddress"
                                                    checked={addr.isMain}
                                                    onChange={() => handleSetMainAddress(addr.id)}
                                                    className="text-[#5CAF90] focus:ring-[#5CAF90]"
                                                />
                                                <span className="text-gray-800 flex-1 text-sm md:text-base">{addr.address}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 ml-4">
                                                <button 
                                                    onClick={() => handleEditAddress(addr)}
                                                    className="text-[#5CAF90] hover:text-[#1D372E]"
                                                >
                                                    <EditIcon className="h-5 w-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteAddress(addr.id)}
                                                    className="text-red-500 hover:text-[#1D372E]"
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Orders */}
                    <div className="lg:w-3/4 space-y-8">
                        <CurrentOrders />
                        <OrderHistory />
                    </div>
                </div>
            </div>
            <Footer />

            {/* Edit Profile Modal */}
            {isEditProfileOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-medium">Edit Profile data</h2>
                            <button 
                                onClick={() => setIsEditProfileOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {showProfileUpdateSuccess && (
                                <div className="flex items-center justify-center text-[#5CAF90] space-x-2 mb-4">
                                    <CheckCircleIcon />
                                    <span>Profile Successfully Updated</span>
                                </div>
                            )}
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
                                    className="w-[168px] h-[43.14px] border-2 border-gray-300 rounded-full text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleProfileUpdate}
                                    className="w-[168px] h-[43.14px] bg-[#5CAF90] text-white rounded-full hover:bg-[#408a6d]"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Address Modal */}
            {isAddAddressModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-medium">Add New Address</h2>
                            <button 
                                onClick={() => setIsAddAddressModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Address</label>
                                <textarea
                                    value={newAddress}
                                    onChange={(e) => setNewAddress(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]"
                                    rows="3"
                                    placeholder="Enter your address"
                                />
                            </div>
                            {showSuccessMessage && (
                                <div className="flex items-center justify-center text-[#5CAF90] space-x-2">
                                    <CheckCircleIcon />
                                    <span>Address Added Successfully</span>
                                </div>
                            )}
                            <div className="flex justify-center space-x-4 mt-6">
                                <button
                                    onClick={() => setIsAddAddressModalOpen(false)}
                                    className="w-[168px] h-[43.14px] border-2 border-gray-300 rounded-full text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddAddress}
                                    className="w-[168px] h-[43.14px] bg-[#5CAF90] text-white rounded-full hover:bg-[#408a6d]"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Address Modal */}
            {isEditAddressModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-medium">Edit Address</h2>
                            <button 
                                onClick={() => {
                                    setIsEditAddressModalOpen(false);
                                    setEditingAddress(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Address</label>
                                <textarea
                                    value={editingAddress?.address || ''}
                                    onChange={(e) => setEditingAddress(prev => ({ ...prev, address: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E83]"
                                    rows="3"
                                    placeholder="Enter your address"
                                />
                            </div>
                            {showSuccessMessage && (
                                <div className="flex items-center justify-center text-[#5CAF90] space-x-2 mb-4">
                                    <CheckCircleIcon />
                                    <span>Address Successfully Updated</span>
                                </div>
                            )}
                            <div className="flex justify-center space-x-4 mt-6">
                                <button
                                    onClick={() => {
                                        setIsEditAddressModalOpen(false);
                                        setEditingAddress(null);
                                    }}
                                    className="w-[168px] h-[43.14px] border-2 border-gray-300 rounded-full text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateAddress}
                                    className="w-[168px] h-[43.14px] bg-[#5CAF90] text-white rounded-full hover:bg-[#408a6d]"
                                >
                                    Update
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