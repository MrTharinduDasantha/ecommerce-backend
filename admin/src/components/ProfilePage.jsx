import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import * as api from "../api/auth";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile");
        toast.error("There was an error loading your profile.");
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (showEditModal && user) {
      setEditName(user.Full_Name);
      setEditEmail(user.Email);
      setEditPhone(user.Phone_No);
      setEditStatus(user.Status);
    }
  }, [showEditModal, user]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Full Name is required.");
      return;
    }
    if (!editEmail.trim()) {
      toast.error("Email is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(editEmail)) {
      toast.error("Enter a valid email address.");
      return;
    }
    if (!/^(\+?\d{1,3}[- ]?)?\d{10}$/.test(editPhone)) {
      toast.error("Enter a valid phone number.");
      return;
    }

    try {
      const formValues = {
        full_name: editName,
        email: editEmail,
        phone_no: editPhone,
        status: editStatus,
      };
      await api.updateUser(user.idUser, formValues);
      toast.success("Profile updated successfully.");
      if (editEmail !== user.Email) {
        toast("A confirmation email has been sent to your new email address.");
      }
      setUser((prevUser) => ({
        ...prevUser,
        Full_Name: editName,
        Email: editEmail,
        Phone_No: editPhone,
        Status: editStatus,
      }));
      setShowEditModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error("New password is required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      await api.updateUserPassword(user.idUser, newPassword);
      toast.success("Password updated successfully.");
      setShowPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to update password.");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen">
      <div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              {/* Profile Image */}
              <div className="relative flex-shrink-0">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsyA44JdhHChP6kGqx36BolQq4Hn7z2yGekw&s"
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-md ring-4 ring-gray-50"
                />
              </div>
              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                  {user ? user.Full_Name : "Loading..."}
                </h2>
                <div className="space-y-1">
                  <p className="text-gray-600">
                    {user ? user.Email : "Loading..."}
                  </p>
                  <p className="text-gray-600">
                    {user ? user.Phone_No : "Loading..."}
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user?.Status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user ? user.Status : "Loading..."}
                  </span>
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                className="btn btn-primary gap-2 bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] btn-sm md:btn-md"
                onClick={() => setShowEditModal(true)}
              >
                Edit Profile
              </button>
              <button
                className="btn btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] btn-sm md:btn-md"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md max-h-[80vh] bg-white text-[#1D372E]">
            <h3 className="font-bold text-base lg:text-lg mb-4">
              Update Your Information
            </h3>
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute right-6 top-7 text-lg text-[#1D372E]"
            >
              <IoClose className="w-5 h-5" />
            </button>
            <form onSubmit={handleEditSubmit}>
              <div className="form-control mb-4">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="label-text text-sm lg:text-base font-medium">
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  placeholder="Enter Name"
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="label-text text-sm lg:text-base font-medium">
                    Email Address
                  </span>
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  placeholder="Enter Email"
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="label-text text-sm lg:text-base font-medium">
                    Phone Number
                  </span>
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  placeholder="Enter Phone Number"
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="label-text text-sm lg:text-base font-medium">
                    Status
                  </span>
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="select select-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="modal-action">
                <button
                  type="submit"
                  className="btn btn-primary bg-[#5CAF90] border-none text-white btn-sm md:btn-md hover:bg-[#4a9a7d]"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md max-h-[70vh] bg-white text-[#1D372E]">
            <h3 className="font-bold text-base lg:text-lg mb-4">
              Change Your Password
            </h3>
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute right-6 top-7 text-lg text-[#1D372E]"
            >
              <IoClose className="w-5 h-5" />
            </button>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-control mb-4">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="label-text text-sm lg:text-base font-medium">
                    New Password
                  </span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="label-text text-sm lg:text-base font-medium">
                    Confirm Password
                  </span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <div className="modal-action">
                <button
                  type="submit"
                  className="btn btn-primary bg-[#5CAF90] border-none text-white btn-sm md:btn-md hover:bg-[#4a9a7d]"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfilePage;
