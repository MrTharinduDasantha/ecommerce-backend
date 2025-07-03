import { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const SearchableSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  multiple = false,
  maxHeight = "200px",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle option selection
  const handleOptionClick = (option) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(option.value)
        ? currentValues.filter((v) => v !== option.value)
        : [...currentValues, option.value];
      onChange(newValues);
    } else {
      onChange(option.value);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  // Get display text for selected values
  const getDisplayText = () => {
    if (multiple) {
      const selectedOptions = options.filter(
        (opt) => Array.isArray(value) && value.includes(opt.value)
      );
      if (selectedOptions.length === 0) return placeholder;
      if (selectedOptions.length === 1) return selectedOptions[0].label;
      return `${selectedOptions.length} items selected`;
    } else {
      const selectedOption = options.find((opt) => opt.value === value);
      return selectedOption ? selectedOption.label : placeholder;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="select select-bordered select-sm md:select-md w-full bg-white border-[#1D372E] text-[#1D372E] flex items-center justify-between"
      >
        <span className="truncate text-left">{getDisplayText()}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-30 w-full mt-1 bg-white border border-[#1D372E] rounded-lg shadow-lg">
          {/* Search Input */}
          <div className="relative p-2 border-b border-gray-200">
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none z-10">
              <FaSearch className="text-[#1D372E] w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="input input-bordered input-sm w-full bg-white border-[#1D372E] text-[#1D372E] pr-10"
              autoFocus
            />
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto" style={{ maxHeight }}>
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-gray-500">
                No products found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionClick(option)}
                  className={`w-full text-left p-3 hover:bg-gray-100 transition-colors ${
                    multiple &&
                    Array.isArray(value) &&
                    value.includes(option.value)
                      ? "bg-[#5CAF90] bg-opacity-10 text-[#1D372E] font-medium"
                      : value === option.value
                      ? "bg-[#5CAF90] bg-opacity-10 text-[#1D372E] font-medium"
                      : "text-[#1D372E]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{option.label}</span>
                    {multiple &&
                      Array.isArray(value) &&
                      value.includes(option.value) && (
                        <span className="text-[#1D372E]">✓</span>
                      )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
