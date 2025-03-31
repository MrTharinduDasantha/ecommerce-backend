import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
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
      title: "Edit Profile",
      html: `
        <input id="full_name" class="swal2-input" placeholder="Full Name" value="${user.Full_Name}">
        <input id="email" class="swal2-input" placeholder="Email" value="${user.Email}">
        <input id="phone_no" class="swal2-input" placeholder="Phone Number" value="${user.Phone_No}">
        <select id="status" class="swal2-input">
          <option value="Active" ${user.Status === "Active" ? "selected" : ""}>Active</option>
          <option value="Inactive" ${user.Status === "Inactive" ? "selected" : ""}>Inactive</option>
        </select>
      `,
      preConfirm: () => {
        return {
          full_name: document.getElementById("full_name").value,
          email: document.getElementById("email").value,
          phone_no: document.getElementById("phone_no").value,
          status: document.getElementById("status").value,
        };
      },
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Update",
      focusConfirm: false,
    });

    if (formValues) {
      try {
        await api.updateUser(user.idUser, formValues);
        Swal.fire("Updated!", "Your profile has been updated.", "success");
        if (formValues.email !== user.Email) {
          Swal.fire({
            title: "Email Updated",
            text: "A confirmation email has been sent to your new email address.",
            icon: "info",
            confirmButtonText: "OK",
          });
        }
        setUser((prevUser) => ({
          ...prevUser,
          ...formValues,
        }));
      } catch (error) {
        Swal.fire("Error", "There was an error updating the profile.", "error");
      }
    }
  };

  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Change Password",
      html: `
        <input id="new_password" type="password" class="swal2-input" placeholder="New Password">
        <input id="confirm_password" type="password" class="swal2-input" placeholder="Confirm New Password">
      `,
      preConfirm: () => {
        return {
          newPassword: document.getElementById("new_password").value,
          confirmPassword: document.getElementById("confirm_password").value,
        };
      },
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Change Password",
      focusConfirm: false,
    });

    if (formValues) {
      if (formValues.newPassword !== formValues.confirmPassword) {
        Swal.fire("Error", "Passwords do not match", "error");
        return;
      }
      try {
        await api.updateUserPassword(user.idUser, formValues.newPassword);
        Swal.fire("Updated!", "Your password has been updated.", "success");
      } catch (error) {
        Swal.fire("Error", "There was an error updating your password.", "error");
      }
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section>
      <Navbar />
      <div className="mt-[100px] ml-[50px]">
        <button
          className="px-6 py-3 bg-[#5CAF90] text-white rounded-lg hover:bg-[#4b9f75] transition duration-300"
          onClick={handleBackClick}
        >
          Back
        </button>
      </div>
      <div className="container mx-auto p-8 mt-[100px]" style={{ backgroundColor: "#F4F4F4" }}>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center mb-8">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsyA44JdhHChP6kGqx36BolQq4Hn7z2yGekw&s"
              alt="Profile"
              className="w-32 h-32 rounded-full mr-8 shadow-md"
            />
            <div>
              <h2 className="text-3xl font-semibold text-black">{user ? user.Full_Name : "Loading..."}</h2>
              <p className="text-lg text-gray-600">{user ? user.Email : "Loading..."}</p>
              <p className="text-md text-gray-500">{user ? user.Phone_No : "Loading..."}</p>
              <p className="text-sm text-gray-400">{user ? user.Status : "Loading..."}</p>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              className="px-6 py-3 bg-[#5CAF90] text-white rounded-lg hover:bg-[#4b9f75] transition duration-300"
              onClick={handleEditProfile}
            >
              Edit Profile
            </button>
            <button
              className="px-6 py-3 bg-[#5CAF90] text-white rounded-lg hover:bg-[#4b9f75] transition duration-300"
              onClick={handleChangePassword}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;