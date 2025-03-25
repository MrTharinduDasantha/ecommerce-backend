import { useState } from "react";

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Todo: Api call to add product to databas
  };
  return (
    <div className="max-w-5xl mx-auto my-5 p-10 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-[#2d2d2d] mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1 text-[#2d2d2d]">
          <label className="block text-lg font-medium ">Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="input input-bordered w-full bg-white border-2 border-[#2d2d2d]"
          />
        </div>
        <div className="space-y-1 text-[#2d2d2d]">
          <label className="block text-lg font-medium text-[#2d2d2d]">
            Description
          </label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Enter product description"
            className="textarea textarea-bordered w-full bg-white border-2 border-[#2d2d2d]"
          />
        </div>
        <div className="space-y-1 text-[#2d2d2d]">
          <label className="block text-lg font-medium text-[#2d2d2d]">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Enter product price"
            className="input input-bordered w-full bg-white border-2 border-[#2d2d2d]"
          />
        </div>
        <div className="space-y-1 text-[#2d2d2d]">
          <label className="block text-lg font-medium text-[#2d2d2d]">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            placeholder="Enter stock quantity"
            className="input input-bordered w-full bg-white border-2 border-[#2d2d2d]"
          />
        </div>
        <div className="space-y-1 text-[#2d2d2d]">
          <label className="block text-lg font-medium text-[#2d2d2d]">
            Category
          </label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="select select-bordered w-full bg-white border-2 border-[#2d2d2d]"
          >
            <option value="">Select category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home Appliances">Home Appliances</option>
            <option value="Books">Books</option>
          </select>
        </div>
        <div className="space-y-1 text-[#2d2d2d]">
          <label className="block text-lg font-medium text-[#2d2d2d]">
            Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="file-input file-input-bordered w-full bg-white border-2 border-[#2d2d2d]"
          />
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="btn block px-6 py-3 ml-auto btn-primary bg-[#a3fe00] hover:bg-[#77c900] border-none text-[#2d2d2d] transition-colors duration-300 ease-in-out"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
