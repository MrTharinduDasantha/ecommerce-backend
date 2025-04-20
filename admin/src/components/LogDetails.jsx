import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";

const LogDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { log } = location.state || {};
  const [expandedSections, setExpandedSections] = useState({});

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

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Check if a section is expanded
  const isSectionExpanded = (sectionId) => {
    return expandedSections[sectionId] === true;
  };

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
        // Handle Create Product Action
        else if (log.action === "Created product") {
          detailsContent.push(
            <div key="product-creation" className="px-1 py-5">
              <div className="bg-[#F4F4F4] rounded-lg shadow-sm overflow-hidden p-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-[#EAFFF7]"></div>
                  <h3 className="font-semibold text-[#1D372E]">
                    Product Creation Details
                  </h3>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Basic Product Information */}
                    <div className="p-3 border border-[#E5E7EB] rounded-md">
                      <h4 className="font-medium text-[#1D372E] mb-2">Basic Information</h4>
                      {Object.entries(details)
                        .filter(([key]) => !['variations', 'faqs'].includes(key))
                        .map(([key, value]) => (
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
                        ))}
                    </div>
                    
                    {/* Product Variations Section */}
                    {details.variations && (
                      <div className="p-3 border border-[#E5E7EB] rounded-md">
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => toggleSection('createdVariations')}
                        >
                          {isSectionExpanded('createdVariations') ? 
                            <ChevronDown className="w-4 h-4 mr-1 text-[#5CAF90]" /> : 
                            <ChevronRight className="w-4 h-4 mr-1 text-[#5CAF90]" />
                          }
                          <h4 className="font-medium text-[#1D372E]">Product Variations</h4>
                        </div>
                        
                        {isSectionExpanded('createdVariations') && (
                          <div className="mt-2">
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200 text-[#1D372E]">
                                <thead className="bg-[#EAFFF7]">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Color</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Size</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Quantity</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {details.variations.map((variation, index) => (
                                    <tr key={index}>
                                      <td className="px-3 py-2 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div 
                                            className="w-4 h-4 rounded-full mr-2" 
                                            style={{ backgroundColor: variation.colorCode }}
                                          />
                                          {variation.colorCode}
                                        </div>
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap">{variation.size}</td>
                                      <td className="px-3 py-2 whitespace-nowrap">{variation.quantity}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* FAQs Section */}
                    {details.faqs && (
                      <div className="p-3 border border-[#E5E7EB] rounded-md">
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => toggleSection('createdFaqs')}
                        >
                          {isSectionExpanded('createdFaqs') ? 
                            <ChevronDown className="w-4 h-4 mr-1 text-[#5CAF90]" /> : 
                            <ChevronRight className="w-4 h-4 mr-1 text-[#5CAF90]" />
                          }
                          <h4 className="font-medium text-[#1D372E]">Product FAQs</h4>
                        </div>
                        
                        {isSectionExpanded('createdFaqs') && (
                          <div className="mt-2 space-y-3">
                            {details.faqs.map((faq, index) => (
                              <div key={index} className="bg-white p-3 rounded-lg border border-[#E5E7EB]">
                                <h5 className="font-medium text-[#1D372E] mb-1">Q: {faq.question}</h5>
                                <p className="text-sm text-gray-600">A: {faq.answer}</p>
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
        // Handle Update Actions (for products and product variations)
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
              "Updated discount": "Discount Changes",
              "Toggled category status": "Category Status Changes",
            }[log.action] || "Changes Made";

          detailsContent.push(
            <div key="changes" className="px-1 py-5">
              <div className="bg-[#F4F4F4] rounded-lg shadow-sm overflow-hidden p-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-[#EAFFF7]"></div>
                  <h3 className="font-semibold text-[#1D372E]">{title}</h3>
                </div>
                
                {/* Update Product with special handling for variations and FAQs */}
                {log.action === "Updated product" ? (
                  <div className="space-y-4">
                    {/* Basic Info Changes */}
                    <div className="bg-white p-4 rounded-lg">
                      <div 
                        className="flex items-center cursor-pointer mb-3"
                        onClick={() => toggleSection('basicChanges')}
                      >
                        {isSectionExpanded('basicChanges') ? 
                          <ChevronDown className="w-4 h-4 mr-1 text-[#5CAF90]" /> : 
                          <ChevronRight className="w-4 h-4 mr-1 text-[#5CAF90]" />
                        }
                        <h4 className="font-medium text-[#1D372E]">Basic Information Changes</h4>
                      </div>
                      
                      {isSectionExpanded('basicChanges') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white p-3 border border-[#E5E7EB] rounded-md">
                            <h5 className="text-sm font-medium text-gray-600 mb-3">Original Data</h5>
                            {Object.entries(details.originalData || {})
                              .filter(([key]) => !['variations', 'sub_images', 'faqs'].includes(key))
                              .map(([key, value]) => (
                                <div key={key} className="mb-2 text-[#1D372E]">
                                  <span className="text-sm font-medium capitalize">{key}: </span>
                                  <span className="text-sm">
                                    {typeof value === "object" ? JSON.stringify(value) : value}
                                  </span>
                                </div>
                              ))}
                          </div>
                          <div className="bg-white p-3 border border-[#E5E7EB] rounded-md">
                            <h5 className="text-sm font-medium text-gray-600 mb-3">Updated Data</h5>
                            {Object.entries(details.updatedData || {})
                              .filter(([key]) => !['variations', 'sub_images', 'faqs'].includes(key))
                              .map(([key, value]) => {
                                const originalValue = details.originalData?.[key];
                                const isDifferent = originalValue !== value;
                                return (
                                  <div key={key} className={`mb-2 ${isDifferent ? 'bg-red-100 p-1 rounded' : ''}`}>
                                    <span className="text-sm font-medium capitalize">{key}: </span>
                                    <span className="text-sm">
                                      {typeof value === "object" ? JSON.stringify(value) : value}
                                    </span>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Variations Changes */}
                    {(details.originalData?.variations || details.updatedData?.variations) && (
                      <div className="bg-white p-4 rounded-lg">
                        <div 
                          className="flex items-center cursor-pointer mb-3"
                          onClick={() => toggleSection('variationChanges')}
                        >
                          {isSectionExpanded('variationChanges') ? 
                            <ChevronDown className="w-4 h-4 mr-1 text-[#5CAF90]" /> : 
                            <ChevronRight className="w-4 h-4 mr-1 text-[#5CAF90]" />
                          }
                          <h4 className="font-medium text-[#1D372E]">Product Variations Changes</h4>
                        </div>
                        
                        {isSectionExpanded('variationChanges') && (
                          <div className="grid grid-cols-1 gap-4">
                            {/* Original Variations */}
                            {details.originalData?.variations && (
                              <div className="p-3 border border-[#E5E7EB] rounded-md">
                                <h5 className="text-sm font-medium text-gray-600 mb-3">Original Variations</h5>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200 text-[#1D372E]">
                                    <thead className="bg-[#EAFFF7]">
                                      <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Color</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Size</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Quantity</th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {details.originalData.variations.map((variation, index) => (
                                        <tr key={index}>
                                          <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="flex items-center">
                                              <div 
                                                className="w-4 h-4 rounded-full mr-2" 
                                                style={{ backgroundColor: variation.Colour || variation.colorCode }}
                                              />
                                              {variation.Colour || variation.colorCode}
                                            </div>
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap">{variation.Size || variation.size}</td>
                                          <td className="px-3 py-2 whitespace-nowrap">{variation.Qty || variation.quantity}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                            
                            {/* Updated Variations */}
                            {details.updatedData?.variations && (
                              <div className="p-3 border border-[#E5E7EB] rounded-md">
                                <h5 className="text-sm font-medium text-gray-600 mb-3">Updated Variations</h5>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200 text-[#1D372E]">
                                    <thead className="bg-[#EAFFF7]">
                                      <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Color</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Size</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Quantity</th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {details.updatedData.variations.map((variation, index) => (
                                        <tr key={index}>
                                          <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="flex items-center">
                                              <div 
                                                className="w-4 h-4 rounded-full mr-2" 
                                                style={{ backgroundColor: variation.Colour || variation.colorCode }}
                                              />
                                              {variation.Colour || variation.colorCode}
                                            </div>
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap">{variation.Size || variation.size}</td>
                                          <td className="px-3 py-2 whitespace-nowrap">{variation.Qty || variation.quantity}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* FAQs Changes */}
                    {(details.originalData?.faqs || details.updatedData?.faqs) && (
                      <div className="bg-white p-4 rounded-lg">
                        <div 
                          className="flex items-center cursor-pointer mb-3"
                          onClick={() => toggleSection('faqChanges')}
                        >
                          {isSectionExpanded('faqChanges') ? 
                            <ChevronDown className="w-4 h-4 mr-1 text-[#5CAF90]" /> : 
                            <ChevronRight className="w-4 h-4 mr-1 text-[#5CAF90]" />
                          }
                          <h4 className="font-medium text-[#1D372E]">FAQ Changes</h4>
                        </div>
                        
                        {isSectionExpanded('faqChanges') && (
                          <div className="grid grid-cols-1 gap-4">
                            {/* Original FAQs */}
                            {details.originalData?.faqs && (
                              <div className="p-3 border border-[#E5E7EB] rounded-md">
                                <h5 className="text-sm font-medium text-gray-600 mb-3">Original FAQs</h5>
                                <div className="space-y-3">
                                  {details.originalData.faqs.map((faq, index) => (
                                    <div key={index} className="bg-white p-3 rounded-lg border border-[#E5E7EB]">
                                      <h6 className="font-medium text-[#1D372E] mb-1">
                                        Q: {faq.Question || faq.question}
                                      </h6>
                                      <p className="text-sm text-gray-600">
                                        A: {faq.Answer || faq.answer}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Updated FAQs */}
                            {details.updatedData?.faqs && (
                              <div className="p-3 border border-[#E5E7EB] rounded-md">
                                <h5 className="text-sm font-medium text-gray-600 mb-3">Updated FAQs</h5>
                                <div className="space-y-3">
                                  {details.updatedData.faqs.map((faq, index) => (
                                    <div key={index} className="bg-white p-3 rounded-lg border border-[#E5E7EB]">
                                      <h6 className="font-medium text-[#1D372E] mb-1">
                                        Q: {faq.Question || faq.question}
                                      </h6>
                                      <p className="text-sm text-gray-600">
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
                    )}
                  </div>
                ) : (
                  // Regular diff view for non-product updates
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
                      <h4 className="text-sm font-medium text-gray-600 mb-3">Updated Data</h4>
                       {Object.entries(details.updatedData || {}).map(([key, value]) => {
                        const originalValue = details.originalData?.[key];
      
                        // Check for difference and highlight accordingly
                        const isDifferent = originalValue !== value;
      
                       return (
                    <div key={key} className={`mb-2 ${isDifferent ? 'bg-red-100 p-1 rounded' : ''}`}> 
                       <span className="text-sm font-medium capitalize">{key}: </span>
                       <span className="text-sm">{Array.isArray(value) ? JSON.stringify(value) : value}</span>
                     </div>
                       );
                       })}
                    </div>
                  </div>
                )}
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
                  <h3 className="font-semibold text-[#1D372E]">Deleted Product Details</h3>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  {/* Basic Product Information */}
                  <div className="p-3 border border-[#E5E7EB] rounded-md mb-4">
                    <h4 className="font-medium text-[#1D372E] mb-2">Basic Information</h4>
                    {Object.entries(details)
                      .filter(([key]) => !['variations', 'faqs'].includes(key))
                      .map(([key, value]) => (
                        <div key={key} className="mb-2 text-[#1D372E]">
                          <span className="text-sm font-medium capitalize">
                            {key}:{" "}
                          </span>
                          <span className="text-sm">
                            {typeof value === "object" && !Array.isArray(value)
                              ? JSON.stringify(value)
                              : value}
                          </span>
                        </div>
                      ))}
                  </div>
                  
                  {/* Product Variations if available */}
                  {details.variations && (
                    <div className="p-3 border border-[#E5E7EB] rounded-md mb-4">
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleSection('deletedVariations')}
                      >
                        {isSectionExpanded('deletedVariations') ? 
                          <ChevronDown className="w-4 h-4 mr-1 text-[#5CAF90]" /> : 
                          <ChevronRight className="w-4 h-4 mr-1 text-[#5CAF90]" />
                        }
                        <h4 className="font-medium text-[#1D372E]">Deleted Product Variations</h4>
                      </div>
                      
                      {isSectionExpanded('deletedVariations') && (
                        <div className="mt-2">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-[#1D372E]">
                              <thead className="bg-[#EAFFF7]">
                                <tr>
                                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Color</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Size</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">Quantity</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {details.variations.map((variation, index) => (
                                  <tr key={index}>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div 
                                          className="w-4 h-4 rounded-full mr-2" 
                                          style={{ backgroundColor: variation.Colour || variation.colorCode }}
                                        />
                                        {variation.Colour || variation.colorCode}
                                      </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">{variation.Size || variation.size}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{variation.Qty || variation.quantity}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Deleted FAQs if available */}
                  {details.faqs && (
                    <div className="p-3 border border-[#E5E7EB] rounded-md">
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleSection('deletedFaqs')}
                      >
                        {isSectionExpanded('deletedFaqs') ? 
                          <ChevronDown className="w-4 h-4 mr-1 text-[#5CAF90]" /> : 
                          <ChevronRight className="w-4 h-4 mr-1 text-[#5CAF90]" />
                        }
                        <h4 className="font-medium text-[#1D372E]">Deleted Product FAQs</h4>
                      </div>
                      
                      {isSectionExpanded('deletedFaqs') && (
                        <div className="mt-2 space-y-3">
                          {details.faqs.map((faq, index) => (
                            <div key={index} className="bg-white p-3 rounded-lg border border-[#E5E7EB]">
                              <h5 className="font-medium text-[#1D372E] mb-1">
                                Q: {faq.Question || faq.question}
                              </h5>
                              <p className="text-sm text-gray-600">
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
        // Handle other Create Actions (admin addition not included)
        else if (log.action.startsWith("Created")) {
          const title = {
            "Created category": "Newly Created Category",
            "Created product": "Newly Created Product",
            "Created brand": "Newly Created Brand",
            "Created subcategory": "Newly Created Subcategory",
            "Created discount": "Newly Created Discount",
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
            "Deleted discount": "Deleted Discount Details",
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