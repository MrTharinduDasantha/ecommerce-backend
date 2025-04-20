import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Review from "../../Components/NavBar/Review";
import { getBrands } from "../../api/product"; // Adjust the import as necessary

const BrandDetails = () => {
  const { name } = useParams();
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBrandData = async () => {
      try {
        const data = await getBrands();
        const brand = data.brands.find((brand) => brand.Brand_Name.toUpperCase() === name.toUpperCase());
        if (brand) {
          setSelectedBrand(brand);
          // Example: Simulate fetching products for the selected brand
          setProducts(await fetchProductsForBrand(brand));
        } else {
          setError("Brand not found");
        }
      } catch (error) {
        setError(error.message || "Failed to load brand details");
      } finally {
        setLoading(false);
      }
    };

    loadBrandData();
  }, [name]);

  // Placeholder function to simulate fetching products for a specific brand
  const fetchProductsForBrand = async (brand) => {
    // This would normally fetch products related to the brand
    return [
      { name: "Product 1", category: "Category 1", image: "url/to/image1.jpg", price: 100, oldPrice: 150 },
      { name: "Product 2", category: "Category 2", image: "url/to/image2.jpg", price: 200, oldPrice: 250 },
      // Add more products if needed
    ];
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading brand details...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        {error}
      </div>
    );
  }

  if (!selectedBrand) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        Brand not found!
      </div>
    );
  }

  // Define static top selling products
  const topSellingProducts = [
    { itemNo: 1, orderName: "Product A", price: 199.99 },
    { itemNo: 2, orderName: "Product B", price: 299.99 },
    { itemNo: 3, orderName: "Product C", price: 399.99 },
    { itemNo: 4, orderName: "Product D", price: 99.99 },
    { itemNo: 5, orderName: "Product E", price: 149.99 },
  ];

  return (
    <div className="bg-white min-h-screen px-4 py-8 md:px-16 font-poppins">
      <h2 className="text-[33.18px] text-[#1D372E] font-semibold mb-6 text-left">
        {selectedBrand.Brand_Name}
      </h2>

      <div className="bg-white rounded-md p-6 flex flex-col md:flex-row items-center max-w-3xl mx-auto md:max-w-full relative ">
        <div className="flex-shrink-0 w-40">
          <img src={selectedBrand.Brand_Image_Url || '/placeholder.svg'} alt={selectedBrand.Brand_Name} className="w-full h-auto object-contain rounded-lg" />
        </div>

        <div className="md:flex-1 px-6 text-left">
          <p className="text-[16px] md:text-[19.2px] text-[#5E5E5E]">
            {selectedBrand.ShortDescription}
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="mt-12">
        <h3 className="text-[33.18px] text-[#1D372E] font-semibold mb-6 text-left">Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-lg relative border border-[#E8E8E8] hover:shadow-lg transition-shadow"
                style={{ width: '220px', height: '290px' }}
              >
                <div className="relative ">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-[220px] h-[170px] object-cover"
                  />
                  <span className="absolute top-4 right-4 bg-[#5CAF90] text-white text-[8px] px-2 py-0.5 rounded">
                   New
                   </span>
                </div>
                <div className="mt-4">
                  <p className="text-[11.11px] text-gray-400 mb-1 text-[#7A7A7A] pl-4">{product.category}</p>
                  <h3 className="text-[13.33px] font-medium text-gray-700 leading-snug text-[#1D372E] pl-4">{product.name}</h3>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-[16px] font-semibold text-[#5E5E5E] pl-4">${product.price}</span>
                    <span className="text-[13.33px] text-gray-400 line-through text-[#CCCCCC]">${product.oldPrice}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No products available.</div>
          )}
        </div>
      </div>

      {/* Top Selling Products Section */}
      <div className="mt-12 border border-[#E8E8E8] rounded-[15px] p-6">
        <h3 className="text-[33.18px] text-[#1D372E] font-semibold mb-6 text-center">Top Selling Products</h3>
        <table className="min-w-full rounded-[15px] overflow-hidden">
          <thead>
            <tr>
              <th className="bg-[#EAFFF7] py-2 px-4 text-center font-semibold h-[60px] border-b-2 border-gray-300">Item No</th>
              <th className="bg-[#EAFFF7] py-2 px-4 text-center font-semibold h-[60px] border-b-2 border-gray-300">Order Name</th>
              <th className="bg-[#EAFFF7] py-2 px-4 text-center font-semibold h-[60px] border-b-2 border-gray-300">Price</th>
            </tr>
          </thead>
          <tbody>
            {topSellingProducts.map((product, index) => (
              <tr key={index} className="text-center">
                <td className={`py-2 px-4 h-[45px] ${index !== topSellingProducts.length - 1 ? 'border-b border-gray-300' : ''} bg-[#F7FDFF] border-r border-gray-300`}>
                  {product.itemNo}
                </td>
                <td className={`py-2 px-4 ${index !== topSellingProducts.length - 1 ? 'border-b border-gray-300' : ''} bg-[#F7FDFF] border-r border-gray-300`}>
                  {product.orderName}
                </td>
                <td className={`py-2 px-4 ${index !== topSellingProducts.length - 1 ? 'border-b border-gray-300' : ''} bg-[#F7FDFF]`}>
                  ${product.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
<br/>
      <Review />
    </div>
  );
};

export default BrandDetails;