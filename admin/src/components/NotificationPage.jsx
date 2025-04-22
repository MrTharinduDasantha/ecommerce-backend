import React, { useState, useEffect, useRef } from 'react';
import { 
  getNotifications, 
  createNotification, 
  updateNotification, 
  deleteNotification, 
  markAsRead, 
  markAsUnread 
} from '../api/notification';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useNotifications } from '../context/NotificationContext';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const toastTimerRef = useRef(null);

  const { updateUnreadCount } = useNotifications();

  useEffect(() => {
    fetchNotifications();
    
    // Clear any pending timers when component unmounts
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Show toast with debounce to prevent duplicates
  const showToast = (message, type = 'success') => {
    // Clear any pending toast timers
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    
    // Set a small timeout to prevent multiple toasts firing at once
    toastTimerRef.current = setTimeout(() => {
      if (type === 'success') {
        toast.success(message);
      } else if (type === 'error') {
        toast.error(message);
      }
      toastTimerRef.current = null;
    }, 100);
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchNotifications();
    updateUnreadCount();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      showToast('Title and message are required', 'error');
      return;
    }

    try {
      if (editMode && currentNotification) {
        await updateNotification(currentNotification.id, { title, message });
        showToast('Notification updated successfully');
      } else {
        await createNotification({ title, message });
        showToast('Notification created successfully');
      }

      setTitle('');
      setMessage('');
      setEditMode(false);
      setCurrentNotification(null);
      refreshData();
    } catch (error) {
      console.error('Error submitting notification:', error);
    }
  };

  const handleEdit = (notification) => {
    Swal.fire({
      title: 'Edit Notification',
      html: `
        <div class="text-left">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="swal-title">
              Title
            </label>
            <input 
              id="swal-title" 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text" 
              value="${notification.title.replace(/"/g, '&quot;')}"
              placeholder="Notification Title"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="swal-message">
              Message
            </label>
            <textarea 
              id="swal-message" 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
              placeholder="Notification Message"
            >${notification.message}</textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#5CAF90',
      cancelButtonColor: '#6B7280',
      focusConfirm: false,
      preConfirm: () => {
        const newTitle = Swal.getPopup().querySelector('#swal-title').value;
        const newMessage = Swal.getPopup().querySelector('#swal-message').value;
        
        if (!newTitle || !newMessage) {
          Swal.showValidationMessage('Title and message are required');
          return false;
        }
        
        return { title: newTitle, message: newMessage };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateNotification(notification.id, result.value);
          await refreshData();
          showToast('Notification updated successfully');
        } catch (error) {
          console.error('Error updating notification:', error);
          showToast('Failed to update notification', 'error');
        }
      }
    });
  };

  const handleDelete = async (notification) => {
    Swal.fire({
      title: 'Confirm Delete',
      html: `
        <div class="text-center">
          <p class="mb-2">Are you sure you want to delete this notification?</p>
          <div class="bg-gray-50 p-3 my-3 rounded-lg border border-gray-200 text-left">
            <h3 class="font-semibold text-gray-800">${notification.title}</h3>
            <p class="text-sm text-gray-600 mt-1">${notification.message}</p>
          </div>
          <p class="text-sm text-gray-600">This action cannot be undone.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6B7280',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteNotification(notification.id);
          await refreshData();
          showToast('Notification deleted successfully');
        } catch (error) {
          console.error('Error deleting notification:', error);
          showToast('Failed to delete notification', 'error');
        }
      }
    });
  };

  const handleCancel = () => {
    setTitle('');
    setMessage('');
    setEditMode(false);
    setCurrentNotification(null);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      await refreshData();
      showToast('Marked as read');
    } catch (error) {
      console.error('Error marking as read:', error);
      showToast('Failed to mark as read', 'error');
    }
  };

  const handleMarkAsUnread = async (id) => {
    try {
      await markAsUnread(id);
      await refreshData();
      showToast('Marked as unread');
    } catch (error) {
      console.error('Error marking as unread:', error);
      showToast('Failed to mark as unread', 'error');
    }
  };

  // Get current user ID from localStorage
  const currentUserId = JSON.parse(localStorage.getItem('user'))?.userId;

  const getNotificationStatusColor = (isRead) => {
    return isRead 
      ? "bg-gray-100 text-gray-800"
      : "bg-blue-100 text-blue-800";
  };

  // Filter notifications based on search term
  const filteredNotifications = notifications.filter((notification) => {
    if (!searchTerm) return true;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      notification.title.toLowerCase().includes(lowerSearchTerm) ||
      notification.message.toLowerCase().includes(lowerSearchTerm) ||
      notification.creator_name.toLowerCase().includes(lowerSearchTerm)
    );
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Notifications</h1>
        <button
          onClick={() => {
            Swal.fire({
              title: 'Create New Notification',
              html: `
                <div class="text-left">
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="swal-title">
                      Title
                    </label>
                    <input 
                      id="swal-title" 
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text" 
                      placeholder="Notification Title"
                    />
                  </div>
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="swal-message">
                      Message
                    </label>
                    <textarea 
                      id="swal-message" 
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows="4"
                      placeholder="Notification Message"
                    ></textarea>
                  </div>
                </div>
              `,
              showCancelButton: true,
              confirmButtonText: 'Send',
              cancelButtonText: 'Cancel',
              confirmButtonColor: '#5CAF90',
              cancelButtonColor: '#6B7280',
              focusConfirm: false,
              preConfirm: () => {
                const newTitle = Swal.getPopup().querySelector('#swal-title').value;
                const newMessage = Swal.getPopup().querySelector('#swal-message').value;
                
                if (!newTitle || !newMessage) {
                  Swal.showValidationMessage('Title and message are required');
                  return false;
                }
                
                return { title: newTitle, message: newMessage };
              }
            }).then(async (result) => {
              if (result.isConfirmed) {
                try {
                  await createNotification(result.value);
                  await refreshData();
                  showToast('Notification created successfully');
                } catch (error) {
                  console.error('Error creating notification:', error);
                  showToast('Failed to create notification', 'error');
                }
              }
            });
          }}
          className="bg-[#5CAF90] hover:bg-[#4a9278] text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Notification
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5CAF90] focus:border-transparent"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5CAF90] mx-auto"></div>
              <p className="mt-3 text-gray-600">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="mt-3 text-gray-600">No notifications found</p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-[#5CAF90] hover:underline focus:outline-none"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notification</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <tr key={notification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2">{notification.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{notification.creator_name}</div>
                      <div className="text-xs text-gray-500 mt-1">{notification.creator_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(notification.created_at).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getNotificationStatusColor(notification.is_read)}`}>
                        {notification.is_read ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        {notification.is_read ? (
                          <button
                            onClick={() => handleMarkAsUnread(notification.id)}
                            className="flex items-center text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                            title="Mark as unread"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            <span>Unread</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="flex items-center text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded"
                            title="Mark as read"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Read</span>
                          </button>
                        )}
                        
                        {/* View details button */}
                        <button
                          onClick={() => {
                            Swal.fire({
                              title: notification.title,
                              html: `
                                <div class="text-left">
                                  <div class="mt-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <p class="text-gray-800">${notification.message}</p>
                                  </div>
                                  <div class="mt-3 flex justify-between text-sm">
                                    <span class="text-gray-600">By: ${notification.creator_name} (${notification.creator_email || 'No email'})</span>
                                    <span class="text-gray-600">${new Date(notification.created_at).toLocaleString()}</span>
                                  </div>
                                </div>
                              `,
                              confirmButtonText: 'Close',
                              confirmButtonColor: '#5CAF90',
                            });
                          }}
                          className="flex items-center text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded"
                          title="View details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          <span>View</span>
                        </button>
                        
                        {/* Only show edit/delete for notifications created by current user */}
                        {currentUserId === notification.created_by && (
                          <>
                            <button
                              onClick={() => handleEdit(notification)}
                              className="flex items-center text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100 px-2 py-1 rounded"
                              title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(notification)}
                              className="flex items-center text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded"
                              title="Delete"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <span>Delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage; 