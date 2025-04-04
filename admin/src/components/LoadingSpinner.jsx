const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="w-10 h-10 border-4 border-[#1D372E] border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
