import React, { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import { FaSearch } from "react-icons/fa";
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
      maxWidth: "100%",
      height: "100%",
      html: `
         <div class="max-h-[80vh] overflow-y-auto px-4 py-2">
          <h4 class="pt-5 text-xl font-bold text-left">Add New Admin</h4> <br/>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-left mb-2">Full Name:</label>
              <input id="name" type="text" class="w-full px-3 py-2 border rounded-md" placeholder="Enter Name" />
            </div>
            <div>
              <label class="block text-sm font-medium text-left mb-2">Email:</label>
              <input id="email" type="email" class="w-full px-3 py-2 border rounded-md" placeholder="Enter Email" />
            </div>
            <div>
              <label class="block text-sm font-medium text-left mb-2">Password:</label>
              <input id="password" type="password" class="w-full px-3 py-2 border rounded-md" placeholder="Enter Password" />
            </div>
            <div>
              <label class="block text-sm font-medium text-left mb-2">Phone Number:</label>
              <input id="phone" type="tel" class="w-full px-3 py-2 border rounded-md" placeholder="Enter Phone Number" />
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
        if (!/\S+@\S+\.\S+/.test(email)) {
          Swal.showValidationMessage("Enter a valid email address");
          return false;
        }
        if (!/^\d{10}$/.test(phone)) {
          Swal.showValidationMessage("Phone number must be 10 digits");
          return false;
        }

        return { full_name: name, email, password, phone_no: phone, status };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newUser = result.value;

        try {
          const response = await api.addUser(newUser);

          try {
            await api.logAdminAction('Added new user', navigator.userAgent, JSON.stringify(newUser));
          } catch (logError) {
            console.warn("Admin action logging failed:", logError);
          }

          setUsers([
            ...users,
            { 
              idUser: response.id,
              Full_Name: newUser.full_name,
              Email: newUser.email,
              Phone_No: newUser.phone_no,
              Status: newUser.status,
              created_at: new Date(),
              updated_at: new Date()
            }
          ]);

          toast.success("User has been added successfully!");
        } catch (error) {
          console.error("Error adding user:", error);
          toast.error("User was added but some features may be limited.");
        }
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
    <div className="px-1 py-5">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-[#5CAF90]"></div>
            <h2 className="text-xl font-bold text-[#1D372E]">Admin Details</h2>
          </div>
          <button
            onClick={handleAddUser}
            className="bg-[#5CAF90] text-white px-4 py-2 rounded-2xl flex items-center hover:bg-[#4a9277] transition-colors sm:ml-auto"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            <span className="text-sm sm:text-base">Add User</span>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <div className="relative flex w-full md:max-w-xl md:mx-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <FaSearch className="text-muted-foreground text-[#1D372E]" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="input input-bordered w-full pl-10 bg-white border-[#1D372E] text-[#1D372E]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary ml-2 bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]">Search</button>
            </div>
          </div>

          <div className="block w-full overflow-x-auto">
            <div className="hidden sm:block">
              <table className="table min-w-[700px] text-center border border-[#B7B7B7]">
                <thead className="bg-[#EAFFF7] text-[#1D372E]">
                  <tr className="border-b border-[#B7B7B7]">
                    <th className="font-semibold p-3 w-[20%]">Name</th>
                    <th className="font-semibold p-3 w-[20%]">Email</th>
                    <th className="font-semibold p-3 w-[20%]">Phone</th>
                    <th className="font-semibold p-3 w-[20%]">Status</th>
                    <th className="font-semibold p-3 w-[20%]">Created At</th>
                    <th className="font-semibold p-3 w-[20%]">Updated At</th>
                  </tr>
                </thead>
                <tbody className="text-[#1D372E]">
                  {filteredUsers.map((user) => (
                    <tr key={user.idUser} className="border-b border-[#B7B7B7] bg-[#F7FDFF]">
                      <td className="p-5">{user.Full_Name}</td>
                      <td className="p-5">{user.Email}</td>
                      <td className="p-5">{user.Phone_No}</td>
                      <td className="p-5">
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
                      <td className="p-5">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>{new Date(user.updated_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="sm:hidden space-y-4">
  {filteredUsers.map((user) => (
    <div key={user.idUser} className="bg-[#F7FDFF] p-4 rounded-lg border border-[#B7B7B7]">
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-1">
          <div className="font-medium text-[#1D372E]">{user.Full_Name}</div>
          <div className="text-sm text-gray-600">{user.Email}</div>
        </div>
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border border-black-300  ${
            user.Status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
                }`}
           >
          {user.Status}
           </span>
              </div>
                <div className="text-sm text-gray-600 mb-2">{user.Phone_No}</div>
                 <div className="text-xs text-gray-500 space-y-1">
                  <div>Created: {new Date(user.created_at).toLocaleDateString()}</div>
                   <div>Updated: {new Date(user.updated_at).toLocaleDateString()}</div>
                </div>
             </div>
             ))}
          </div>   
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersManagedForm;