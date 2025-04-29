import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";

const LogDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { log } = location.state || {};
  const [expandedSections, setExpandedSections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for consistency; set to false after checking log data
    if (log) {
      setLoading(false);
    } else {
      setLoading(false); // No log data, so no need to keep loading
    }
  }, [log]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

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

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const isSectionExpanded = (sectionId) => {
    return expandedSections[sectionId] === true;
  };

  const getDetailsContent = () => {
    let detailsContent = [];

    // Admin Information Section
    detailsContent.push(
      <div key="admin-info">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/dashboard/admin-logs")}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#5CAF90] text-white hover:bg-[#4a9277] transition-colors cursor-pointer"
            aria-label="Back to admin logs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-[#5CAF90]"></div>
            <h2 className="text-base font-bold text-[#1D372E]">Admin Action</h2>
          </div>
        </div>
        <div className="bg-[#F4F4F4] rounded-lg shadow-sm overflow-hidden p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-[#EAFFF7]"></div>
            <h3 className=" text-base font-semibold text-[#1D372E]">
              Admin Information
            </h3>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 p-2">
              Admin Name:{" "}
              <span className="font-medium p-2 text-xs">
                {log.Admin_Name || "N/A"}
              </span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 p-2">
              Action:
              <span
                className={`items-center px-2.5 py-0.5 rounded-full w-45 font-medium p-2 text-xs ${getActionStyle(
                  log.action
                )}`}
              >
                {log.action}
              </span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 p-2">
              Date and Time:{" "}
              <span className="font-medium p-2 text-xs">
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

        // Handle Create Product Action
        if (log.action === "Created product") {
          detailsContent.push(
            <div key="product-creation" className="px-1 py-5">
              <div className="bg-[#F4F4F4] rounded-lg shadow-sm overflow-hidden p-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-5 bg-[#EAFFF7]"></div>
                  <h3 className="font-semibold text-[#1D372E]">
                    Product Creation Details
                  </h3>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Basic Product Information */}
                    <div className="p-3 border border-[#E5E7EB] rounded-md">
                      <h4 className=" font-medium text-[#1D372E] mb-2 text-sm">
                        Basic Information
                      </h4>
                      {Object.entries(details)
                        .filter(
                          ([key]) =>
                            ![
                              "variations",
                              "faqs",
                              "sub_images",
                              "sub_categories",
                              "main_image",
                            ].includes(key)
                        )
                        .map(([key, value]) => (
                          <div key={key} className="mb-2 text-[#1D372E]">
                            <span className="text-sm font-medium capitalize">
                              {key.replace("_", " ")}:{" "}
                            </span>
                            <span className="text-xs">
                              {typeof value === "object"
                                ? JSON.stringify(value)
                                : value}
                            </span>
                          </div>
                        ))}
                    </div>

                    {/* Images Section */}
                    {(details.main_image || details.sub_images?.length > 0) && (
                      <div className="p-3 border border-[#E5E7EB] rounded-md">
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => toggleSection("createdImages")}
                        >
                          {isSectionExpanded("createdImages") ? (
                            <ChevronDown className="w-4 h-4 mr-1 text-[#5CAF90]" />
                          ) : (
                            <ChevronRight className="w-4 h-4 mr-1 text-[#5CAF90]" />
                          )}
                          <h4 className="font-medium text-[#1D372E] text-sm">
                            Images
                          </h4>
                        </div>
                        {isSectionExpanded("createdImages") && (
                          <div className="mt-2">
                            {details.main_image && (
                              <div className="mb-4">
                                <h5 className="text-xs font-medium text-gray-600">
                                  Main Image
                                </h5>
                                <img
                                  src={details.main_image}
                                  alt="Main Image"
                                  className="w-32 h-32 object-cover rounded-md mt-2"
                                  onError={(e) =>
                                    (e.target.src = "/placeholder.svg")
                                  }
                                />
                              </div>
                            )}
                            {details.sub_images?.length > 0 && (
                              <div>
                                <h5 className="text-xs font-medium text-gray-600">
                                  Sub Images
                                </h5>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {details.sub_images.map((img, index) => (
                                    <img
                                      key={index}
                                      src={img}
                                      alt={`Sub Image ${index + 1}`}
                                      className="w-24 h-24 object-cover rounded-md"
                                      onError={(e) =>
                                        (e.target.src = "/placeholder.svg")
                                      }
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Subcategories Section */}
                    {details.sub_categories?.length > 0 && (
                      <div className="p-3 border border-[#E5E7EB] rounded-md">
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => toggleSection("createdSubCategories")}
                        >
                          {isSectionExpanded("createdSubCategories") ? (
                            <ChevronDown className="w-4 h-4 mr-1 text-[#5CAF90]" />
                          ) : (
                            <ChevronRight className="w-4 h-4 mr-1 text-[#5CAF90]" />
                          )}
                          <h4 className="font-medium text-[#1D372E] text-sm">
                            Subcategories
                          </h4>
                        </div>
                        {isSectionExpanded("createdSubCategories") && (
                          <div className="mt-2">
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200 text-[#1D372E]">
                                <thead className="bg-[#EAFFF7]">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-sm font-medium uppercase tracking-wider">
                                      ID
                                    </th>
                                    <th className="px-3 py-2 text-left text-sm font-medium uppercase tracking-wider">
                                      Description
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {details.sub_categories.map(
                                    (subCat, index) => (
                                      <tr key={index}>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs">
                                          {subCat.idSub_Category}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs">
                                          {subCat.Description}
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Product Variations Section */}
                    {details.variations?.length > 0 && (
                      <div className="p-3 border border-[#E5E7EB] rounded-md">
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => toggleSection("createdVariations")}
                        >
                          {isSectionExpanded("createdVariations") ? (
                            <ChevronDown className="w-4 h-4 mr-1 text-[#5CAF90]" />
                          ) : (
                            <ChevronRight className="w-4 h-4 mr-1 text-[#5CAF90]" />
                          )}
                          <h4 className="font-medium text-[#1D372E] text-sm">
                            Product Variations
                          </h4>
                        </div>
                        {isSectionExpanded("createdVariations") && (
                          <div className="mt-2">
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200 text-[#1D372E]">
                                <thead className="bg-[#EAFFF7]">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-sm font-medium uppercase tracking-wider">
                                      Color
                                    </th>
                                    <th className="px-3 py-2 text-left text-sm font-medium uppercase tracking-wider">
                                      Size
                                    </th>
                                    <th className="px-3 py-2 text-left text-sm font-medium uppercase tracking-wider">
                                      Quantity
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {details.variations.map(
                                    (variation, index) => (
                                      <tr key={index}>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs">
                                          <div className="flex items-center">
                                            <div
                                              className="w-4 h-4 rounded-full mr-2"
                                              style={{
                                                backgroundColor:
                                                  variation.colorCode,
                                              }}
                                            />
                                            {variation.colorCode}
                                          </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs">
                                          {variation.size}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-xs">
                                          {variation.quantity}
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* FAQs Section */}
                    {details.faqs?.length > 0 && (
                      <div className="p-3 border border-[#E5E7EB] rounded-md">
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => toggleSection("createdFaqs")}
                        >
                          {isSectionExpanded("createdFaqs") ? (
                            <ChevronDown className="w-4 h-4 mr-1 text-[#5CAF90]" />
                          ) : (
                            <ChevronRight className="w-4 h-4 mr-1 text-[#5CAF90]" />
                          )}
                          <h4 className="font-medium text-[#1D372E] text-sm">
                            Product FAQs
                          </h4>
                        </div>
                        {isSectionExpanded("createdFaqs") && (
                          <div className="mt-2 space-y-3">
                            {details.faqs.map((faq, index) => (
                              <div
                                key={index}
                                className="bg-white p-3 rounded-lg border border-[#E5E7EB]"
                              >
                                <h5 className="font-medium text-[#1D372E] mb-1 text-xs">
                                  Q: {faq.question}
                                </h5>
                                <p className="text-gray-600 text-xs">
                                  A: {faq.answer}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }
        // Handle Update Product Action
        else if (log.action === "Updated product") {
          detailsContent.push(
            <div key="product-update" className="px-1 py-5">
              <div className="bg-[#F4F4F4] rounded-lg shadow-sm overflow-hidden p-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-[#EAFFF7]"></div>
                  <h3 className="text-base font-semibold text-[#1D372E]">
                    Product Update Details
                  </h3>
                </div>
                <div className="space-y-4">
                  {/* Basic Information Changes */}
                  <div className="bg-white p-4 rounded-lg">
                    <div
                      className="flex items-center cursor-pointer mb-3"
                      onClick={() => toggleSection("basicChanges")}
                    >
                      {isSectionExpanded("basicChanges") ? (
                        <ChevronDown className="w-4 h-4 mr-1 text-[#5CAF90]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 mr-1 text-[#5CAF90]" />
                      )}
                      <h4 className="font-medium text-[#1D372E] text-sm">
                        Basic Information
                      </h4>
                    </div>
                    {isSectionExpanded("basicChanges") && (
                      <div className="p-3 border border-[#E5E7EB] rounded-md">
                        {Object.entries(details.updatedData || {})
                          .filter(
                            ([key]) =>
                              ![
                                "variations",
                                "sub_images",
                                "faqs",
                                "sub_categories",
                                "main_image",
                              ].includes(key)
                          )
                          .map(([key, value]) => (
                            <div key={key} className="mb-2 text-[#1D372E]">
                              <span className="text-sm font-medium capitalize">
                                {key.replace("_", " ")}:{" "}
                              </span>
                              <span className="text-xs">
                                {typeof value === "object"
                                  ? JSON.stringify(value)
                                  : value}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Images Changes */}
                  {details.updatedData?.main_image ||
                  details.updatedData?.sub_images?.length > 0 ? (
                    <div className="bg-white p-4 rounded-lg">
                      <div
                        className="flex items-center cursor-pointer mb-3"
                        onClick={() => toggleSection("imageChanges")}
                      >
                        {isSectionExpanded("imageChanges") ? (
                          <ChevronDown className="w-4 h-4 mr-1 text-[#5CAF90]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 mr-1 text-[#5CAF90]" />
                        )}
                        <h4 className="font-medium text-[#1D372E] text-sm">
                          Images
                        </h4>
                      </div>
                      {isSectionExpanded("imageChanges") && (
                        <div className="p-3 border border-[#E5E7EB] rounded-md">
                          {details.updatedData?.main_image && (
                            <div className="mb-4">
                              <h6 className="text-xs font-medium text-gray-600 ">
                                Main Image
                              </h6>
                              <img
                                src={details.updatedData.main_image}
                                alt="Updated Main Image"
                                className="w-32 h-32 object-cover rounded-md mt-2"
                                onError={(e) =>
                                  (e.target.src = "/placeholder.svg")
                                }
                              />
                            </div>
                          )}
                          {details.updatedData?.sub_images?.length > 0 && (
                            <div>
                              <h6 className="text-xs font-medium text-gray-600">
                                Sub Images
                              </h6>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {details.updatedData.sub_images.map(
                                  (img, index) => (
                                    <img
                                      key={index}
                                      src={img}
                                      alt={`Updated Sub Image ${index + 1}`}
                                      className="w-24 h-24 object-cover rounded-md"
                                      onError={(e) =>
                                        (e.target.src = "/placeholder.svg")
                                      }
                                    />
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* Subcategories Changes */}
                  {details.updatedData?.sub_categories?.length > 0 && (
                    <div className="bg-white p-4 rounded-lg">
                      <div
                        className="flex items-center cursor-pointer mb-3"
                        onClick={() => toggleSection("subCategoryChanges")}
                      >
                        {isSectionExpanded("subCategoryChanges") ? (
                          <ChevronDown className="w-4 h-4 mr-1 text-[#5CAF90]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 mr-1 text-[#5CAF90]" />
                        )}
                        <h4 className="font-medium text-[#1D372E] text-sm">
                          Subcategories
                        </h4>
                      </div>
                      {isSectionExpanded("subCategoryChanges") && (
                        <div className="p-3 border border-[#E5E7EB] rounded-md">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-[#1D372E]">
                              <thead className="bg-[#EAFFF7]">
                                <tr>
                                  <th className="px-3 py-2 text-left text-sm font-medium uppercase tracking-wider">
                                    ID
                                  </th>
                                  <th className="px-3 py-2 text-left text-sm font-medium uppercase tracking-wider">
                                    Description
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {details.updatedData.sub_categories.map(
                                  (subCat, index) => (
                                    <tr key={index}>
                                      <td className="px-3 py-2 whitespace-nowrap text-xs">
                                        {subCat.idSub_Category}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap text-xs">
                                        {subCat.Description}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Variations Changes */}
                  {details.updatedData?.variations?.length > 0 && (
                    <div className="bg-white p-4 rounded-lg">
                      <div
                        className="flex items-center cursor-pointer mb-3"
                        onClick={() => toggleSection("variationChanges")}
                      >
                        {isSectionExpanded("variationChanges") ? (
                          <ChevronDown className="w-4 h-4 mr-1 text-[#5CAF90]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 mr-1 text-[#5CAF90]" />
                        )}
                        <h4 className="font-medium text-[#1D372E] text-sm">
                          Product Variations
                        </h4>
                      </div>
                      {isSectionExpanded("variationChanges") && (
                        <div className="p-3 border border-[#E5E7EB] rounded-md">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-[#1D372E]">
                              <thead className="bg-[#EAFFF7]">
                                <tr>
                                  <th className="px-3 py-2 text-left text-sm font-medium uppercase tracking-wider ">
                                    Color
                                  </th>
                                  <th className="px-3 py-2 text-left text-sm font-medium uppercase tracking-wider">
                                    Size
                                  </th>
                                  <th className="px-3 py-2 text-left text-sm font-medium uppercase tracking-wider">
                                    Quantity
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {details.updatedData.variations.map(
                                  (variation, index) => (
                                    <tr key={index}>
                                      <td className="px-3 py-2 whitespace-nowrap text-xs">
                                        <div className="flex items-center">
                                          <div
                                            className="w-4 h-4 rounded-full mr-2"
                                            style={{
                                              backgroundColor:
                                                variation.Colour ||
                                                variation.colorCode,
                                            }}
                                          />
                                          {variation.Colour ||
                                            variation.colorCode}
                                        </div>
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap text-xs">
                                        {variation.Size || variation.size}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap text-xs">
                                        {variation.Qty || variation.quantity}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* FAQs Changes */}
                  {details.updatedData?.faqs?.length > 0 && (
                    <div className="bg-white p-4 rounded-lg">
                      <div
                        className="flex items-center cursor-pointer mb-3"
                        onClick={() => toggleSection("faqChanges")}
                      >
                        {isSectionExpanded("faqChanges") ? (
                          <ChevronDown className="w-4 h-4 mr-1 text-[#5CAF90]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 mr-1 text-[#5CAF90]" />
                        )}
                        <h4 className="font-medium text-[#1D372E] text-sm">
                          FAQs
                        </h4>
                      </div>
                      {isSectionExpanded("faqChanges") && (
                        <div className="p-3 border border-[#E5E7EB] rounded-md">
                          <div className="space-y-3">
                            {details.updatedData.faqs.map((faq, index) => (
                              <div
                                key={index}
                                className="bg-white p-3 rounded-lg border border-[#E5E7EB]"
                              >
                                <h6 className="font-medium text-[#1D372E] mb-1 text-xs">
                                  Q: {faq.Question || faq.question}
                                </h6>
                                <p className="text-gray-600 text-xs">
                                  A: {faq.Answer || faq.answer}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }
        // Handle Delete Product Action
        else if (log.action === "Deleted product") {
          detailsContent.push(
            <div key="product-deletion" className="px-1 py-5">
              <div className="bg-[#F4F4F4] rounded-lg shadow-sm overflow-hidden p-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-[#EAFFF7]"></div>
                  <h3 className="font-semibold text-[#1D372E] text-base">
                    Deleted Product Details
                  </h3>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  {/* Basic Product Information */}
                  <div className="p-3 border border-[#E5E7EB] rounded-md mb-4">
                    <h4 className="font-medium text-[#1D372E] mb-2 text-sm">
                      Basic Information
                    </h4>
                    {Object.entries(details)
                      .filter(([key]) => !["variations", "faqs"].includes(key))
                      .map(([key, value]) => (
                        <div key={key} className="mb-2 text-[#1D372E]">
                          <span className="text-sm font-medium capitalize">
                            {key.replace("_", " ")}:{" "}
                          </span>
                          <span className="text-xs">
                            {typeof value === "object" && !Array.isArray(value)
                              ? JSON.stringify(value)
                              : value}
                          </span>
                        </div>
                      ))}
                  </div>

                  {/* Product Variations */}
                  {details.variations?.length > 0 && (
                    <div className="p-3 border border-[#E5E7EB] rounded-md mb-4">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleSection("deletedVariations")}
                      >
                        {isSectionExpanded("deletedVariations") ? (
                          <ChevronDown className="w-4 h-4 mr-1 text-[#5CAF90]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 mr-1 text-[#5CAF90]" />
                        )}
                        <h4 className="font-medium text-[#1D372E] text-sm">
                          Deleted Product Variations
                        </h4>
                      </div>
                      {isSectionExpanded("deletedVariations") && (
                        <div className="mt-2">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-[#1D372E]">
                              <thead className="bg-[#EAFFF7]">
                                <tr>
                                  <th className="px-3 py-2 text-left text-sm font-medium uppercase tracking-wider">
                                    Color
                                  </th>
                                  <th className="px-3 py-2 text-left text-sm font-medium uppercase tracking-wider">
                                    Size
                                  </th>
                                  <th className="px-3 py-2 text-left text-sm font-medium uppercase tracking-wider">
                                    Quantity
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {details.variations.map((variation, index) => (
                                  <tr key={index}>
                                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                                      <div className="flex items-center">
                                        <div
                                          className="w-4 h-4 rounded-full mr-2"
                                          style={{
                                            backgroundColor:
                                              variation.Colour ||
                                              variation.colorCode,
                                          }}
                                        />
                                        {variation.Colour ||
                                          variation.colorCode}
                                      </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                                      {variation.Size || variation.size}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                                      {variation.Qty || variation.quantity}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Deleted FAQs */}
                  {details.faqs?.length > 0 && (
                    <div className="p-3 border border-[#E5E7EB] rounded-md">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleSection("deletedFaqs")}
                      >
                        {isSectionExpanded("deletedFaqs") ? (
                          <ChevronDown className="w-4 h-4 mr-1 text-[#5CAF90]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 mr-1 text-[#5CAF90]" />
                        )}
                        <h4 className="font-medium text-[#1D372E] text-sm">
                          Deleted Product FAQs
                        </h4>
                      </div>
                      {isSectionExpanded("deletedFaqs") && (
                        <div className="mt-2 space-y-3">
                          {details.faqs.map((faq, index) => (
                            <div
                              key={index}
                              className="bg-white p-3 rounded-lg border border-[#E5E7EB]"
                            >
                              <h5 className="font-medium text-[#1D372E] mb-1 text-xs">
                                Q: {faq.Question || faq.question}
                              </h5>
                              <p className="text-gray-600 text-xs">
                                A: {faq.Answer || faq.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }
        // Handle Other Actions (Generic Handling)
        else if (
          log.action.startsWith("Created") ||
          log.action.startsWith("Updated") ||
          log.action.startsWith("Deleted")
        ) {
          const title =
            {
              "Created category": "Newly Created Category",
              "Created product": "Newly Created Product",
              "Created brand": "Newly Created Brand",
              "Created subcategory": "Newly Created Subcategory",
              "Created discount": "Newly Created Discount",
              "Updated category": "Category Changes",
              "Updated product": "Product Changes",
              "Updated customer": "Customer Changes",
              "Updated subcategory": "Subcategory Changes",
              "Updated discount": "Discount Changes",
              "Toggled category status": "Category Status Changes",
              "Deleted customer": "Delete Customer Details",
              "Deleted subcategory": "Deleted Subcategory Details",
              "Deleted product": "Deleted Product Details",
              "Deleted category": "Deleted Category Details",
              "Deleted discount": "Deleted Discount Details",
            }[log.action] || "Action Details";

          detailsContent.push(
            <div key="generic-action" className="px-1 py-5">
              <div className="bg-[#F4F4F4] rounded-lg shadow-sm overflow-hidden p-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-[#EAFFF7]"></div>
                  <h3 className="font-semibold text-[#1D372E]">{title}</h3>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  {details.originalData || details.updatedData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {details.updatedData && (
                        <div className="p-3 border border-[#E5E7EB] rounded-md">
                          <h5 className="text-sm font-medium text-gray-600 mb-3">
                            Updated Data
                          </h5>
                          {Object.entries(details.updatedData).map(
                            ([key, value]) => (
                              <div key={key} className="mb-2 text-[#1D372E]">
                                <span className="text-sm font-medium capitalize">
                                  {key.replace("_", " ")}:{" "}
                                </span>
                                <span className="text-xs">
                                  {typeof value === "object"
                                    ? JSON.stringify(value)
                                    : value}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    Object.entries(details).map(([key, value]) => (
                      <div key={key} className="mb-2 text-[#1D372E]">
                        <span className="text-sm font-medium capitalize">
                          {key.replace("_", " ")}:{" "}
                        </span>
                        <span className="text-sm">
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : value}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        }
        // Handle Other Actions (e.g., Added new user)
        else {
          detailsContent.push(
            <div key="other-action" className="px-1 py-5">
              <div className="bg-[#F4F4F4] rounded-lg shadow-sm overflow-hidden p-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-[#EAFFF7]"></div>
                  <h3 className="font-semibold text-[#1D372E]">
                    Additional Information
                  </h3>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  {Object.entries(details).map(([key, value]) => (
                    <div key={key} className="mb-2 text-[#1D372E]">
                      <span className="text-sm font-medium capitalize">
                        {key.replace("_", " ")}:{" "}
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
              <h3 className="test-base font-semibold text-[#1D372E]">
                Device Information
              </h3>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-gray-600 text-xs">{log.device_info}</p>
            </div>
          </div>
        </div>
      );
    }

    return detailsContent;
  };

  return (
    <div className="w-315 mx-auto p-6 sm:p-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
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
    case "Updated discount":
      return "bg-yellow-100 text-yellow-800";
    case "Deleted customer":
    case "Deleted category":
    case "Deleted subcategory":
    case "Deleted product":
    case "Deleted discount":
      return "bg-red-100 text-red-800";
    case "Created category":
    case "Created subcategory":
    case "Created product":
    case "Created brand":
    case "Created discount":
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