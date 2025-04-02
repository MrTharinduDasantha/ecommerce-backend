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
      width: "600px",
      height: "auto",
      html: `<div style="position: relative; max-height: 400px; overflow-y: auto;">
          <h3 style="padding-top: 20px; font-size: 20px; font-weight: bold; text-align: left;">
            Update Your Information
          </h3>
          <!-- Close Icon -->
          <button id="close-modal" style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; cursor: pointer; font-size: 18px; color: #333;">
            &times;
          </button>
          <label for="name" style="margin-top: 20px; display: block; font-size: 16px; text-align: left; font-weight: medium; margin-bottom: 8px;">Edit Name:</label>
          <input id="name" class="swal2-input" value="${
            user.Full_Name
          }" placeholder="Enter Name" style="margin-bottom: 10px; padding: 8px; font-size: 14px; width: 450px; border: 1px solid #ccc; border-radius: 4px;" />

          <label for="email" style="margin-top: 20px; display: block; font-size: 16px; text-align: left; font-weight: medium; margin-bottom: 8px;">Edit Email:</label>
          <input id="email" class="swal2-input" value="${
            user.Email
          }" placeholder="Enter Email" style="margin-bottom: 10px; padding: 8px; font-size: 14px; width: 450px; border: 1px solid #ccc; border-radius: 4px;" />

          <label for="phonenumber" style="margin-top: 20px; display: block; font-size: 16px; text-align: left; font-weight: medium; margin-bottom: 8px;">Edit Phone Number:</label>
          <input id="phonenumber" class="swal2-input" value="${
            user.Phone_No
          }" placeholder="Enter Phone Number" style="margin-bottom: 10px; padding: 8px; font-size: 14px; width: 450px; border: 1px solid #ccc; border-radius: 4px;" />

          <label for="status" style="margin-top: 10px; display: block; font-size: 16px; text-align: left; font-weight: medium; margin-bottom: 8px;">Change Status:</label>
          <select id="status" class="swal2-input" style="margin-bottom: 10px; padding: 8px; font-size: 14px; width: 450px; border: 1px solid #ccc; border-radius: 4px;">
            <option value="Active" ${
              user.Status === "Active" ? "selected" : ""
            }>Active</option>
            <option value="Inactive" ${
              user.Status === "Inactive" ? "selected" : ""
            }>Inactive</option>
          </select>
        </div>`,
      preConfirm: () => {
        return {
          full_name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          phone_no: document.getElementById("phonenumber").value,
          status: document.getElementById("status").value,
        };
      },
      confirmButtonText: "Update",
      focusConfirm: false,
      customClass: {
        confirmButton: "swal2-confirm-button",
      },
      buttonsStyling: false,
      didOpen: () => {
        const closeModalButton = document.getElementById("close-modal");
        closeModalButton.addEventListener("click", () => {
          Swal.close();
        });

        const confirmButton = document.querySelector(".swal2-confirm");
        confirmButton.style.backgroundColor = "#5CAF90";
        confirmButton.style.color = "white";
        confirmButton.style.borderRadius = "4px";
        confirmButton.style.padding = "10px 20px";
        confirmButton.style.fontSize = "16px";

        confirmButton.addEventListener("mouseover", () => {
          confirmButton.style.backgroundColor = "#4b9f75";
        });

        confirmButton.addEventListener("mouseout", () => {
          confirmButton.style.backgroundColor = "#5CAF90";
        });
      },
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
      width: "600px",
      height: "auto",
      html: `<div style="position: relative; max-height: 400px; overflow-y: auto;">
          <h3 style="padding-top: 20px; font-size: 20px; font-weight: bold; text-align: left;">
            Change Your Password
          </h3>
          <!-- Close Icon -->
          <button id="close-modal" style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; cursor: pointer; font-size: 18px; color: #333;">
            &times;
          </button>
          <label for="new_password" style="margin-top: 20px; display: block; font-size: 16px; text-align: left; margin-bottom: 8px;">New Password:</label>
          <input id="new_password" type="password" placeholder="New Password" class="swal2-input" style="margin-bottom: 10px; padding: 8px; font-size: 14px; width: 450px; border: 1px solid #ccc; border-radius: 4px;" />

          <label for="confirm_password" style="margin-top: 20px; display: block; font-size: 16px; text-align: left; margin-bottom: 8px;">Confirm New Password:</label>
          <input id="confirm_password" type="password" placeholder="Confirm New Password" class="swal2-input" style="margin-bottom: 10px; padding: 8px; font-size: 14px; width: 450px; border: 1px solid #ccc; border-radius: 4px;" />
        </div>`,
      preConfirm: () => {
        return {
          newPassword: document.getElementById("new_password").value,
          confirmPassword: document.getElementById("confirm_password").value,
        };
      },
      confirmButtonText: "Change Password",
      focusConfirm: false,
      customClass: {
        confirmButton: "swal2-confirm-button",
      },
      buttonsStyling: false,
      didOpen: () => {
        const closeModalButton = document.getElementById("close-modal");
        closeModalButton.addEventListener("click", () => {
          Swal.close();
        });

        const confirmButton = document.querySelector(".swal2-confirm");
        confirmButton.style.backgroundColor = "#5CAF90";
        confirmButton.style.color = "white";
        confirmButton.style.borderRadius = "4px";
        confirmButton.style.padding = "10px 20px";
        confirmButton.style.fontSize = "16px";

        confirmButton.addEventListener("mouseover", () => {
          confirmButton.style.backgroundColor = "#4b9f75";
        });

        confirmButton.addEventListener("mouseout", () => {
          confirmButton.style.backgroundColor = "#5CAF90";
        });
      },
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
        Swal.fire(
          "Error",
          "There was an error updating your password.",
          "error"
        );
      }
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section>
      <div
        className="container mx-auto p-8 mt-[25px]"
        style={{ backgroundColor: "#F4F4F4" }}
      >
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center mb-8">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsyA44JdhHChP6kGqx36BolQq4Hn7z2yGekw&s"
              alt="Profile"
              className="w-32 h-32 rounded-full mr-8 shadow-md"
            />
            <div>
              <h2 className="text-3xl font-semibold text-black">
                {user ? user.Full_Name : "Loading..."}
              </h2>
              <p className="text-lg text-gray-600">
                {user ? user.Email : "Loading..."}
              </p>
              <p className="text-md text-gray-500">
                {user ? user.Phone_No : "Loading..."}
              </p>
              <p className="text-sm text-gray-400">
                {user ? user.Status : "Loading..."}
              </p>
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
