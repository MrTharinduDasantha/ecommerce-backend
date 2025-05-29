const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  prevLabel = "Previous",
  nextLabel = "Next",
}) => {
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-between items-center mt-4 ${className}`}>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-[#5CAF90] text-white hover:bg-opacity-90"
        }`}
      >
        {prevLabel}
      </button>
      <span className="text-[#1D372E] text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-[#5CAF90] text-white hover:bg-opacity-90"
        }`}
      >
        {nextLabel}
      </button>
    </div>
  );
};

export default Pagination;
