import React, { useState, useEffect } from "react";
import { HiOutlineUserAdd } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";
import * as api from "../api/auth";

const UsersManagedForm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_no: "",
    status: "Active",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await api.fetchUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("There was an issue fetching users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    const { full_name, email, password, phone_no, status } = addUserForm;
    if (
      !full_name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !phone_no.trim()
    ) {
      toast.error("All fields are required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    if (!/^\d{10}$/.test(phone_no)) {
      toast.error("Phone number must be 10 digits");
      return;
    }
    try {
      const response = await api.addUser(addUserForm);
      try {
        await api.logAdminAction(
          "Added new user",
          navigator.userAgent,
          JSON.stringify(addUserForm)
        );
      } catch (logError) {
        console.warn("Admin action logging failed:", logError);
      }
      setUsers([
        ...users,
        {
          idUser: response.id,
          Full_Name: full_name,
          Email: email,
          Phone_No: phone_no,
          Status: status,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
      toast.success("User has been added successfully!");
      setShowAddUserModal(false);
      setAddUserForm({
        full_name: "",
        email: "",
        password: "",
        phone_no: "",
        status: "Active",
      });
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user.");
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
    const filtered = users.filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.Full_Name?.toLowerCase().includes(searchLower) ||
        user.Email?.toLowerCase().includes(searchLower) ||
        user.Phone_No?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredUsers(filtered);
  };

  // Reset filtered users when search term is cleared
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  if (loading) {
    return (
      <div className="card bg-white">
        <div className="card-body">
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-[#5CAF90]"></div>
            <h2 className="text-lg md:text-xl font-bold text-[#1D372E]">
              Admin Details
            </h2>
          </div>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="btn btn-primary bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d] flex items-center sm:ml-auto"
          >
            <HiOutlineUserAdd className="w-5 h-5 mr-0.5" />
            Add User
          </button>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <div className="relative flex w-full md:max-w-xl md:mx-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <FaSearch className="text-muted-foreground text-[#1D372E]" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="input input-bordered input-sm md:input-md w-full pl-10 bg-white border-[#1D372E] text-[#1D372E]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="btn btn-primary btn-sm md:btn-md ml-2 bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]"
              >
                Search
              </button>
            </div>
          </div>

          <div className="block w-full overflow-x-auto">
            {filteredUsers.length === 0 ? (
              <div className="alert bg-[#1D372E] border-[#1D372E]">
                <span>No users found.</span>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden sm:block">
                  <table className="table min-w-[700px] text-center border border-[#1D372E]">
                    <thead className="bg-[#EAFFF7] text-[#1D372E]">
                      <tr className="border-b border-[#1D372E]">
                        <th className="font-semibold py-2 px-3 md:text-xs lg:text-sm">
                          Name
                        </th>
                        <th className="font-semibold py-2 px-3 md:text-xs lg:text-sm">
                          Email
                        </th>
                        <th className="font-semibold py-2 px-3 md:text-xs lg:text-sm">
                          Phone
                        </th>
                        <th className="font-semibold py-2 px-3 md:text-xs lg:text-sm">
                          Status
                        </th>
                        <th className="font-semibold py-2 px-3 md:text-xs lg:text-sm">
                          Created
                        </th>
                        <th className="font-semibold py-2 px-3 md:text-xs lg:text-sm">
                          Updated
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-[#1D372E]">
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.idUser}
                          className="border-b border-[#1D372E]"
                        >
                          <td className="py-2 px-3 text-xs lg:text-sm">
                            {user.Full_Name}
                          </td>
                          <td className="py-2 px-3 text-xs lg:text-sm">
                            {user.Email}
                          </td>
                          <td className="py-2 px-3 text-xs lg:text-sm">
                            {user.Phone_No}
                          </td>
                          <td className="py-2 px-3 text-xs lg:text-sm">
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
                          <td className="py-2 text-xs lg:text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-2 text-xs lg:text-sm">
                            {new Date(user.updated_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden space-y-3">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.idUser}
                      className="bg-[#F7FDFF] p-3 rounded-lg border border-[#B7B7B7]"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="space-y-1">
                          <div className="font-medium text-[#1D372E] text-xs">
                            {user.Full_Name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {user.Email}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border border-black-300 ${
                            user.Status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.Status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {user.Phone_No}
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>
                          Created:{" "}
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                        <div>
                          Updated:{" "}
                          {new Date(user.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showAddUserModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md max-h-[95vh] bg-white text-[#1D372E]">
            <h3 className="font-bold text-base lg:text-lg mb-4">
              Add New Admin
            </h3>
            <button
              onClick={() => setShowAddUserModal(false)}
              className="absolute right-6 top-7 text-lg"
            >
              <IoClose className="w-5 h-5" />
            </button>
            <form onSubmit={handleAddUserSubmit}>
              <div className="form-control mb-4">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="abel-text text-sm lg:text-base font-medium">
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  value={addUserForm.full_name}
                  onChange={(e) =>
                    setAddUserForm({
                      ...addUserForm,
                      full_name: e.target.value,
                    })
                  }
                  className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  placeholder="Enter Name"
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="abel-text text-sm lg:text-base font-medium">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  value={addUserForm.email}
                  onChange={(e) =>
                    setAddUserForm({ ...addUserForm, email: e.target.value })
                  }
                  className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  placeholder="Enter Email"
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="abel-text text-sm lg:text-base font-medium">
                    Password
                  </span>
                </label>
                <input
                  type="password"
                  value={addUserForm.password}
                  onChange={(e) =>
                    setAddUserForm({ ...addUserForm, password: e.target.value })
                  }
                  className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  placeholder="Enter Password"
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="abel-text text-sm lg:text-base font-medium">
                    Phone Number
                  </span>
                </label>
                <input
                  type="tel"
                  value={addUserForm.phone_no}
                  onChange={(e) =>
                    setAddUserForm({ ...addUserForm, phone_no: e.target.value })
                  }
                  className="input input-bordered input-sm md:input-md w-full bg-white border-[#1D372E] text-[#1D372E]"
                  placeholder="Enter Phone Number"
                  required
                />
              </div>
              <div className="form-control mb-4">
                <label className="label text-[#1D372E] mb-0.5">
                  <span className="abel-text text-sm lg:text-base font-medium">
                    Status
                  </span>
                </label>
                <select
                  value={addUserForm.status}
                  onChange={(e) =>
                    setAddUserForm({ ...addUserForm, status: e.target.value })
                  }
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
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagedForm;
