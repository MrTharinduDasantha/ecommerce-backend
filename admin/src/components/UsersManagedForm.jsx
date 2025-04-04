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
    }).then((result) => {
      if (result.isConfirmed) {
        const newUser = result.value;

        api
          .addUser(newUser)
          .then((response) => {
            setUsers([...users, { id: response.id, ...newUser }]);
            toast.success("User has been added successfully!");
          })
          .catch((error) => {
            console.error("Error adding user:", error);
            toast.error("There was an issue adding the user.");
          });
      }
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
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 mt-5 ml-5">
        <h2 className="text-2xl font-bold text-[#1D372E] mb-3 md:mb-4"> Admin Details</h2>
        <button
          onClick={handleAddUser}
          className="bg-[#5CAF90] text-white px-4 py-2 rounded-lg flex items-center hover:bg-[#4a9277] transition-colors mr-5"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add User
        </button>
      </div>
        <div className="p-4 border-b">
          <div className="flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="block w-full overflow-x-auto">
          {/* Desktop view */}
          <div className="hidden sm:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider bg-[#5CAF90]">
                    Name
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider bg-[#5CAF90]">
                    Email
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider bg-[#5CAF90]">
                    Phone
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider bg-[#5CAF90]">
                    Status
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider bg-[#5CAF90]">
                    Created At
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider bg-[#5CAF90]">
                    Updated At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.idUser} className="hover:bg-gray-50">
                    <td className="p-3 whitespace-nowrap text-black">{user.Full_Name}</td>
                    <td className="p-3 whitespace-nowrap text-black">{user.Email}</td>
                    <td className="p-3 whitespace-nowrap text-black">{user.Phone_No}</td>
                    <td className="p-3 whitespace-nowrap text-black">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.Status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.Status}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap text-black">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 whitespace-nowrap text-black">
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
