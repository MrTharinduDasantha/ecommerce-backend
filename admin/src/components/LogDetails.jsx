import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const LogDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { log } = location.state || {};

  if (!log) {
    return (
      <div className="p-8 text-center">
        <p>Log not found</p>
        <button
          onClick={() => navigate("/dashboard/admin-logs")}
          className="inline-flex items-center text-[#5CAF90] hover:text-[#4a9277] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Logs
        </button>
      </div>
    );
  }

  const getDetailsContent = () => {
    let detailsContent = [];

    // Admin Information Section
    detailsContent.push(
      <div key="admin-info" className="px-1 py-5">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-[#5CAF90]"></div>
          <h2 className="text-xl font-bold text-[#1D372E]">Admin Action</h2>
        </div>
        <div className="bg-[#F4F4F4] rounded-lg shadow-sm overflow-hidden p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-[#EAFFF7]"></div>
            <h3 className="font-semibold text-[#1D372E]">Admin Information</h3>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 p-2">
              Admin Name:{" "}
              <span className="font-medium p-2">{log.Admin_Name || "N/A"}</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 p-2">
              Action:
              <span
                className={`items-center px-2.5 py-0.5 rounded-full w-45 text-sm font-medium p-2 ${getActionStyle(
                  log.action
                )}`}
              >
                {log.action}
              </span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 p-2">
              Timestamp:{" "}
              <span className="font-medium p-2">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </span>
          </div>
        </div>
      </div>
    );

    // Action Details Section
    if (log.new_user_info) {
      try {
        const details = JSON.parse(log.new_user_info);

        // Handle Add New Admin Action
        if (log.action === "Added new user") {
          detailsContent.push(
            <div key="new-admin" className="px-1 py-5">
              <div className="bg-[#F4F4F4] rounded-lg shadow-sm overflow-hidden p-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-[#EAFFF7]"></div>
                  <h3 className="font-semibold text-[#1D372E]">
                    New Admin Details
                  </h3>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  {Object.entries(details).map(([key, value]) => (
                    <div key={key} className="mb-2">
                      <span className="text-sm font-medium capitalize">
                        {key}:{" "}
                      </span>
                      <span className="text-sm">
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }
        // Handle Update Actions (other than admin addition)
        else if (
          log.action.startsWith("Updated") ||
          log.action === "Toggled category status"
        ) {
          const title =
            {
              "Updated category": "Category Changes",
              "Updated product": "Product Changes",
              "Updated customer": "Customer Changes",
              "Updated subcategory": "Subcategory Changes",
              "Toggled category status": "Category Status Changes",
            }[log.action] || "Changes Made";

          detailsContent.push(
            <div key="changes" className="px-1 py-5">
              <div className="bg-[#F4F4F4] rounded-lg shadow-sm overflow-hidden p-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-[#EAFFF7]"></div>
                  <h3 className="font-semibold text-[#1D372E]">Changes Made</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 mb-3">
                      Original Data
                    </h4>
                    {Object.entries(details.originalData || {}).map(
                      ([key, value]) => (
                        <div key={key} className="mb-2 text-[#1D372E]">
                          <span className="text-sm font-medium capitalize">
                            {key}:{" "}
                          </span>
                          <span className="text-sm">
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600 mb-3">
                      Updated Data
                    </h4>
                    {Object.entries(details.updatedData || {}).map(
                      ([key, value]) => (
                        <div key={key} className="mb-2 text-[#1D372E]">
                          <span className="text-sm font-medium capitalize">
                            {key}:{" "}
                          </span>
                          <span className="text-sm">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }
        // Handle Create Actions (admin addition not included)
        else if (log.action.startsWith("Created")) {
          const title = {
            "Created category": "Newly Created Category",
            "Created product": "Newly Created Product",
            "Created brand": "Newly Created Brand",
            "Created subcategory": "Newly Created Subcategory",
          }[log.action];

          detailsContent.push(
            <div key="creation" className="px-1 py-5">
              <div className="bg-[#F4F4F4] rounded-lg shadow-sm overflow-hidden p-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-[#EAFFF7]"></div>
                  <h3 className="font-semibold text-[#1D372E]">{title}</h3>
                </div>
                <div className="bg-white text-[#1D372E] p-4 rounded-lg">
                  {Object.entries(details).map(([key, value]) => (
                    <div key={key} className="mb-2">
                      <span className="text-sm font-medium capitalize">
                        {key}:{" "}
                      </span>
                      <span className="text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }
        // Handle Delete Actions
        else if (log.action.startsWith("Deleted")) {
          const title = {
            "Deleted customer": "Delete Customer Details",
            "Deleted subcategory": "Deleted Subcategory Details",
            "Deleted product": "Deleted Product Details",
            "Deleted category": "Deleted Category Details",
          }[log.action];

          detailsContent.push(
            <div key="deletion" className="px-1 py-5">
              <div className="bg-[#F4F4F4] rounded-lg shadow-sm overflow-hidden p-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-[#EAFFF7]"></div>
                  <h3 className="font-semibold text-[#1D372E]">{title}</h3>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  {Object.entries(details).map(([key, value]) => (
                    <div key={key} className="mb-2">
                      <span className="text-sm font-medium capitalize">
                        {key}:{" "}
                      </span>
                      <span className="text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }
      } catch (e) {
        detailsContent.push(
          <div key="error" className="px-1 py-5">
            <div className="bg-[#F4F4F4] rounded-lg shadow-sm overflow-hidden p-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-[#EAFFF7]"></div>
                <h3 className="font-semibold text-[#1D372E]">
                  Additional Information
                </h3>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Failed to parse user info: {log.new_user_info}
                </p>
              </div>
            </div>
          </div>
        );
      }
    }

    // Device Information Section
    if (log.device_info) {
      detailsContent.push(
        <div key="device-info" className="px-1 py-5">
          <div className="bg-[#F4F4F4] rounded-lg shadow-sm overflow-hidden p-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-[#EAFFF7]"></div>
              <h3 className="font-semibold text-[#1D372E]">
                Device Information
              </h3>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600">{log.device_info}</p>
            </div>
          </div>
        </div>
      );
    }

    return detailsContent;
  };

  return (
    <div className="w-full sm:w-500px mx-auto p-3 sm:p-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => navigate("/dashboard/admin-logs")}
            className="inline-flex items-center text-[#5CAF90] hover:text-[#4a9277] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Logs
          </button>
        </div>
        {getDetailsContent()}
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
    case "Updated category":
    case "Updated product":
    case "Updated subcategory":
      return "bg-yellow-100 text-yellow-800";
    case "Deleted customer":
    case "Deleted category":
    case "Deleted subcategory":
    case "Deleted product":
      return "bg-red-100 text-red-800";
    case "Created category":
    case "Created subcategory":
    case "Created product":
    case "Created brand":
      return "bg-emerald-100 text-emerald-800";
    case "Toggled category status":
      return "bg-amber-100 text-amber-800";
    case "Updated order status":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default LogDetails;
