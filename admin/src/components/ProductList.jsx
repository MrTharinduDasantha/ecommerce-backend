import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Chair from "../assets/Chair.jpeg";
import Guitar from "../assets/Guitar.jpg";
import T_Shirt from "../assets/T_Shirt.jpg";

const ProductList = () => {
  // Sample product data
  const products = [
    {
      id: 1,
      name: "Ergonomic Chair",
      description: "Comfortable office chair with lumbar support",
      price: "$199",
      stock: 15,
      category: "Home Appliances",
      image: Chair,
    },
    {
      id: 2,
      name: "Acoustic Guitar",
      description: "High-quality acoustic guitar for beginners",
      price: "$299",
      stock: 8,
      category: "Electronics",
      image: Guitar,
    },
    {
      id: 3,
      name: "Classic T-Shirt",
      description: "100% cotton T-shirt in multiple colors",
      price: "$29",
      stock: 50,
      category: "Clothing",
      image: T_Shirt,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto my-5 p-10 overflow-x-auto bg-white text-[#2d2d2d] rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      <table className="table w-full border-collapse border border-gray-300">
        {/* Head */}
        <thead className="bg-[#a3fe00] text-[#2d2d2d]">
          <tr>
            <th className="border-2 p-2">Name</th>
            <th className="border-2 p-2">Description</th>
            <th className="border-2 p-2">Price</th>
            <th className="border-2 p-2">Stock</th>
            <th className="border-2 p-2">Category</th>
            <th className="border-2 p-2">Image</th>
            <th className="border-2 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="hover">
              <td className="border-2 p-2">{product.name}</td>
              <td className="border-2 p-2">{product.description}</td>
              <td className="border-2 p-2">{product.price}</td>
              <td className="border-2 p-2">{product.stock}</td>
              <td className="border-2 p-2">{product.category}</td>
              <td className="border-2 p-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
              </td>
              <td className="border-2 p-2">
                <div className="flex justify-center items-center gap-2">
                  <button className="bg-[#a3fe00] hover:bg-[#77c900] p-1.5 transition-colors duration-300 ease-in-out cursor-pointer">
                    <FaEdit className="w-5 h-5" />
                  </button>
                  <button className="bg-[#a3fe00] hover:bg-[#77c900] p-1.5 transition-colors duration-300 ease-in-out cursor-pointer">
                    <RiDeleteBin5Fill className="w-6 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
