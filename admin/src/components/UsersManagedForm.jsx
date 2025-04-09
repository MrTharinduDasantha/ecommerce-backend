import React, { useState, useEffect } from "react";
import { Search, UserPlus } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import * as api from "../api/auth";

const UsersManagedForm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("There was an issue fetching users.");
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = () => {
    Swal.fire({
      title: "Add New User",
      maxWidth: "100%",
      height: "100%",
      html: `
        <div class="max-h-[80vh] overflow-y-auto px-4 py-2">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-left mb-2">Full Name:</label>
              <input id="name" class="w-full px-3 py-2 border rounded-md" placeholder="Enter Name" />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-left mb-2">Email:</label>
              <input id="email" class="w-full px-3 py-2 border rounded-md" placeholder="Enter Email" />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-left mb-2">Password:</label>
              <input id="password" type="password" class="w-full px-3 py-2 border rounded-md" placeholder="Enter Password" />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-left mb-2">Phone Number:</label>
              <input id="phone" class="w-full px-3 py-2 border rounded-md" placeholder="Enter Phone Number" />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-left mb-2">Status:</label>
              <select id="status" class="w-full px-3 py-2 border rounded-md">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      `,
      focusConfirm: false,
      confirmButtonText: "Add User",
      confirmButtonColor: "#5CAF90",
      showCancelButton: true,
      cancelButtonColor: "#5CAF90",
      preConfirm: () => {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const phone = document.getElementById("phone").value;
        const status = document.getElementById("status").value;
  
        if (!name || !email || !password || !phone) {
          Swal.showValidationMessage("All fields are required");
          return false;
        }
  
        return { full_name: name, email, password, phone_no: phone, status };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newUser = result.value;
  
        try {
          // Add the user through the API
          const response = await api.addUser(newUser);
          
          // Update local state with new user data
          setUsers([...users, { id: response.id, ...newUser }]);
          
          // Show success message
          toast.success("User has been added successfully!");
  
          // Log admin action with new user details
          await api.logAdminAction("Added new admin", { // Ensure this API endpoint exists
            name: newUser.full_name,
            email: newUser.email,
            phone: newUser.phone_no,
          });
        } catch (error) {
          console.error("Error adding user:", error);
          toast.error("There was an issue adding the user.");
        }
      }
    });
  
    document.getElementById("close-modal")?.addEventListener("click", () => {
      Swal.close();
    });
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.Full_Name && user.Full_Name.toLowerCase().includes(searchLower)) ||
      (user.Email && user.Email.toLowerCase().includes(searchLower)) ||
      (user.Phone_No && user.Phone_No.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-5 ml-5">
          <h2 className="text-2xl font-bold text-[#1D372E] mb-3 md:mb-4">
            {" "}
            Admin Details
          </h2>
          <button
            onClick={handleAddUser}
            className="bg-[#5CAF90] text-white px-4 py-2 rounded-2xl flex items-center hover:bg-[#4a9277] transition-colors mr-5 cursor-pointer"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Add User
          </button>
        </div>
        <div className="p-4 border-b">
          <div className="max-w-sm mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5 z-10" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="input input-bordered w-full pl-8 md:pl-10 py-1 md:py-2 text-sm md:text-base bg-white border-2 border-[#1D372E] text-[#1D372E] rounded-2xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="block w-full overflow-x-auto">
          {/* Desktop view */}
          <div className="m-4 hidden sm:block">
            <table className="min-w-full divide-y divide-gray-200 border border-[#1D372E]">
              <thead className="bg-[#5CAF90] text-[#1D372E]">
                <tr>
                  <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                    Name
                  </th>
                  <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                    Email
                  </th>
                  <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                    Phone
                  </th>
                  <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                    Status
                  </th>
                  <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                    Created At
                  </th>
                  <th className="border-2 p-1 md:p-2 text-xs md:text-sm lg:text-base">
                    Updated At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white text-[#1D372E] divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.idUser} className="hover:bg-gray-50">
                    <td className="p-3 whitespace-nowrap border-2 border-[#1D372E] text-center">
                      {user.Full_Name}
                    </td>
                    <td className="p-3 whitespace-nowrap border-2 border-[#1D372E] text-center">
                      {user.Email}
                    </td>
                    <td className="p-3 whitespace-nowrap border-2 border-[#1D372E] text-center">
                      {user.Phone_No}
                    </td>
                    <td className="p-3 whitespace-nowrap border-2 border-[#1D372E] text-center">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border border-black-300 ${
                          user.Status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.Status}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap border-2 border-[#1D372E] text-center">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 whitespace-nowrap border-2 border-[#1D372E] text-center">
                      {new Date(user.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile view */}
          <div className="sm:hidden">
            {filteredUsers.map((user) => (
              <div key={user.idUser} className="bg-white p-4 border-b">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.Full_Name}
                    </div>
                    <div className="text-sm text-gray-500">{user.Email}</div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.Status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.Status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  {user.Phone_No}
                </div>
                <div className="text-xs text-gray-400">
                  Created: {new Date(user.created_at).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-400">
                  Updated: {new Date(user.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersManagedForm;