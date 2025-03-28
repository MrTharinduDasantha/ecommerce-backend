import { useState, useEffect } from "react";
import * as api from "../api/auth";
import Swal from "sweetalert2";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile(); // Fetch profile data
        console.log(data); // Log the response data
        setUser(data); // Set the user state with the fetched data
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile"); // Show error if API call fails
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = async () => {
    // Show SweetAlert to edit profile
    const { value: formValues } = await Swal.fire({
      title: "Edit Profile",
      html: `
        <input id="full_name" class="swal2-input" placeholder="Full Name" value="${
          user.Full_Name
        }">
        <input id="email" class="swal2-input" placeholder="Email" value="${
          user.Email
        }">
        <input id="phone_no" class="swal2-input" placeholder="Phone Number" value="${
          user.Phone_No
        }">
        <select id="status" class="swal2-input">
          <option value="Active" ${
            user.Status === "Active" ? "selected" : ""
          }>Active</option>
          <option value="Inactive" ${
            user.Status === "Inactive" ? "selected" : ""
          }>Inactive</option>
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
        await api.updateUser(user.idUser, formValues); // Update user data
        Swal.fire("Updated!", "Your profile has been updated.", "success");

        // Check if the email has changed
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
        Swal.fire("Error", "There was an error updating the profile.", error);
      }
    }
  };
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold">Profile Details</h2>
      {user ? (
        <div className="mt-4">
          <p>
            <strong>Name:</strong> {user.Full_Name}
          </p>
          <p>
            <strong>Email:</strong> {user.Email}
          </p>
          <p>
            <strong>Phone:</strong> {user.Phone_No}
          </p>
          <p>
            <strong>Status:</strong> {user.Status}
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfilePage;
