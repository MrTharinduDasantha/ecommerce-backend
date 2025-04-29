import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchAdminLogs } from "../api/auth";
import toast from "react-hot-toast";

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const logData = await fetchAdminLogs();
        setLogs(logData);
      } catch (error) {
        console.error("Error fetching logs:", error);
        toast.error("Failed to fetch logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const handleViewDetails = (log) => {
    navigate(`/dashboard/log/view-adminlogs/${log.log_id}`, {
      state: {
        log: {
          ...log,
          details: {
            ...log.details,
            oldData: log.old_data ? JSON.parse(log.old_data) : null,
            newData: log.new_data ? JSON.parse(log.new_data) : null,
          },
        },
      },
    });
  };

  const getActionBadgeWidth = (action) => {
    const length = action.length;
    if (length <= 8) return "w-24";
    if (length <= 12) return "w-32";
    if (length <= 16) return "w-40";
    if (length <= 20) return "w-48";
    return "w-56";
  };

  const filteredLogs = logs.filter((log) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const adminName = log.Admin_Name?.toLowerCase() || "";
    const timestamp = new Date(log.timestamp).toLocaleString().toLowerCase();

    return adminName.includes(lowerSearchTerm) || timestamp.includes(lowerSearchTerm);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-5 bg-[#5CAF90]"></div>
          <h2 className="text-base font-bold text-[#1D372E]">Admin Logs</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="relative flex w-full md:max-w-xl md:mx-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
              <FaSearch className="text-muted-foreground text-[#1D372E]" />
            </div>
            <input
              type="text"
              placeholder="Search by Name, Date and Time..."
              className="input input-bordered w-full pl-10 bg-white border-[#1D372E] text-[#1D372E]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary ml-2 bg-[#5CAF90] border-[#5CAF90] hover:bg-[#4a9a7d]">
              Search
            </button>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <div className="hidden sm:block">
            <table className="table min-w-[700px] w-full text-center border border-[#B7B7B7]">
              <thead className="bg-[#EAFFF7] text-[#1D372E]">
                <tr className="border-b border-[#B7B7B7]">
                  <th className="font-semibold py-2 px-3 text-xs">Admin Name</th>
                  <th className="font-semibold py-2 px-3 text-xs">Action</th>
                  <th className="font-semibold py-2 px-3 text-xs">Date and Time</th>
                  <th className="font-semibold py-2 px-3 text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[#1D372E]">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.log_id}
                    className="border-b border-[#B7B7B7] bg-[#F7FDFF]"
                  >
                    <td className="py-2 px-3 text-xs">{log.Admin_Name || "N/A"}</td>
                    <td className="py-2 px-3 text-xs">
                      <div className="flex justify-center">
                        <span
                          className={`${getActionBadgeWidth(
                            log.action
                          )} py-1 inline-flex items-center justify-center text-xs leading-4 font-semibold rounded-full border border-black-300 ${getActionStyle(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-xs">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleViewDetails(log)}
                          className="btn bg-[#5CAF90] border-[#5CAF90] btn-xs btn-square hover:bg-[#4a9a7d] p-1"
                          title="View Details"
                        >
                          <Eye className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.log_id}
                className="bg-[#F7FDFF] p-3 rounded-lg border border-[#B7B7B7]"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1">
                    <div className="font-medium text-[#1D372E] text-xs">
                      {log.Admin_Name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <span
                    className={`${getActionBadgeWidth(
                      log.action
                    )} py-1 text-xs font-semibold rounded-full border border-black-300 text-center ${getActionStyle(
                      log.action
                    )}`}
                  >
                    {log.action}
                  </span>
                </div>
                <div className="flex justify-center mt-3 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => handleViewDetails(log)}
                    className="flex items-center text-[#5CAF90] hover:text-[#4a9277] text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const getActionStyle = (action) => {
  switch (action) {
    case "Logged In":
      return "bg-blue-100 text-blue-800";
    case "Added new user":
      return "bg-green-100 text-green-800";
    case "Updated customer":
      return "bg-yellow-100 text-yellow-800";
    case "Deleted customer":
      return "bg-red-100 text-red-800";
    case "Created category":
    case "Created subcategory":
    case "Created product":
    case "Created brand":
      return "bg-emerald-100 text-emerald-800";
    case "Updated category":
    case "Updated product":
    case "Toggled category status":
      return "bg-amber-100 text-amber-800";
    case "Deleted subcategory":
    case "Deleted product":
      return "bg-rose-100 text-rose-800";
    case "Updated order status":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default AdminLogs;