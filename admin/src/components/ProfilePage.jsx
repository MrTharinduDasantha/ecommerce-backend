import { useState, useEffect } from "react";
import * as api from "../api/auth";
import Swal from "sweetalert2";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        console.log(data);
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
      
      maxWidth: '600px',
      height: '200px',
      html: `<div class="relative max-h-[80vh] overflow-y-auto p-4">
          <h3 class="pt-5 text-xl font-bold text-left">
            Update Your Information
          </h3>
          <button id="close-modal" class="absolute top-2 right-2 bg-transparent border-none cursor-pointer text-xl text-gray-600">
            &times;
          </button>
          <div class="space-y-4 mt-6">
            <div>
              <label class="block text-sm font-medium text-left mb-2">Full Name:</label>
              <input id="name" class="w-full px-3 py-2 border rounded-md" value="${user.Full_Name}" placeholder="Enter Name" />
            </div>

            <div>
              <label class="block text-sm font-medium text-left mb-2">Email Address:</label>
              <input id="email" class="w-full px-3 py-2 border rounded-md" value="${user.Email}" placeholder="Enter Email" />
            </div>

            <div>
              <label class="block text-sm font-medium text-left mb-2">Phone Number:</label>
              <input id="phonenumber" class="w-full px-3 py-2 border rounded-md" value="${user.Phone_No}" placeholder="Enter Phone Number" />
            </div>

            <div>
              <label class="block text-sm font-medium text-left mb-2">Status:</label>
              <select id="status" class="w-full px-3 py-2 border rounded-md">
                <option value="Active" ${user.Status === "Active" ? "selected" : ""}>Active</option>
                <option value="Inactive" ${user.Status === "Inactive" ? "selected" : ""}>Inactive</option>
              </select>
            </div>
          </div>
        </div>`,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#5CAF90",
      cancelButtonColor: "#5CAF90",
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
          confirmButtonColor: "#5CAF90"
        });
        if (formValues.email !== user.Email) {
          Swal.fire({
            title: "Email Updated",
            text: "A confirmation email has been sent to your new email address.",
            icon: "info",
            confirmButtonColor: "#5CAF90"
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
          confirmButtonColor: "#5CAF90"
        });
      }
    }
  };

  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
       
      maxWidth: '600px',
      height: '200px',
      html: `<div class="relative max-h-[80vh] overflow-y-auto p-4">
          <h3 class="pt-5 text-xl font-bold text-left">
            Change Your Password
          </h3>
          <button id="close-modal" class="absolute top-2 right-2 bg-transparent border-none cursor-pointer text-xl text-gray-600">
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
        </div>`,
      showCancelButton: true,
      confirmButtonText: "Change Password",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#5CAF90",
      cancelButtonColor: "#5CAF90",
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
          confirmButtonColor: "#5CAF90"
        });
        return;
      }
      try {
        await api.updateUserPassword(user.idUser, formValues.newPassword);
        Swal.fire({
          title: "Updated!",
          text: "Your password has been updated.",
          icon: "success",
          confirmButtonColor: "#5CAF90"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "There was an error updating your password.",
          icon: "error",
          confirmButtonColor: "#5CAF90"
        });
      }
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
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              {/* Profile Image */}
              <div className="relative flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"
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
                  <p className="text-gray-600">{user ? user.Email : "Loading..."}</p>
                  <p className="text-gray-600">{user ? user.Phone_No : "Loading..."}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user?.Status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {user ? user.Status : "Loading..."}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                className="w-full sm:w-auto px-6 py-3 bg-[#5CAF90] text-white rounded-lg hover:bg-[#4b9f75] transition duration-300 text-sm sm:text-base font-medium"
                onClick={handleEditProfile}
              >
                Edit Profile
              </button>
              <button
                className="w-full sm:w-auto px-6 py-3 bg-[#5CAF90] text-white rounded-lg hover:bg-[#4b9f75] transition duration-300 text-sm sm:text-base font-medium"
                onClick={handleChangePassword}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;