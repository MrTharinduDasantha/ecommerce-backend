import { useState, useEffect } from 'react';
import { IoCheckmarkDoneOutline, IoTimeOutline, IoNotificationsOutline } from 'react-icons/io5';
import { TbBell, TbBellRinging } from 'react-icons/tb';
import { FaShoppingCart, FaUserAlt, FaServer, FaCog } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState(null);
  
  // Mock data for demonstration
  useEffect(() => {
    // In a real implementation, this would be an API call
    const mockNotifications = [
      {
        id: 1,
        title: 'New Order Received',
        message: 'You have received a new order #ORD-1234 from John Doe worth $240.00',
        time: '2023-05-15T10:30:00',
        isRead: false,
        type: 'order'
      },
      {
        id: 2,
        title: 'Payment Successful',
        message: 'Payment for order #ORD-1233 has been successfully processed. Amount: $120.50',
        time: '2023-05-14T08:45:00',
        isRead: false,
        type: 'payment'
      },
      {
        id: 3,
        title: 'Customer Account Created',
        message: 'A new customer account has been created by Jane Smith (jane.smith@example.com).',
        time: '2023-05-13T14:20:00',
        isRead: true,
        type: 'user'
      },
      {
        id: 4,
        title: 'Low Stock Alert',
        message: 'The product "Organic Cotton T-Shirt" is running low on stock. Current quantity: 5',
        time: '2023-05-12T09:15:00',
        isRead: true,
        type: 'inventory'
      },
      {
        id: 5,
        title: 'System Maintenance',
        message: 'The system will undergo maintenance on May 20, 2023, from 2:00 AM to 4:00 AM UTC.',
        time: '2023-05-10T16:30:00',
        isRead: true,
        type: 'system'
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 800);
  }, []);

  const getFilteredNotifications = () => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.isRead);
    return notifications.filter(n => n.type === filter);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'order':
        return <FaShoppingCart className="text-blue-500" />;
      case 'payment':
        return <FaShoppingCart className="text-green-500" />;
      case 'user':
        return <FaUserAlt className="text-purple-500" />;
      case 'inventory':
        return <FaServer className="text-orange-500" />;
      case 'system':
        return <FaCog className="text-gray-500" />;
      default:
        return <IoNotificationsOutline className="text-blue-500" />;
    }
  };

  const markAsRead = (id) => {
    // In a real implementation, this would call an API
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
    toast.success('Notification marked as read');
  };

  const markAllAsRead = () => {
    // In a real implementation, this would call an API
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    if (selectedNotification && selectedNotification.id === id) {
      setSelectedNotification(null);
    }
    toast.success('Notification deleted');
  };

  const viewNotificationDetails = (notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </div>
    );
  }

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1D372E]">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">
            You have {unreadCount} unread notifications
          </p>
        </div>
        
        <div className="flex gap-2">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select select-bordered select-sm border-[#5CAF90] text-[#1D372E] bg-white focus:outline-none focus:ring-2 focus:ring-[#5CAF90] focus:border-[#5CAF90]"
            style={{ backgroundColor: 'white', color: '#1D372E' }}
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread</option>
            <option value="order">Orders</option>
            <option value="payment">Payments</option>
            <option value="user">Users</option>
            <option value="inventory">Inventory</option>
            <option value="system">System</option>
          </select>
          
          <button 
            onClick={markAllAsRead}
            className="btn btn-sm bg-[#5CAF90] text-white hover:bg-opacity-90 border-none"
            disabled={unreadCount === 0}
          >
            <IoCheckmarkDoneOutline className="w-4 h-4 mr-1" />
            Mark all as read
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-1 border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-3 border-b border-gray-200">
            <h2 className="font-semibold text-[#1D372E]">Notification List</h2>
          </div>
          
          <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
            {filteredNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications found
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedNotification && selectedNotification.id === notification.id 
                        ? 'bg-gray-50' 
                        : ''
                    } ${!notification.isRead ? 'border-l-4 border-[#5CAF90]' : ''}`}
                    onClick={() => viewNotificationDetails(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${!notification.isRead ? 'text-[#1D372E]' : 'text-gray-600'}`}>
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span className="inline-flex items-center rounded-full bg-[#5CAF90] px-2 py-1 text-xs font-medium text-white">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {notification.message}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <IoTimeOutline className="mr-1" />
                          {new Date(notification.time).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Notification Detail View */}
        <div className="lg:col-span-2 border border-gray-200 rounded-lg overflow-hidden">
          {selectedNotification ? (
            <>
              <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-[#1D372E]">Notification Details</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => markAsRead(selectedNotification.id)} 
                    className="btn btn-sm bg-[#5CAF90] text-white hover:bg-opacity-90 border-none"
                    disabled={selectedNotification.isRead}
                  >
                    <IoCheckmarkDoneOutline className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteNotification(selectedNotification.id)} 
                    className="btn btn-sm bg-red-500 text-white hover:bg-opacity-90 border-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-gray-100">
                    {getTypeIcon(selectedNotification.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#1D372E]">{selectedNotification.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedNotification.time).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-[#1D372E]">{selectedNotification.message}</p>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Status:</span>
                    {selectedNotification.isRead ? (
                      <span className="text-blue-500 flex items-center">
                        <IoCheckmarkDoneOutline className="mr-1" /> Read
                      </span>
                    ) : (
                      <span className="text-yellow-500 flex items-center">
                        <TbBellRinging className="mr-1" /> Unread
                      </span>
                    )}
                  </p>
                </div>
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-[#1D372E] mb-2">Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <button className="btn btn-sm bg-[#5CAF90] text-white hover:bg-opacity-90 border-none">
                      View Related Content
                    </button>
                    {selectedNotification.type === 'order' && (
                      <button className="btn btn-sm border-[#5CAF90] bg-white text-[#5CAF90] hover:bg-[#5CAF90] hover:text-white">
                        View Order
                      </button>
                    )}
                    {selectedNotification.type === 'user' && (
                      <button className="btn btn-sm border-[#5CAF90] bg-white text-[#5CAF90] hover:bg-[#5CAF90] hover:text-white">
                        View User
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <TbBell className="w-12 h-12 mb-4" />
              <p>Select a notification to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications; 