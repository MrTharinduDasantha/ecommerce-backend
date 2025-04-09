import React, { useEffect, useState } from "react";
import { fetchAdminLogs } from "../api/auth"; 
import { FaEye } from 'react-icons/fa';

// Basic modal component
const Modal = ({ isOpen, onClose, details }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-5 max-w-sm w-full">
                <h3 className="text-xl font-bold mb-4">Action Details</h3>
                <pre className="whitespace-pre-wrap break-words">{details}</pre>
                <button
                    onClick={onClose}
                    className="mt-4 bg-[#5CAF90] text-white py-2 px-4 rounded hover:bg-[#4a9277]"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDetails, setModalDetails] = useState("");

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const logData = await fetchAdminLogs();
                setLogs(logData);
            } catch (error) {
                console.error("Error fetching logs:", error);
            }
        };

        fetchLogs();
    }, []);

    const handleViewDetails = (log) => {
        let detailsMessage = `Admin: ${log.Admin_Name || 'N/A'}\nAction: ${log.action}\nTimestamp: ${new Date(log.timestamp).toLocaleString()}`;

        if (log.new_user_info) {
            try {
                const details = JSON.parse(log.new_user_info);
                
                // Format details based on action type
                switch (log.action) {
                    case 'Added new user':
                        detailsMessage += `\n\nNew Admin Details:\n- Name: ${details.full_name || 'N/A'}\n- Email: ${details.email || 'N/A'}\n- Phone: ${details.phone_no || 'N/A'}`;
                        break;
                    case 'Updated customer':
                        detailsMessage += `\n\nCustomer Update:\nOriginal Data:\n- Name: ${details.originalData.name}\n- Email: ${details.originalData.email}\n- Status: ${details.originalData.status}\n\nUpdated To:\n- Name: ${details.updatedData.name}\n- Email: ${details.updatedData.email}\n- Status: ${details.updatedData.status}`;
                        break;
                    case 'Deleted customer':
                        detailsMessage += `\n\nDeleted Customer Details:\n- Name: ${details.customerName}\n- Email: ${details.customerEmail}`;
                        break;
                    default:
                        if (typeof details === 'object') {
                            detailsMessage += '\n\nAdditional Details:';
                            Object.entries(details).forEach(([key, value]) => {
                                detailsMessage += `\n- ${key}: ${value}`;
                            });
                        }
                }
            } catch (e) {
                detailsMessage += `\n\nAdditional Info: ${log.new_user_info}`;
            }
        }

        if (log.device_info) {
            detailsMessage += `\n\nDevice Info: ${log.device_info}`;
        }

        setModalDetails(detailsMessage);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const getActionStyle = (action) => {
        switch (action) {
            case 'Logged In':
                return 'bg-blue-100 text-blue-800';
            case 'Added new user':
                return 'bg-green-100 text-green-800';
            case 'Updated customer':
                return 'bg-yellow-100 text-yellow-800';
            case 'Deleted customer':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-5 ml-5">
                    <h2 className="text-2xl font-bold text-[#1D372E] mb-3 md:mb-4">Admin Logs</h2>
                </div>

                <div className="block w-full overflow-x-auto">
                    <div className="m-4 hidden sm:block">
                        <table className="min-w-full divide-y divide-gray-200 border border-[#1D372E]">
                            <thead className="bg-[#5CAF90] text-[#1D372E]">
                                <tr>
                                    <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">Admin Name</th>
                                    <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">Action</th>
                                    <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">Timestamp</th>
                                    <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">Device Info</th>
                                    <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">Details</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white text-[#1D372E] divide-y divide-gray-200">
                                {logs.map((log) => (
                                    <tr key={log.log_id} className="hover:bg-gray-50">
                                        <td className="p-3 whitespace-nowrap border-2 border-[#1D372E] text-center">
                                            {log.Admin_Name || 'N/A'}
                                        </td>
                                        <td className="p-3 whitespace-nowrap border-2 border-[#1D372E] text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs ${getActionStyle(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="p-3 whitespace-nowrap border-2 border-[#1D372E] text-center">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="p-3 whitespace-nowrap border-2 border-[#1D372E] text-center">
                                            {log.device_info}
                                        </td>
                                        <td className="p-3 whitespace-nowrap border-2 border-[#1D372E] text-center">
                                            <button 
                                                onClick={() => handleViewDetails(log)} 
                                                className="text-[#5CAF90] hover:text-[#4a9277]"
                                            >
                                                <FaEye />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile view */}
                    <div className="sm:hidden space-y-4">
                        {logs.map((log) => (
                            <div key={log.log_id} className="bg-white p-4 border rounded-lg shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-sm font-medium text-gray-900">
                                        {log.Admin_Name || 'N/A'}
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs ${getActionStyle(log.action)}`}>
                                        {log.action}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 mb-2">
                                    {new Date(log.timestamp).toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500 mb-3">
                                    {log.device_info}
                                </div>
                                <button 
                                    onClick={() => handleViewDetails(log)}
                                    className="text-[#5CAF90] hover:text-[#4a9277] flex items-center"
                                >
                                    <FaEye className="mr-1" /> View Details
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} details={modalDetails} />
        </div>
    );
};

export default AdminLogs;