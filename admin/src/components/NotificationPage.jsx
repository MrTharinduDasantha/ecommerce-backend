import { useState, useEffect, useRef } from "react";
import {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAsUnread,
} from "../api/notification";
import { toast } from "react-hot-toast";
import { useNotifications } from "../context/NotificationContext";
import { MdOutlineNotificationAdd } from "react-icons/md";
import {
  FaSearch,
  FaCheckSquare,
  FaRegCheckSquare,
  FaEye,
  FaEdit,
} from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { io } from "socket.io-client";
import Pagination from "../components/common/Pagination";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [deleteNotificationId, setDeleteNotificationId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [addTitle, setAddTitle] = useState("");
  const [addMessage, setAddMessage] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const toastTimerRef = useRef(null);
  const socketRef = useRef(null);

  const { updateUnreadCount } = useNotifications();

  // Define items per page
  const itemsPerPage = 10;

  useEffect(() => {
    socketRef.current = io("http://localhost:9000");

    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socketRef.current.on("newNotification", () => {
      fetchNotifications();
    });

    socketRef.current.on("notificationUpdated", () => {
      fetchNotifications();
    });

    socketRef.current.on("notificationDeleted", () => {
      fetchNotifications();
    });

    fetchNotifications();

    return () => {
      socketRef.current.disconnect();
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message, type = "success") => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      if (type === "success") {
        toast.success(message);
      } else if (type === "error") {
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
      setFilteredNotifications(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error(error.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchNotifications();
    updateUnreadCount();
  };

  const handleOpenAddModal = () => {
    setAddTitle("");
    setAddMessage("");
    setShowAddModal(true);
  };

  const handleOpenEditModal = (notification) => {
    setCurrentNotification(notification);
    setEditTitle(notification.title);
    setEditMessage(notification.message);
    setShowEditModal(true);
  };

  const handleOpenViewModal = (notification) => {
    setCurrentNotification(notification);
    setShowViewModal(true);
  };

  const handleAddSubmit = async () => {
    if (!addTitle.trim() || !addMessage.trim()) {
      toast.error("Title and message are required");
      return;
    }

    try {
      await createNotification({ title: addTitle, message: addMessage });
      setShowAddModal(false);
      refreshData();
      toast.success("Notification created successfully");
    } catch (error) {
      toast.error(error.message || "Failed to create notification");
    }
  };

  const handleEditSubmit = async () => {
    if (!editTitle.trim() || !editMessage.trim()) {
      toast.error("Title and message are required");
      return;
    }

    try {
      await updateNotification(currentNotification.id, {
        title: editTitle,
        message: editMessage,
      });
      setShowEditModal(false);
      setCurrentNotification(null);
      refreshData();
      toast.success("Notification updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update notification");
    }
  };

  const handleDelete = (notification) => {
    setDeleteNotificationId(notification.id);
  };

  const confirmDelete = async () => {
    try {
      await deleteNotification(deleteNotificationId);
      await refreshData();
      showToast("Notification deleted successfully");
      setDeleteNotificationId(null);
    } catch (error) {
      console.error("Error deleting notification:", error);
      showToast("Failed to delete notification", "error");
      setDeleteNotificationId(null);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      await refreshData();
      showToast("Marked as read");
    } catch (error) {
      console.error("Error marking as read:", error);
      showToast("Failed to mark as read", "error");
    }
  };

  const handleMarkAsUnread = async (id) => {
    try {
      await markAsUnread(id);
      await refreshData();
      showToast("Marked as unread");
    } catch (error) {
      console.error("Error marking as unread:", error);
      showToast("Failed to mark as unread", "error");
    }
  };

  const currentUserId = JSON.parse(localStorage.getItem("user"))?.userId;

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredNotifications(notifications);
      setTotalPages(Math.ceil(notifications.length / itemsPerPage));
      setCurrentPage(1);
      return;
    }
    const filtered = notifications.filter((notification) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        notification.title.toLowerCase().includes(lowerSearchTerm) ||
        notification.message.toLowerCase().includes(lowerSearchTerm) ||
        notification.creator_name.toLowerCase().includes(lowerSearchTerm)
      );
    });
    setFilteredNotifications(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredNotifications(notifications);
      setTotalPages(Math.ceil(notifications.length / itemsPerPage));
      setCurrentPage(1);
    }
  }, [searchTerm, notifications]);

  useEffect(() => {
    if (showAddModal || showEditModal || showViewModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showAddModal, showEditModal, showViewModal]);

  // Slice the filtered notifications for the current page
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="card bg-white shadow-md">
      <div className="card-body p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-[#5CAF90]"></div>
            <h2 className="text-lg md:text-xl font-bold text-[#1D372E]">
              Admin Notifications
            </h2>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="btn btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] btn-sm md:btn-md w-full md:w-auto"
          >
            <MdOutlineNotificationAdd className="w-4 h-4 md:w-5 md:h-5 mr-1" />
            Add Notification
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="relative flex w-full md:max-w-xl md:mx-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
              <FaSearch className="text-muted-foreground text-[#1D372E]" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search notifications..."
              className="input input-bordered input-sm md:input-md w-full pl-8 md:pl-10 bg-white border-[#1D372E] text-[#1D372E]"
            />
            <button
              onClick={handleSearch}
              className="btn btn-primary btn-sm md:btn-md ml-2 bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]"
            >
              Search
            </button>
          </div>
        </div>

        {/* Notifications Display */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="alert bg-[#1D372E] border-[#1D372E]">
            <span>No notifications found.</span>
          </div>
        ) : (
          <>
            {/* Table for larger screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="table table-fixed min-w-[800px] text-center border border-[#1D372E]">
                <thead className="bg-[#EAFFF7] text-[#1D372E]">
                  <tr className="border-b border-[#1D372E]">
                    <th className="font-semibold text-xs lg:text-sm w-[200px]">
                      Notification
                    </th>
                    <th className="font-semibold text-xs lg:text-sm w-[250px]">
                      Created By
                    </th>
                    <th className="font-semibold text-xs lg:text-sm w-[150px]">
                      Date & Time
                    </th>
                    <th className="font-semibold text-xs lg:text-sm w-[100px]">
                      Status
                    </th>
                    <th className="font-semibold text-xs lg:text-sm w-[100px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[#1D372E]">
                  {paginatedNotifications.map((notification) => (
                    <tr
                      key={notification.id}
                      className="border-b border-[#1D372E]"
                    >
                      <td>
                        <div className="font-medium text-xs lg:text-sm">
                          {notification.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {notification.message}
                        </div>
                      </td>
                      <td>
                        <div className="text-xs lg:text-sm">
                          {notification.creator_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {notification.creator_email}
                        </div>
                      </td>
                      <td>
                        <div className="text-xs lg:text-sm">
                          {new Date(
                            notification.created_at
                          ).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(
                            notification.created_at
                          ).toLocaleTimeString()}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs lg:text-sm">Read</span>
                          <button
                            onClick={() =>
                              notification.is_read
                                ? handleMarkAsUnread(notification.id)
                                : handleMarkAsRead(notification.id)
                            }
                            className="text-[#5CAF90]"
                          >
                            {notification.is_read ? (
                              <FaCheckSquare className="w-3 h-3 lg:w-4 lg:h-4" />
                            ) : (
                              <FaRegCheckSquare className="w-3 h-3 lg:w-4 lg:h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenViewModal(notification)}
                            className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                            title="View Notification"
                          >
                            <FaEye />
                          </button>
                          {currentUserId === notification.created_by && (
                            <>
                              <button
                                onClick={() =>
                                  handleOpenEditModal(notification)
                                }
                                className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                                title="Edit Notification"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(notification)}
                                className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                                title="Delete Notification"
                              >
                                <RiDeleteBin5Fill />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notification Cards for mobile view */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {paginatedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="card bg-white shadow-md border border-[#1D372E] p-4"
                >
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold text-[#1D372E]">
                        {notification.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-[#1D372E]">
                        <span className="font-medium">Created by:</span>{" "}
                        {notification.creator_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {notification.creator_email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.created_at).toLocaleDateString()}{" "}
                        {new Date(notification.created_at).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#1D372E]">Read</span>
                      <button
                        onClick={() =>
                          notification.is_read
                            ? handleMarkAsUnread(notification.id)
                            : handleMarkAsRead(notification.id)
                        }
                        className="text-[#5CAF90]"
                      >
                        {notification.is_read ? (
                          <FaCheckSquare className="w-4 h-4" />
                        ) : (
                          <FaRegCheckSquare className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => handleOpenViewModal(notification)}
                      className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                      title="View Notification"
                    >
                      <FaEye />
                    </button>
                    {currentUserId === notification.created_by && (
                      <>
                        <button
                          onClick={() => handleOpenEditModal(notification)}
                          className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                          title="Edit Notification"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(notification)}
                          className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d]"
                          title="Delete Notification"
                        >
                          <RiDeleteBin5Fill />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredNotifications.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      {/* Add Notification Modal */}
      {showAddModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-white text-[#1D372E] mx-4 max-w-lg">
            <h3 className="font-bold text-lg mb-4">Create New Notification</h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-6 top-7 text-[#1D372E]"
            >
              <IoClose className="w-5 h-5" />
            </button>

            <div className="form-control mb-4">
              <label className="label text-[#1D372E] mb-0.5">
                <span className="label-text font-medium">Title</span>
              </label>
              <input
                type="text"
                value={addTitle}
                onChange={(e) => setAddTitle(e.target.value)}
                placeholder="Notification Title"
                className="input input-bordered w-full bg-white border-[#1D372E] text-[#1D372E]"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label text-[#1D372E] mb-0.5">
                <span className="label-text font-medium">Message</span>
              </label>
              <textarea
                value={addMessage}
                onChange={(e) => setAddMessage(e.target.value)}
                placeholder="Notification Message"
                className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E]"
                rows="4"
              ></textarea>
            </div>

            <div className="modal-action">
              <button
                onClick={handleAddSubmit}
                className="btn btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Notification Modal */}
      {showEditModal && currentNotification && (
        <div className="modal modal-open">
          <div className="modal-box bg-white text-[#1D372E] mx-4 max-w-lg">
            <h3 className="font-bold text-lg mb-4">Edit Notification</h3>
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute right-6 top-7 text-[#1D372E]"
            >
              <IoClose className="w-5 h-5" />
            </button>

            <div className="form-control mb-4">
              <label className="label text-[#1D372E] mb-0.5">
                <span className="label-text font-medium">Title</span>
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Notification Title"
                className="input input-bordered w-full bg-white border-[#1D372E] text-[#1D372E]"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label text-[#1D372E] mb-0.5">
                <span className="label-text font-medium">Message</span>
              </label>
              <textarea
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                placeholder="Notification Message"
                className="textarea textarea-bordered w-full bg-white border-[#1D372E] text-[#1D372E]"
                rows="4"
              ></textarea>
            </div>

            <div className="modal-action">
              <button
                onClick={handleEditSubmit}
                className="btn btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Notification Modal */}
      {showViewModal && currentNotification && (
        <div className="modal modal-open">
          <div className="modal-box bg-white text-[#1D372E] mx-4 max-w-lg">
            <h3 className="font-bold text-lg mb-4">
              {currentNotification.title}
            </h3>
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute right-6 top-7 text-[#1D372E]"
            >
              <IoClose className="w-5 h-5" />
            </button>

            <div className="mt-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-800">{currentNotification.message}</p>
            </div>
            <div className="mt-3 flex flex-col text-sm gap-2">
              <span className="text-gray-600">
                By: {currentNotification.creator_name} (
                {currentNotification.creator_email || "No email"})
              </span>
              <span className="text-gray-600">
                {new Date(currentNotification.created_at).toLocaleString()}
              </span>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setShowViewModal(false)}
                className="btn btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Notification Confirmation Modal */}
      {deleteNotificationId && (
        <div className="modal modal-open">
          <div className="modal-box bg-white text-[#1D372E] mx-4 max-w-lg">
            <h3 className="font-bold text-lg mb-4">Delete Notification</h3>
            <button
              onClick={() => setDeleteNotificationId(null)}
              className="absolute right-6 top-7 text-[#1D372E]"
            >
              <IoClose className="w-5 h-5" />
            </button>

            <p className="mb-6">
              Are you sure you want to delete this notification? This action
              cannot be undone.
            </p>

            <div className="modal-action">
              <button
                onClick={() => setDeleteNotificationId(null)}
                className="btn btn-sm bg-[#1D372E] border-[#1D372E]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-sm bg-[#5CAF90] border-[#5CAF90]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
