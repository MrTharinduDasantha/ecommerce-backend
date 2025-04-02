import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Lock } from 'lucide-react';
import Navbar from "./Navbar";
import * as api from "../api/auth";
import Swal from "sweetalert2";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/dashboard-private");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = async () => {
    const { value: formValues } = await Swal.fire({
      width: '90%',
      maxWidth: '600px',
      html: `
        <div class="max-h-[80vh] overflow-y-auto px-4 py-2">
          <h3 class="pt-5 text-xl font-bold text-left">
            Update Your Information
          </h3>

          <button id="close-modal" class="absolute top-3 right-3 bg-transparent border-none cursor-pointer text-xl text-gray-600">
            &times;
          </button>

          <div class="space-y-4 mt-6">
            <div>
              <label class="block text-sm font-medium text-left mb-2">Full Name:</label>
              <input id="name" class="w-full px-3 py-2 border rounded-md" value="${user?.Full_Name || ''}" placeholder="Enter Name" />
            </div>

            <div>
              <label class="block text-sm font-medium text-left mb-2">Email Address:</label>
              <input id="email" class="w-full px-3 py-2 border rounded-md" value="${user?.Email || ''}" placeholder="Enter Email" />
            </div>

            <div>
              <label class="block text-sm font-medium text-left mb-2">Phone Number:</label>
              <input id="phonenumber" class="w-full px-3 py-2 border rounded-md" value="${user?.Phone_No || ''}" placeholder="Enter Phone Number" />
            </div>

            <div>
              <label class="block text-sm font-medium text-left mb-2">Status:</label>
              <select id="status" class="w-full px-3 py-2 border rounded-md">
                <option value="Active" ${user?.Status === "Active" ? "selected" : ""}>Active</option>
                <option value="Inactive" ${user?.Status === "Inactive" ? "selected" : ""}>Inactive</option>
              </select>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      confirmButtonColor: '#5CAF90',
      cancelButtonColor: '#5CAF90',
      preConfirm: () => {
        return {
          full_name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          phone_no: document.getElementById("phonenumber").value,
          status: document.getElementById("status").value,
        };
      }
    });

    if (formValues) {
      try {
        await api.updateUser(user.idUser, formValues);
        Swal.fire({
          title: "Updated!",
          text: "Your profile has been updated.",
          icon: "success",
          confirmButtonColor: '#5CAF90'
        });
        
        if (formValues.email !== user.Email) {
          Swal.fire({
            title: "Email Updated",
            text: "A confirmation email has been sent to your new email address.",
            icon: "info",
            confirmButtonColor: '#5CAF90'
          });
        }
        
        setUser((prevUser) => ({
          ...prevUser,
          ...formValues,
        }));
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "There was an error updating the profile.",
          icon: "error",
          confirmButtonColor: '#5CAF90'
        });
      }
    }
  };

  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      width: '90%',
      maxWidth: '600px',
      html: `
        <div class="max-h-[80vh] overflow-y-auto px-4 py-2">
          <h3 class="pt-5 text-xl font-bold text-left">
            Change Your Password
          </h3>

          <button id="close-modal" class="absolute top-3 right-3 bg-transparent border-none cursor-pointer text-xl text-gray-600">
            &times;
          </button>

          <div class="space-y-4 mt-6">
            <div>
              <label class="block text-sm font-medium text-left mb-2">New Password:</label>
              <input id="new_password" type="password" class="w-full px-3 py-2 border rounded-md" placeholder="Enter new password" />
            </div>

            <div>
              <label class="block text-sm font-medium text-left mb-2">Confirm Password:</label>
              <input id="confirm_password" type="password" class="w-full px-3 py-2 border rounded-md" placeholder="Confirm new password" />
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Change Password",
      cancelButtonText: "Cancel",
      confirmButtonColor: '#5CAF90',
      cancelButtonColor: '#5CAF90',
      preConfirm: () => {
        return {
          newPassword: document.getElementById("new_password").value,
          confirmPassword: document.getElementById("confirm_password").value,
        };
      }
    });

    if (formValues) {
      if (formValues.newPassword !== formValues.confirmPassword) {
        Swal.fire({
          title: "Error",
          text: "Passwords do not match",
          icon: "error",
          confirmButtonColor: '#5CAF90'
        });
        return;
      }
      try {
        await api.updateUserPassword(user.idUser, formValues.newPassword);
        Swal.fire({
          title: "Updated!",
          text: "Your password has been updated.",
          icon: "success",
          confirmButtonColor: '#5CAF90'
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "There was an error updating your password.",
          icon: "error",
          confirmButtonColor: '#5CAF90'
        });
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-6">
        <button
          className="inline-flex items-center px-4 py-2 bg-[#5CAF90] text-white rounded-lg hover:bg-[#4b9f75] transition duration-300"
          onClick={handleBackClick}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>

      {/* Profile card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              {/* Profile image */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover shadow-md ring-4 ring-gray-50"
                />
              </div>

              {/* Profile info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                  {user ? user.Full_Name : "Loading..."}
                </h2>
                <div className="mt-2 space-y-1">
                  <p className="text-gray-600">{user ? user.Email : "Loading..."}</p>
                  <p className="text-gray-600">{user ? user.Phone_No : "Loading..."}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user?.Status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user ? user.Status : "Loading..."}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                className="inline-flex items-center justify-center px-4 py-2 bg-[#5CAF90] text-white rounded-lg hover:bg-[#4b9f75] transition duration-300"
                onClick={handleEditProfile}
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit Profile
              </button>
              <button
                className="inline-flex items-center justify-center px-4 py-2 bg-[#5CAF90] text-white rounded-lg hover:bg-[#4b9f75] transition duration-300"
                onClick={handleChangePassword}
              >
                <Lock className="w-5 h-5 mr-2" />
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;